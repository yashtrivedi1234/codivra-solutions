import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0F1C] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#0066FF]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Number */}
          <div className="relative mb-8">
            <div className="absolute inset-0 blur-3xl opacity-50">
              <span className="text-[12rem] md:text-[16rem] font-black bg-gradient-to-r from-[#00D9FF] to-[#0066FF] bg-clip-text text-transparent">
                404
              </span>
            </div>
            <h1 className="relative text-[12rem] md:text-[16rem] font-black bg-gradient-to-r from-[#00D9FF] to-[#0066FF] bg-clip-text text-transparent leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
              404
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white font-bold px-8 py-6 text-lg rounded-xl hover:shadow-[0_0_40px_rgba(0,217,255,0.6)]"
              >
                <a href="/" className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Return Home
                </a>
              </Button>
              <Button
                asChild
                className="bg-white/5 border-2 border-white/10 text-white font-semibold px-8 py-6 text-lg rounded-xl hover:bg-white/10"
              >
                <a href="javascript:history.back()" className="flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Go Back
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="absolute inset-0 border-2 border-[#00D9FF]/10 rounded-full" />
          <div className="absolute inset-8 border-2 border-[#0066FF]/10 rounded-full" />
          <div className="absolute inset-16 border-2 border-[#00D9FF]/10 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;