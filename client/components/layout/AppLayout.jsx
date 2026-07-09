import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function AppLayout() {
  return (
    <div className="grid h-screen grid-cols-1 bg-app-bg lg:grid-cols-[280px_minmax(0,1fr)]">
      <Sidebar />
      <div className="grid min-h-0 grid-rows-[72px_minmax(0,1fr)]">
        <Header />
        <main className="min-h-0 overflow-y-auto px-4 pb-6 pt-4 md:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}