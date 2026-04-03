// app/(user)/dashboard/page.tsx
import { Card } from "@heroui/react";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-10 max-w-5xl mx-auto w-full gap-6">
      <div className="w-full text-left border-b border-default-200 pb-4 mt-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-default-500">Manage your active exchanges and offers.</p>
      </div>

      <Card className="w-full p-6 bg-success/10 text-success border border-success/30 shadow-none">
        <h2 className="font-semibold text-lg">Login Successful!</h2>
        <p className="text-sm mt-1">
          You reached this page because the database successfully processed your request.
        </p>
      </Card>
    </main>
  );
}