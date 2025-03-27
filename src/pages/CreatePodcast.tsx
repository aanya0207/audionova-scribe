
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const CreatePodcast = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleGenerateScript = () => {
    if (!title) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your podcast",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    
    // Simulate AI script generation
    setTimeout(() => {
      setDescription("This is an AI-generated script for your podcast about " + title + ". The content explores various aspects of this topic, diving into interesting perspectives and thought-provoking ideas...");
      setGenerating(false);
      
      toast({
        title: "Script Generated",
        description: "Your AI script has been created successfully!"
      });
    }, 2000);
  };

  const handleCreatePodcast = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    // Simulate podcast creation
    setTimeout(() => {
      setUploading(false);
      
      toast({
        title: "Podcast Created",
        description: "Your podcast has been published successfully!"
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
    }, 2000);
  };

  const categories = [
    'Business', 'Health', 'Education', 'Art', 'Science', 
    'Finance', 'Technology', 'Entertainment'
  ];

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
      
      <form onSubmit={handleCreatePodcast} className="space-y-6">
        <div className="glass-card p-6 rounded-lg space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Podcast Title</Label>
            <Input 
              id="title" 
              placeholder="Enter a compelling title for your podcast"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select 
              id="category"
              className="w-full p-2 rounded-md bg-background border border-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="script">Podcast Script</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleGenerateScript}
                disabled={generating}
                className="flex gap-1"
              >
                <Sparkles className="h-4 w-4" />
                {generating ? 'Generating...' : 'Generate with AI'}
              </Button>
            </div>
            <Textarea 
              id="script" 
              placeholder="Write or generate your podcast script"
              className="min-h-[200px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-4">
            <Label>Podcast Thumbnail</Label>
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <Image className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop an image or click to upload
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Select Image
                </Button>
                <p className="text-xs text-muted-foreground">
                  Recommended: 1200 x 675px (16:9 ratio)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-sidebar-primary hover:bg-sidebar-primary/90 px-6"
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Publishing...' : 'Publish Podcast'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePodcast;
