import { Navbar } from "./Navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="ambient-bg relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 grid-overlay opacity-40" />
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
          <div className="page-enter">{children}</div>
        </main>
      </div>
    </div>
  );
}
