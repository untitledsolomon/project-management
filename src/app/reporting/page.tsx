import { MainLayout } from "@/components/layout/MainLayout";

export default function ReportingPage() {
  return (
    <MainLayout title="Reporting">
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h2 className="text-xl font-display font-semibold mb-2">Reporting & Analytics</h2>
        <p className="text-secondary max-w-md">
          Track velocity, burn-down, and team performance with custom dashboards.
        </p>
      </div>
    </MainLayout>
  );
}
