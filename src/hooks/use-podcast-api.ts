
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Podcast {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  duration: string;
  category: string;
  publishedAt: string;
  episodeCount?: number;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: string;
  publishedAt: string;
  podcastId: string;
}

interface PodcastFilters {
  category?: string;
  sort?: 'newest' | 'popular' | 'duration';
  search?: string;
}

// Function to fetch all podcasts with optional filtering
export const usePodcasts = (filters: PodcastFilters = {}) => {
  const queryKey = ['podcasts', filters];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.search) params.append('search', filters.search);
      
      const { data, error } = await supabase.functions.invoke('podcast-api/get-podcasts', {
        query: params,
      });
      
      if (error) throw new Error(error.message);
      
      // If Taddy API is unavailable, return mock data for development
      if (!data || data.error) {
        console.warn('Using mock podcast data');
        return getMockPodcasts();
      }
      
      return data;
    },
  });
};

// Function to fetch details for a specific podcast
export const usePodcastDetails = (podcastId: string | undefined) => {
  return useQuery({
    queryKey: ['podcast', podcastId],
    queryFn: async () => {
      if (!podcastId) throw new Error('Podcast ID is required');
      
      const { data, error } = await supabase.functions.invoke('podcast-api/get-podcast-details', {
        query: { id: podcastId },
      });
      
      if (error) throw new Error(error.message);
      
      // If Taddy API is unavailable, return mock data for development
      if (!data || data.error) {
        console.warn('Using mock podcast details');
        return getMockPodcastDetails(podcastId);
      }
      
      return data;
    },
    enabled: !!podcastId,
  });
};

// Function to fetch episodes for a specific podcast
export const usePodcastEpisodes = (podcastId: string | undefined) => {
  return useQuery({
    queryKey: ['podcast-episodes', podcastId],
    queryFn: async () => {
      if (!podcastId) throw new Error('Podcast ID is required');
      
      const { data, error } = await supabase.functions.invoke('podcast-api/get-podcast-episodes', {
        query: { id: podcastId },
      });
      
      if (error) throw new Error(error.message);
      
      // If Taddy API is unavailable, return mock data for development
      if (!data || data.error) {
        console.warn('Using mock podcast episodes');
        return getMockPodcastEpisodes(podcastId);
      }
      
      return data;
    },
    enabled: !!podcastId,
  });
};

// Mock data functions for development and testing
function getMockPodcasts(): Podcast[] {
  return [
    {
      id: '1',
      title: 'The Future of AI in Business',
      description: 'Exploring how artificial intelligence is transforming business operations and strategy.',
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'Tech Innovators',
      duration: '32 min',
      category: 'Business',
      publishedAt: '2023-05-15',
      episodeCount: 12,
    },
    {
      id: '2',
      title: 'Mindfulness in the Digital Age',
      description: 'How to maintain focus and mental health in our constantly connected world.',
      imageUrl: 'https://images.unsplash.com/photo-1593697821028-7cc59cfd7399?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'Wellness Collective',
      duration: '45 min',
      category: 'Health',
      publishedAt: '2023-06-22',
      episodeCount: 8,
    },
    {
      id: '3',
      title: 'Sustainable Living: A Practical Guide',
      description: 'Simple steps to reduce your carbon footprint and live more sustainably.',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'EcoFriendly',
      duration: '28 min',
      category: 'Education',
      publishedAt: '2023-04-10',
      episodeCount: 15,
    },
    {
      id: '4',
      title: 'Modern Architecture Trends',
      description: 'Examining the latest innovations and designs in contemporary architecture.',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'Design Masters',
      duration: '37 min',
      category: 'Art',
      publishedAt: '2023-07-05',
      episodeCount: 6,
    },
    {
      id: '5',
      title: 'Space Exploration: New Frontiers',
      description: 'The latest discoveries and future missions in our journey through space.',
      imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'Cosmic Ventures',
      duration: '52 min',
      category: 'Science',
      publishedAt: '2023-03-18',
      episodeCount: 9,
    },
    {
      id: '6',
      title: 'Financial Freedom After 40',
      description: 'Investment strategies and financial planning for mid-life prosperity.',
      imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'Wealth Builders',
      duration: '41 min',
      category: 'Finance',
      publishedAt: '2023-08-30',
      episodeCount: 11,
    },
  ];
}

function getMockPodcastDetails(podcastId: string): Podcast {
  const podcasts = getMockPodcasts();
  const podcast = podcasts.find(p => p.id === podcastId);
  
  if (!podcast) {
    throw new Error(`Podcast with ID ${podcastId} not found`);
  }
  
  return {
    ...podcast,
    description: podcast.description + ' ' + podcast.description + ' ' + podcast.description, // Make it longer for the details page
  };
}

function getMockPodcastEpisodes(podcastId: string): PodcastEpisode[] {
  // Create 5 mock episodes for any podcast ID
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${podcastId}-ep-${i+1}`,
    title: `Episode ${i+1}: The Journey Continues`,
    description: `This is episode ${i+1} of the podcast series. Join us as we explore more fascinating topics and insights.`,
    audioUrl: 'https://example.com/audio.mp3',
    duration: `${Math.floor(20 + Math.random() * 40)} min`,
    publishedAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Dates going back weekly
    podcastId,
  }));
}
