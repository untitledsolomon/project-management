import { MainLayout } from "@/components/layout/MainLayout";

export default function PeoplePage() {
  return (
    <MainLayout title="People & Teams">
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">👥</span>
        </div>
        <h2 className="text-xl font-display font-semibold mb-2">People & Teams</h2>
        <p className="text-secondary max-w-md">
          Manage organisation members, teams, and resource allocation.
        </p>
      </div>
    </MainLayout>
  );
}
