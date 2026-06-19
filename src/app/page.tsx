import HomeContent from "@/components/HomeContent";
import PageErrorBoundary from "@/components/PageErrorBoundary";

export default function Home() {
  return (
    <PageErrorBoundary>
      <HomeContent />
    </PageErrorBoundary>
  );
}
