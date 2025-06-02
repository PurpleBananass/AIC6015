import { useNavigate, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  ClipboardList, 
  Clock, 
  Bell, 
  User, 
  X, 
  ServerCog
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', text: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/resources', text: 'GPU Resources', icon: <Cpu size={20} /> },
    { to: '/request', text: 'Request Resources', icon: <ClipboardList size={20} /> },
    { to: '/history', text: 'Request History', icon: <Clock size={20} /> },
    { to: '/notifications', text: 'Notifications', icon: <Bell size={20} />, badge: unreadCount },
    { to: '/profile', text: 'Profile', icon: <User size={20} /> }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <ServerCog className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <span className="text-lg font-semibold">GPU Cluster</span>
          </div>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex flex-col h-[calc(100%-4rem)] py-4">
          <div className="flex-1 px-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-colors relative ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <div className="mr-3">{link.icon}</div>
                <span>{link.text}</span>
                {link.badge && link.badge > 0 && (
                  <span className="absolute right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* User info at bottom */}
          <div className="px-4 py-3 mt-auto border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              {user?.avatar ? (
                <img
                  className="h-8 w-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[11rem]">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[11rem]">
                  {user?.organization}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;