import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export const ParallaxBackground = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax transforms for different layers
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <div ref={ref} className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      {/* Base Deep Space Gradient */}
      <div className="absolute inset-0 bg-[#0A0F1F]" />
      
      {/* Layer 1: Distant Nebula/Glows (Slowest) */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 opacity-30"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#0D47A1]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C62828]/10 rounded-full blur-[100px]" />
      </motion.div>

      {/* Layer 2: Floating Geometric Rings (Medium) */}
      <motion.div 
        style={{ y: y2, rotate: rotate1 }}
        className="absolute inset-0 opacity-20"
      >
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] border border-[#00E5FF]/20 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] border border-[#FFC107]/10 rounded-full border-dashed" />
      </motion.div>

      {/* Layer 3: Particles/Stars (Fastest) */}
      <motion.div 
        style={{ y: y3 }}
        className="absolute inset-0"
      >
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: Math.random() }}
            animate={{ 
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2 + Math.random() * 3, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              boxShadow: Math.random() > 0.8 ? '0 0 10px #00E5FF' : 'none'
            }}
          />
        ))}
      </motion.div>

      {/* Layer 4: Accent Glows (Very Fast) */}
      <motion.div 
        style={{ y: y3, rotate: rotate2 }}
        className="absolute inset-0 opacity-40 pointer-events-none"
      >
        <div className="absolute top-[20%] right-[15%] w-2 h-2 bg-[#00E5FF] rounded-full shadow-[0_0_20px_#00E5FF]" />
        <div className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-[#FFC107] rounded-full shadow-[0_0_20px_#FFC107]" />
      </motion.div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0F1F]" />
    </div>
  );
};
