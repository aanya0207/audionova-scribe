
import React from 'react';
import { motion } from 'framer-motion';
import { Headphones } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo = ({ size = 'md', showText = true }: LogoProps) => {
  const sizeMap = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
  };

  const textSizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const iconVariants = {
    initial: {
      rotate: 0,
    },
    hover: {
      rotate: 15,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 10,
      },
    },
  };

  return (
    <motion.div 
      className="flex items-center gap-2 select-none"
      initial="initial"
      whileHover="hover"
    >
      <motion.div
        variants={iconVariants}
        className={`relative rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-sidebar-primary to-purple-400 ${sizeMap[size]}`}
      >
        <Headphones className="w-5/8 h-5/8 text-white" strokeWidth={2} />
      </motion.div>
      
      {showText && (
        <div className="flex flex-col">
          <div className={`font-display font-bold tracking-tight text-gradient ${textSizeMap[size]}`}>Podcraft</div>
          <div className="text-xs text-muted-foreground leading-none">AI Podcast Platform</div>
        </div>
      )}
    </motion.div>
  );
};

export default Logo;
