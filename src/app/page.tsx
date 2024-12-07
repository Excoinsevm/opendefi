import { Card } from "@/components/ui/card";
import TokenInfoView from "./components/token-info-view";
import { getTokenDataISR } from "./fetchers/get-token-data-isr";

const HomePage = async () => {
  const tokenData = await getTokenDataISR("eth", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");

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
