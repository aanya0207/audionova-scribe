import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, Mail, MessageCircle, AlarmClock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const Help = () => {
  const { toast } = useToast();
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    message: '',
    type: 'suggestion'
  });
  
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFeedbackTypeChange = (value: string) => {
    setFeedbackForm(prev => ({ ...prev, type: value }));
  };
  
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to the backend
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! We'll review it shortly."
    });
    setFeedbackForm({
      name: '',
      email: '',
      message: '',
      type: 'suggestion'
    });
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
          <HelpCircle className="h-6 w-6 text-sidebar-primary" />
          <h1 className="text-3xl font-display font-bold tracking-tight">Help & Support</h1>
        </div>
        <p className="text-muted-foreground">Find answers to common questions and get assistance</p>
      </motion.div>
      
      <Tabs defaultValue="faqs" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="faqs">
            Frequently Asked Questions
          </TabsTrigger>
          <TabsTrigger value="contact">
            Contact Support
          </TabsTrigger>
          <TabsTrigger value="troubleshooting">
            Troubleshooting
          </TabsTrigger>
          <TabsTrigger value="feedback">
            Feedback & Suggestions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faqs" className="space-y-6">
          <div className="glass-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I create a podcast?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Creating a podcast is simple:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Navigate to the Create page from the sidebar</li>
                    <li>Enter a compelling title for your podcast</li>
                    <li>Select a category that best fits your content</li>
                    <li>Write a prompt or description for your script (or generate one with AI)</li>
                    <li>Generate a thumbnail image using our AI tool</li>
                    <li>Review and edit the generated script as needed</li>
                    <li>Generate audio from your script or upload your own recording</li>
                    <li>Add a description and click "Publish Podcast"</li>
                  </ol>
                  <p className="mt-2">Your podcast will be published and available on your profile!</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I generate scripts or thumbnails?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2"><strong>For Scripts:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 mb-4">
                    <li>Enter a descriptive prompt about your podcast topic</li>
                    <li>Click the "Generate Script" button</li>
                    <li>Review and edit the AI-generated script in the script editor</li>
                  </ol>
                  
                  <p className="mb-2"><strong>For Thumbnails:</strong></p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Enter a specific thumbnail prompt describing what you want in your image</li>
                    <li>Click the "Generate Image" button</li>
                    <li>If you're not satisfied with the result, try a different prompt or generate again</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>How do I upload my audio?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">You have two options for adding audio to your podcast:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Generate from Script:</strong> Click the "Generate Audio from Script" button to convert your script to speech using our AI voice technology.</li>
                    <li><strong>Upload Your Own:</strong> Click the "Upload Your Audio" button to select an audio file from your device. Supported formats include MP3, WAV, and M4A.</li>
                  </ol>
                  <p className="mt-2">After either method, you'll see an audio player where you can preview your podcast before publishing.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Why is audio playback not working?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">If you're experiencing issues with audio playback:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Check that your device's volume is turned up and not muted</li>
                    <li>Try refreshing the page or using a different browser</li>
                    <li>Ensure the audio file format is supported (MP3, WAV, M4A)</li>
                    <li>For AI-generated audio, try regenerating the audio</li>
                    <li>For uploaded audio, try uploading the file again or using a different file</li>
                    <li>Clear your browser cache and cookies</li>
                  </ul>
                  <p className="mt-2 text-muted-foreground">If problems persist, please contact our support team with details about your issue.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>How do I edit my profile?</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Navigate to the Settings page from the sidebar</li>
                    <li>Click on the "Profile" tab</li>
                    <li>Update your name, bio, and other information</li>
                    <li>Click "Save Changes" to apply your updates</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger>Can I delete a podcast?</AccordionTrigger>
                <AccordionContent>
                  <p>Yes, you can delete podcasts you've created:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to your Profile page</li>
                    <li>Find the podcast you want to delete</li>
                    <li>Click the options menu (three dots) on the podcast card</li>
                    <li>Select "Delete"</li>
                    <li>Confirm the deletion when prompted</li>
                  </ol>
                  <p className="mt-2 text-muted-foreground">Note: Deletion is permanent and cannot be undone.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Support
                </CardTitle>
                <CardDescription>
                  Get help via email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Send us an email and we'll get back to you within 24-48 hours during business days.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  support@podcastai.com
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Live Chat
                </CardTitle>
                <CardDescription>
                  Chat with our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Available Monday to Friday, 9 AM to 5 PM EST for immediate assistance.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Start Chat
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlarmClock className="h-5 w-5" />
                  Support Ticket
                </CardTitle>
                <CardDescription>
                  Submit a detailed request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  For complex issues, submit a support ticket and track the resolution process.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Open Ticket
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="troubleshooting" className="space-y-6">
          <div className="glass-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Common Issues & Solutions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">AI Script or Thumbnail Generation Failures</h3>
                <div className="bg-white/5 p-4 rounded-md">
                  <p className="mb-2 font-medium">Troubleshooting Steps:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Ensure your prompt is clear and descriptive (at least 5-10 words)</li>
                    <li>Check your internet connection</li>
                    <li>Try refreshing the page and attempting again</li>
                    <li>If generating a thumbnail, try a simpler description</li>
                    <li>If generating a script, check that your category is selected</li>
                    <li>Wait a few minutes and try again (our AI services might be experiencing high demand)</li>
                  </ol>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Audio Playback Issues</h3>
                <div className="bg-white/5 p-4 rounded-md">
                  <p className="mb-2 font-medium">Troubleshooting Steps:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Check device volume and ensure it's not muted</li>
                    <li>Try using headphones to rule out speaker issues</li>
                    <li>Restart your browser</li>
                    <li>Clear browser cache and cookies</li>
                    <li>Try a different browser</li>
                    <li>For AI audio, check that your script isn't too long (limit is 4000 characters)</li>
                    <li>For uploaded audio, ensure the file format is supported (MP3, WAV, M4A)</li>
                  </ol>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Login or Account Issues</h3>
                <div className="bg-white/5 p-4 rounded-md">
                  <p className="mb-2 font-medium">Troubleshooting Steps:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Try resetting your password</li>
                    <li>Check that your email address is entered correctly</li>
                    <li>Ensure you've verified your email address</li>
                    <li>Clear browser cookies and try logging in again</li>
                    <li>Try logging in from a different device</li>
                    <li>If using social login, try disconnecting and reconnecting the account</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-6">
          <div className="glass-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Share Your Thoughts</h2>
            <p className="mb-6 text-muted-foreground">
              We value your feedback and suggestions to improve our platform. Please share your thoughts with us!
            </p>
            
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={feedbackForm.name}
                    onChange={handleFeedbackChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={feedbackForm.email}
                    onChange={handleFeedbackChange}
                    placeholder="Your email address"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="feedback-type" className="block text-sm font-medium">
                  Feedback Type
                </label>
                <Select 
                  value={feedbackForm.type} 
                  onValueChange={handleFeedbackTypeChange}
                >
                  <SelectTrigger className="w-full" id="feedback-type">
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    <SelectItem value="suggestion">Feature Suggestion</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="improvement">Improvement Idea</SelectItem>
                    <SelectItem value="praise">Praise</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={feedbackForm.message}
                  onChange={handleFeedbackChange}
                  placeholder="Please describe your feedback, suggestion, or report in detail..."
                  className="min-h-[150px]"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Help;
