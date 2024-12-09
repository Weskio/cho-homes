import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { FiHome, FiUsers, FiSettings, FiMenu, FiX, FiLogOut, FiBarChart2, FiMessageSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/auth-context';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/properties', icon: FiBarChart2, label: 'Properties' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/messages', icon: FiMessageSquare, label: 'Messages' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-dark-90 rounded-lg md:hidden"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'tween' }}
            className="fixed top-0 left-0 h-full w-64 bg-dark-90 border-r border-dark-80 z-40"
          >
            <div className="p-6">
              <h1 className="text-2xl font-bold text-btn-primary">Cho-Homes</h1>
              <p className="text-dark-10 text-sm">Admin Dashboard</p>
            </div>

            <nav className="px-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    isActive(item.path)
                      ? 'bg-btn-primary text-white'
                      : 'hover:bg-dark-80'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}

              <button
                onClick={signOut}
                className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 w-full hover:bg-dark-80 text-left mt-8"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : ''
        }`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
