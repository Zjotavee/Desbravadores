import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  children, 
  ...props 
}: ButtonProps) => {
  
  const variants = {
    primary: "bg-pathfinder-red text-white hover:bg-red-700 shadow-lg shadow-red-900/20",
    secondary: "bg-pathfinder-blue text-white hover:bg-blue-800 shadow-lg shadow-blue-900/20",
    outline: "border-2 border-white/20 text-white hover:bg-white/10",
    ghost: "text-white/70 hover:text-white hover:bg-white/5",
    neon: "bg-neon-blue/10 border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/20 shadow-[0_0_15px_rgba(74,222,128,0.3)]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base font-semibold",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "rounded-xl font-medium transition-all flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </motion.button>
  );
};
