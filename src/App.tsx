
import React, { useEffect } from 'react';
import { MetaTags } from './seo/MetaTags';
import { SchemaScript } from './seo/SchemaScript';
import './App.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSecurityHeaders } from "@/hooks/useSecurityHeaders";
import Index from "./pages/Index";
import Success from "./pages/Success";
import Analytics from "./pages/Analytics";
import AdminAuth from "./pages/AdminAuth";
import AdminSetup from "./pages/AdminSetup";
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

// 404 Component for non-existent calculator paths
const NotFound = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Don't handle static files - let them be served by the server
    if (location.pathname === '/sitemap.xml' || 
        location.pathname === '/robots.txt' || 
        location.pathname.startsWith('/sitemap.xml') || 
        location.pathname.startsWith('/robots.txt')) {
      // Force a hard refresh to let the server handle these static files
      window.location.href = location.pathname;
      return;
    }
    
    // Redirect calculator/* paths to the main calculator
    if (location.pathname.startsWith('/calculator/')) {
      window.location.replace('/');
    }
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <a 
          href="/" 
          className="bg-[#1A3174] text-white px-6 py-3 rounded-lg hover:bg-[#1A3174]/90 transition-colors"
        >
          Go to Calculator
        </a>
      </div>
    </div>
  );
};

function App() {
  useSecurityHeaders();
  
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
              <Route path="/admin" element={<AdminAuth />} />
              <Route path="/admin/setup" element={<AdminSetup />} />
              <Route path="/analytics" element={<Analytics />} />
              {/* Redirect any calculator/* paths to home */}
              <Route path="/calculator/*" element={<Navigate to="/" replace />} />
              {/* Catch all other routes */}
              <Route path="*" element={<NotFound />} />
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
