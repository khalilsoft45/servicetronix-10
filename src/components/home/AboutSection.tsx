
import { CheckCircle } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Technician working on computer repair" 
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Sala7li</h2>
            <p className="text-lg text-gray-600 mb-6">
              Sala7li is a premium device repair service provider committed to delivering 
              high-quality, fast, and reliable repair solutions for all your electronic devices.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Our team of certified technicians has years of experience in repairing various 
              devices, ensuring that your valuable electronics are in safe hands.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="min-w-6 h-6 text-sala7li-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Expert Technicians</h4>
                  <p className="text-gray-600">Certified and experienced repair specialists</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="min-w-6 h-6 text-sala7li-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Transparent Pricing</h4>
                  <p className="text-gray-600">Clear and honest pricing with no hidden fees</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="min-w-6 h-6 text-sala7li-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Convenient Service</h4>
                  <p className="text-gray-600">We collect your device and deliver it back to you after repair</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
