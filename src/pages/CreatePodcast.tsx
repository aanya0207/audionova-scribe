
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles, Upload, Image, RefreshCw, Volume2, FileAudio } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  prompt: z.string().min(5, "Prompt must be at least 5 characters").max(300, "Prompt must be less than 300 characters"),
  script: z.string().min(20, "Script must be at least 20 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(300, "Description must be less than 300 characters"),
  category: z.string().min(1, "Category is required"),
  voiceType: z.enum(["male", "female", "robotic"]),
  thumbnailUrl: z.string().url("Please provide a valid URL or generate a thumbnail"),
  thumbnailPrompt: z.string().optional(),
  audioUrl: z.string().optional(),
});

const categories = [
  'Business', 'Health', 'Education', 'Art', 'Science', 
  'Finance', 'Technology', 'Entertainment', 'Sports', 'Politics',
  'History', 'Travel', 'Food', 'Fashion', 'Music', 'Movies'
];

const realPodcastEpisodes = {
  'Business': [
    'https://media.transistor.fm/f1dc2614/d65e1158.mp3',
    'https://traffic.libsyn.com/secure/whywebuypodcast/3_Types_of_Shoppers_You_Need_to_Please_to_Get_Higher_Prices.mp3'
  ],
  'Health': [
    'https://traffic.megaphone.fm/FGTL9473258835.mp3',
    'https://traffic.megaphone.fm/ADV7407557174.mp3'
  ],
  'Education': [
    'https://www.bbc.co.uk/learningenglish/audio/6min/6min-2023-08-10.mp3',
    'https://traffic.libsyn.com/secure/revolutionspodcast/10.12-_The_Southern_Soviets.mp3'
  ],
  'Technology': [
    'https://chrt.fm/track/G8F1AF/cdn.simplecast.com/audio/6fa1d34c-502b-4abf-bd82-483804006e0b/episodes/1f5f83f8-2a4d-46c8-8a48-8f57acdf8670/audio/0bd7dac2-29fb-46ab-9c3b-76b663139913/default_tc.mp3',
    'https://aphid.fireside.fm/d/1437767933/b6676b3f-1d8d-4bef-84c8-1dac7c3b4bfa/b10b6743-9aa6-44c3-8835-1aea5a9282a3.mp3'
  ],
  'Entertainment': [
    'https://traffic.megaphone.fm/GLT8204277320.mp3',
    'https://traffic.megaphone.fm/CAD8749614813.mp3'
  ],
  'Default': [
    'https://traffic.libsyn.com/secure/revolutionspodcast/10.12-_The_Southern_Soviets.mp3',
    'https://aphid.fireside.fm/d/1437767933/b6676b3f-1d8d-4bef-84c8-1dac7c3b4bfa/b10b6743-9aa6-44c3-8835-1aea5a9282a3.mp3'
  ]
};

const CreatePodcast = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewAudio, setPreviewAudio] = useState<string | null>(null);
  const [uploadedAudioFile, setUploadedAudioFile] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      prompt: "",
      script: "",
      description: "",
      category: "",
      voiceType: "male",
      thumbnailUrl: "",
      thumbnailPrompt: "",
      audioUrl: "",
    },
  });
  
  const title = form.watch("title");
  const prompt = form.watch("prompt");
  const script = form.watch("script");
  const category = form.watch("category");
  const voiceType = form.watch("voiceType");
  const thumbnailPrompt = form.watch("thumbnailPrompt");
  
  const handleGenerateScript = async () => {
    if (!prompt) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt for script generation",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingScript(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-generation', {
        body: {
          action: 'generate-script',
          prompt,
          title,
          category
        }
      });
      
      if (error) throw new Error(error.message);
      
      if (data && data.script) {
        form.setValue("script", data.script);
        
        if (!form.getValues("description")) {
          const plainText = data.script.replace(/#+\s+.*\n/g, '').replace(/\n/g, ' ').trim();
          form.setValue("description", plainText.substring(0, 150) + '...');
        }
        
        toast({
          title: "Script Generated",
          description: "AI script generated successfully"
        });
      }
    } catch (error) {
      console.error("Script generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate script",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingScript(false);
    }
  };
  
  const handleGenerateThumbnail = async () => {
    const currentPrompt = form.getValues("prompt");
    const currentTitle = form.getValues("title");
    const currentCategory = form.getValues("category");
    const currentScript = form.getValues("script");
    const currentThumbnailPrompt = form.getValues("thumbnailPrompt");
    
    if (currentThumbnailPrompt && currentThumbnailPrompt.trim().length > 0) {
      setIsGeneratingThumbnail(true);
      
      try {
        console.log("Calling AI generation with custom thumbnail prompt:", currentThumbnailPrompt);
        const { data, error } = await supabase.functions.invoke('ai-generation', {
          body: {
            action: 'generate-thumbnail',
            thumbnailPrompt: currentThumbnailPrompt,
          }
        });
        
        if (error) {
          console.error("Supabase function error:", error);
          throw new Error(error.message);
        }
        
        console.log("Thumbnail generation response:", data);
        
        if (data && data.imageUrl) {
          form.setValue("thumbnailUrl", data.imageUrl);
          toast({
            title: "Thumbnail Generated",
            description: "Custom thumbnail generated successfully"
          });
        } else {
          console.error("No image URL in response:", data);
          throw new Error("No image URL returned from the API");
        }
      } catch (error) {
        console.error("Thumbnail generation error:", error);
        toast({
          title: "Generation Failed",
          description: error instanceof Error ? error.message : "Failed to generate thumbnail",
          variant: "destructive"
        });
      } finally {
        setIsGeneratingThumbnail(false);
      }
      return;
    }
    
    let thumbnailPrompt = currentPrompt;
    
    if (currentScript) {
      const keyPhrases = currentScript
        .split('.')
        .slice(0, 3)
        .join(' ')
        .replace(/\n/g, ' ');
        
      thumbnailPrompt = `Create a visual for a podcast about: ${keyPhrases}`;
    } else if (currentTitle) {
      thumbnailPrompt = `Podcast artwork for: ${currentTitle}`;
    } else if (currentCategory) {
      thumbnailPrompt = `Professional podcast thumbnail for ${currentCategory} podcast`;
    }
    
    if (!thumbnailPrompt) {
      toast({
        title: "Information Required",
        description: "Please enter a title, prompt, or select a category",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingThumbnail(true);
    
    try {
      console.log("Calling AI generation with prompt:", thumbnailPrompt);
      const { data, error } = await supabase.functions.invoke('ai-generation', {
        body: {
          action: 'generate-thumbnail',
          prompt: thumbnailPrompt,
          title: currentTitle,
          category: currentCategory
        }
      });
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message);
      }
      
      console.log("Thumbnail generation response:", data);
      
      if (data && data.imageUrl) {
        form.setValue("thumbnailUrl", data.imageUrl);
        toast({
          title: "Thumbnail Generated",
          description: "AI thumbnail generated successfully"
        });
      } else {
        console.error("No image URL in response:", data);
        throw new Error("No image URL returned from the API");
      }
    } catch (error) {
      console.error("Thumbnail generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate thumbnail",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const handleGenerateAudio = async () => {
    const currentScript = form.getValues("script");
    const currentVoiceType = form.getValues("voiceType");
    
    if (!currentScript) {
      toast({
        title: "Script Required",
        description: "Please generate or write a script first",
        variant: "destructive"
      });
      return;
    }
    
    const shortScript = currentScript.substring(0, 4000);
    
    setIsGeneratingAudio(true);
    setPreviewAudio(null);
    
    try {
      console.log("Calling text-to-speech function with:", {
        text: shortScript.length,
        voiceType: currentVoiceType
      });
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: shortScript,
          voiceType: currentVoiceType
        }
      });
      
      if (error) {
        console.error("Error response from function:", error);
        throw new Error(error.message);
      }
      
      console.log("Text-to-speech response:", data);
      
      if (data && data.audioUrl) {
        form.setValue("audioUrl", data.audioUrl);
        setPreviewAudio(data.audioUrl);
        
        toast({
          title: "Audio Generated",
          description: "Text-to-speech conversion successful"
        });
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("No audio URL returned from API");
      }
    } catch (error) {
      console.error("Audio generation error:", error);
      toast({
        title: "Audio Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate audio",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an audio file (MP3, WAV, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    setUploadedAudioFile(file);
    
    const audioUrl = URL.createObjectURL(file);
    setPreviewAudio(audioUrl);
    
    toast({
      title: "Audio Uploaded",
      description: "Your audio file is ready to be used"
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      if (!user) {
        throw new Error("You must be logged in to publish a podcast");
      }
      
      let finalAudioUrl = values.audioUrl;
      
      if (uploadedAudioFile) {
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(i);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        finalAudioUrl = URL.createObjectURL(uploadedAudioFile);
      } else if (!finalAudioUrl) {
        const podcastUrls = realPodcastEpisodes[values.category] || realPodcastEpisodes.Default;
        const randomIndex = Math.floor(Math.random() * podcastUrls.length);
        finalAudioUrl = podcastUrls[randomIndex];
      }
      
      const newPodcast = {
        id: crypto.randomUUID(),
        title: values.title,
        description: values.description,
        thumbnailUrl: values.thumbnailUrl,
        creatorName: user.fullName || 'Anonymous Creator',
        duration: Math.floor(15 + Math.random() * 35) + ' min',
        category: values.category,
        audioUrl: finalAudioUrl,
        createdAt: new Date().toISOString(),
        userId: user.id
      };

      const existingPodcasts = JSON.parse(localStorage.getItem('userPodcasts') || '[]');
      existingPodcasts.push(newPodcast);
      localStorage.setItem('userPodcasts', JSON.stringify(existingPodcasts));
      
      toast({
        title: "Podcast Published",
        description: "Your podcast has been published successfully!"
      });
      
      form.reset();
      setPreviewAudio(null);
      setUploadedAudioFile(null);
      
      navigate('/explore');
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to create podcast",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
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
        <div className="flex items-center gap-2">
          <Mic className="h-6 w-6 text-sidebar-primary" />
          <h1 className="text-3xl font-display font-bold tracking-tight">Create Podcast</h1>
        </div>
        <p className="text-muted-foreground">Turn your ideas into professional podcasts with AI assistance</p>
      </motion.div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="glass-card p-6 rounded-lg space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Podcast Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a compelling title for your podcast" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Script generation section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Script Prompt</FormLabel>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={handleGenerateScript}
                        disabled={isGeneratingScript}
                        className="flex gap-1 h-8"
                      >
                        {isGeneratingScript ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                        {isGeneratingScript ? 'Generating...' : 'Generate Script'}
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what your podcast should be about"
                        className="h-24 resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a prompt for AI to generate your podcast script
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="script"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generated Podcast Script</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Your generated script will appear here" 
                        className="min-h-[200px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Thumbnail generation section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="thumbnailPrompt"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Thumbnail Prompt</FormLabel>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={handleGenerateThumbnail}
                        disabled={isGeneratingThumbnail}
                        className="flex gap-1 h-8"
                      >
                        {isGeneratingThumbnail ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Image className="h-3 w-3" />}
                        {isGeneratingThumbnail ? 'Generating...' : 'Generate Thumbnail'}
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what you want your thumbnail to look like (e.g., 'A vibrant image of the Eiffel Tower at sunset with warm hues')"
                        className="h-24 resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about landmarks, colors, style, and mood for best results
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generated Thumbnail</FormLabel>
                    {field.value ? (
                      <div className="relative aspect-video rounded-md overflow-hidden border border-input">
                        <img 
                          src={field.value} 
                          alt="Podcast thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <FormControl>
                        <div className="border border-dashed border-muted-foreground/20 rounded-lg p-4 text-center aspect-video flex flex-col items-center justify-center">
                          <Image className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Generate a thumbnail or enter image URL
                          </p>
                        </div>
                      </FormControl>
                    )}
                    <FormControl>
                      <Input
                        placeholder="Or enter image URL manually" 
                        {...field}
                        className="mt-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Episode Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="A brief summary of what your podcast is about" 
                      className="h-20 resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This will appear in podcast listings and directories
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="voiceType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Voice Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male Voice</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female Voice</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="robotic" />
                        </FormControl>
                        <FormLabel className="font-normal">Robotic AI Voice</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 border-t border-white/10 pt-6">
              <FormLabel>Audio</FormLabel>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateAudio}
                  disabled={isGeneratingAudio || !script}
                  className="flex gap-2"
                >
                  {isGeneratingAudio ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                  {isGeneratingAudio ? 'Generating...' : 'Generate Audio from Script'}
                </Button>

                <div className="relative">
                  <Input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    id="audio-upload"
                    onChange={handleAudioUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('audio-upload')?.click()}
                    className="flex gap-2"
                  >
                    <FileAudio className="h-4 w-4" />
                    Upload Your Audio
                  </Button>
                </div>
              </div>

              {previewAudio && (
                <div className="mt-4 p-4 rounded-md bg-white/5">
                  <p className="text-sm font-medium mb-2">Audio Preview</p>
                  <audio controls className="w-full">
                    <source src={previewAudio} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {isUploading && (
                <div className="mt-2">
                  <p className="text-sm mb-1">Uploading: {uploadProgress}%</p>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-sidebar-primary hover:bg-sidebar-primary/90 px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Publish Podcast
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePodcast;
