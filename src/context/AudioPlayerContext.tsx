
import React, { createContext, useContext, useState, useRef } from 'react';
import { toast } from 'sonner';

interface Podcast {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  audioUrl?: string;
  creatorName: string;
  duration: string;
  category: string;
}

interface AudioPlayerContextType {
  currentPodcast: Podcast | null;
  isPlaying: boolean;
  playPodcast: (podcast: Podcast) => void;
  pausePodcast: () => void;
  resumePodcast: () => void;
  stopPodcast: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element if it doesn't exist
  if (typeof window !== 'undefined' && !audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setIsPlaying(false);
    };
    audioRef.current.onerror = () => {
      toast.error('Error playing podcast. Please try another one.');
      setIsPlaying(false);
    };
  }

  const playPodcast = (podcast: Podcast) => {
    if (!podcast.audioUrl) {
      // For demo, use a default audio URL if none is provided
      podcast.audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    }

    if (audioRef.current) {
      // If we're already playing this podcast, just return
      if (currentPodcast?.id === podcast.id && isPlaying) {
        return;
      }

      // If we're playing a different podcast, stop the current one
      if (currentPodcast && currentPodcast.id !== podcast.id) {
        audioRef.current.pause();
      }

      // Set the new audio source and play
      audioRef.current.src = podcast.audioUrl;
      audioRef.current.play()
        .then(() => {
          setCurrentPodcast(podcast);
          setIsPlaying(true);
          toast.success(`Now playing: ${podcast.title}`);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
          toast.error('Failed to play podcast. Please try again.');
        });
    }
  };

  const pausePodcast = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumePodcast = () => {
    if (audioRef.current && currentPodcast && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error resuming audio:', error);
          toast.error('Failed to resume podcast. Please try again.');
        });
    }
  };

  const stopPodcast = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentPodcast(null);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentPodcast,
        isPlaying,
        playPodcast,
        pausePodcast,
        resumePodcast,
        stopPodcast
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
