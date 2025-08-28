import AgentProfitabilityCalculator from "@/components/AgentProfitabilityCalculator";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <AgentProfitabilityCalculator />
      </div>
    </main>
  );
}
