
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Index from "./pages/Index";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/Layout/MainLayout";

// Install framer-motion package for animations
<lov-add-dependency>framer-motion@10.15.0</lov-add-dependency>

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Routes with sidebar layout */}
            <Route element={<MainLayout />}>
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
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
