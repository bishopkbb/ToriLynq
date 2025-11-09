import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Import actual page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ConversationPage from './pages/ConversationPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import BookmarksPage from './pages/BookmarksPage';
import CommunitiesPage from './pages/CommunitiesPage';
import SettingsPage from './pages/SettingsPage';
import VideosPage from './pages/VideosPage';
import TrendingPage from './pages/TrendingPage';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/videos"
          element={
            <ProtectedRoute>
              <VideosPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <BookmarksPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/communities"
          element={
            <ProtectedRoute>
              <CommunitiesPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/trending"
          element={
            <ProtectedRoute>
              <TrendingPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/chat/:conversationId"
          element={
            <ProtectedRoute>
              <ConversationPage />
            </ProtectedRoute>
          }
        />

        <Route
  path="/settings"
  element={
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  }
/>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;