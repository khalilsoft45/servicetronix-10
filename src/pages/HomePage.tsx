
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.role === 'fixer') {
        navigate('/fixer');
      } else if (user?.role === 'operator') {
        navigate('/operator');
      } else if (user?.role === 'collector') {
        navigate('/collector');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <div className="bg-sala7li-primary/10 py-12">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Our platform is now connected to a secure database. Your repairs and data are safely stored and managed.
            </p>
            <Button 
              size="lg" 
              className="bg-sala7li-primary hover:bg-sala7li-primary/90"
              onClick={handleGetStarted}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Sign In / Register'}
            </Button>
          </div>
        </div>
        <ServicesSection />
        <AboutSection />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
