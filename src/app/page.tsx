import { Card } from "@/components/ui/card";
import TokenInfoView from "./components/token-info-view";
import { getTokenDataISR } from "./fetchers/get-token-data-isr";

const HomePage = async () => {
  const tokenData = await getTokenDataISR("tswap", "0xAbE78f9f591F8802955155abB8B2C2dB19F4adF7");

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
