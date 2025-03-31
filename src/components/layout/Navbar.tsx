
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRepairRequest = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signin?referrer=/dashboard');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-sala7li-primary">Sala7li</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/#services" className="text-sala7li-dark hover:text-sala7li-primary font-medium">
            Services
          </Link>
          <Link to="/#about" className="text-sala7li-dark hover:text-sala7li-primary font-medium">
            About Us
          </Link>
          <Link to="/#contact" className="text-sala7li-dark hover:text-sala7li-primary font-medium">
            Contact
          </Link>
          
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              <Button onClick={handleRepairRequest}>
                Request Repair
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-sala7li-primary text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    switch(user.role) {
                      case 'admin':
                        navigate('/admin');
                        break;
                      case 'fixer':
                        navigate('/fixer');
                        break;
                      case 'operator':
                        navigate('/operator');
                        break;
                      case 'collector':
                        navigate('/collector');
                        break;
                      default:
                        navigate('/dashboard');
                    }
                  }}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button asChild variant="outline">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-sala7li-dark" />
            ) : (
              <Menu className="h-6 w-6 text-sala7li-dark" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 animate-fade-in">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link
              to="/#services"
              className="text-sala7li-dark hover:text-sala7li-primary font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/#about"
              className="text-sala7li-dark hover:text-sala7li-primary font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/#contact"
              className="text-sala7li-dark hover:text-sala7li-primary font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            
            {isAuthenticated && user ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 py-2">
                  <Avatar className="h-8 w-8">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-sala7li-primary text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setIsOpen(false);
                    handleRepairRequest();
                  }}
                >
                  Request Repair
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    switch(user.role) {
                      case 'admin':
                        navigate('/admin');
                        break;
                      case 'fixer':
                        navigate('/fixer');
                        break;
                      case 'operator':
                        navigate('/operator');
                        break;
                      case 'collector':
                        navigate('/collector');
                        break;
                      default:
                        navigate('/dashboard');
                    }
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
