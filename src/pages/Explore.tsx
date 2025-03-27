
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Headphones } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePodcasts, Podcast } from '@/hooks/use-podcast-api';
import PodcastCard from '@/components/ui/podcast-card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';

const categories = ['All', 'Business', 'Health', 'Education', 'Art', 'Science', 'Finance', 'Technology', 'Entertainment'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'duration', label: 'Duration' },
];

const Explore = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'popular' | 'duration'>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const podcastsPerPage = 9;

  // Apply filters for API request
  const filters = {
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    sort: selectedSort,
    search: debouncedSearch || undefined,
  };

  const { data: podcasts, isLoading, isError } = usePodcasts(filters);

  // Pagination logic
  const totalPages = podcasts ? Math.ceil(podcasts.length / podcastsPerPage) : 0;
  const paginatedPodcasts = podcasts?.slice(
    (currentPage - 1) * podcastsPerPage,
    currentPage * podcastsPerPage
  );

  // Handle podcast play
  const handlePlayPodcast = (podcast: Podcast) => {
    // In a real app, this would start playing the podcast
    toast({
      title: "Playing Podcast",
      description: `Now playing ${podcast.title}`,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
          <Headphones className="h-6 w-6 text-sidebar-primary" />
          <h1 className="text-3xl font-display font-bold tracking-tight">Explore Podcasts</h1>
        </div>
        <p className="text-muted-foreground">Discover and listen to podcasts from various categories</p>
      </motion.div>
      
      <div className="glass-card p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="text"
              placeholder="Search podcasts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              className="bg-background border border-input rounded-md px-2 py-1 text-sm"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as 'newest' | 'popular' | 'duration')}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <Button variant="outline" size="sm" className="flex gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap focus-ring ${
              category === selectedCategory 
                ? 'bg-sidebar-primary text-white' 
                : 'glass-card hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sidebar-primary"></div>
        </div>
      ) : isError ? (
        <div className="py-20 text-center">
          <p className="text-lg font-semibold text-red-500">Error loading podcasts</p>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedPodcasts?.map((podcast) => (
              <PodcastCard
                key={podcast.id}
                id={podcast.id}
                title={podcast.title}
                description={podcast.description}
                thumbnailUrl={podcast.imageUrl}
                creatorName={podcast.author}
                duration={podcast.duration}
                category={podcast.category}
                onClick={() => handlePlayPodcast(podcast)}
              />
            ))}
          </motion.div>
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;
