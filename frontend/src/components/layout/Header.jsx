import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="mx-auto px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Menu (mobile) + Logo */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="text-center"
            >
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Tori<span className="text-primary-500 border-b-4 border-primary-500">Lynq</span>
              </h1>
            </button>
          </div>

          {/* Center: Search Bar (Desktop only) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search ToriLynq..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Search Icon (Mobile only) */}
            <button
              onClick={() => navigate('/search')}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Search className="w-6 h-6 text-gray-700" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile (Desktop only) */}
            <button
              onClick={() => navigate('/profile')}
              className="hidden lg:flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <img
                src={user?.avatar || 'https://i.pravatar.cc/150'}
                alt={user?.username}
                className="w-8 h-8 rounded-full"
              />
            </button>

            {/* Profile Icon (Mobile only) */}
            <button
              onClick={() => navigate('/profile')}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
