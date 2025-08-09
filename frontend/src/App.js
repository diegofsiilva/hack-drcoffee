
// frontend/src/App.tsx - MODIFICADO PARA INTEGRAR COM ESTRUTURA EXISTENTE
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CameraScreen from './screens/CameraScreen';
import DiagnosisScreen from './screens/DiagnosisScreen';
import CommunityScreen from './screens/CommunityScreen';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const queryClient = new QueryClient();

// Firebase config
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "agrosos-app.firebaseapp.com",
  projectId: "agrosos-app",
  storageBucket: "agrosos-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "sua-app-id"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);

const App = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Registrar Service Worker para PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    // Obter localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/camera" element={<CameraScreen />} />
            <Route path="/diagnosis/:id" element={<DiagnosisScreen />} />
            <Route path="/community" element={<CommunityScreen location={location} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;