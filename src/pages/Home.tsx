import { motion } from 'motion/react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ChevronRight, Star, Shield, Flame, Map, Users, Tent, Sparkles } from 'lucide-react';

import { InstallPWA } from '@/components/InstallPWA';

export const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleFindClub = () => {
    window.open('https://clubes.adventistas.org/br/search-clube/', '_blank');
  };

  const handleLearnMore = () => {
    window.open('https://www.youtube.com/watch?v=VUw493jKMGE&pp=ygUNZGVzYnJhdmFkb3Jlcw%3D%3D', '_blank');
  };

  return (
    <motion.div 
      className="space-y-16 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <InstallPWA />
      {/* Hero Section */}
      <section className="text-center space-y-10 pt-20 pb-12 relative z-10 overflow-visible">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/5 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />
        
        <motion.div variants={itemVariants} className="relative px-4">
          {/* Decorative Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full -z-10 pointer-events-none"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-dashed border-white/10 rounded-full -z-10 pointer-events-none"
          />

          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 py-2 px-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-sm font-bold tracking-[0.2em] text-neon-blue mb-10 uppercase shadow-[0_0_30px_rgba(74,222,128,0.15)] hover:bg-white/10 transition-colors cursor-default"
          >
            <Sparkles size={14} className="animate-pulse" /> 
            <span>Clube de Desbravadores</span>
          </motion.div>
          
          {/* Main Title */}
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9] select-none relative z-10">
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400 drop-shadow-2xl">
              RUMO
            </span>
            <span className="relative block mt-2">
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-pathfinder-yellow via-pathfinder-red to-pathfinder-red blur-3xl opacity-40" aria-hidden="true">
                AO LAR
              </span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-pathfinder-yellow via-pathfinder-red to-pathfinder-red drop-shadow-[0_0_25px_rgba(198,40,40,0.6)]">
                AO LAR
              </span>
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-gray-300 text-lg md:text-2xl mt-10 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
            Uma jornada de <strong className="text-white font-semibold">fé</strong>, <strong className="text-white font-semibold">aventura</strong> e <strong className="text-white font-semibold">amizade</strong>. 
            <br className="hidden md:block" />
            Explore o mundo e sirva ao próximo com tecnologia e propósito.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center pt-10 px-4 relative z-20">
          <Button 
            size="lg" 
            className="group text-lg px-10 py-7 h-auto bg-gradient-to-r from-neon-blue to-emerald-600 text-white border-none shadow-[0_0_40px_rgba(74,222,128,0.4)] hover:shadow-[0_0_80px_rgba(74,222,128,0.6)] hover:scale-105 transition-all duration-300 relative overflow-hidden"
            onClick={handleFindClub}
          >
            <span className="relative z-10 flex items-center gap-3 font-bold tracking-wide text-xl">
              Encontre um Clube
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-10 py-7 h-auto border-white/20 hover:bg-white/5 hover:border-white/40 transition-all backdrop-blur-sm"
            onClick={handleLearnMore}
          >
            Saiba Mais
          </Button>
        </motion.div>
      </section>

      {/* Feature Carousel / Hero Image */}
      <motion.section variants={itemVariants} className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-transparent to-transparent z-10 pointer-events-none" />
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-neon-blue/10 group">
          <img 
            src="https://picsum.photos/seed/campori/1200/600" 
            alt="Desbravadores em Campori" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-2xl font-bold text-white mb-2">Próximo Evento: Campori DSA</h3>
            <p className="text-gray-300">Prepare seu clube para a maior aventura do ano.</p>
          </div>
        </div>
      </motion.section>

      {/* Pillars Grid */}
      <section>
        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-8 text-white">
          Nossos Pilares
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              icon: Shield, 
              title: "Missão", 
              desc: "Levar a mensagem do advento a todo o mundo nesta geração.", 
              color: "text-pathfinder-red",
              bg: "bg-pathfinder-red/10",
              border: "border-pathfinder-red/20"
            },
            { 
              icon: Star, 
              title: "Ideais", 
              desc: "Amar a Deus acima de tudo e ao próximo como a si mesmo.", 
              color: "text-pathfinder-yellow",
              bg: "bg-pathfinder-yellow/10",
              border: "border-pathfinder-yellow/20"
            },
            { 
              icon: Flame, 
              title: "Propósito", 
              desc: "Salvar do pecado e guiar no serviço.", 
              color: "text-neon-blue",
              bg: "bg-neon-blue/10",
              border: "border-neon-blue/20"
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <Card className={`h-full flex flex-col items-center text-center gap-4 p-8 border ${item.border} hover:bg-white/5 transition-colors`}>
                <div className={`p-4 rounded-2xl ${item.bg} ${item.color} shadow-[0_0_20px_rgba(0,0,0,0.2)]`}>
                  <item.icon size={40} />
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats / Info */}
      <motion.section variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { number: "2M+", label: "Desbravadores", icon: Users },
          { number: "160+", label: "Países", icon: Map },
          { number: "90k+", label: "Clubes", icon: Tent },
          { number: "∞", label: "Aventuras", icon: Star },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col items-center justify-center p-6 bg-white/5 border-white/5">
            <stat.icon className="text-neon-blue mb-2 opacity-50" size={24} />
            <span className="text-3xl font-bold text-white">{stat.number}</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</span>
          </Card>
        ))}
      </motion.section>

      {/* CTA Section */}
      <motion.section variants={itemVariants} className="glass-panel rounded-3xl p-8 md:p-16 text-center relative overflow-hidden border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-pathfinder-blue/20 via-transparent to-pathfinder-red/20 opacity-30" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-pathfinder-yellow/20 rounded-full blur-[80px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-neon-blue/20 rounded-full blur-[80px]" />
        
        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Pronto para a <span className="text-pathfinder-yellow">Aventura?</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Junte-se a nós e descubra o seu potencial. O Clube de Desbravadores é o lugar onde fé e amizade se encontram.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-12 py-5 h-auto bg-gradient-to-r from-pathfinder-red to-red-600 text-white font-bold tracking-wide shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_rgba(220,38,38,0.7)] hover:scale-105 transition-all duration-300 border-none relative overflow-hidden group"
            onClick={handleFindClub}
          >
            <span className="relative z-10 flex items-center gap-2">
              Encontre um Clube
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          </Button>
        </div>
      </motion.section>
    </motion.div>
  );
};
