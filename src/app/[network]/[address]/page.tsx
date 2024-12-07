import type { Metadata, NextPage } from "next";
import { Card } from "../../../components/ui/card";
import TokenInfo from "../../components/token-info-view";
import getFormattedCurrency from "@/utils/get-formatted-currency";
import { getTokenData } from "@/app/fetchers/get-token-data";

type Props = {
  params: Promise<{ network: string; address: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const network = (await params).network
  const address = (await params).address
 
  const tokenData = await getTokenData(network, address)
 
  return {
    title: `${getFormattedCurrency(tokenData.priceUSD)} | ${tokenData.name} (${tokenData.symbol}${tokenData.pools[0]?.pairSymbol}) Price`,
    description: `View the ${tokenData.name} (${tokenData.symbol}${tokenData.pools[0]?.pairSymbol}) price and market cap on Open Defi`,
  }
} 

const TokenInfoPage: NextPage<{ params: Promise<{ network: string; address: string }> }> = async ({ params }) => {
  const { network, address } = await params;

  const tokenData = await getTokenData(network, address);

  return (
    <main className="lg:container p-4">
      <Card className="w-full h-full">
        <TokenInfo tokenData={tokenData} />
      </Card>
    </main>
  );
};

export default TokenInfoPage;
