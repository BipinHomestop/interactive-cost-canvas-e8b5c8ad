
import React, { useEffect } from 'react';
import { MetaTags } from './seo/MetaTags';
import { SchemaScript } from './seo/SchemaScript';
import './App.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Success from "./pages/Success";
import Analytics from "./pages/Analytics";
import { useUserLocation } from "./hooks/analytics/use-user-location";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
    },
  },
});

// Analytics tracker component
const AnalyticsTracker = () => {
  const location = useLocation();
  const { trackPageView } = useUserLocation();

  useEffect(() => {
    // Track page view on route change using our custom hook
    trackPageView(location.pathname);
    
    // Also track in Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
        send_to: 'G-773SG7LPWC'
      });
      console.log('Page view tracked:', location.pathname);
    }
  }, [location, trackPageView]);

  return null;
};

function App() {
  return (
    <>
      <SchemaScript />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/">
          <TooltipProvider>
            <AnalyticsTracker />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/step/:stepNumber" element={<Index />} />
              <Route path="/success" element={<Success />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
