
import React from 'react';
import { motion } from 'framer-motion';
import PodcastCard from '@/components/ui/podcast-card';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

// Sample data
const podcasts = [
  {
    id: '1',
    title: 'The Future of AI in Business',
    description: 'Exploring how artificial intelligence is transforming business operations and strategy.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400&h=225',
    creatorName: 'Tech Innovators',
    duration: '32 min',
    category: 'Business',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '2',
    title: 'Mindfulness in the Digital Age',
    description: 'How to maintain focus and mental health in our constantly connected world.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593697821028-7cc59cfd7399?auto=format&fit=crop&q=80&w=400&h=225',
    creatorName: 'Wellness Collective',
    duration: '45 min',
    category: 'Health',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '3',
    title: 'Sustainable Living: A Practical Guide',
    description: 'Simple steps to reduce your carbon footprint and live more sustainably.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400&h=225',
    creatorName: 'EcoFriendly',
    duration: '28 min',
    category: 'Education',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: '4',
    title: 'Modern Architecture Trends',
    description: 'Examining the latest innovations and designs in contemporary architecture.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400&h=225',
    creatorName: 'Design Masters',
    duration: '37 min',
    category: 'Art',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: '5',
    title: 'Space Exploration: New Frontiers',
    description: 'The latest discoveries and future missions in our journey through space.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=400&h=225',
    creatorName: 'Cosmic Ventures',
    duration: '52 min',
    category: 'Science',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: '6',
    title: 'Financial Freedom After 40',
    description: 'Investment strategies and financial planning for mid-life prosperity.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=400&h=225',
    creatorName: 'Wealth Builders',
    duration: '41 min',
    category: 'Finance',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  },
];

const categories = ['All', 'Business', 'Health', 'Education', 'Art', 'Science', 'Finance', 'Technology', 'Entertainment'];

const Home = () => {
  const { playPodcast } = useAudioPlayer();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-3xl font-display font-bold tracking-tight">Discover Podcasts</h1>
        <p className="text-muted-foreground">Explore trending content or create your own AI-powered podcasts</p>
      </motion.div>
      
      <motion.div 
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap focus-ring ${
              index === 0 
                ? 'bg-sidebar-primary text-white' 
                : 'glass-card hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            {...podcast}
            onClick={() => playPodcast(podcast)}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
