import { Linkedin, Twitter, Github, Loader2 } from "lucide-react";
import { AnimatedSection, AnimatedStagger, AnimatedItem } from "./AnimatedSection";
import { useGetTeamQuery } from "@/lib/api";
import { motion } from "framer-motion";

export const Team = () => {
  const { data, isLoading } = useGetTeamQuery();
  const teamMembers = data?.items && data.items.length > 0
    ? data.items.map((member) => ({
        name: member.name,
        role: member.role,
        image: member.image,
        bio: member.bio,
        social: {
          linkedin: member.social_links?.linkedin || "",
          twitter: member.social_links?.twitter || "",
          github: member.social_links?.github || "",
        },
      }))
    : [];

  return (
    <section id="team" className="relative py-32 bg-[#0A0F1C] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#0066FF]/5 rounded-full blur-[120px]" />
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
              Our Team
              <span className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#00D9FF]" />
            </span>
          </motion.div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Meet the <span className="text-[#00D9FF]">Experts</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            A talented team of professionals dedicated to delivering exceptional results for your business.
          </p>
        </AnimatedSection>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#00D9FF]" />
          </div>
        )}

        {/* Team Grid */}
        {!isLoading && teamMembers.length > 0 && (
          <AnimatedStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {teamMembers.map((member) => (
              <AnimatedItem key={member.name}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative"
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/10 to-[#0066FF]/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Card */}
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#00D9FF]/20 to-[#0066FF]/20 flex items-center justify-center">
                          <span className="text-6xl font-black text-white/30">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      {/* Overlay with social links */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        {member.social.linkedin && (
                          <a
                            href={member.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group/icon"
                            aria-label={`${member.name} LinkedIn`}
                          >
                            <div className="absolute inset-0 bg-[#00D9FF] rounded-lg blur-md opacity-0 group-hover/icon:opacity-75 transition-opacity" />
                            <div className="relative w-11 h-11 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                              <Linkedin className="w-5 h-5 text-white" />
                            </div>
                          </a>
                        )}
                        {member.social.twitter && (
                          <a
                            href={member.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group/icon"
                            aria-label={`${member.name} Twitter`}
                          >
                            <div className="absolute inset-0 bg-[#00D9FF] rounded-lg blur-md opacity-0 group-hover/icon:opacity-75 transition-opacity" />
                            <div className="relative w-11 h-11 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                              <Twitter className="w-5 h-5 text-white" />
                            </div>
                          </a>
                        )}
                        {member.social.github && (
                          <a
                            href={member.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group/icon"
                            aria-label={`${member.name} GitHub`}
                          >
                            <div className="absolute inset-0 bg-[#00D9FF] rounded-lg blur-md opacity-0 group-hover/icon:opacity-75 transition-opacity" />
                            <div className="relative w-11 h-11 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                              <Github className="w-5 h-5 text-white" />
                            </div>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-[#00D9FF] font-semibold text-sm mb-3">
                        {member.role}
                      </p>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedItem>
            ))}
          </AnimatedStagger>
        )}

        {/* Empty State */}
        {!isLoading && teamMembers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/50 text-lg">No team members found.</p>
          </div>
        )}
      </div>
    </section>
  );
};