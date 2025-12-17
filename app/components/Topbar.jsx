"use client";
import { useState } from "react";
import { Bell, Menu, Settings, User, LogOut } from "lucide-react";

export default function Topbar({ onToggleSidebar }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationCount] = useState(5); // Example notification count
  const [profileNotificationCount] = useState(2); // Example profile notification count
  const [settingsNotificationCount] = useState(1); // Example settings notification count

  return (
    <header className="flex items-center justify-between bg-white dark:bg-darkgray px-6 py-4 shadow-sm border-b border-gray-200 dark:border-gray-700">
      
      {/* Left: Hamburger & Page Title */}
      <div className="flex items-center gap-4">
        {/* Hamburger for mobile */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-white" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Dashboard
        </h2>
      </div>

      {/* Right: Notifications & User */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </button>

        {/* User Avatar with Profile Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="relative flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <img
              src="/avatar.svg"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
            />
            {profileNotificationCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                {profileNotificationCount > 99 ? '99+' : profileNotificationCount}
              </span>
            )}
            <span className="hidden sm:inline text-gray-700 dark:text-white font-medium">
              Admin
            </span>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-darkgray rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              {/* Profile Option */}
              <button className="relative w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="flex-1 text-gray-700 dark:text-white font-medium">Profile</span>
                {profileNotificationCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {profileNotificationCount > 99 ? '99+' : profileNotificationCount}
                  </span>
                )}
              </button>

              {/* Settings Option */}
              <button className="relative w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="flex-1 text-gray-700 dark:text-white font-medium">Settings</span>
                {settingsNotificationCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {settingsNotificationCount > 99 ? '99+' : settingsNotificationCount}
                  </span>
                )}
              </button>

              {/* Divider */}
              <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>

              {/* Logout Option */}
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-700 dark:text-white font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        ></div>
      )}
    </header>
  );
}
