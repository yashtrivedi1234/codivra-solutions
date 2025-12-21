import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Zap,
  Layout,
  BookOpen,
  Briefcase,
  MessageSquare,
  LogOut,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ReactNode } from "react";
import AdminNotifications from "./AdminNotifications";
import Sidebar from '../Sidebar';
import logo from '@/assets/logo.png';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const email = typeof window !== "undefined" ? window.localStorage.getItem("admin_email") : null;

  const getInitials = (email: string | null) => {
    if (!email) return "AD";
    const parts = email.split("@")[0].split(".");
    return parts.map((p) => p[0].toUpperCase()).join("").slice(0, 2);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("admin_token");
    window.localStorage.removeItem("admin_email");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0A0F1C] flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          letter-spacing: -0.01em;
        }
        
        .mono {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
        }
        
        .crm-header {
          background: rgba(255, 255, 255, 0.95);
          border-bottom: 1px solid #E5E7EB;
          backdrop-filter: blur(20px);
        }
        
        .dark .crm-header {
          background: rgba(15, 23, 42, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: #EF4444;
          border: 2px solid white;
          border-radius: 50%;
        }

        .dark .notification-badge {
          border-color: #0F172A;
        }
      `}</style>

      {/* Header */}
      <header className="w-full fixed top-0 z-50 crm-header">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Codivra"
                className="h-10 w-auto object-contain brightness-0 dark:invert"
              />
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Admin Portal
              </span>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Quick Actions */}
              <button className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>

              <button className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>

              {/* Notifications */}
              <AdminNotifications />

              {/* Divider */}
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Avatar className="h-9 w-9 border-2 border-gray-200 dark:border-gray-700">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`}
                        alt="Admin"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
                        {getInitials(email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {email?.split('@')[0] || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Administrator
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="flex flex-col space-y-1 pb-2">
                    <span className="text-sm font-semibold">{email || "Admin User"}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                      {email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        <Sidebar context="admin" showDescription={false} sticky />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 overflow-y-auto">{children}</div>

          {/* Footer */}
          <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F172A] mt-auto">
            <div className="container mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    © 2025 Codivra Solutions. All rights reserved.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      Privacy Policy
                    </a>
                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      Terms of Service
                    </a>
                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      Documentation
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Version 1.0.0</span>
                  <span className="w-1 h-1 rounded-full bg-green-500"></span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    All Systems Operational
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;