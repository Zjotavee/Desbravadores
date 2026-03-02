import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card = ({ children, className, onClick, hoverEffect = true }: CardProps) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, boxShadow: "0 10px 30px -10px rgba(74, 222, 128, 0.2)" } : {}}
      onClick={onClick}
      className={cn(
        "glass-panel rounded-2xl p-4 overflow-hidden relative",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
