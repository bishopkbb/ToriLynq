import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Video, User } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Chat', icon: MessageCircle, path: '/chat' },
    { name: 'Video', icon: Video, path: '/videos' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-bg border-t border-gray-700 z-50">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center space-y-1 transition-colors duration-200"
              >
                <Icon
                  className={`w-6 h-6 ${
                    active ? 'text-primary-500' : 'text-gray-400'
                  }`}
                />
                <span
                  className={`text-xs ${
                    active ? 'text-primary-500 font-semibold' : 'text-gray-400'
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
