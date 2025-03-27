
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
                {/* Additional routes will be added as we develop them */}
                <Route path="/explore" element={<Home />} /> {/* Placeholder */}
                <Route path="/create" element={<Home />} /> {/* Placeholder */}
                <Route path="/profile" element={<Home />} /> {/* Placeholder */}
                <Route path="/analytics" element={<Home />} /> {/* Placeholder */}
                <Route path="/settings" element={<Home />} /> {/* Placeholder */}
                <Route path="/help" element={<Home />} /> {/* Placeholder */}
              </Route>
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ClerkLoaded>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
