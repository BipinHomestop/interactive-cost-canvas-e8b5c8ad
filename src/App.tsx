
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Success from "./pages/Success";
import LocationPage from "./pages/calculator/LocationPage";
import ContactPage from "./pages/calculator/ContactPage";
import GarageCapacityPage from "./pages/calculator/GarageCapacityPage";
import GarageFinishPage from "./pages/calculator/GarageFinishPage";
import StemWallsPage from "./pages/calculator/StemWallsPage";
import HouseStepsPage from "./pages/calculator/HouseStepsPage";
import AdditionalFootagePage from "./pages/calculator/AdditionalFootagePage";
import CurrentConditionPage from "./pages/calculator/CurrentConditionPage";
import PaymentPage from "./pages/calculator/PaymentPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/">
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/calculator/location" element={<LocationPage />} />
              <Route path="/calculator/contact" element={<ContactPage />} />
              <Route path="/calculator/garage-capacity" element={<GarageCapacityPage />} />
              <Route path="/calculator/garage-finish" element={<GarageFinishPage />} />
              <Route path="/calculator/stem-walls" element={<StemWallsPage />} />
              <Route path="/calculator/house-steps" element={<HouseStepsPage />} />
              <Route path="/calculator/additional-footage" element={<AdditionalFootagePage />} />
              <Route path="/calculator/current-condition" element={<CurrentConditionPage />} />
              <Route path="/calculator/payment" element={<PaymentPage />} />
              <Route path="/success" element={<Success />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
