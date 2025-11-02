import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import DesktopSidebar from './DesktopSidebar';
import RightSidebar from './RightSidebar';

const ResponsiveLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Always visible */}
      <Header />

      <div className="flex justify-center">
        {/* Left Sidebar - Hidden on mobile, visible on desktop */}
        <aside className="hidden lg:block w-64 xl:w-72 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200 bg-white">
          <DesktopSidebar />
        </aside>

        {/* Main Content - Responsive width */}
        <main className="w-full lg:ml-64 xl:ml-72 lg:mr-80 xl:mr-96 pb-20 lg:pb-0">
          <div className="max-w-2xl mx-auto">
            {children}
          </div>
        </main>

        {/* Right Sidebar - Hidden on mobile/tablet, visible on desktop */}
        <aside className="hidden lg:block w-80 xl:w-96 fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto border-l border-gray-200 bg-white">
          <RightSidebar />
        </aside>
      </div>

      {/* Bottom Nav - Only on mobile/tablet */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default ResponsiveLayout;
