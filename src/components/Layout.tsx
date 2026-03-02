import { Outlet } from 'react-router-dom';
import { Background } from './Background';
import { BottomNav } from './BottomNav';
import { InstallPWA } from './InstallPWA';

export const Layout = () => {
  return (
    <div className="min-h-screen text-white font-sans selection:bg-neon-blue selection:text-space-dark pb-20">
      <Background />
      <InstallPWA />
      <main className="container mx-auto px-4 py-6 max-w-md md:max-w-2xl lg:max-w-4xl">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
