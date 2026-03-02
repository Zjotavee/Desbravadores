import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Card } from './Card';
import { Home, MessageSquare, Heart, Tent, Calendar } from 'lucide-react';

export const Sitemap = () => {
  const routes = [
    { path: '/', name: 'Início', icon: Home },
    { path: '/ai', name: 'IA Desbravador', icon: MessageSquare },
    { path: '/spirituality', name: 'Espiritualidade', icon: Heart },
    { path: '/activities', name: 'Atividades', icon: Tent },
    { path: '/agenda', name: 'Agenda', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-space-dark p-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-neon-blue mb-8 text-glow">Sitemap (Ambiente de Preview)</h1>
        <div className="grid gap-4">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link key={route.path} to={route.path}>
                <Card className="hover:border-neon-blue/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-neon-blue/10 text-neon-blue group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{route.name}</h3>
                      <p className="text-sm text-gray-400">{route.path}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
