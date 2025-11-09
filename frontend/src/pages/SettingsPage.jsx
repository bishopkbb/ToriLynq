import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  User, Lock, Bell, Shield, Eye, Globe, Palette,
  HelpCircle, Info, LogOut, ChevronRight, Moon,
  Sun, Languages, MapPin, Mail, Smartphone, Monitor,
  Download, Upload, Trash2, AlertCircle, CheckCircle
} from 'lucide-react';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import { logout, updateUser } from '../store/slices/authSlice';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [activeSection, setActiveSection] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
    messages: true,
    email: true,
    push: false,
  });
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showLocation: true,
    allowMessages: 'everyone', // everyone, followers, none
    allowTags: true,
  });

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/login');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you ABSOLUTELY sure? This action cannot be undone!')) {
      if (window.confirm('Last chance! This will permanently delete your account and all data.')) {
        // TODO: API call to delete account
        console.log('Delete account');
        dispatch(logout());
        navigate('/login');
      }
    }
  };

  const SettingsSection = ({ icon: Icon, title, description, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );

  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-primary-500' : 'bg-gray-300'
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-16 bg-white border-b border-gray-200 p-4 z-10">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Main Settings Menu */}
          {activeSection === null && (
            <div className="divide-y divide-gray-200">
              {/* Account Section */}
              <div className="p-4">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Account
                </h2>
                <div className="space-y-2">
                  <SettingsSection
                    icon={User}
                    title="Edit Profile"
                    description="Update your profile information"
                    onClick={() => navigate('/profile')}
                  />
                  <SettingsSection
                    icon={Lock}
                    title="Account Security"
                    description="Password, 2FA, and security"
                    onClick={() => setActiveSection('security')}
                  />
                  <SettingsSection
                    icon={Shield}
                    title="Privacy"
                    description="Control who can see your content"
                    onClick={() => setActiveSection('privacy')}
                  />
                </div>
              </div>

              {/* Preferences Section */}
              <div className="p-4">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Preferences
                </h2>
                <div className="space-y-2">
                  <SettingsSection
                    icon={Bell}
                    title="Notifications"
                    description="Manage notification preferences"
                    onClick={() => setActiveSection('notifications')}
                  />
                  <SettingsSection
                    icon={Palette}
                    title="Appearance"
                    description="Theme and display settings"
                    onClick={() => setActiveSection('appearance')}
                  />
                  <SettingsSection
                    icon={Languages}
                    title="Language & Region"
                    description="English · Nigeria"
                    onClick={() => setActiveSection('language')}
                  />
                </div>
              </div>

              {/* Data & Storage Section */}
              <div className="p-4">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Data & Storage
                </h2>
                <div className="space-y-2">
                  <SettingsSection
                    icon={Download}
                    title="Download Your Data"
                    description="Get a copy of your ToriLynq data"
                    onClick={() => alert('Data export will be emailed to you')}
                  />
                  <SettingsSection
                    icon={Upload}
                    title="Data Usage"
                    description="Manage storage and bandwidth"
                    onClick={() => setActiveSection('data')}
                  />
                </div>
              </div>

              {/* Support Section */}
              <div className="p-4">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Support & About
                </h2>
                <div className="space-y-2">
                  <SettingsSection
                    icon={HelpCircle}
                    title="Help Center"
                    description="Get help and support"
                    onClick={() => window.open('https://help.torilynq.com', '_blank')}
                  />
                  <SettingsSection
                    icon={Info}
                    title="About ToriLynq"
                    description="Version 1.0.0"
                    onClick={() => setActiveSection('about')}
                  />
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-4">
                <h2 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-3">
                  Danger Zone
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors rounded-lg border border-red-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-red-900">Logout</h3>
                        <p className="text-sm text-red-600">Sign out of your account</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors rounded-lg border border-red-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-red-900">Delete Account</h3>
                        <p className="text-sm text-red-600">Permanently delete your account</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <div>
              <button
                onClick={() => setActiveSection(null)}
                className="p-4 text-primary-500 font-semibold hover:underline"
              >
                ← Back
              </button>
              <div className="p-4 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Notification Preferences</h2>
                  <p className="text-sm text-gray-600">Choose what you want to be notified about</p>
                </div>

                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">{key}</h3>
                        <p className="text-sm text-gray-600">
                          Get notified about new {key}
                        </p>
                      </div>
                      <Toggle
                        enabled={value}
                        onChange={(val) => setNotifications({ ...notifications, [key]: val })}
                      />
                    </div>
                  ))}
                </div>

                <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeSection === 'privacy' && (
            <div>
              <button
                onClick={() => setActiveSection(null)}
                className="p-4 text-primary-500 font-semibold hover:underline"
              >
                ← Back
              </button>
              <div className="p-4 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Privacy & Security</h2>
                  <p className="text-sm text-gray-600">Control your privacy settings</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Public Profile</h3>
                      <p className="text-sm text-gray-600">Anyone can view your profile</p>
                    </div>
                    <Toggle
                      enabled={privacy.profilePublic}
                      onChange={(val) => setPrivacy({ ...privacy, profilePublic: val })}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Show Email</h3>
                      <p className="text-sm text-gray-600">Display email on profile</p>
                    </div>
                    <Toggle
                      enabled={privacy.showEmail}
                      onChange={(val) => setPrivacy({ ...privacy, showEmail: val })}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Show Location</h3>
                      <p className="text-sm text-gray-600">Display location on posts</p>
                    </div>
                    <Toggle
                      enabled={privacy.showLocation}
                      onChange={(val) => setPrivacy({ ...privacy, showLocation: val })}
                    />
                  </div>

                  <div className="py-3">
                    <h3 className="font-semibold text-gray-900 mb-2">Who can message you?</h3>
                    <div className="space-y-2">
                      {['everyone', 'followers', 'none'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setPrivacy({ ...privacy, allowMessages: option })}
                          className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                            privacy.allowMessages === option
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="font-medium text-gray-900 capitalize">{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeSection === 'appearance' && (
            <div>
              <button
                onClick={() => setActiveSection(null)}
                className="p-4 text-primary-500 font-semibold hover:underline"
              >
                ← Back
              </button>
              <div className="p-4 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Appearance</h2>
                  <p className="text-sm text-gray-600">Customize how ToriLynq looks</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <Moon className="w-5 h-5" />
                        <span>Dark Mode</span>
                      </h3>
                      <p className="text-sm text-gray-600">Switch to dark theme</p>
                    </div>
                    <Toggle enabled={darkMode} onChange={setDarkMode} />
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-900">
                        Dark mode is coming in the next update! We're working on a beautiful dark theme for you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* About Section */}
          {activeSection === 'about' && (
            <div>
              <button
                onClick={() => setActiveSection(null)}
                className="p-4 text-primary-500 font-semibold hover:underline"
              >
                ← Back
              </button>
              <div className="p-4 space-y-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl mx-auto flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">TL</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">ToriLynq</h2>
                  <p className="text-gray-600 mb-1">Where Stories Connect</p>
                  <p className="text-sm text-gray-500">Version 1.0.0</p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-primary-500">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">You're all up to date!</span>
                </div>
                <div className="pt-4 space-y-2 text-sm text-gray-600">
                  <p>© 2025 ToriLynq. All rights reserved.</p>
                  <div className="flex items-center justify-center space-x-4">
                    <button className="hover:text-primary-500 transition-colors">Terms</button>
                    <span>•</span>
                    <button className="hover:text-primary-500 transition-colors">Privacy</button>
                    <span>•</span>
                    <button className="hover:text-primary-500 transition-colors">Contact</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default SettingsPage;