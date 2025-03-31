
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
          <div className="flex space-x-2">
            <Button asChild variant="outline">
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
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
            <div className="flex flex-col space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
