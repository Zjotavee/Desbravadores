import { Link, useLocation } from 'react-router-dom';
import { Home, Bot, Heart, Compass, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export const BottomNav = () => {
  const location = useLocation();

  const tabs = [
    { name: 'Início', path: '/', icon: Home },
    { name: 'IA', path: '/ai', icon: Bot },
    { name: 'Espiritual', path: '/spirituality', icon: Heart },
    { name: 'Atividades', path: '/activities', icon: Compass },
    { name: 'Agenda', path: '/agenda', icon: Calendar },
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel rounded-2xl flex justify-around items-center p-2 bg-space-dark/80 backdrop-blur-2xl border border-neon-blue/40 shadow-[0_10px_40px_rgba(0,229,255,0.3)] neon-glow-blue"
      >
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-500",
                isActive ? "text-neon-blue scale-110" : "text-gray-400 hover:text-white hover:scale-105"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-neon-blue/20 rounded-xl border border-neon-blue/60 shadow-[0_0_20px_rgba(0,229,255,0.5)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={cn(
                    "transition-all duration-500", 
                    isActive && "drop-shadow-[0_0_12px_rgba(0,229,255,1)]"
                  )} 
                />
                <span className={cn(
                  "text-[10px] mt-1 font-medium transition-all duration-500", 
                  isActive ? "opacity-100 font-bold tracking-wider" : "opacity-60"
                )}>
                  {tab.name}
                </span>
              </div>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
};
