import { Globe, Code, Palette, Search, Megaphone, ArrowUpRight, Loader2 } from "lucide-react";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "./AnimatedSection";
import { useGetServicesQuery } from "@/lib/api";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ComponentType<any>> = {
  Globe,
  Code,
  Palette,
  Search,
  Megaphone,
};

export const Services = () => {
  const { data, isLoading } = useGetServicesQuery();

  return (
    <section id="services" className="relative py-32 bg-[#0A0F1C] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#0066FF]/10 rounded-full blur-[120px]" />
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
              What We Do
              <span className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#00D9FF]" />
            </span>
          </motion.div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Comprehensive <span className="text-[#00D9FF]">IT Solutions</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            From concept to launch, we deliver end-to-end digital services that transform your business vision into reality.
          </p>
        </AnimatedSection>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#00D9FF]" />
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && data?.items && (
          <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {data.items.map((service: any, index: number) => {
              const Icon = iconMap[service.icon as string] || Globe;
              return (
                <AnimatedItem
                  key={service._id}
                  className={index === 4 ? "lg:col-start-2" : ""}
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="group relative h-full"
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/20 to-[#0066FF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Card */}
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                      {/* Icon */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] to-[#0066FF] rounded-xl blur-lg opacity-50" />
                        <div className="relative w-16 h-16 bg-gradient-to-br from-[#00D9FF] to-[#0066FF] rounded-xl flex items-center justify-center">
                          {/\p{Emoji}/u.test(service.icon) ? (
                            <span className="text-3xl">{service.icon}</span>
                          ) : (
                            <Icon className="w-8 h-8 text-white" />
                          )}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 group-hover:text-[#00D9FF] transition-colors">
                        {service.title}
                        <ArrowUpRight className="w-5 h-5 text-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </h3>
                      
                      <p className="text-white/60 mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      
                      {service.features && service.features.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {service.features.map((feature: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs font-semibold bg-white/5 text-white/70 px-3 py-1.5 rounded-full border border-white/10"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}

                      {service.price && (
                        <div className="mt-auto pt-6 border-t border-white/10">
                          <p className="text-sm text-white/50 mb-1">Starting at</p>
                          <p className="text-2xl font-bold text-[#00D9FF]">
                            ${service.price.toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute top-4 right-4 w-12 h-[2px] bg-gradient-to-l from-[#00D9FF] to-transparent" />
                        <div className="absolute top-4 right-4 w-[2px] h-12 bg-gradient-to-b from-[#00D9FF] to-transparent" />
                      </div>
                    </div>
                  </motion.div>
                </AnimatedItem>
              );
            })}
          </AnimatedStagger>
        )}

        {/* Empty State */}
        {!isLoading && (!data?.items || data.items.length === 0) && (
          <div className="text-center py-20">
            <p className="text-white/50 text-lg">No services available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};