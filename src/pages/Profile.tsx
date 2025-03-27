
import React from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Calendar, Clock, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@clerk/clerk-react';
import PodcastCard from '@/components/ui/podcast-card';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { playPodcast } = useAudioPlayer();
  
  // Mock user podcasts data
  const userPodcasts = [
    {
      id: 'user-1',
      title: 'My First Podcast',
      description: 'This is my first podcast about technology and innovation.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400&h=225',
      creatorName: user?.fullName || 'User',
      duration: '25 min',
      category: 'Technology',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: 'user-2',
      title: 'Creative Thinking',
      description: 'Exploring methods to enhance creativity and problem-solving.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=400&h=225',
      creatorName: user?.fullName || 'User',
      duration: '32 min',
      category: 'Education',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
  ];

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
                <span>57 min Total Duration</span>
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPodcasts.map((podcast) => (
            <PodcastCard
              key={podcast.id}
              {...podcast}
              onClick={() => playPodcast(podcast)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
