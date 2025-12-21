import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "./AnimatedSection";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small businesses getting started",
    price: "99",
    period: "project",
    features: [
      "5-page responsive website",
      "Basic SEO setup",
      "Mobile optimization",
      "Contact form integration",
      "2 rounds of revisions",
      "30-day support",
    ],
    highlighted: false,
    cta: "Get Started",
  },
  {
    name: "Professional",
    description: "Ideal for growing businesses",
    price: "499",
    period: "project",
    features: [
      "10-page custom website",
      "Advanced SEO optimization",
      "Custom UI/UX design",
      "CMS integration",
      "E-commerce ready",
      "Unlimited revisions",
      "90-day priority support",
      "Analytics dashboard",
    ],
    highlighted: true,
    cta: "Most Popular",
  },
  {
    name: "Enterprise",
    description: "Full-scale digital solutions",
    price: "Custom",
    period: "quote",
    features: [
      "Unlimited pages",
      "Custom software development",
      "Full-stack solutions",
      "API integrations",
      "Dedicated project manager",
      "24/7 premium support",
      "Performance optimization",
      "Security audits",
      "Ongoing maintenance",
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="relative py-32 bg-gradient-to-b from-[#070B14] to-[#0A0F1C] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#0066FF]/5 rounded-full blur-[120px]" />
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
              Our Services
              <span className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#00D9FF]" />
            </span>
          </motion.div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Simple & <span className="text-[#00D9FF]">Honest Pricing</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            We are a service-based startup helping businesses build websites, apps, and digital solutions.
          </p>
        </AnimatedSection>

        {/* Pricing Cards */}
        <AnimatedStagger className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <AnimatedItem key={plan.name}>
              <motion.div
                whileHover={{ y: plan.highlighted ? 0 : -8 }}
                transition={{ duration: 0.3 }}
                className={`group relative h-full ${plan.highlighted ? 'md:scale-105' : ''}`}
              >
                {/* Popular Badge */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF] to-[#0066FF] rounded-full blur-lg opacity-75" />
                      <div className="relative flex items-center gap-2 bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white px-5 py-2 rounded-full text-sm font-bold">
                        <Star className="w-4 h-4 fill-white" />
                        Most Popular
                      </div>
                    </div>
                  </div>
                )}

                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl blur-2xl transition-opacity duration-500 ${
                  plan.highlighted 
                    ? 'bg-gradient-to-br from-[#00D9FF]/20 to-[#0066FF]/20 opacity-100' 
                    : 'bg-gradient-to-br from-[#00D9FF]/10 to-[#0066FF]/10 opacity-0 group-hover:opacity-100'
                }`} />

                {/* Card */}
                <div className={`relative rounded-3xl p-10 h-full transition-all duration-500 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-[#00D9FF]/10 to-[#0066FF]/10 backdrop-blur-sm border-2 border-[#00D9FF]"
                    : "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}>
                  {/* Plan Header */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {plan.name}
                    </h3>
                    <p className="text-white/60">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8 pb-8 border-b border-white/10">
                    <div className="flex items-baseline gap-2">
                      {plan.price !== "Custom" && (
                        <span className="text-2xl text-white/60">$</span>
                      )}
                      <span className="text-5xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {plan.price}
                      </span>
                    </div>
                    <span className="text-sm text-white/50 font-medium">
                      {plan.period === "project" ? "per project" : "Get a custom quote"}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="relative mt-0.5">
                          <div className="absolute inset-0 bg-[#00D9FF] rounded-full blur-sm opacity-50" />
                          <div className="relative w-5 h-5 bg-[#00D9FF]/20 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-[#00D9FF]" />
                          </div>
                        </div>
                        <span className="text-white/70 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    className={`w-full font-bold py-6 text-base rounded-xl transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white hover:shadow-[0_0_40px_rgba(0,217,255,0.6)]"
                        : "bg-white/5 border-2 border-white/10 text-white hover:bg-white/10 hover:border-[#00D9FF]"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </motion.div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>

        {/* Bottom Note */}
        <AnimatedSection delay={0.3} className="text-center text-white/50 max-w-2xl mx-auto">
          <p className="leading-relaxed">
            We work as a service partner, not a large agency. 
            Pricing depends on scope, timelines, and requirements.
            <a href="#contact" className="text-[#00D9FF] hover:underline ml-1 font-semibold">
              Talk to us
            </a> to get the right solution for your business.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};