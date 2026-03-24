import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 md:p-12 lg:p-16 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
