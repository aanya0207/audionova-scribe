
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
        // Generate thumbnail based on prompt
        console.log(`Generating thumbnail for prompt: ${prompt}`);
        
        // For demo purposes, return a relevant Unsplash image URL
        const imageUrl = await getUnsplashImage(prompt || title || category || 'podcast');
        
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

async function getUnsplashImage(query: string) {
  // In production, this would use the Unsplash API with proper attribution
  // For demo, use a predefined list of topic-related images
  
  const imagesByCategory: Record<string, string[]> = {
    'technology': [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1'
    ],
    'business': [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
      'https://images.unsplash.com/photo-1611095973763-414019e72400'
    ],
    'health': [
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352'
    ],
    'education': [
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e'
    ],
    'entertainment': [
      'https://images.unsplash.com/photo-1603739903239-8b6e64c3b185',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
      'https://images.unsplash.com/photo-1603190287605-e6ade32fa852'
    ],
    'science': [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
      'https://images.unsplash.com/photo-1564325724739-bae0bd08762c',
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31'
    ],
    'default': [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc',
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618',
      'https://images.unsplash.com/photo-1526128034903-1f149c291f59'
    ]
  };
  
  // Simplistic category matching based on query
  let category = 'default';
  
  const queryLower = query.toLowerCase();
  if (queryLower.includes('tech') || queryLower.includes('computer') || queryLower.includes('digital')) {
    category = 'technology';
  } else if (queryLower.includes('business') || queryLower.includes('work') || queryLower.includes('finance')) {
    category = 'business';
  } else if (queryLower.includes('health') || queryLower.includes('fitness') || queryLower.includes('wellness')) {
    category = 'health';
  } else if (queryLower.includes('edu') || queryLower.includes('learn') || queryLower.includes('study')) {
    category = 'education';
  } else if (queryLower.includes('entertain') || queryLower.includes('music') || queryLower.includes('movie')) {
    category = 'entertainment';
  } else if (queryLower.includes('science') || queryLower.includes('research') || queryLower.includes('lab')) {
    category = 'science';
  }
  
  const images = imagesByCategory[category];
  const randomIndex = Math.floor(Math.random() * images.length);
  
  // Add size parameters to the URL
  return `${images[randomIndex]}?auto=format&fit=crop&w=800&h=450&q=80`;
}
