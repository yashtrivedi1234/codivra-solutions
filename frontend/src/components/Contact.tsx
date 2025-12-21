import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnimatedSection } from "./AnimatedSection";

import { useSubmitContactMutation, useGetServicesQuery } from "@/lib/api";

export const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const [submitContact] = useSubmitContactMutation();
  const { data: servicesData, isLoading: servicesLoading, isError: servicesError } = useGetServicesQuery();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: (formData.get("name") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      service: (formData.get("service") || "").toString(),
      message: (formData.get("message") || "").toString().trim(),
    };

    try {
      const result = await submitContact(payload).unwrap();

      setIsSubmitted(true);
      if (e.currentTarget && typeof e.currentTarget.reset === "function") {
        e.currentTarget.reset();
      }
      toast({
        title: "Contact Message Sent!",
        description:
          result.message || "Thank you for contacting Codivra Solutions. We'll get back to you within 24 hours.",
      });
    } catch (error: any) {
      console.error(error);
      setIsSubmitted(false);
      let errorMsg = "Please check your inputs or reach Codivra Solutions at codivrasolutions@gmail.com.";
      const fieldErrors = error?.data?.issues?.fieldErrors;
      const firstFieldError = fieldErrors
        ? Object.values(fieldErrors).flat()[0]
        : null;
      if (firstFieldError) errorMsg = String(firstFieldError);
      else if (error?.data?.error) errorMsg = error.data.error;
      else if (error?.status) errorMsg = `Status: ${error.status}`;
      else if (error?.message) errorMsg = error.message;
      toast({
        title: "Contact Submission Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-32 bg-[#0A0F1C] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#0066FF]/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
            {/* Left - Contact Info */}
            <AnimatedSection>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-2 text-[#00D9FF] font-bold text-sm tracking-[0.2em] uppercase">
                  <span className="w-8 h-[2px] bg-gradient-to-r from-transparent to-[#00D9FF]" />
                  Get In Touch
                </span>
              </motion.div>

              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Let's Build Something <span className="text-[#00D9FF]">Amazing</span>
              </h2>

              <p className="text-lg text-white/70 leading-relaxed mb-12">
                Ready to start your project? Contact us today for a free consultation 
                and quote. We're here to help turn your vision into reality.
              </p>

              {/* Contact Details */}
              <div className="space-y-6">
                {[
                  { 
                    icon: Mail, 
                    label: "Email Us", 
                    value: "codivrasolutions@gmail.com", 
                    href: "mailto:codivrasolutions@gmail.com" 
                  },
                  { 
                    icon: Phone, 
                    label: "Call Us", 
                    value: "+91 9452819739", 
                    href: "tel:+919452819739" 
                  },
                  { 
                    icon: MapPin, 
                    label: "Visit Us", 
                    value: "813, Vikas Nagar Colony, Khoobpur, Sitapur", 
                    href: null 
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group flex items-start gap-5"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] to-[#0066FF] rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative w-14 h-14 bg-gradient-to-br from-[#00D9FF] to-[#0066FF] rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="pt-1">
                      <div className="text-sm text-white/50 mb-1 font-medium">{item.label}</div>
                      {item.href ? (
                        <a 
                          href={item.href} 
                          className="text-white text-lg font-semibold hover:text-[#00D9FF] transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-white text-lg font-semibold">{item.value}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-12 pt-8 border-t border-white/10"
              >
                <p className="text-white/50 text-sm mb-4">Trusted by 50+ businesses worldwide</p>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D9FF]/20 to-[#0066FF]/20 border-2 border-white/10 flex items-center justify-center text-white/60 text-xs font-bold" style={{ marginLeft: i > 0 ? '-12px' : '0' }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <span className="ml-2 text-white/60 text-sm">+45 more</span>
                </div>
              </motion.div>
            </AnimatedSection>

            {/* Right - Contact Form */}
            <AnimatedSection delay={0.2}>
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/10 to-[#0066FF]/10 rounded-3xl blur-2xl" />
                
                {/* Form Card */}
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-10">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF] to-[#0066FF] rounded-full blur-xl opacity-50" />
                        <div className="relative w-20 h-20 bg-gradient-to-br from-[#00D9FF] to-[#0066FF] rounded-full flex items-center justify-center">
                          <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                      <p className="text-white/60 mb-6">
                        We've received your message and will get back to you soon.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        className="bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white font-semibold px-6 py-3 rounded-lg"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-semibold text-white mb-3 block">
                            Full Name
                          </label>
                          <Input
                            name="name"
                            placeholder="John Doe"
                            required
                            minLength={2}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 rounded-lg focus:border-[#00D9FF] focus:ring-[#00D9FF]"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-white mb-3 block">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 rounded-lg focus:border-[#00D9FF] focus:ring-[#00D9FF]"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-white mb-3 block">
                          Service Interested In
                        </label>
                        <select
                          name="service"
                          className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#00D9FF] focus:ring-[#00D9FF] focus:outline-none"
                          required
                          disabled={isSubmitting || servicesLoading || servicesError}
                        >
                          <option value="" className="bg-[#0A0F1C]">
                            {servicesLoading ? "Loading..." : servicesError ? "Failed to load" : "Select a service"}
                          </option>
                          {servicesData?.items?.length > 0 ? (
                            servicesData.items.map((service) => (
                              <option key={service._id} value={service.title} className="bg-[#0A0F1C]">
                                {service.title}
                              </option>
                            ))
                          ) : null}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-white mb-3 block">
                          Project Details
                        </label>
                        <Textarea
                          name="message"
                          placeholder="Tell us about your project..."
                          rows={6}
                          required
                          minLength={10}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-lg resize-none focus:border-[#00D9FF] focus:ring-[#00D9FF]"
                          disabled={isSubmitting}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white font-bold py-6 text-lg rounded-xl hover:shadow-[0_0_40px_rgba(0,217,255,0.6)] transition-all duration-300 group"
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};