
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Check if we have an ElevenLabs API key
const elevenLabsApiKey = Deno.env.get('ELEVEN_LABS_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceId, voiceType } = await req.json();
    
    if (!text) {
      throw new Error("Text content is required");
    }

    if (!elevenLabsApiKey) {
      throw new Error("ElevenLabs API key is not configured");
    }

    // Default to a specific voice if not provided based on the voice type
    let selectedVoiceId = voiceId;
    if (!selectedVoiceId) {
      switch(voiceType) {
        case 'male':
          selectedVoiceId = 'pNInz6obpgDQGcFmaJgB'; // Adam
          break;
        case 'female':
          selectedVoiceId = 'EXAVITQu4vr4xnSDxMaL'; // Sarah
          break;
        case 'robotic':
          selectedVoiceId = 'XrExE9yKIg1WjnnlVkGX'; // Matilda
          break;
        default:
          selectedVoiceId = 'pNInz6obpgDQGcFmaJgB'; // Default to Adam
      }
    }

    console.log(`Generating speech for voice ${selectedVoiceId}, text length: ${text.length} characters`);

    // Make sure we're not sending too much text - ElevenLabs has limits
    // Typically around 5000 characters is safe
    const trimmedText = text.substring(0, 4000);
    
    try {
      // Call ElevenLabs API to generate audio
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey,
        },
        body: JSON.stringify({
          text: trimmedText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('ElevenLabs API error:', errorData);
        throw new Error(`Failed to generate speech: ${response.status}`);
      }

      // Get the audio as an array buffer
      const audioArrayBuffer = await response.arrayBuffer();
      
      // Convert to base64 for easy transport
      const audioBase64 = btoa(
        new Uint8Array(audioArrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      console.log('Successfully generated audio');

      return new Response(
        JSON.stringify({ 
          success: true,
          audioUrl: `data:audio/mpeg;base64,${audioBase64}`
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      throw new Error(`ElevenLabs API error: ${error.message}`);
    }
  } catch (error) {
    console.error('Text-to-speech error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
