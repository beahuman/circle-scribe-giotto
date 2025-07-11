import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import TonePackUnlockBanner from "@/components/TonePackUnlockBanner";
import ToneVariantUnlockModal from "@/components/modal/ToneVariantUnlockModal";
import { useToneMastery } from "@/hooks/useToneMastery";
import Launch from "./pages/Launch";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import History from "./pages/History";
import Progress from "./pages/Progress";
import About from "./pages/About";
import Account from "./pages/Account";
import EditAccount from "./pages/EditAccount";
import Auth from "./pages/Auth";
import Tutorial from "./pages/Tutorial";
import Store from "./pages/Store";
import Achievements from "./pages/Achievements";
import Subscription from "./pages/Subscription";
import BottomNav from "@/components/BottomNav";

// Create the client outside of the component
const queryClient = new QueryClient();
const App = () => {
  const toneMastery = useToneMastery();
  
  return <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <TonePackUnlockBanner />
            {toneMastery.pendingVariantUnlock && (
              <ToneVariantUnlockModal
                baseTone={toneMastery.pendingVariantUnlock.baseTone}
                variant={toneMastery.pendingVariantUnlock.variant}
                isOpen={true}
                onClose={toneMastery.clearPendingVariantUnlock}
              />
            )}
            <div className="min-h-screen overflow-y-auto pb-16 bg-background">
              <Routes>
                <Route path="/launch" element={<Launch />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/signin" element={<Navigate to="/auth" replace />} />
                <Route path="/signup" element={<Navigate to="/auth" replace />} />
                <Route path="/" element={<Index />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/history" element={<History />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/about" element={<About />} />
                <Route path="/tutorial" element={<Tutorial />} />
                <Route path="/store" element={<Store />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/account" element={<Account />} />
                <Route path="/account/edit" element={<EditAccount />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* Enhanced Bottom Navigation */}
              <BottomNav 
                hideOnPaths={['/launch', '/auth', '/signin', '/signup']}
              />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>;
};
export default App;