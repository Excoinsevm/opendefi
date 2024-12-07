"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/utils/formatting";
import getFormattedCurrency from "@/utils/get-formatted-currency";
import CopyButton from "./copy-button";
import LoadingSkeleton from "./loading-skeleton";
import { LiquidityPool, TokenInfo } from "@/types/token";
import { revalidatePath } from "next/cache";

interface TokenInfoViewProps {
  tokenData: TokenInfo;
}

const TokenInfoView: React.FC<TokenInfoViewProps> = ({ tokenData }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [tokenAddress, setTokenAddress] = useState(tokenData.address);
  const [tokenNetwork, setTokenNetwork] = useState(tokenData.network);

  return (
    <div className="mx-auto p-4">
      <div className="mb-6">
        <div className="flex">
          <Select onValueChange={(value) => setTokenNetwork(value)} value={tokenNetwork}>
            <SelectTrigger className="max-w-48 rounded-tr-none rounded-br-none">
              <SelectValue defaultValue={pathname.split("/")[1]} placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="eth">Ethereum</SelectItem>
                <SelectItem value="bsc" disabled>
                  Binance Smart Chain
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Enter token address"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="flex-1 rounded-tl-none rounded-bl-none"
          />
          <Button onClick={() => router.push(`/${tokenNetwork}/${tokenAddress}`)} className="ml-2">
            {"Get Info"}
            {/* {loading ? <Spinner /> : "Get Info"} */}
          </Button>
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-500">Popular tokens </span>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant={tokenAddress === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" ? "default" : "outline"}
            >
              <Link href="/eth/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2">Wrapped Ether (WETH)</Link>
            </Button>
            <Button
              asChild
              variant={tokenAddress === "0xdac17f958d2ee523a2206206994597c13d831ec7" ? "default" : "outline"}
            >
              <Link href="/eth/0xdac17f958d2ee523a2206206994597c13d831ec7">Tether (USDT)</Link>
            </Button>
            <Button
              variant={tokenAddress === "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" ? "default" : "outline"}
              asChild
            >
              <Link href="/eth/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48">USD Coin (USDC)</Link>
            </Button>
            <Button
              variant={tokenAddress === "0x514910771af9ca656af840dff83e8264ecf986ca" ? "default" : "outline"}
              asChild
            >
              <Link href="/eth/0x514910771af9ca656af840dff83e8264ecf986ca">Chainlink (LINK)</Link>
            </Button>
            <Button
              variant={tokenAddress === "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE" ? "default" : "outline"}
              asChild
            >
              <Link href="/eth/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE"> Shiba Inu (SHIB)</Link>
            </Button>
            <Button
              variant={tokenAddress === "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" ? "default" : "outline"}
              asChild
            >
              <Link href="/eth/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599">Wrapped Bitcoin (WBTC)</Link>
            </Button>
          </div>
        </div>
        {/* {error && (
          <Alert variant="destructive" className="mt-2">
            {error}
          </Alert>
        )} */}
      </div>
      {tokenData  ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row items-center space-x-2">
                <span>Token Information</span>
                <Button variant="ghost" size="icon" onClick={() => revalidatePath(`/${tokenNetwork}/${tokenAddress}`, "page")}>
                  <ReloadIcon className="h-2 w-2" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">{tokenData.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Symbol</p>
                  <p className="font-medium">{tokenData.symbol}</p>
                </div>
                <div>
                  <p className="text-gray-600">Address</p>
                  <span className="text-wrap break-all font-medium font-mono text-sm">{tokenData.address}</span>
                </div>
                <div>
                  <p className="text-gray-600">Price USD</p>
                  <p className="font-medium">{getFormattedCurrency(tokenData.priceUSD)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Decimals</p>
                  <p className="font-medium">{tokenData.decimals}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Supply</p>
                  <p className="font-medium">{Number(tokenData.totalSupply).toLocaleString("en")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liquidity Pools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pair</TableHead>
                      <TableHead>Pool Address</TableHead>
                      <TableHead className="text-right">Reserve 0</TableHead>
                      <TableHead className="text-right">Reserve 1</TableHead>
                      <TableHead className="text-right">Liquidity USD</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tokenData.pools.map((pool: LiquidityPool) => (
                      <TableRow key={pool.pairAddress}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>
                              {pool.token0.symbol} / {pool.token1.symbol}
                            </span>
                            <span className="text-xs text-gray-500">
                              {Number(pool.reserve0).toFixed(4)} / {Number(pool.reserve1).toFixed(4)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-row items-center space-x-2">
                            <span className="font-mono text-sm">{pool.pairAddress}</span>
                            <CopyButton text={pool.pairAddress} />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(pool.reserve0)} {pool.token0.symbol}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(pool.reserve1)} {pool.token1.symbol}
                        </TableCell>
                        <TableCell className="text-right">${formatNumber(pool.liquidityUSD)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </div>
  );
};

export default TokenInfoView;
