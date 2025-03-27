
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TADDY_API_KEY = Deno.env.get("TADDY_API_KEY");
const TADDY_API_BASE_URL = "https://api.taddy.org"; // Replace with actual Taddy API URL

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body = await req.json();
    const { action, params, id } = body;
    
    console.log(`Processing ${action} request`, { params, id });

    // Return mock data for now, until we implement the real API integration
    let responseData;
    
    if (action === "get-podcasts") {
      responseData = getMockPodcasts(params);
    } else if (action === "get-podcast-details") {
      responseData = getMockPodcastDetails(id);
    } else if (action === "get-podcast-episodes") {
      responseData = getMockPodcastEpisodes(id);
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in podcast-api function:", error.message);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

// Mock data functions for development
function getMockPodcasts(params?: any): any[] {
  const mockPodcasts = [
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
    {
      id: '7',
      title: 'Technology Trends for 2023',
      description: 'A deep dive into upcoming tech innovations that will shape our future.',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'Future Tech Now',
      duration: '39 min',
      category: 'Technology',
      publishedAt: '2023-01-05',
      episodeCount: 7,
    },
    {
      id: '8',
      title: 'The Art of Storytelling',
      description: 'How master storytellers captivate audiences and create memorable narratives.',
      imageUrl: 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'Creative Minds',
      duration: '33 min',
      category: 'Entertainment',
      publishedAt: '2023-02-12',
      episodeCount: 14,
    },
    {
      id: '9',
      title: 'Nutrition Myths Debunked',
      description: 'Separating fact from fiction in the world of nutrition and diet advice.',
      imageUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=400&h=225',
      author: 'Health Science',
      duration: '46 min',
      category: 'Health',
      publishedAt: '2023-05-25',
      episodeCount: 10,
    },
  ];

  // Filter by category if provided
  let filteredPodcasts = [...mockPodcasts];
  if (params?.category && params.category !== 'All') {
    filteredPodcasts = filteredPodcasts.filter(p => p.category === params.category);
  }

  // Apply search if provided
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredPodcasts = filteredPodcasts.filter(p => 
      p.title.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower) ||
      p.author.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  if (params?.sort) {
    switch (params.sort) {
      case 'newest':
        filteredPodcasts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'popular':
        filteredPodcasts.sort((a, b) => (b.episodeCount || 0) - (a.episodeCount || 0));
        break;
      case 'duration':
        filteredPodcasts.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        break;
    }
  }

  return filteredPodcasts;
}

function getMockPodcastDetails(id: string): any {
  const podcasts = getMockPodcasts();
  const podcast = podcasts.find(p => p.id === id);
  
  if (!podcast) {
    throw new Error(`Podcast with ID ${id} not found`);
  }
  
  return {
    ...podcast,
    description: podcast.description + ' ' + podcast.description + ' ' + podcast.description, // Make it longer for the details page
  };
}

function getMockPodcastEpisodes(podcastId: string): any[] {
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
