
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={["user"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fixer" 
                  element={
                    <ProtectedRoute allowedRoles={["fixer"]}>
                      <FixerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/operator" 
                  element={
                    <ProtectedRoute allowedRoles={["operator"]}>
                      <OperatorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/collector" 
                  element={
                    <ProtectedRoute allowedRoles={["collector"]}>
                      <CollectorDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
