"use client";
import { useState } from "react";
import { Bell, Menu } from "lucide-react";

export default function Topbar({ onToggleSidebar }) {
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
          <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* User Avatar */}
        <div className="relative">
          <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <img
              src="/avatar.svg"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
            />
            <span className="hidden sm:inline text-gray-700 dark:text-white font-medium">
              Admin
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
