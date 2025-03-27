
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, params, id } = await req.json();
    
    // Mock data for quick response
    const mockPodcasts = getMockPodcasts();
    const cachedCategories = ['All', 'Business', 'Health', 'Education', 'Art', 'Science', 'Finance', 'Technology', 'Entertainment'];
    
    // Route requests based on action
    switch(action) {
      case 'get-podcasts':
        let filteredPodcasts = [...mockPodcasts];
        
        // Apply category filter
        if (params?.category && params.category !== 'All') {
          filteredPodcasts = filteredPodcasts.filter(p => p.category === params.category);
        }
        
        // Apply search query
        if (params?.search) {
          const query = params.search.toLowerCase();
          filteredPodcasts = filteredPodcasts.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query) ||
            p.author.toLowerCase().includes(query)
          );
        }
        
        // Apply sorting
        if (params?.sort) {
          switch(params.sort) {
            case 'newest':
              filteredPodcasts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
              break;
            case 'popular':
              // Sort by some popularity metric, like episodeCount or a random number for demo
              filteredPodcasts.sort((a, b) => (b.episodeCount || 0) - (a.episodeCount || 0));
              break;
            case 'duration':
              // Sort by duration (assuming duration is stored as 'XX min')
              filteredPodcasts.sort((a, b) => {
                const aDuration = parseInt(a.duration.replace(' min', '')) || 0;
                const bDuration = parseInt(b.duration.replace(' min', '')) || 0;
                return bDuration - aDuration;
              });
              break;
          }
        }
        
        return new Response(JSON.stringify(filteredPodcasts), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      
      case 'get-podcast-details':
        const podcast = mockPodcasts.find(p => p.id === id);
        if (!podcast) {
          return new Response(JSON.stringify({ error: 'Podcast not found' }), { 
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }
        return new Response(JSON.stringify(podcast), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      
      case 'get-podcast-episodes':
        const episodes = getMockPodcastEpisodes(id);
        return new Response(JSON.stringify(episodes), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      
      case 'get-categories':
        return new Response(JSON.stringify(cachedCategories), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});

function getMockPodcasts() {
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
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
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
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
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
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
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
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
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
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
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
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
    },
    {
      id: '7',
      title: 'The History of Rock Music',
      description: 'A journey through the evolution of rock music from the 1950s to today.',
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'Music Historians',
      duration: '48 min',
      category: 'Entertainment',
      publishedAt: '2023-09-15',
      episodeCount: 7,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
    },
    {
      id: '8',
      title: 'Quantum Computing Explained',
      description: 'Breaking down the complex science of quantum computing for the average person.',
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'Science Simplified',
      duration: '33 min',
      category: 'Technology',
      publishedAt: '2023-02-28',
      episodeCount: 5,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
    },
    {
      id: '9',
      title: 'Cooking Without Borders',
      description: 'Exploring global cuisines and fusion cooking techniques from professional chefs.',
      imageUrl: 'https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'Global Gastronomy',
      duration: '39 min',
      category: 'Education',
      publishedAt: '2023-10-05',
      episodeCount: 14,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
    },
    {
      id: '10',
      title: 'The Psychology of Success',
      description: 'Understanding the mindset and habits that lead to personal and professional success.',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'Mind Matters',
      duration: '47 min',
      category: 'Business',
      publishedAt: '2023-01-22',
      episodeCount: 18,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
    },
    {
      id: '11',
      title: 'Urban Gardening Solutions',
      description: 'How to create thriving gardens in small urban spaces with limited resources.',
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'City Growers',
      duration: '31 min',
      category: 'Health',
      publishedAt: '2023-04-18',
      episodeCount: 9,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3'
    },
    {
      id: '12',
      title: 'Digital Privacy in 2023',
      description: 'Essential strategies to protect your personal data in an increasingly connected world.',
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'Security Experts',
      duration: '36 min',
      category: 'Technology',
      publishedAt: '2023-03-30',
      episodeCount: 11,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3'
    }
  ];
}

function getMockPodcastEpisodes(podcastId: string) {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${podcastId}-ep-${i+1}`,
    title: `Episode ${i+1}: The Journey Continues`,
    description: `This is episode ${i+1} of the podcast series. Join us as we explore more fascinating topics and insights.`,
    audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 16) + 1}.mp3`,
    duration: `${Math.floor(20 + Math.random() * 40)} min`,
    publishedAt: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    podcastId,
  }));
}
