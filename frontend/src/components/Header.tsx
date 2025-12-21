import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navLinks = [
	{ href: "/services", label: "Services" },
	{ href: "/about", label: "About" },
	{ href: "/pricing", label: "Pricing" },
	{ href: "/portfolio", label: "Portfolio" },
	{ href: "/blog", label: "Blog" },
	{ href: "/careers", label: "Careers" },
	{ href: "/contact", label: "Contact" },
	{ href: "/admin", label: "Admin" },
];

export const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`w-full sticky top-0 z-50 transition-all duration-300 ${
				isScrolled
					? "bg-white/95 backdrop-blur-md shadow-lg"
					: "bg-white/80 backdrop-blur-sm shadow-md"
			}`}
		>
			<div className="container mx-auto px-4 md:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20 md:h-24">
					{/* Logo */}
					<Link to="/" className="flex items-center flex-shrink-0">
						<img
							src={logo}
							alt="Codivra Logo"
							className="h- md:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
						/>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center gap-1 xl:gap-2">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								to={link.href}
								className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 group ${
									location.pathname === link.href
										? "text-accent"
										: "text-gray-700 hover:text-accent"
								}`}
							>
								{link.label}
								<span
									className={`absolute bottom-0 left-0 w-full h-0.5 bg-accent transform origin-left transition-transform duration-300 ${
										location.pathname === link.href
											? "scale-x-100"
											: "scale-x-0 group-hover:scale-x-100"
									}`}
								/>
							</Link>
						))}
					</nav>

					{/* CTA Button - Desktop */}
					<div className="hidden lg:flex items-center gap-4">
						<Button
							variant="accent"
							size="lg"
							asChild
							className="font-semibold shadow-sm hover:shadow-md transition-shadow duration-200"
						>
							<Link to="/contact">Get a Quote</Link>
						</Button>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="lg:hidden p-2 text-gray-700 hover:text-accent transition-colors duration-200 rounded-lg hover:bg-gray-100"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label="Toggle menu"
					>
						{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
					isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="bg-white border-t border-gray-200 shadow-lg">
					<nav className="container mx-auto px-4 py-6 flex flex-col">
						{navLinks.map((link, index) => (
							<Link
								key={link.href}
								to={link.href}
								className={`py-3 px-4 text-base font-medium transition-all duration-200 rounded-lg ${
									location.pathname === link.href
										? "text-accent bg-accent/5"
										: "text-gray-700 hover:text-accent hover:bg-gray-50"
								}`}
								onClick={() => setIsMobileMenuOpen(false)}
								style={{
									animationDelay: `${index * 50}ms`,
									animation: isMobileMenuOpen
										? "slideDown 0.3s ease-out forwards"
										: "none",
								}}
							>
								{link.label}
							</Link>
						))}
						<div className="mt-6 px-4">
							<Button
								variant="accent"
								className="w-full font-semibold shadow-sm"
								size="lg"
								asChild
							>
								<Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
									Get a Quote
								</Link>
							</Button>
						</div>
					</nav>
				</div>
			</div>

			<style>{`
				@keyframes slideDown {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</header>
	);
};