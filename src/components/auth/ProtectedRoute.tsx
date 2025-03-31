
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Please sign in to access this page");
    } else if (!loading && isAuthenticated && user && !allowedRoles.includes(user.role)) {
      toast.error("You don't have permission to access this page");
    }
  }, [isAuthenticated, loading, user, allowedRoles]);

  // Show nothing while checking authentication to prevent flicker
  if (loading) {
    return null;
  }

  // Redirect to sign in if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to={`/signin?referrer=${location.pathname}`} replace />;
  }

  // Check if user has the required role
  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard or homepage based on user role
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "fixer") {
      return <Navigate to="/fixer" replace />;
    } else if (user.role === "operator") {
      return <Navigate to="/operator" replace />;
    } else if (user.role === "collector") {
      return <Navigate to="/collector" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has the required role
  return <>{children}</>;
};

export default ProtectedRoute;
