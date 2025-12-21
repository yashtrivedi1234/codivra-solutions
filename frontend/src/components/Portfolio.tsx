import { ExternalLink } from "lucide-react";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "./AnimatedSection";
import { useGetPortfolioQuery } from "@/lib/api";
import { motion } from "framer-motion";

export const Portfolio = () => {
  const { data, isLoading } = useGetPortfolioQuery();
  const projects = data?.items || [];

  if (isLoading) {
    return (
      <section id="portfolio" className="relative py-32 bg-[#0A0F1C]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="inline-block w-10 h-10 border-4 border-[#00D9FF] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white/60">Loading portfolio...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="relative py-32 bg-[#0A0F1C] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#0066FF]/5 rounded-full blur-[120px]" />
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
              Our Work
              <span className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#00D9FF]" />
            </span>
          </motion.div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Featured <span className="text-[#00D9FF]">Projects</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Sample work representing the type of services we provide to startups and growing businesses.
          </p>
        </AnimatedSection>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/50 text-lg">No portfolio items yet.</p>
          </div>
        ) : (
          <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projects.map((project) => (
              <AnimatedItem key={project._id}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative h-full"
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/10 to-[#0066FF]/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Card */}
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {project.image ? (
                        <motion.img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#00D9FF]/20 to-[#0066FF]/20 flex items-center justify-center">
                          <span className="text-white/30 text-lg font-semibold">No image</span>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-block bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                          {project.category}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                        >
                          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full">
                            <span className="text-white font-bold">View Project</span>
                            <ExternalLink className="w-5 h-5 text-white" />
                          </div>
                        </a>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00D9FF] transition-colors flex items-center gap-2">
                        {project.title}
                        {project.link && (
                          <ExternalLink className="w-4 h-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </h3>
                      <p className="text-white/60 leading-relaxed flex-1">
                        {project.description}
                      </p>
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
        )}
      </div>
    </section>
  );
};