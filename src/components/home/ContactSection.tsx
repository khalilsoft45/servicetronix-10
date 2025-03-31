
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our services? Get in touch with us and we'll be happy to help.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-sala7li-primary/5 p-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+1 234 567 8901"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="How can we help you?"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Get In Touch</h3>
              <p className="text-gray-600 mb-6">
                We're here to help with all your device repair needs. Contact us through any 
                of the channels below and our team will respond promptly.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-sala7li-primary/10 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-sala7li-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Visit Us</h4>
                    <p className="text-gray-600">123 Repair Street, Fix City, FC 12345</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-sala7li-primary/10 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-sala7li-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email Us</h4>
                    <a href="mailto:info@sala7li.com" className="text-sala7li-primary hover:underline">
                      info@sala7li.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-sala7li-primary/10 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-sala7li-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Call Us</h4>
                    <a href="tel:+12345678901" className="text-sala7li-primary hover:underline">
                      +1 234 567 8901
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-sala7li-dark text-white p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-4">Business Hours</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
