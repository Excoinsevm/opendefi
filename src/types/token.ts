export interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  network: string;
  decimals: number;
  priceUSD: number;
  burnAddressBalance: string;
  zeroAddressBalance: string;
  totalSupply: string;
  pools: LiquidityPool[];
}

export interface LiquidityPool {
  pairAddress: string;
  pairSymbol: string;
  token0: { address: string; symbol: string; decimals: number };
  token1: { address: string; symbol: string; decimals: number };
  reserve0: string;
  reserve1: string;
  liquidityUSD: number;
}