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