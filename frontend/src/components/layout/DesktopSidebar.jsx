import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Home, 
  Search, 
  Bell, 
  MessageCircle, 
  Video, 
  Bookmark,
  Settings,
  User,
  TrendingUp,
  Users,
  LogOut,
  PlusCircle
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';

const DesktopSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { name: 'Home', icon: Home, path: '/', badge: null },
    { name: 'Explore', icon: Search, path: '/explore', badge: null },
    { name: 'Notifications', icon: Bell, path: '/notifications', badge: 5 },
    { name: 'Messages', icon: MessageCircle, path: '/chat', badge: 3 },
    { name: 'Videos', icon: Video, path: '/videos', badge: null },
    { name: 'Bookmarks', icon: Bookmark, path: '/bookmarks', badge: null },
    { name: 'Communities', icon: Users, path: '/communities', badge: null },
    { name: 'Trending', icon: TrendingUp, path: '/trending', badge: null },
    { name: 'Profile', icon: User, path: `/profile/${user?.username}`, badge: null },
    { name: 'Settings', icon: Settings, path: '/settings', badge: null },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="p-4 space-y-2">
      {/* Create Post Button */}
      <button
        onClick={() => navigate('/create')}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 flex items-center justify-center space-x-2 mb-4"
      >
        <PlusCircle className="w-5 h-5" />
        <span>Create Post</span>
      </button>

      {/* Menu Items */}
      {menuItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);

        return (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              active
                ? 'bg-primary-50 text-primary-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className={`w-6 h-6 ${active ? 'text-primary-500' : ''}`} />
            <span className="flex-1 text-left">{item.name}</span>
            {item.badge && (
              <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* User Profile Card */}
      <div className="px-4 py-3 rounded-xl bg-gray-50">
        <div className="flex items-center space-x-3">
          <img
            src={user?.avatar || 'https://i.pravatar.cc/150'}
            alt={user?.username}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">@{user?.username}</p>
            <p className="text-sm text-gray-500">{user?.followers?.length || 0} followers</p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200"
      >
        <LogOut className="w-6 h-6" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default DesktopSidebar;
