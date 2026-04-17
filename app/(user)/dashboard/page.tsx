// app/(user)/dashboard/page.tsx

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl w-full px-6 py-10">
      <div className="border-b border-oat pb-6 mb-8">
        <div className="clay-label text-warm-silver mb-2">Account</div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-warm-silver mt-1">
          Manage your active exchanges and offers.
        </p>
      </div>

      <div className="bg-matcha-300/15 border border-matcha-600/20 rounded-3xl p-6">
        <h2 className="font-semibold text-lg text-matcha-800">
          Login Successful!
        </h2>
        <p className="text-sm mt-1 text-matcha-600">
          You reached this page because the database successfully processed your
          request.
        </p>
      </div>
    </main>
  );
}