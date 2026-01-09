import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight, Rocket, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.webp";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
];

export const Header = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const location = useLocation();

	// Close mobile drawer on Escape
	useEffect(() => {
		if (!isMobileMenuOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsMobileMenuOpen(false);
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [isMobileMenuOpen]);

	return (
		<>
			<motion.header
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.1, ease: "easeOut" }}
				className="w-full fixed top-0 z-50 transition-all duration-500 bg-[#0A0F1C]/95 backdrop-blur-xl border-b-2 border-white/10"
				style={{ willChange: 'transform' }}
			>
				<div className="container mx-auto px-4 sm:px-6 lg:px-12">
					<div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
						{/* Logo */}
						<Link to="/" className="relative z-10 flex items-center group">
							{/* Glow backdrop */}
							<motion.div 
								initial={{ opacity: 0.7 }}
								whileHover={{ opacity: 1 }}
								className="pointer-events-none absolute -inset-3 rounded-2xl bg-gradient-to-r from-[#00D9FF]/30 to-[#0066FF]/30 blur-2xl"
							/>
							<motion.img
								whileHover={{ scale: 1.07 }}
								whileTap={{ scale: 0.96 }}
								src={logo}
								alt="Codivra"
								width={220}
								height={88}
								className="relative h-12 sm:h-16 lg:h-20 w-auto object-contain transition-all duration-300 brightness-0 invert drop-shadow-[0_0_18px_rgba(0,217,255,0.55)]"
								fetchPriority="high"
								decoding="async"
							/>
						</Link>

						{/* Desktop Navigation */}
						<nav className="hidden lg:flex items-center gap-1">
							{navLinks.map((link, idx) => {
								const isActive = location.pathname === link.href || 
												 (link.href.startsWith('#') && location.pathname === '/');
								const isExternal = link.href.startsWith('http') || link.href === '/admin';
								
								return isExternal ? (
									<motion.a
										key={link.href}
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: idx * 0.05 }}
										whileHover={{ y: -2 }}
										className={`relative px-5 py-3 text-sm font-bold tracking-wider transition-all duration-300 group uppercase ${
											isActive
												? "text-[#00D9FF]"
												: "text-white/70 hover:text-white"
										}`}
										style={{ fontFamily: "'Oswald', sans-serif" }}
									>
										<span className="relative z-10">{link.label}</span>
										{isActive && (
											<motion.div
												layoutId="activeTab"
												className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/10 to-[#0066FF]/10 rounded-xl border border-[#00D9FF]/30"
											/>
										)}
										<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-gradient-to-r from-[#00D9FF] to-[#0066FF] rounded-full transition-all duration-300 group-hover:w-4/5" />
									</motion.a>
								) : (
									<motion.div
										key={link.href}
										initial={{ opacity: 0, y: -20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: idx * 0.05 }}
									>
										<Link
											to={link.href}
											className={`relative px-2 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-3 text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 group uppercase block ${
												isActive
													? "text-[#00D9FF]"
													: "text-white/70 hover:text-white"
											}`}
											style={{ fontFamily: "'Oswald', sans-serif" }}
										>
											<span className="relative z-10">{link.label}</span>
											{isActive && (
												<motion.div
													layoutId="activeTab"
													className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/10 to-[#0066FF]/10 rounded-xl border border-[#00D9FF]/30"
													transition={{ type: "spring", stiffness: 300, damping: 30 }}
												/>
											)}
											<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-gradient-to-r from-[#00D9FF] to-[#0066FF] rounded-full transition-all duration-300 group-hover:w-4/5" />
										</Link>
									</motion.div>
								);
							})}
						</nav>

						{/* CTA Button - Desktop */}
						<motion.div 
							className="hidden lg:flex items-center gap-4"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.4 }}
						>
							<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								<Button
									asChild
									className="relative overflow-hidden bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white font-black px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,217,255,0.7)] group uppercase tracking-wider text-xs sm:text-sm"
								>
									<Link to="/inquiry" className="flex items-center gap-1 sm:gap-2">
										<Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
										<span className="hidden sm:inline">Inquiry</span>
										<ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
									</Link>
								</Button>
							</motion.div>
						</motion.div>

						{/* Mobile Menu Button */}
						<motion.button
							whileTap={{ scale: 0.9 }}
							className="lg:hidden relative p-3 text-white/70 hover:text-white transition-colors duration-200 rounded-xl hover:bg-white/10 border border-white/10"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							aria-label="Toggle menu"
							aria-controls="mobile-menu"
							aria-expanded={isMobileMenuOpen}
						>
							<AnimatePresence mode="wait">
								{isMobileMenuOpen ? (
									<motion.div
										key="close"
										initial={{ rotate: -90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: 90, opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<X size={24} />
									</motion.div>
								) : (
									<motion.div
										key="menu"
										initial={{ rotate: 90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: -90, opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<Menu size={24} />
									</motion.div>
								)}
							</AnimatePresence>
						</motion.button>
					</div>
				</div>
			</motion.header>
			{/* Mobile Menu Drawer */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="lg:hidden fixed inset-0 z-40"
					>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.9 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 bg-[#0A0F1C]/90 backdrop-blur"
							onClick={() => setIsMobileMenuOpen(false)}
						/>

						{/* Right-side drawer */}
						<motion.nav
							id="mobile-menu"
							initial={{ x: 320 }}
							animate={{ x: 0 }}
							exit={{ x: 320 }}
							transition={{ type: 'spring', stiffness: 260, damping: 28 }}
							className="absolute right-0 top-0 h-full w-[80vw] max-w-sm bg-[#0A0F1C] border-l-2 border-white/10 shadow-2xl flex flex-col"
							aria-label="Mobile navigation"
						>
							<div className="px-5 py-4 border-b-2 border-white/10 flex items-center justify-between">
								<span className="text-white/80 font-bold tracking-wider uppercase text-sm">Menu</span>
								<button
									className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 border border-white/10"
									aria-label="Close menu"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<X size={20} />
								</button>
							</div>

							<div className="flex-1 overflow-y-auto">
								<ul className="px-3 py-2">
									{navLinks.map((link, index) => {
										const isActive = location.pathname === link.href || (link.href.startsWith('#') && location.pathname === '/');
										const isExternal = link.href.startsWith('http') || link.href === '/admin';

										return (
											<li key={link.href}>
												{isExternal ? (
													<motion.a
														href={link.href}
														target="_blank"
														rel="noopener noreferrer"
														initial={{ opacity: 0, x: 20 }}
														animate={{ opacity: 1, x: 0 }}
														transition={{ delay: index * 0.05 }}
														className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
															isActive ? 'text-[#00D9FF] bg-white/5 border border-[#00D9FF]/30' : 'text-white/80 hover:text-white hover:bg-white/5'
														}`}
													>
														<span style={{ fontFamily: "'Oswald', sans-serif" }}>{link.label}</span>
														<ArrowUpRight className="w-4 h-4" />
													</motion.a>
												) : (
													<motion.div
														initial={{ opacity: 0, x: 20 }}
														animate={{ opacity: 1, x: 0 }}
														transition={{ delay: index * 0.05 }}
													>
														<Link
															to={link.href}
															onClick={() => setIsMobileMenuOpen(false)}
															className={`flex items-center px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider block ${
																isActive ? 'text-[#00D9FF] bg-white/5 border border-[#00D9FF]/30' : 'text-white/80 hover:text-white hover:bg-white/5'
															}`}
															style={{ fontFamily: "'Oswald', sans-serif" }}
														>
															{link.label}
														</Link>
													</motion.div>
												)}
											</li>
										);
									})}
								</ul>
							</div>

							<div className="p-4 border-t-2 border-white/10">
								<Button
									asChild
									className="w-full bg-gradient-to-r from-[#00D9FF] to-[#0066FF] text-white font-black py-4 rounded-xl hover:shadow-[0_0_40px_rgba(0,217,255,0.7)] uppercase tracking-wider text-sm"
								>
									<Link to="/inquiry" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2">
										<Rocket className="w-5 h-5" />
										Inquiry
										<Zap className="w-5 h-5" />
									</Link>
								</Button>
							</div>
						</motion.nav>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};