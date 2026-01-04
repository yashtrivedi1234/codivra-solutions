import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			setIsVisible(window.scrollY > 400);
		};

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0, opacity: 0 }}
					className="fixed bottom-6 right-6 z-40"
				>
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={scrollToTop}
						className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white shadow-[0_0_30px_rgba(0,217,255,0.5)] hover:shadow-[0_0_50px_rgba(0,217,255,0.7)] transition-all duration-300 flex items-center justify-center"
						aria-label="Scroll to top"
					>
						<ArrowUp className="w-6 h-6 sm:w-7 sm:h-7" />
					</motion.button>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ScrollToTop;
