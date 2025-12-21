import { BarChart3, Zap, Palette, DollarSign, Layout, BookOpen, Briefcase, MessageSquare, Home } from 'lucide-react';

/**
 * Page File References
 * Links to actual component files
 */

// Admin Pages
// - src/pages/admin/AdminDashboard.tsx
// - src/pages/admin/AdminServices.tsx
// - src/pages/admin/AdminAbout.tsx
// - src/pages/admin/AdminPricing.tsx
// - src/pages/admin/AdminPortfolio.tsx
// - src/pages/admin/AdminBlog.tsx
// - src/pages/admin/AdminCareers.tsx
// - src/pages/admin/AdminContact.tsx

// Website Pages
// - src/pages/Index.tsx (Home)
// - src/pages/Services.tsx
// - src/pages/About.tsx
// - src/pages/Pricing.tsx
// - src/pages/Portfolio.tsx
// - src/pages/Blog.tsx
// - src/pages/Careers.tsx
// - src/pages/Contact.tsx

export interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon: any;
  badge?: string;
  description?: string;
  componentPath?: string; // Reference to actual component file
}

// Admin Sidebar Items
export const adminSidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: BarChart3,
    componentPath: 'src/pages/admin/AdminDashboard.tsx',
  },
  {
    id: 'services',
    label: 'Services',
    path: '/admin/services',
    icon: Zap,
    componentPath: 'src/pages/admin/AdminServices.tsx',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    path: '/admin/portfolio',
    icon: Layout,
    componentPath: 'src/pages/admin/AdminPortfolio.tsx',
  },
  {
    id: 'blog',
    label: 'Blog',
    path: '/admin/blog',
    icon: BookOpen,
    componentPath: 'src/pages/admin/AdminBlog.tsx',
  },
  {
    id: 'careers',
    label: 'Careers',
    path: '/admin/careers',
    icon: Briefcase,
    componentPath: 'src/pages/admin/AdminCareers.tsx',
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/admin/contact',
    icon: MessageSquare,
    componentPath: 'src/pages/admin/AdminContact.tsx',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    icon: Palette,
    componentPath: 'src/pages/AdminSettings.tsx',
  },
];

// Main Website Sidebar (for mobile/drawer menu)
export const websiteSidebarItems: SidebarItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: Home,
    componentPath: 'src/pages/Index.tsx',
  },
  {
    id: 'services',
    label: 'Services',
    path: '/services',
    icon: Zap,
    componentPath: 'src/pages/Services.tsx',
  },
  {
    id: 'about',
    label: 'About',
    path: '/about',
    icon: Palette,
    componentPath: 'src/pages/About.tsx',
  },
  {
    id: 'pricing',
    label: 'Pricing',
    path: '/pricing',
    icon: DollarSign,
    componentPath: 'src/pages/Pricing.tsx',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    path: '/portfolio',
    icon: Layout,
    componentPath: 'src/pages/Portfolio.tsx',
  },
  {
    id: 'blog',
    label: 'Blog',
    path: '/blog',
    icon: BookOpen,
    componentPath: 'src/pages/Blog.tsx',
  },
  {
    id: 'careers',
    label: 'Careers',
    path: '/careers',
    icon: Briefcase,
    componentPath: 'src/pages/Careers.tsx',
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    icon: MessageSquare,
    componentPath: 'src/pages/Contact.tsx',
  },
];

// Get sidebar items based on context
export const getSidebarItems = (context: 'admin' | 'website' = 'website'): SidebarItem[] => {
  return context === 'admin' ? adminSidebarItems : websiteSidebarItems
};


/**
 * Page File Mapping
 * Maps routes to component files for reference
 */
export const pageFileMapping = {
  // Admin Pages
  '/admin/dashboard': 'src/pages/admin/AdminDashboard.tsx',
  '/admin/services': 'src/pages/admin/AdminServices.tsx',
  '/admin/about': 'src/pages/admin/AdminAbout.tsx',
  '/admin/pricing': 'src/pages/admin/AdminPricing.tsx',
  '/admin/portfolio': 'src/pages/admin/AdminPortfolio.tsx',
  '/admin/blog': 'src/pages/admin/AdminBlog.tsx',
  '/admin/careers': 'src/pages/admin/AdminCareers.tsx',
  '/admin/contact': 'src/pages/admin/AdminContact.tsx',
  
  // Website Pages
  '/': 'src/pages/Index.tsx',
  '/services': 'src/pages/Services.tsx',
  '/about': 'src/pages/About.tsx',
  '/pricing': 'src/pages/Pricing.tsx',
  '/portfolio': 'src/pages/Portfolio.tsx',
  '/blog': 'src/pages/Blog.tsx',
  '/careers': 'src/pages/Careers.tsx',
  '/contact': 'src/pages/Contact.tsx',
} as const;

/**
 * Get component path for a given route
 */
export const getComponentPath = (route: string): string | undefined => {
  return pageFileMapping[route as keyof typeof pageFileMapping];
};
