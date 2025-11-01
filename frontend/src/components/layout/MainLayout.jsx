import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="max-w-lg mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
