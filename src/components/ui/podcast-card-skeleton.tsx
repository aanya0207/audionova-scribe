
import React from 'react';
import { motion } from 'framer-motion';

const PodcastCardSkeleton = () => {
  return (
    <motion.div
      className="glass-card rounded-lg overflow-hidden flex flex-col w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-white/5 animate-pulse">
        <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/10 animate-pulse"></div>
        <div className="absolute top-4 left-4 w-16 h-5 rounded-full bg-white/10 animate-pulse"></div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-6 bg-white/10 rounded animate-pulse mb-2 w-3/4"></div>
        <div className="h-4 bg-white/5 rounded animate-pulse mb-1 w-full"></div>
        <div className="h-4 bg-white/5 rounded animate-pulse mb-6 w-2/3"></div>
        
        <div className="mt-auto flex justify-between items-center pt-2 border-t border-white/10">
          <div className="h-3 bg-white/5 rounded animate-pulse w-1/3"></div>
          <div className="h-3 bg-white/5 rounded animate-pulse w-1/4"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default PodcastCardSkeleton;
