import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSidebarItems } from '@/layout/Sidebar';

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
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-6 right-6 md:hidden z-40 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-lg transition-colors"
      >
        {mobileOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${sticky ? 'sticky' : 'fixed'} md:sticky top-0 left-0 h-screen ${
          collapsed ? 'w-20' : 'w-64'
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-40 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-3">
          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 rounded-lg transition-colors ${
                  collapsed ? 'justify-center px-3 py-3' : 'px-3 py-2.5'
                } ${
                  active
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={collapsed ? item.label : ''}
              >
                <div className="flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>

                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>
                      {item.label}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}

                {!collapsed && active && (
                  <div className="flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer - Status Indicator */}
        {collapsed && (
          <div className="p-3 border-t border-gray-200">
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;