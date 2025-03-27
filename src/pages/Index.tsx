
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Layers, Zap, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import AuthButtons from '@/components/Authentication/AuthButtons';

const Index = () => {
  const features = [
    {
      icon: <Sparkles className="h-5 w-5 text-sidebar-primary" />,
      title: 'AI-Generated Scripts',
      description: 'Create compelling podcast content with our AI script generation.'
    },
    {
      icon: <Layers className="h-5 w-5 text-sidebar-primary" />,
      title: 'Smart Thumbnails',
      description: 'Automatically generate eye-catching thumbnails for your podcasts.'
    },
    {
      icon: <Zap className="h-5 w-5 text-sidebar-primary" />,
      title: 'Analytics & Insights',
      description: 'Track engagement and understand your audience with detailed metrics.'
    },
    {
      icon: <Upload className="h-5 w-5 text-sidebar-primary" />,
      title: 'Easy Publishing',
      description: 'Share your podcast across platforms with one-click publishing.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="pt-6 px-6 md:px-10 flex justify-between items-center">
        <Logo size="lg" />
        <div className="hidden sm:block">
          <AuthButtons />
        </div>
        <Button variant="ghost" className="sm:hidden">
          Menu
        </Button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="container mx-auto px-6 pt-12 pb-24 flex flex-col lg:flex-row gap-12 lg:gap-6 items-center">
          <motion.div 
            className="flex-1 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-sidebar-primary/10 text-sidebar-primary mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-sidebar-primary mr-2"></span>
              Revolutionizing Podcast Creation
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="text-gradient">Create Amazing Podcasts </span> 
              <span className="text-gradient-purple">With&nbsp;AI</span>
            </motion.h1>
            
            <motion.p 
              className="mt-4 text-lg text-muted-foreground max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Generate engaging podcast scripts, eye-catching thumbnails, and 
              professional audio with our AI-powered platform. Share your voice with the world.
            </motion.p>
            
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link to="/home">
                <Button className="px-6 py-6 bg-sidebar-primary hover:bg-sidebar-primary/90 w-full sm:w-auto">
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" className="px-6 py-6 glass-card hover:bg-white/10 w-full sm:w-auto">
                  Explore Podcasts
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1 max-w-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <img 
              src="/assets/images/hero-image.svg" 
              alt="AI Podcast illustration" 
              className="w-full h-auto animate-float"
            />
          </motion.div>
        </div>
        
        <motion.div
          className="container mx-auto px-6 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">
              Powered by AI, created by you
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Our platform combines artificial intelligence with your creativity to produce
              professional-quality podcasts in minutes, not hours.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 rounded-lg hover-scale"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              >
                <div className="h-12 w-12 rounded-full glass-card flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      
      <motion.footer 
        className="py-8 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo size="sm" />
          <div className="text-sm text-muted-foreground">
            &copy; 2023 Podcraft. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
