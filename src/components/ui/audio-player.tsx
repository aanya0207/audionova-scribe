
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

const AudioPlayer = () => {
  const { currentPodcast, isPlaying, pausePodcast, resumePodcast, stopPodcast } = useAudioPlayer();

  if (!currentPodcast) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded overflow-hidden">
            <img 
              src={currentPodcast.thumbnailUrl} 
              alt={currentPodcast.title} 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{currentPodcast.title}</p>
            <p className="text-sm text-muted-foreground">{currentPodcast.creatorName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={isPlaying ? pausePodcast : resumePodcast}
            className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-white"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          
          <button
            onClick={stopPodcast}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
