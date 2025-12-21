import { motion } from "framer-motion";
import { Shield, Clock, Headphones, Award, Zap, Heart } from "lucide-react";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "./AnimatedSection";
import { useTeamCount } from "@/hooks/use-team-count";

const reasons = [
  {
    icon: Heart,
    title: "Founder-Led Team",
    description: "Work directly with the founders and core team members who are personally involved in every project."
  },
  {
    icon: Zap,
    title: "Agile & Flexible",
    description: "As a young startup, we adapt quickly to your requirements and iterate fast without rigid processes."
  },
  {
    icon: Shield,
    title: "Honest Commitment",
    description: "We commit only to what we can deliver and focus on building long-term trust with our clients."
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "Clear timelines, regular updates, and disciplined execution to ensure timely delivery."
  },
  {
    icon: Headphones,
    title: "Direct Communication",
    description: "No middle layers — you communicate directly with developers and decision-makers."
  },
  {
    icon: Award,
    title: "Quality-Focused Start",
    description: "We may be new, but we follow best practices to deliver clean, scalable, and maintainable solutions."
  },
];

const staticStats = [
  { value: "Dec 2025", label: "Founded" },
  { value: "10+", label: "Projects Delivered" },
  { value: "100%", label: "Client Commitment" },
];

const services = [
  {
    title: "Website Development",
    description: "Modern, responsive websites tailored to your business needs.",
  },
  {
    title: "Web & App Development",
    description: "Custom web apps and dashboards built for performance and scale.",
  },
  {
    title: "UI/UX & Design",
    description: "Clean, user-friendly designs focused on usability and branding.",
  },
];

export const WhyChooseUs = () => {
  const { count, isLoading } = useTeamCount();
  const stats = [
    { value: "Dec 2025", label: "Founded" },
    { value: isLoading ? "..." : `${count}`, label: "Core Team Members" },
    ...staticStats,
  ].slice(0, 4);

  return (
    <section id="why-us" className="relative py-32 bg-gradient-to-b from-[#0A0F1C] to-[#070B14] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0066FF]/5 rounded-full blur-[120px]" />
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
              Why Choose Us
              <span className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#00D9FF]" />
            </span>
          </motion.div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Why Clients Choose <span className="text-[#00D9FF]">Our Startup</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            A small, dedicated service-based startup focused on quality, transparency, and long-term partnerships.
          </p>
        </AnimatedSection>

        {/* Stats Bar */}
        <AnimatedSection className="mb-20">
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/10 to-[#0066FF]/10 rounded-3xl blur-2xl" />
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label + '-' + index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl md:text-5xl font-black text-[#00D9FF] mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/60 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Services Cards */}
        <AnimatedStagger className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {services.map((service) => (
            <AnimatedItem key={service.title}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group relative h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/10 to-[#0066FF]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00D9FF] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>

        {/* Reasons Grid */}
        <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {reasons.map((reason) => (
            <AnimatedItem key={reason.title}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group relative h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/5 to-[#0066FF]/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex gap-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] to-[#0066FF] rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative w-14 h-14 bg-gradient-to-br from-[#00D9FF] to-[#0066FF] rounded-xl flex items-center justify-center">
                      <reason.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">{reason.title}</h3>
                    <p className="text-white/60 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatedItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
};