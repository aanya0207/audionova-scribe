
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles, Upload, Image, RefreshCw } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  prompt: z.string().min(5, "Prompt must be at least 5 characters").max(300, "Prompt must be less than 300 characters"),
  script: z.string().min(20, "Script must be at least 20 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(300, "Description must be less than 300 characters"),
  category: z.string().min(1, "Category is required"),
  voiceType: z.enum(["male", "female", "robotic"]),
  thumbnailUrl: z.string().url("Please provide a valid URL or generate a thumbnail"),
});

const categories = [
  'Business', 'Health', 'Education', 'Art', 'Science', 
  'Finance', 'Technology', 'Entertainment', 'Sports', 'Politics',
  'History', 'Travel', 'Food', 'Fashion', 'Music', 'Movies'
];

const CreatePodcast = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form definition
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
    },
  });
  
  // Watch form values for AI generation
  const title = form.watch("title");
  const prompt = form.watch("prompt");
  const category = form.watch("category");
  
  // Generate script with AI
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
        
        // If description is empty, use the first 150 characters of the script as description
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
  
  // Generate thumbnail with AI
  const handleGenerateThumbnail = async () => {
    const currentPrompt = form.getValues("prompt");
    const currentTitle = form.getValues("title");
    const currentCategory = form.getValues("category");
    
    if (!currentPrompt && !currentTitle && !currentCategory) {
      toast({
        title: "Information Required",
        description: "Please enter a title, prompt, or select a category",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingThumbnail(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-generation', {
        body: {
          action: 'generate-thumbnail',
          prompt: currentPrompt,
          title: currentTitle,
          category: currentCategory
        }
      });
      
      if (error) throw new Error(error.message);
      
      if (data && data.imageUrl) {
        form.setValue("thumbnailUrl", data.imageUrl);
        toast({
          title: "Thumbnail Generated",
          description: "AI thumbnail generated successfully"
        });
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
  
  // Form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would create a podcast in the database
      console.log("Submitting podcast:", values);
      
      // Mock successful submission
      setTimeout(() => {
        toast({
          title: "Podcast Created",
          description: "Your podcast has been published successfully!"
        });
        
        // Reset form
        form.reset();
        
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to create podcast",
        variant: "destructive"
      });
      setIsSubmitting(false);
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
            
            <div className="grid gap-6 md:grid-cols-2">
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
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Thumbnail</FormLabel>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={handleGenerateThumbnail}
                        disabled={isGeneratingThumbnail}
                        className="flex gap-1 h-8"
                      >
                        {isGeneratingThumbnail ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Image className="h-3 w-3" />}
                        {isGeneratingThumbnail ? 'Generating...' : 'Generate Image'}
                      </Button>
                    </div>
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
              name="script"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Podcast Script</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write or generate your podcast script" 
                      className="min-h-[200px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This is the full script your podcast will be based on
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
