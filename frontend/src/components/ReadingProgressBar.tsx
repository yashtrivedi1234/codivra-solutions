import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface ReadingProgressBarProps {
  progress: number;
}

const ReadingProgressBar = ({ progress }: ReadingProgressBarProps) => {
  const location = useLocation();

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <motion.div
      role="presentation"
      aria-hidden="true"
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#00D9FF] to-[#0066FF] z-[60]"
      initial={{ width: "0%" }}
      animate={{ width: `${progress}%` }}
      transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
    />
  );
};

export default ReadingProgressBar;