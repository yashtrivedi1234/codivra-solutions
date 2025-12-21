import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSidebarItems } from '@/layout/Sidebar';
import logo from '@/assets/logo.png';

interface SidebarProps {
  context?: 'admin' | 'website';
  isOpen?: boolean;
  onClose?: () => void;
  showDescription?: boolean;
  sticky?: boolean;
}

const Sidebar = ({ context = 'website', isOpen = true, onClose, sticky = false }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(isOpen);
  const [collapsed, setCollapsed] = useState(false);

  const items = getSidebarItems(context);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    onClose?.();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .crm-sidebar {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          letter-spacing: -0.01em;
        }

        .sidebar-item {
          position: relative;
          transition: all 0.2s ease;
        }

        .sidebar-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 0;
          background: linear-gradient(180deg, #3B82F6 0%, #2563EB 100%);
          border-radius: 0 3px 3px 0;
          transition: height 0.2s ease;
        }

        .sidebar-item.active::before {
          height: 32px;
        }

        .sidebar-item:hover:not(.active) {
          background: rgba(59, 130, 246, 0.05);
        }

        .dark .sidebar-item:hover:not(.active) {
          background: rgba(59, 130, 246, 0.1);
        }

        .sidebar-item.active {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
        }

        .dark .sidebar-item.active {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, transparent 100%);
        }

        .collapse-button {
          transition: all 0.2s ease;
        }

        .collapse-button:hover {
          background: rgba(59, 130, 246, 0.1);
          transform: scale(1.05);
        }

        .sidebar-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }

        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .sidebar-item {
          animation: slideIn 0.3s ease-out;
        }

        .mobile-toggle {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 40;
          padding: 14px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
          transition: all 0.3s ease;
        }

        .mobile-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.5);
        }

        .mobile-toggle:active {
          transform: scale(0.95);
        }
      `}</style>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="mobile-toggle md:hidden"
      >
        {mobileOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`crm-sidebar ${sticky ? 'sticky' : 'fixed'} md:sticky top-0 left-0 h-screen ${
          collapsed ? 'w-20' : 'w-72'
        } bg-white dark:bg-[#0F172A] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 z-40 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className={`border-b border-gray-200 dark:border-gray-800 ${collapsed ? 'px-4 py-6' : 'p-6'}`}>
          <div className="flex items-center justify-between mb-4">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img 
                  src={logo} 
                  alt="Codivra Logo" 
                  className="h-10 w-auto object-contain brightness-0 dark:invert" 
                />
              </div>
            )}
            {collapsed && (
              <img 
                src={logo} 
                alt="Codivra Logo" 
                className="h-8 w-auto object-contain brightness-0 dark:invert mx-auto" 
              />
            )}
          </div>
          
          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={`collapse-button w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-all ${
              collapsed ? 'px-2' : ''
            }`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto sidebar-scrollbar">
          {items.map((item, index) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className={`sidebar-item w-full flex items-center gap-3 rounded-lg transition-all ${
                  collapsed ? 'justify-center px-3 py-3.5' : 'px-4 py-3'
                } ${
                  active
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                title={collapsed ? item.label : ''}
              >
                <div className={`flex-shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-semibold ${active ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                      {item.label}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}

                {!collapsed && active && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  System Status
                </p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                All systems operational
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-500">Version</span>
                <span className="font-semibold text-gray-900 dark:text-white mono">1.0.0</span>
              </div>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;