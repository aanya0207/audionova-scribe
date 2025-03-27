
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Calendar, Clock, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@clerk/clerk-react';
import PodcastCard from '@/components/ui/podcast-card';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

interface UserPodcast {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  creatorName: string;
  duration: string;
  category: string;
  audioUrl: string;
  createdAt?: string;
  userId?: string;
}

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { playPodcast } = useAudioPlayer();
  const [userPodcasts, setUserPodcasts] = useState<UserPodcast[]>([]);
  const [totalDuration, setTotalDuration] = useState<string>("0 min");
  
  useEffect(() => {
    // Load user podcasts from localStorage
    if (isLoaded && user) {
      // Get stored podcasts
      const storedPodcasts = JSON.parse(localStorage.getItem('userPodcasts') || '[]');
      
      // Filter podcasts for the current user
      const currentUserPodcasts = storedPodcasts.filter(
        (podcast: UserPodcast) => podcast.userId === user.id
      );
      
      setUserPodcasts(currentUserPodcasts);
      
      // Calculate total duration
      if (currentUserPodcasts.length > 0) {
        const totalMinutes = currentUserPodcasts.reduce((total: number, podcast: UserPodcast) => {
          const durationMatch = podcast.duration.match(/(\d+)/);
          const minutes = durationMatch ? parseInt(durationMatch[0]) : 0;
          return total + minutes;
        }, 0);
        
        setTotalDuration(`${totalMinutes} min`);
      }
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sidebar-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-sidebar-primary" />
          <h1 className="text-3xl font-display font-bold tracking-tight">My Profile</h1>
        </div>
        <p className="text-muted-foreground">Manage your profile and view your podcasts</p>
      </motion.div>
      
      <div className="glass-card p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
            <AvatarFallback className="text-xl">{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-semibold">{user?.fullName || 'Welcome!'}</h2>
            <p className="text-muted-foreground">{user?.emailAddresses[0].emailAddress || 'user@example.com'}</p>
            
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mic className="h-4 w-4" />
                <span>{userPodcasts.length} Podcasts</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{totalDuration} Total Duration</span>
              </div>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="flex gap-1">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Podcasts</h2>
        
        {userPodcasts.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Mic className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No podcasts yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't created any podcasts yet. Start creating your first podcast now!
            </p>
            <Button variant="default" onClick={() => window.location.href = '/create'}>
              Create Your First Podcast
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPodcasts.map((podcast) => (
              <PodcastCard
                key={podcast.id}
                {...podcast}
                onClick={() => playPodcast(podcast)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
