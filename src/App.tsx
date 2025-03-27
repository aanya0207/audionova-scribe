
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from "@clerk/clerk-react";

import Index from "./pages/Index";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/Layout/MainLayout";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Explore from "./pages/Explore";
import CreatePodcast from "./pages/CreatePodcast";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";
import AudioPlayer from "./components/ui/audio-player";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AudioPlayerProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <ClerkLoading>
              <div className="h-screen w-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sidebar-primary"></div>
              </div>
            </ClerkLoading>
            <ClerkLoaded>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sign-in/*" element={<SignIn />} />
                <Route path="/sign-up/*" element={<SignUp />} />
                
                {/* Routes with sidebar layout - protected with SignedIn */}
                <Route 
                  element={
                    <>
                      <SignedIn>
                        <MainLayout />
                      </SignedIn>
                      <SignedOut>
                        <div className="h-screen flex items-center justify-center">
                          <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                            <p className="mb-4">You need to sign in to access this page</p>
                          </div>
                        </div>
                      </SignedOut>
                    </>
                  }
                >
                  <Route path="/home" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/create" element={<CreatePodcast />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/help" element={<Help />} />
                </Route>
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <AudioPlayer />
            </ClerkLoaded>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </AudioPlayerProvider>
  </QueryClientProvider>
);

export default App;
