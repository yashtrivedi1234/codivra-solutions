import { useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

interface PageLoaderProps {
  children: ReactNode;
  minLoadTime?: number;
}

const LoadingSpinner = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0F1C]">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-[#00D9FF] to-[#0066FF] rounded-full blur-2xl opacity-50 animate-pulse" />
        
        {/* Base circle */}
        <div className="absolute inset-0 w-20 h-20 border-4 border-white/10 rounded-full" />
        
        {/* Spinning gradient circle */}
        <div className="w-20 h-20 border-4 border-transparent border-t-[#00D9FF] border-r-[#0066FF] rounded-full animate-spin" />
      </div>
      
      {/* Loading text with dots */}
      <div className="flex items-center gap-2">
        <span className="text-white/70 text-sm font-medium">Loading</span>
        <div className="flex gap-1">
          <motion.div
            className="w-1.5 h-1.5 bg-[#00D9FF] rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-[#00D9FF] rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-[#00D9FF] rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  </div>
);

export const PageLoader = ({ children, minLoadTime = 300 }: PageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadTime);

    return () => clearTimeout(timer);
  }, [minLoadTime]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export { LoadingSpinner };