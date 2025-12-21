import { Star, Quote } from "lucide-react";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "./AnimatedSection";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
    content: "Codivra delivered beyond expectations. Our new website has significantly increased our conversion rates and the team was incredibly professional throughout.",
    rating: 5,
    image: "SJ"
  },
  {
    name: "Michael Chen",
    role: "Founder, GrowthLabs",
    content: "The custom software they built has streamlined our operations completely. Their attention to detail and commitment to quality is unmatched.",
    rating: 5,
    image: "MC"
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director, ScaleUp",
    content: "Our SEO rankings improved dramatically within months. The Codivra team truly understands digital marketing and delivers results.",
    rating: 5,
    image: "ER"
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="relative py-32 bg-[#0A0F1C] overflow-hidden">
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
              Testimonials
              <span className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#00D9FF]" />
            </span>
          </motion.div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            What Our <span className="text-[#00D9FF]">Clients Say</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Don't just take our word for it—hear from businesses we've helped succeed.
          </p>
        </AnimatedSection>

        {/* Testimonials Grid */}
        <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <AnimatedItem key={testimonial.name}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="group relative h-full"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/10 to-[#0066FF]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card */}
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                  {/* Quote Icon */}
                  <div className="absolute -top-4 left-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] to-[#0066FF] rounded-lg blur-lg opacity-70" />
                      <div className="relative w-12 h-12 bg-gradient-to-br from-[#00D9FF] to-[#0066FF] rounded-lg flex items-center justify-center">
                        <Quote className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6 mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#00D9FF] text-[#00D9FF]" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-white/70 leading-relaxed mb-8 text-lg">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] to-[#0066FF] rounded-full blur-md opacity-50" />
                      <div className="relative w-14 h-14 bg-gradient-to-br from-[#00D9FF] to-[#0066FF] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {testimonial.image}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{testimonial.name}</div>
                      <div className="text-sm text-white/50">{testimonial.role}</div>
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-4 right-4 w-12 h-[2px] bg-gradient-to-r from-[#00D9FF] to-transparent" />
                    <div className="absolute bottom-4 right-4 w-[2px] h-12 bg-gradient-to-t from-[#00D9FF] to-transparent" />
                  </div>
                </div>
              </motion.div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-white/60 mb-6">Join our growing list of satisfied clients</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border-2 border-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 hover:border-[#00D9FF] transition-all duration-300"
          >
            Start Your Project
          </a>
        </motion.div>
      </div>
    </section>
  );
};