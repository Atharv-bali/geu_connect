import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'My Profile', path: '/profile', icon: '👤' },
    { name: 'Feed', path: '/feed', icon: '📰' },
    { name: 'Projects', path: '/projects', icon: '💼' },
    { name: 'Forum', path: '/forum', icon: '💬' },
    { name: 'Interviews', path: '/interviews', icon: '📅' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-primary">Navigation</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              location.pathname === item.path
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
