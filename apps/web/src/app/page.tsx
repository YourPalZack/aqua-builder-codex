export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-emerald-600">AquaBuilder</h1>
        <p className="text-2xl text-gray-600">
          Welcome to your aquarium building companion!
        </p>
        <div className="space-y-4 mt-8">
          <div className="p-6 border border-emerald-200 rounded-lg bg-emerald-50">
            <h2 className="text-xl font-semibold text-emerald-800 mb-2">
              Development Environment Ready
            </h2>
            <p className="text-gray-700">
              The web application is now running. This is a minimal scaffold.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            <p>Next.js + React + TailwindCSS</p>
            <p>Monorepo with pnpm workspaces</p>
          </div>
        </div>
      </main>
    </div>
  );
}
