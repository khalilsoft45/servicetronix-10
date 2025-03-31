
import { Laptop, Smartphone, Tablet, Monitor, Clock, Check, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Laptop,
    title: "Laptop Repair",
    description: "Professional repair services for all laptop brands including screen replacement, keyboard repair, and hardware upgrades."
  },
  {
    icon: Smartphone,
    title: "Phone Repair",
    description: "Expert phone repair for cracked screens, battery replacement, charging port repair, and water damage recovery."
  },
  {
    icon: Tablet,
    title: "Tablet Repair",
    description: "Comprehensive tablet repair services including screen replacement, battery issues, and software troubleshooting."
  },
  {
    icon: Monitor,
    title: "Desktop Repair",
    description: "Complete desktop computer repair services including hardware upgrades, virus removal, and system optimization."
  }
];

const features = [
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Most repairs are completed within 24-48 hours to minimize your downtime."
  },
  {
    icon: Check,
    title: "Quality Parts",
    description: "We use only high-quality, authentic parts for all our repair services."
  },
  {
    icon: Shield,
    title: "Service Warranty",
    description: "All our repairs come with a 90-day warranty for your peace of mind."
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Repair Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer comprehensive repair services for all your devices with expert technicians and quality parts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="card-hover">
              <CardHeader className="pb-2">
                <div className="mb-4 bg-sala7li-primary/10 p-3 rounded-full w-fit">
                  <service.icon className="h-6 w-6 text-sala7li-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Us</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best repair experience with quick service and quality results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-sala7li-primary/10 p-3 rounded-full mr-4">
                    <feature.icon className="h-6 w-6 text-sala7li-primary" />
                  </div>
                  <h4 className="text-xl font-semibold">{feature.title}</h4>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
