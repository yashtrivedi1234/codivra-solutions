import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface ReadingProgressBarProps {
  progress: number;
}

const ReadingProgressBar = ({ progress }: ReadingProgressBarProps) => {
  const location = useLocation();

  // Don't show progress bar on admin routes
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#00D9FF] to-[#0066FF] z-50 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  );
};

export default ReadingProgressBar;