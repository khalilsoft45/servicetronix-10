
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import FixerDashboard from "./pages/FixerDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import CollectorDashboard from "./pages/CollectorDashboard";
import NotFound from "./pages/NotFound";
import RepairsList from "./pages/dashboard/RepairsList";
import CreateRepair from "./pages/dashboard/CreateRepair";

// Initialize the query client with default options that ensure users see feedback
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LanguageProvider defaultLanguage="fr">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/repairs" element={<RepairsList />} />
              <Route path="/dashboard/create-repair" element={<CreateRepair />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/fixer" element={<FixerDashboard />} />
              <Route path="/operator" element={<OperatorDashboard />} />
              <Route path="/collector" element={<CollectorDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
