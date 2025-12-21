import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Menu } from 'lucide-react';
import { getSidebarItems, adminSidebarItems, websiteSidebarItems } from '@/layout/Sidebar';
import logo from '@/assets/logo.png';

interface SidebarProps {
  context?: 'admin' | 'website';
  isOpen?: boolean;
  onClose?: () => void;
  showDescription?: boolean;
  sticky?: boolean;
}

const Sidebar = ({ context = 'website', isOpen = true, onClose, showDescription = true, sticky = false }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(isOpen);
  const [collapsed, setCollapsed] = useState(false);

  const items = getSidebarItems(context);
  const isAdmin = context === 'admin';

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
        className="fixed bottom-6 right-6 z-40 md:hidden p-3 rounded-full icon-gradient-blue text-white shadow-lg hover:shadow-xl transition-all"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`$${sticky ? 'sticky' : 'fixed'} md:sticky top-0 left-0 h-screen ${collapsed ? 'w-20' : 'w-64'} bg-white/60 dark:bg-[#181c23]/60 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 z-40 overflow-hidden rounded-r-2xl backdrop-blur-lg ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          ...(sticky ? { position: 'sticky', top: 0, overflowY: 'visible' } : {}),
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Header */}
        <div className={`p-6 border-b border-slate-200 dark:border-slate-800 ${collapsed ? 'px-2 py-4' : ''}`} style={{ background: 'transparent' }}>
          <div className="flex items-center mb-4 gap-3">
            <div
              className="icon-gradient-blue p-2 rounded-2xl cursor-pointer shadow-md hover:scale-110 transition-transform border-4 border-white dark:border-[#181c23]"
              onClick={() => setCollapsed((c) => !c)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{ boxShadow: '0 4px 24px 0 rgba(76,110,245,0.10)' }}
            >
              <Menu className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <img src={logo} alt="Codivra Logo" className="h-36 w-auto max-w-[420px] min-w-[180px] object-contain mb-1" />
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-widest uppercase mt-0.5">
                  Admin Panel
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1">
          {items.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className={`w-full text-left py-3 rounded-xl transition-all duration-200 flex items-center group ${
                  active
                    ? 'bg-white/80 dark:bg-blue-400/20 text-blue-700 dark:text-blue-200 font-bold shadow-lg border-l-4 border-blue-500'
                    : 'hover:bg-white/40 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-200 font-medium border-l-4 border-transparent'
                } ${collapsed ? 'justify-center items-center px-0' : 'gap-3 px-4'}`}
                title={item.label}
                style={collapsed ? { minHeight: 48, minWidth: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}
              >
                <span style={collapsed ? { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 } : {}}>
                  <IconComponent className={`w-5 h-5 ${active ? 'text-blue-600 dark:text-blue-200' : 'group-hover:text-blue-700 dark:group-hover:text-blue-200'}`} />
                </span>
                {!collapsed && (
                  <div className="flex-1">
                    <p className="text-base font-semibold tracking-wide">{item.label}</p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
      {/* Style */}
      <style>{`
        .icon-gradient-blue {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
