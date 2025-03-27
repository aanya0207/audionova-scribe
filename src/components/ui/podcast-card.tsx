
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonHoverTap } from '@/lib/animations';

export interface PodcastCardProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  creatorName: string;
  duration: string;
  category: string;
  className?: string;
}

const PodcastCard = ({
  id,
  title,
  description,
  thumbnailUrl,
  creatorName,
  duration,
  category,
  className,
}: PodcastCardProps) => {
  return (
    <motion.div
      className={cn(
        "glass-card rounded-lg overflow-hidden flex flex-col w-full h-full hover-scale", 
        className
      )}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        
        <motion.button
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-sidebar-primary flex items-center justify-center text-white"
          {...buttonHoverTap}
        >
          <Play className="w-5 h-5 ml-0.5" fill="white" />
        </motion.button>
        
        <div className="absolute top-4 left-4 px-2 py-1 text-xs rounded-full glass-card text-white/90">
          {category}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-display font-semibold text-lg line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-3 line-clamp-2">{description}</p>
        
        <div className="mt-auto flex justify-between items-center pt-2 border-t border-white/10">
          <div className="flex items-center text-xs text-muted-foreground">
            <User className="w-3 h-3 mr-1" />
            {creatorName}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            {duration}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PodcastCard;
