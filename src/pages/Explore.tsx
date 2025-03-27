
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Headphones } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePodcasts, Podcast } from '@/hooks/use-podcast-api';
import PodcastCard from '@/components/ui/podcast-card';
import PodcastCardSkeleton from '@/components/ui/podcast-card-skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const categories = ['All', 'Business', 'Health', 'Education', 'Art', 'Science', 'Finance', 'Technology', 'Entertainment'];

const Explore = () => {
  const { toast } = useToast();
  const { playPodcast } = useAudioPlayer();
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

  // Get user created podcasts from localStorage
  const userPodcasts = JSON.parse(localStorage.getItem('userPodcasts') || '[]');
  
  // Combine API podcasts with user created podcasts
  const allPodcasts = React.useMemo(() => {
    if (!podcasts) return [];
    
    // Filter user podcasts by selected category if needed
    const filteredUserPodcasts = userPodcasts.filter((podcast: any) => 
      selectedCategory === 'All' || podcast.category === selectedCategory
    );
    
    // Sort all podcasts based on selected sort option
    const combined = [...podcasts, ...filteredUserPodcasts];
    
    if (selectedSort === 'newest') {
      return combined.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    } else if (selectedSort === 'popular') {
      // For demo, we'll use the podcast ID as a proxy for popularity
      return combined.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    } else if (selectedSort === 'duration') {
      // Sort by duration - convert "X min" to number
      return combined.sort((a, b) => {
        const durationA = parseInt(a.duration?.replace(' min', '') || '0');
        const durationB = parseInt(b.duration?.replace(' min', '') || '0');
        return durationB - durationA;
      });
    }
    
    return combined;
  }, [podcasts, userPodcasts, selectedCategory, selectedSort]);

  // Pagination logic
  const totalPages = allPodcasts ? Math.ceil(allPodcasts.length / podcastsPerPage) : 0;
  const paginatedPodcasts = allPodcasts?.slice(
    (currentPage - 1) * podcastsPerPage,
    currentPage * podcastsPerPage
  );

  // Handle podcast play
  const handlePlayPodcast = (podcast: Podcast) => {
    playPodcast({
      id: podcast.id,
      title: podcast.title,
      description: podcast.description,
      thumbnailUrl: podcast.imageUrl || podcast.thumbnailUrl,
      creatorName: podcast.author || podcast.creatorName,
      duration: podcast.duration,
      category: podcast.category,
      audioUrl: podcast.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-' + (parseInt(podcast.id) % 16 + 1) + '.mp3'
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

  // Generate skeleton array when loading
  const skeletons = Array.from({ length: 6 }, (_, i) => <PodcastCardSkeleton key={i} />);

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-popover">
                <DropdownMenuLabel>Sort & Filter</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Sort by</DropdownMenuLabel>
                  <DropdownMenuItem 
                    className={selectedSort === 'newest' ? 'bg-accent' : ''}
                    onClick={() => setSelectedSort('newest')}
                  >
                    Newest
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={selectedSort === 'popular' ? 'bg-accent' : ''}
                    onClick={() => setSelectedSort('popular')}
                  >
                    Popular
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={selectedSort === 'duration' ? 'bg-accent' : ''}
                    onClick={() => setSelectedSort('duration')}
                  >
                    Duration
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skeletons}
        </motion.div>
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
                thumbnailUrl={podcast.imageUrl || podcast.thumbnailUrl}
                creatorName={podcast.author || podcast.creatorName}
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
