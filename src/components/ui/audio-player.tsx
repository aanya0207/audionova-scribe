
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, X, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Slider } from '@/components/ui/slider';

const AudioPlayer = () => {
  const { currentPodcast, isPlaying, pausePodcast, resumePodcast, stopPodcast } = useAudioPlayer();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Handle podcast changes
  useEffect(() => {
    if (currentPodcast && audioRef.current) {
      // Reset states
      setCurrentTime(0);
      setDuration(0);
      
      // Update audio source
      audioRef.current.src = currentPodcast.audioUrl;
      audioRef.current.load();
      
      // Play if isPlaying is true
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      }
      
      // Add event listeners
      const onLoadedMetadata = () => {
        setDuration(audioRef.current?.duration || 0);
      };
      
      const onTimeUpdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      };
      
      const onEnded = () => {
        setCurrentTime(0);
        pausePodcast();
      };
      
      audioRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
      audioRef.current.addEventListener('timeupdate', onTimeUpdate);
      audioRef.current.addEventListener('ended', onEnded);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
          audioRef.current.removeEventListener('timeupdate', onTimeUpdate);
          audioRef.current.removeEventListener('ended', onEnded);
        }
      };
    }
  }, [currentPodcast, isPlaying, pausePodcast]);
  
  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  if (!currentPodcast) return null;
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle seeking
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Skip forward/backward
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 15);
    }
  };
  
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded overflow-hidden">
                <img 
                  src={currentPodcast.thumbnailUrl} 
                  alt={currentPodcast.title} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="max-w-[200px] sm:max-w-xs">
                <p className="font-medium truncate">{currentPodcast.title}</p>
                <p className="text-sm text-muted-foreground truncate">{currentPodcast.creatorName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={skipBackward}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white sm:flex hidden"
              >
                <SkipBack size={16} />
              </button>
              
              <button
                onClick={isPlaying ? pausePodcast : resumePodcast}
                className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-white"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>
              
              <button
                onClick={skipForward}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center sm:flex hidden"
              >
                <SkipForward size={16} />
              </button>
              
              <div className="hidden md:flex items-center gap-2 w-28">
                <button onClick={toggleMute} className="text-white/70 hover:text-white">
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <Slider 
                  value={[isMuted ? 0 : volume]} 
                  max={1} 
                  step={0.01} 
                  onValueChange={handleVolumeChange} 
                  className="w-20"
                />
              </div>
              
              <button
                onClick={stopPodcast}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider 
              value={[currentTime]} 
              max={duration || 100} 
              step={1} 
              onValueChange={handleSeek} 
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
