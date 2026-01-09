import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import AdminNotifications from "./AdminNotifications";
import Sidebar from '../Sidebar';
import logo from '@/assets/logo.webp';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full fixed top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Subtle glow on light background */}
                <div className="pointer-events-none absolute -inset-2 rounded-xl bg-gradient-to-r from-[#00D9FF]/20 to-[#0066FF]/20 blur-xl" />
                <img
                  src={logo}
                  alt="Codivra"
                  className="relative h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,102,255,0.35)]"
                />
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <span className="text-sm font-semibold text-gray-600">
                Admin Portal
              </span>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <AdminNotifications />

              {/* Divider */}
              <div className="h-6 w-px bg-gray-300 mx-2" />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Avatar className="h-8 w-8 border-2 border-gray-200">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`}
                        alt="Admin"
                      />
                      <AvatarFallback className="bg-blue-600 text-white font-semibold text-xs">
                        {getInitials(email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        {email?.split('@')[0] || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Administrator
                      </p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col space-y-1 pb-2">
                    <span className="text-sm font-semibold">{email || "Admin User"}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50"
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
          <footer className="border-t border-gray-200 bg-white mt-auto">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  © 2025 Codivra Solutions. All rights reserved.
                </p>
                <div className="flex gap-4 text-sm">
                  <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                    Terms of Service
                  </a>
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