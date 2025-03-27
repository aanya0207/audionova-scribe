
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const body = await req.json();
    const { action, prompt, title, category } = body;
    
    switch (action) {
      case 'generate-script': {
        // Generate podcast script based on prompt
        console.log(`Generating script for prompt: ${prompt}`);
        
        // For demo purposes, generate a mock script immediately
        const script = generateMockScript(prompt, title, category);
        
        return new Response(JSON.stringify({ script }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      case 'generate-thumbnail': {
        // Generate thumbnail based on enhanced prompt
        const enhancedPrompt = enhanceThumbnailPrompt(prompt, title, category);
        console.log(`Generating thumbnail with enhanced prompt: ${enhancedPrompt}`);
        
        // Get a relevant image URL with better context awareness
        const imageUrl = await getContextualUnsplashImage(enhancedPrompt);
        
        return new Response(JSON.stringify({ imageUrl }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Error in AI generation:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function enhanceThumbnailPrompt(prompt: string, title: string, category: string): string {
  // Create a more specific prompt for better thumbnail generation
  if (prompt && prompt.length > 10) {
    return `Professional podcast cover art for: ${prompt}`;
  } else if (title && title.length > 3) {
    return `High-quality podcast thumbnail for "${title}"`;
  } else if (category) {
    // Map categories to specific visual styles
    const categoryPromptMap: Record<string, string> = {
      'Technology': 'Modern, digital podcast artwork with tech elements',
      'Business': 'Professional corporate podcast cover with business theme',
      'Health': 'Wellness and health podcast thumbnail with calming elements',
      'Education': 'Educational podcast cover with learning symbols',
      'Art': 'Creative and artistic podcast thumbnail with vibrant colors',
      'Science': 'Scientific podcast cover with research and discovery theme',
      'Finance': 'Financial podcast thumbnail with business graphs and charts',
      'Entertainment': 'Dynamic entertainment podcast cover with exciting elements',
      'Sports': 'Athletic podcast thumbnail with action and energy',
      'Politics': 'Political podcast cover with neutral balanced imagery',
      'History': 'Historical podcast thumbnail with vintage aesthetic',
      'Travel': 'Adventure podcast cover with exploration elements',
      'Food': 'Culinary podcast thumbnail with appetizing visuals',
      'Fashion': 'Stylish fashion podcast cover with trendy elements',
      'Music': 'Musical podcast thumbnail with audio visualizer elements',
      'Movies': 'Cinematic podcast cover with film reel aesthetics'
    };
    
    return categoryPromptMap[category] || `Professional podcast cover for ${category} topic`;
  }
  
  return 'High-quality podcast cover artwork';
}

function generateMockScript(prompt: string, title: string, category: string) {
  // In a real implementation, this would call an AI API
  // For now, generate mock content based on inputs
  
  const intros = [
    "Welcome to this episode of our podcast! Today, we're diving deep into a fascinating topic.",
    "Hello listeners! I'm excited to explore a subject that's been on many people's minds lately.",
    "Thank you for joining us for another enlightening discussion. In this episode, we're covering something truly special."
  ];
  
  const bodies = [
    `Let's talk about ${prompt}. This is a subject that touches many aspects of our lives. When we consider the implications, we see that it influences how we work, how we interact with others, and even how we think about ourselves.`,
    `${prompt} represents a paradigm shift in how we understand ${category}. Experts in the field have been observing these changes for years, but only now are we beginning to grasp their full significance.`,
    `The concept of ${prompt} has evolved significantly over time. Initially viewed with skepticism, it has now become central to many discussions about the future of ${category}.`
  ];
  
  const conclusions = [
    "Thank you for listening to our exploration of this fascinating topic. We hope you've gained new insights and perspectives.",
    "As we conclude this episode, remember that these ideas are just the beginning. There's so much more to discover and understand.",
    "That brings us to the end of today's discussion. Join us next time as we continue to explore thought-provoking subjects that shape our world."
  ];
  
  const randomIntro = intros[Math.floor(Math.random() * intros.length)];
  const randomBody = bodies[Math.floor(Math.random() * bodies.length)];
  const randomConclusion = conclusions[Math.floor(Math.random() * conclusions.length)];
  
  return `# ${title || 'Untitled Podcast'}\n\n${randomIntro}\n\n${randomBody}\n\nWhen we dive deeper into ${prompt}, we discover fascinating connections to other areas of ${category}. These connections help us understand the broader context and significance of this topic.\n\nExperts in ${category} often highlight how ${prompt} is changing traditional assumptions. This shift requires us to reconsider established practices and develop new approaches that better address current realities.\n\n${randomConclusion}`;
}

async function getContextualUnsplashImage(query: string) {
  // Enhanced function to get more relevant images based on context
  // In production, this would use the Unsplash API with proper attribution
  
  // Create a mapping of more specific search terms for better results
  const imagesByCategory: Record<string, string[]> = {
    'technology': [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
      'https://images.unsplash.com/photo-1535223289827-42f1e9919769',
    ],
    'business': [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
      'https://images.unsplash.com/photo-1611095973763-414019e72400',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
    ],
    'health': [
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
      'https://images.unsplash.com/photo-1535914254981-b5012eebbd15',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    ],
    'education': [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7',
    ],
    'entertainment': [
      'https://images.unsplash.com/photo-1603739903239-8b6e64c3b185',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
      'https://images.unsplash.com/photo-1603190287605-e6ade32fa852',
      'https://images.unsplash.com/photo-1499364615650-ec38552f4f34',
      'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
    ],
    'science': [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
      'https://images.unsplash.com/photo-1564325724739-bae0bd08762c',
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31',
      'https://images.unsplash.com/photo-1517976487492-5750f3195933',
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69',
      'https://images.unsplash.com/photo-1532187643603-ba119ca4109e',
    ],
    'finance': [
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44',
      'https://images.unsplash.com/photo-1638913974023-cef988e81629',
      'https://images.unsplash.com/photo-1579170053380-58828d4e3f1f',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
      'https://images.unsplash.com/photo-1565514530964-2d886e14e338',
    ],
    'sports': [
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
      'https://images.unsplash.com/photo-1579283471066-d061a6e2b429',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
    ],
    'travel': [
      'https://images.unsplash.com/photo-1500835556837-99ac94a94552',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9',
    ],
    'food': [
      'https://images.unsplash.com/photo-1505935428862-770b6f24f629',
      'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
      'https://images.unsplash.com/photo-1517244683847-7456b63c5969',
    ],
    'music': [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
      'https://images.unsplash.com/photo-1507838153414-b4b713384a76',
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae',
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1',
    ],
    'default': [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618',
      'https://images.unsplash.com/photo-1526128034903-1f149c291f59',
      'https://images.unsplash.com/photo-1599323293366-9a75065cef31',
      'https://images.unsplash.com/photo-1484069560501-87d72b0c3669',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    ]
  };
  
  // Try to find the best matching category
  const queryLower = query.toLowerCase();
  let category = 'default';
  
  // Map specific keywords to categories
  const categoryKeywords = [
    { category: 'technology', keywords: ['tech', 'computer', 'digital', 'software', 'hardware', 'programming', 'code', 'app', 'internet'] },
    { category: 'business', keywords: ['business', 'work', 'finance', 'corporate', 'office', 'startup', 'entrepreneur', 'company', 'management'] },
    { category: 'health', keywords: ['health', 'fitness', 'wellness', 'medical', 'yoga', 'nutrition', 'diet', 'exercise', 'mental health'] },
    { category: 'education', keywords: ['edu', 'learn', 'study', 'teaching', 'school', 'university', 'college', 'knowledge', 'academic'] },
    { category: 'entertainment', keywords: ['entertain', 'music', 'movie', 'film', 'tv', 'television', 'show', 'game', 'fun', 'celebrity'] },
    { category: 'science', keywords: ['science', 'research', 'lab', 'physics', 'chemistry', 'biology', 'astronomy', 'experiment', 'discovery'] },
    { category: 'finance', keywords: ['finance', 'money', 'invest', 'stock', 'market', 'economy', 'trading', 'wealth', 'bank', 'financial'] },
    { category: 'sports', keywords: ['sport', 'athletic', 'game', 'team', 'competition', 'fitness', 'athlete', 'championship', 'olympic'] },
    { category: 'travel', keywords: ['travel', 'adventure', 'journey', 'destination', 'vacation', 'tourist', 'explore', 'tourism', 'trip'] },
    { category: 'food', keywords: ['food', 'cook', 'cuisine', 'recipe', 'dish', 'restaurant', 'chef', 'culinary', 'dining', 'baking'] },
    { category: 'music', keywords: ['music', 'song', 'band', 'concert', 'album', 'artist', 'instrument', 'audio', 'sound', 'melody'] },
  ];
  
  // Find best matching category
  for (const { category: cat, keywords } of categoryKeywords) {
    if (keywords.some(keyword => queryLower.includes(keyword))) {
      category = cat;
      break;
    }
  }
  
  // Get images for the selected category
  const images = imagesByCategory[category] || imagesByCategory.default;
  const randomIndex = Math.floor(Math.random() * images.length);
  
  // Add size parameters to the URL
  return `${images[randomIndex]}?auto=format&fit=crop&w=800&h=450&q=80`;
}
