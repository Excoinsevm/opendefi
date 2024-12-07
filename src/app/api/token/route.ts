import { ethers } from "ethers";
import { NextResponse } from "next/server";
import { UniswapTokenService } from "../../../services/token-info-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address parameter is required" }, { status: 400 });
  }

  try {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const service = new UniswapTokenService(provider);
    const tokenData = await service.getTokenInformation(address);
    return NextResponse.json(tokenData);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
