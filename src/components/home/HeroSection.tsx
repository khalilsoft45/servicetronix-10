
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleRepairRequest = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signin?referrer=/dashboard');
    }
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-40 md:pb-28 bg-gradient-to-r from-sky-50 to-blue-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Fast & Reliable <span className="text-sala7li-primary">Device Repair</span> Services
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              We offer professional repair services for laptops, phones, tablets, and desktops. 
              Our expert technicians provide fast and reliable solutions.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="text-lg py-6 px-8" onClick={handleRepairRequest}>
                Request a Repair <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg py-6 px-8">
                <Link to="/#services">Our Services</Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:block animate-fade-in">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Technician repairing a laptop" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default HeroSection;
