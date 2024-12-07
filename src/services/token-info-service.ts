import { MulticallProvider } from "@ethers-ext/provider-multicall";
import { ethers } from "ethers";
import { ERC20_ABI, FACTORY_ABI, PAIR_ABI, UNISWAP_V2_CONSTANTS } from "./constants";
import { LiquidityPool, TokenInfo } from "@/types/token";


export class UniswapTokenService {
  private factory: ethers.Contract;
  private multiCallProvider: MulticallProvider;
  private wethPriceUSD = 0;
  private lastWETHPriceUpdate = 0;
  private readonly WETH_PRICE_REFRESH_INTERVAL = 300000; // 5 minutes
  private tokenConstsCache = new Map<string, TokenInfo>();

  constructor(private readonly provider: ethers.JsonRpcProvider) {
    this.factory = new ethers.Contract(UNISWAP_V2_CONSTANTS.FACTORY_ADDRESS, FACTORY_ABI, provider);
    this.multiCallProvider = new MulticallProvider(provider);
  }

  public async getTokenInformation(tokenAddress: string): Promise<TokenInfo> {
    try {
      const tokenInfo = await this.getTokenBasicInfo(tokenAddress);

      if (!tokenInfo) {
        throw new Error(`Token with address ${tokenAddress} not found.`);
      }

      await this.updateWETHPrice();
      tokenInfo.pools = await this.findLiquidityPools(tokenInfo);
      tokenInfo.priceUSD = await this.calculateTokenPrice(tokenInfo);
      return tokenInfo;
    } catch (error) {
      throw new Error(`Failed to fetch token information for ${tokenAddress}: ${(error as Error).message}`);
    }
  }

  private async getTokenBasicInfo(tokenAddress: string): Promise<TokenInfo | undefined> {
    if (this.tokenConstsCache.has(tokenAddress)) {
        const token = this.tokenConstsCache.get(tokenAddress);
        if (!token) return undefined;
        return {...token};
    }

    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.multiCallProvider);

    if (
      !tokenContract.name ||
      !tokenContract.symbol ||
      !tokenContract.decimals ||
      !tokenContract.totalSupply ||
      !tokenContract.balanceOf
    ) {
      console.warn("Token contract not initialized.");
      return undefined;
    }

    const [name, symbol, decimals, totalSupply, zeroAddressBalance, burnAddressBalance] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
      tokenContract.totalSupply(),
      tokenContract.balanceOf(ethers.ZeroAddress),
      tokenContract.balanceOf("0x000000000000000000000000000000000000dEaD"),
    ]);

    const tokenInfo = {
      address: tokenAddress,
      name,
      symbol,
      network: "eth",
      decimals: Number(decimals),
      totalSupply: ethers.formatUnits(totalSupply.toString(), decimals),
      zeroAddressBalance: ethers.formatUnits(zeroAddressBalance.toString(), decimals),
      burnAddressBalance: ethers.formatUnits(burnAddressBalance.toString(), decimals),
      priceUSD: 0,
      pools: [],
    };

    this.tokenConstsCache.set(tokenAddress, tokenInfo);
    return tokenInfo;
  }

  private async getPair(tokenA: string, tokenB: string): Promise<string> {
    if (!this.factory.getPair) {
      console.warn("Factory contract not initialized.");
      return ethers.ZeroAddress;
    }

    return this.factory.getPair(tokenA, tokenB);
  }

  private async updateWETHPrice(): Promise<void> {
    if (Date.now() - this.lastWETHPriceUpdate < this.WETH_PRICE_REFRESH_INTERVAL) return;

    const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const usdcWethPair = await this.getPair(UNISWAP_V2_CONSTANTS.WETH_ADDRESS, USDC_ADDRESS);

    if (!usdcWethPair || usdcWethPair === ethers.ZeroAddress) {
      console.warn("USDC-WETH pair not found.");
      return;
    }

    const pairContract = new ethers.Contract(usdcWethPair, PAIR_ABI, this.multiCallProvider);

    if (!pairContract.token0 || !pairContract.getReserves) {
      console.warn("Pair contract not initialized.");
      return;
    }

    const [token0, reserves] = await Promise.all([pairContract.token0(), pairContract.getReserves()]);

    const [reserve0, reserve1] = reserves.map((reserve: string) => Number(reserve));
    const isWETHToken0 = token0.toLowerCase() === UNISWAP_V2_CONSTANTS.WETH_ADDRESS.toLowerCase();

    this.wethPriceUSD = isWETHToken0
      ? (Number(reserve1) * 1e12) / Number(reserve0)
      : (Number(reserve0) * 1e12) / Number(reserve1);

    this.lastWETHPriceUpdate = Date.now();
  }

  private async findLiquidityPools(tokenInfo: TokenInfo): Promise<LiquidityPool[]> {
    const mainTokens = [
      UNISWAP_V2_CONSTANTS.WETH_ADDRESS,
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
      "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
    ];

    try {
      const poolPromises = mainTokens.map((mainToken) => this.getPoolInfo(tokenInfo.address, mainToken));
      const pools = (await Promise.all(poolPromises)).filter((pool) => pool !== null) as LiquidityPool[];

      return pools.sort((a, b) => b.liquidityUSD - a.liquidityUSD);
    } catch (error) {
      console.error("Error finding liquidity pools:", (error as Error).message);
      return [];
    }
  }

  private async getPoolInfo(tokenA: string, tokenB: string): Promise<LiquidityPool | null> {
    try {
      const pairAddress = await this.getPair(tokenA, tokenB);

      if (!pairAddress || pairAddress === ethers.ZeroAddress) return null;

      const pairContract = new ethers.Contract(pairAddress, PAIR_ABI, this.multiCallProvider);

      if (!pairContract.token0 || !pairContract.getReserves) {
        console.error(`Pair contract not initialized for pair ${pairAddress}`);
        return null;
      }

      const [token0Addr, reserves] = await Promise.all([pairContract.token0(), pairContract.getReserves()]);

      const isTokenAFirst = tokenA.toLowerCase() === token0Addr.toLowerCase();

      const token0Info = await this.getTokenBasicInfo(token0Addr);
      const token1Info = await this.getTokenBasicInfo(isTokenAFirst ? tokenB : tokenA);

      if (!token0Info || !token1Info) {
        console.error(`Token info not found for pair ${pairAddress}`);
        return null;
      }

      const reserve0Formatted = ethers.formatUnits(reserves[0], token0Info.decimals);
      const reserve1Formatted = ethers.formatUnits(reserves[1], token1Info.decimals);

      const liquidityUSD = await this.calculatePoolLiquidityUSD(
        reserve0Formatted,
        reserve1Formatted,
        isTokenAFirst ? tokenA : tokenB,
        isTokenAFirst ? tokenB : tokenA,
      );

      return {
        pairAddress,
        pairSymbol: `${isTokenAFirst ? token1Info.symbol : token0Info.symbol}`,
        token0: token0Info,
        token1: token1Info,
        reserve0: reserve0Formatted,
        reserve1: reserve1Formatted,
        liquidityUSD,
      };
    } catch (error) {
      console.error(`Error fetching pool info for ${tokenA} and ${tokenB}:`, (error as Error).message);
      return null;
    }
  }
  private async calculatePoolLiquidityUSD(
    reserveAFormatted: string,
    reserveBFormatted: string,
    referenceTokenAddr: string,
    baseTokenAddr: string,
  ): Promise<number> {
    if (referenceTokenAddr.toLowerCase() === UNISWAP_V2_CONSTANTS.WETH_ADDRESS.toLowerCase()) {
      return Number.parseFloat(reserveAFormatted) * this.wethPriceUSD;
    }

    if (baseTokenAddr.toLowerCase() === UNISWAP_V2_CONSTANTS.WETH_ADDRESS.toLowerCase()) {
      return Number.parseFloat(reserveBFormatted) * this.wethPriceUSD;
    }

    return Number.parseFloat(reserveBFormatted);
  }

  private async calculateTokenPrice(tokenInfo: TokenInfo): Promise<number> {
    if (tokenInfo.address.toLowerCase() === UNISWAP_V2_CONSTANTS.WETH_ADDRESS.toLowerCase()) {
      return this.wethPriceUSD;
    }

    const wethPairPool = tokenInfo.pools.find((pool) =>
      [pool.token0.address.toLowerCase(), pool.token1.address.toLowerCase()].includes(
        UNISWAP_V2_CONSTANTS.WETH_ADDRESS.toLowerCase(),
      ),
    );

    if (!wethPairPool) return 0;

    const isTokenInPositionZero = wethPairPool.token0.address.toLowerCase() === tokenInfo.address.toLowerCase();

    const [tokenReserveFormatted, wethReserveFormatted] = isTokenInPositionZero
      ? [wethPairPool.reserve0, wethPairPool.reserve1]
      : [wethPairPool.reserve1, wethPairPool.reserve0];

    return (Number.parseFloat(wethReserveFormatted) / Number.parseFloat(tokenReserveFormatted)) * this.wethPriceUSD;
  }
}
