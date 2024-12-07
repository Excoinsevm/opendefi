import { Card } from "@/components/ui/card";
import TokenInfoView from "./components/token-info-view";
import { TokenInfo } from "@/types/token";

export async function getTokenData(network: string, address: string): Promise<TokenInfo> {
  if (!address) {
    throw new Error("Invalid address or API configuration");
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/token?network=${network}&address=${address}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as TokenInfo;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch token data");
  }
}

const HomePage = async () => {
  const tokenData = await getTokenData("eth", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");

  if (!tokenData) {
    return null;
  }

  return (
    <main className="lg:container p-4">
      <Card className="w-full h-full">
        <TokenInfoView tokenData={tokenData} />
      </Card>
    </main>
  );
};

export default HomePage;
