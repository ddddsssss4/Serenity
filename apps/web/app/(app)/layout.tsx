import { Sidebar } from '../../components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 md:p-12 lg:p-16 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
