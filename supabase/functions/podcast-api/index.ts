
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TADDY_API_KEY = Deno.env.get("TADDY_API_KEY");
const TADDY_API_BASE_URL = "https://api.taddy.org"; // Replace with actual Taddy API URL

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
    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();
    
    if (!endpoint) {
      throw new Error("No endpoint specified");
    }

    let taddyUrl = "";
    let params = {};

    // Parse request body if present
    let requestBody = {};
    if (req.method === "POST") {
      requestBody = await req.json();
    }

    // Extract query parameters
    const queryParams = url.searchParams;
    
    // Handle different endpoints
    switch (endpoint) {
      case "get-podcasts":
        taddyUrl = `${TADDY_API_BASE_URL}/podcasts`;
        
        // Add filters if present
        if (queryParams.has('category')) {
          params = { ...params, category: queryParams.get('category') };
        }
        if (queryParams.has('sort')) {
          params = { ...params, sort: queryParams.get('sort') };
        }
        if (queryParams.has('search')) {
          params = { ...params, q: queryParams.get('search') };
        }
        break;

      case "get-podcast-details":
        const podcastId = queryParams.get('id');
        if (!podcastId) {
          throw new Error("Podcast ID is required");
        }
        taddyUrl = `${TADDY_API_BASE_URL}/podcasts/${podcastId}`;
        break;

      case "get-podcast-episodes":
        const podcastIdForEpisodes = queryParams.get('id');
        if (!podcastIdForEpisodes) {
          throw new Error("Podcast ID is required");
        }
        taddyUrl = `${TADDY_API_BASE_URL}/podcasts/${podcastIdForEpisodes}/episodes`;
        break;

      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }

    // Create query string from params
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');
    
    const fullUrl = queryString ? `${taddyUrl}?${queryString}` : taddyUrl;

    console.log(`Making request to: ${fullUrl}`);

    // Make the request to Taddy API
    const response = await fetch(fullUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${TADDY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      ...(req.method === "POST" && { body: JSON.stringify(requestBody) }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error in podcast-api function: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
