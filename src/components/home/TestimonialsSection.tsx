
import { Star } from "lucide-react";

type TestimonialProps = {
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
};

const Testimonial = ({ name, role, content, rating, image }: TestimonialProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4 space-x-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
      <p className="text-gray-700 mb-4">{content}</p>
      <div className="flex items-center">
        {image ? (
          <img src={image} alt={name} className="w-10 h-10 rounded-full mr-3" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-sala7li-primary text-white flex items-center justify-center mr-3">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials: TestimonialProps[] = [
    {
      name: "Sarah Johnson",
      role: "Business Owner",
      content: "My laptop was fixed within 24 hours! The technicians at Sala7li are incredibly skilled and professional. Highly recommended!",
      rating: 5
    },
    {
      name: "Ahmed Hassan",
      role: "Student",
      content: "I was worried about losing my data when my phone stopped working, but the team at Sala7li not only fixed the problem but also recovered all my important files.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Software Developer",
      content: "As someone who works in tech, I appreciate the technical expertise and honesty from Sala7li. They didn't try to upsell me and fixed exactly what was needed.",
      rating: 4
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what customers have to say about our repair services.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
