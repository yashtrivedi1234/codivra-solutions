import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export const PrivacyPolicy = () => (
  <div className="min-h-screen bg-[#0A0F1C]">
    <Header />
    <div className="pt-20 relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 text-[#00D9FF] font-bold text-sm tracking-[0.2em] uppercase mb-4">
              <span className="w-8 h-[2px] bg-gradient-to-r from-transparent to-[#00D9FF]" />
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Privacy Policy
            </h1>
            <p className="text-white/60 text-lg">Last updated: December 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/70 leading-relaxed mb-6">
                Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Information We Collect</h2>
              <ul className="list-disc ml-6 mb-6 text-white/70 space-y-2">
                <li>Personal information you provide (name, email, etc.)</li>
                <li>Information collected automatically (cookies, usage data, etc.)</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">How We Use Information</h2>
              <ul className="list-disc ml-6 mb-6 text-white/70 space-y-2">
                <li>To provide and improve our services</li>
                <li>To communicate with you</li>
                <li>To comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Your Rights</h2>
              <ul className="list-disc ml-6 mb-6 text-white/70 space-y-2">
                <li>You can request access, correction, or deletion of your data</li>
                <li>You can opt out of marketing communications</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Us</h2>
              <p className="text-white/70 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:codivrasolutions@gmail.com" className="text-[#00D9FF] hover:underline font-semibold">
                  codivrasolutions@gmail.com
                </a>
                .
              </p>
              <p className="text-white/50 text-sm mt-8">
                © 2025 Codivra Solutions. All rights reserved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export const TermsOfService = () => (
  <div className="min-h-screen bg-[#0A0F1C]">
    <Header />
    <div className="pt-20 relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0066FF]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 text-[#00D9FF] font-bold text-sm tracking-[0.2em] uppercase mb-4">
              <span className="w-8 h-[2px] bg-gradient-to-r from-transparent to-[#00D9FF]" />
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Terms of Service
            </h1>
            <p className="text-white/60 text-lg">Last updated: December 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/70 leading-relaxed mb-6">
                By using our website and services, you agree to the following terms and conditions. Please read them carefully.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Use of Services</h2>
              <ul className="list-disc ml-6 mb-6 text-white/70 space-y-2">
                <li>You must use our services in compliance with all applicable laws</li>
                <li>You may not misuse our services or attempt to access them using unauthorized means</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Intellectual Property</h2>
              <ul className="list-disc ml-6 mb-6 text-white/70 space-y-2">
                <li>All content and materials are the property of Codivra or its licensors</li>
                <li>You may not copy, modify, or distribute our content without permission</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Limitation of Liability</h2>
              <ul className="list-disc ml-6 mb-6 text-white/70 space-y-2">
                <li>We are not liable for any damages resulting from your use of our services</li>
                <li>Our services are provided "as is" without warranties of any kind</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Changes to Terms</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                We may update these Terms of Service from time to time. Continued use of our services constitutes acceptance of the new terms.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Us</h2>
              <p className="text-white/70 leading-relaxed">
                If you have any questions about these Terms, please contact us at{" "}
                <a href="mailto:codivrasolutions@gmail.com" className="text-[#00D9FF] hover:underline font-semibold">
                  codivrasolutions@gmail.com
                </a>
                .
              </p>
              <p className="text-white/50 text-sm mt-8">
                © 2025 Codivra Solutions. All rights reserved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default PrivacyPolicy;