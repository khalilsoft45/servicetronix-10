
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FaqItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
};

const FaqItem = ({ question, answer, isOpen, toggleOpen }: FaqItemProps) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium"
        onClick={toggleOpen}
      >
        <span className="text-lg">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-sala7li-primary" />
        ) : (
          <ChevronDown className="h-5 w-5 text-sala7li-primary" />
        )}
      </button>
      <div
        className={`mt-2 text-gray-600 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <p className="py-2">{answer}</p>
      </div>
    </div>
  );
};

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How long does a typical repair take?",
      answer: "Most repairs are completed within 24-48 hours. Complex issues might take longer, but we'll always keep you updated on the progress."
    },
    {
      question: "Do you offer pickup and delivery services?",
      answer: "Yes, we offer convenient pickup and delivery services for all repair requests. Our collectors will come to your location at a time that suits you."
    },
    {
      question: "What types of devices do you repair?",
      answer: "We repair a wide range of devices including smartphones, laptops, tablets, desktop computers, and more. If you're unsure, please contact us and we'll let you know if we can help."
    },
    {
      question: "Are my data and files safe during repair?",
      answer: "Absolutely. Data protection is our priority. We take all necessary precautions to safeguard your data during repairs. We also recommend backing up your data before bringing in your device when possible."
    },
    {
      question: "Do you provide a warranty for your repairs?",
      answer: "Yes, all our repairs come with a 90-day warranty. If the same issue occurs within this period, we'll fix it free of charge."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our repair services.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              toggleOpen={() => toggleFaq(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
