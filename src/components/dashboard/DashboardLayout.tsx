import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  ClipboardList,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  role?: "user" | "admin" | "fixer" | "operator" | "collector";
}

const DashboardLayout = ({ children, title, role = "user" }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  // Get user's initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Role-specific navigation items
  const getNavItems = () => {
    switch (role) {
      case "admin":
        return [
          { icon: Home, text: "Dashboard", link: "/admin" },
          { icon: ClipboardList, text: "Repairs", link: "/admin/repairs" },
          { icon: User, text: "Users", link: "/admin/users" },
          { icon: Settings, text: "Account", link: "/admin/account" },
        ];
      case "fixer":
        return [
          { icon: Home, text: "Dashboard", link: "/fixer" },
          { icon: ClipboardList, text: "Assigned Repairs", link: "/fixer/repairs" },
          { icon: Settings, text: "Account", link: "/fixer/account" },
        ];
      case "operator":
        return [
          { icon: Home, text: "Dashboard", link: "/operator" },
          { icon: ClipboardList, text: "Service Requests", link: "/operator/requests" },
          { icon: Settings, text: "Account", link: "/operator/account" },
        ];
      case "collector":
        return [
          { icon: Home, text: "Dashboard", link: "/collector" },
          { icon: ClipboardList, text: "Pickup Requests", link: "/collector/pickups" },
          { icon: Settings, text: "Account", link: "/collector/account" },
        ];
      default: // user
        return [
          { icon: Home, text: "Dashboard", link: "/dashboard" },
          { icon: ClipboardList, text: "My Repairs", link: "/dashboard/repairs" },
          { icon: User, text: "Profile", link: "/dashboard/profile" },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 focus:outline-none focus:text-sala7li-primary lg:hidden"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="ml-4 lg:ml-0">
              <Link to="/" className="text-xl font-bold text-sala7li-primary">
                Sala7li
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-sala7li-primary relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-sala7li-accent"></span>
            </button>
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-sm">
                <p className="font-medium text-gray-700">{user?.name || "User"}</p>
                <p className="text-gray-500">{role}</p>
              </div>
              <Link to={`/${role}/account`}>
                <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-sala7li-primary transition-all">
                  {user?.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-sala7li-primary text-white">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-gray-200 w-64 fixed inset-y-0 mt-16 pt-5 pb-4 lg:static lg:block transition-all duration-300 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } z-20`}
        >
          <nav className="mt-5 px-2 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-sala7li-primary/10 hover:text-sala7li-primary"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.text}
              </Link>
            ))}
          </nav>
          <div className="mt-auto px-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
