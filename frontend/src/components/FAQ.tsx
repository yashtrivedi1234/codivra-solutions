import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection } from "./AnimatedSection";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What services does Codivra Solution offer?",
    answer: "We offer comprehensive IT services including Web Development, Custom Software Development, Graphic Design, SEO Optimization, and Digital Marketing. Each service is tailored to meet your specific business needs and goals.",
  },
  {
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on complexity and scope. A standard website typically takes 4-6 weeks, while custom software projects can range from 2-6 months. During our initial consultation, we'll provide a detailed timeline specific to your project.",
  },
  {
    question: "What is your pricing structure?",
    answer: "We offer flexible pricing with three main tiers: Starter ($99), Professional ($499), and Enterprise (custom quote). Each tier includes different features and support levels. We also offer custom quotes for projects that don't fit standard packages.",
  },
  {
    question: "Do you offer ongoing support and maintenance?",
    answer: "Yes! All our packages include post-launch support (30-90 days depending on the tier). We also offer ongoing maintenance contracts for continuous updates, security patches, and technical support.",
  },
  {
    question: "Can you work with existing websites or systems?",
    answer: "Absolutely. We specialize in both building new solutions and improving existing ones. Whether you need a website redesign, system integration, or performance optimization, we can help.",
  },
  {
    question: "What technologies do you use?",
    answer: "We use modern, industry-standard technologies including React, Next.js, Node.js, Python, and various cloud platforms (AWS, Google Cloud). We select the best tech stack based on your project requirements.",
  },
  {
    question: "How do you handle project communication?",
    answer: "We believe in transparent communication. You'll have a dedicated project manager, access to our project management tools, and regular updates via your preferred channel (email, Slack, or video calls).",
  },
  {
    question: "What if I'm not satisfied with the results?",
    answer: "Your satisfaction is our priority. We include revision rounds in all packages and work closely with you throughout the project. If issues arise, we'll address them promptly to ensure the final deliverable meets your expectations.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="relative py-32 bg-gradient-to-b from-[#0A0F1C] to-[#070B14] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#0066FF]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="inline-flex items-center gap-2 text-[#00D9FF] font-bold text-sm tracking-[0.2em] uppercase">
              <span className="w-8 h-[2px] bg-gradient-to-r from-transparent to-[#00D9FF]" />
              FAQ
              <span className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#00D9FF]" />
            </span>
          </motion.div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Frequently Asked <span className="text-[#00D9FF]">Questions</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Got questions? We've got answers. Find everything you need to know about working with us.
          </p>
        </AnimatedSection>

        {/* Accordion */}
        <AnimatedSection delay={0.1} className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="relative group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 data-[state=open]:bg-white/10 data-[state=open]:border-[#00D9FF]"
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/5 to-[#0066FF]/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity duration-500" />
                  
                  <AccordionTrigger className="relative text-left text-white font-bold hover:text-[#00D9FF] hover:no-underline py-6 text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="relative text-white/70 pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </AnimatedSection>

        {/* Bottom CTA */}
        <AnimatedSection delay={0.2} className="text-center mt-16">
          <p className="text-white/60 text-lg">
            Still have questions?{" "}
            <a href="#contact" className="text-[#00D9FF] font-bold hover:underline">
              Contact us
            </a>{" "}
            and we'll be happy to help.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};