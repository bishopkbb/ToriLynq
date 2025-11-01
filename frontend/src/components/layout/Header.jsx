import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Profile Icon */}
          <button
            onClick={() => navigate('/profile')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <User className="w-6 h-6 text-gray-700" />
          </button>

          {/* Logo */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Tori<span className="text-primary-500 border-b-4 border-primary-500">Lynq</span>
            </h1>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/search')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Search className="w-6 h-6 text-gray-700" />
            </button>
            
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {/* Unread badge */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
