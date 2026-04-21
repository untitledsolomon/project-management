import { MainLayout } from "@/components/layout/MainLayout";

export default function InboxPage() {
  return (
    <MainLayout title="Inbox">
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📥</span>
        </div>
        <h2 className="text-xl font-display font-semibold mb-2">Your Inbox</h2>
        <p className="text-secondary max-w-md">
          Catch up on notifications, mentions, and updates across all your projects.
        </p>
      </div>
    </MainLayout>
  );
}
