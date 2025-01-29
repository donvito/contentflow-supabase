import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  Plus,
  Calendar,
  ListTodo,
  Settings,
  Layout as LayoutIcon
} from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  {
    path: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    path: '/dashboard/add',
    icon: Plus,
    label: 'Create Content',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    path: '/dashboard/calendar',
    icon: Calendar,
    label: 'Calendar',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    path: '/dashboard/content',
    icon: ListTodo,
    label: 'Content List',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    path: '/dashboard/settings',
    icon: Settings,
    label: 'Settings',
    gradient: 'from-pink-500 to-rose-500',
  },
];

export const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out relative ${isSidebarCollapsed ? 'px-4 py-6' : 'p-6'}`}>
        <div className={`flex items-center gap-2 text-[#6C5CE7] font-medium mb-8 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          {!isSidebarCollapsed && (
            <>
              <LayoutIcon className="h-5 w-5" />
              <span className="text-lg font-semibold">ContentFlow</span>
            </>
          )}
          {isSidebarCollapsed && (
            <div className="w-8 h-8 bg-[#6C5CE7]/10 rounded-lg flex items-center justify-center">
              <LayoutIcon className="h-5 w-5 text-[#6C5CE7]" />
            </div>
          )}
        </div>

        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-4 top-8 bg-white border border-gray-200 rounded-full p-1.5 text-gray-500 hover:text-[#6C5CE7] transition-colors"
        >
          {isSidebarCollapsed ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
          )}
        </button>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex items-center
                ${isSidebarCollapsed ? 'justify-center' : ''}
                gap-3 px-4 py-3
                text-gray-700
                rounded-lg
                hover:bg-gray-50
                w-full group transition-colors relative
                ${location.pathname === item.path
                  ? 'bg-gradient-to-r ' + item.gradient + ' text-white hover:opacity-90'
                  : ''}
              `}
              title={item.label}
            >
              <div
                className={`${
                  isSidebarCollapsed
                    ? 'w-10 h-10 flex items-center justify-center rounded-lg'
                    : ''
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-colors ${
                    location.pathname === item.path
                      ? 'text-white'
                      : 'group-hover:text-[#6C5CE7]'
                  }`}
                />
              </div>
              {!isSidebarCollapsed && <span>{item.label}</span>}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className={`mt-auto pt-6 border-t border-gray-200 ${isSidebarCollapsed ? 'text-center' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            {!isSidebarCollapsed && <p className="text-sm text-gray-600">{user?.email}</p>}
          </div>
          <Button
            variant="outline"
            onClick={signOut}
            className={`w-full ${isSidebarCollapsed ? 'justify-center px-2 py-2 h-auto group relative' : 'justify-start'}`}
            title="Sign Out"
          >
            {isSidebarCollapsed ? (
              <>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg group-hover:bg-[#6C5CE7]/10">
                  <span className="text-lg">👋</span>
                </div>
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  Sign Out
                </div>
              </>
            ) : (
              <>
                <LayoutIcon className="h-5 w-5 mr-2" />
                <span>Sign Out</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};