"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "/image/dashboard.png", href: "/" },
  { id: "wanachama", label: "Wanachama", icon: "/image/group-users.png", href: "/wanachama" },
  { id: "hisa", label: "Hisa na Jamii", icon: "/image/accounts.png", href: "/first-book/hisa" },
  { id: "mikopo", label: "Mikopo", icon: "/image/loan.png", href: "/second-book/biashara" },
  { id: "reports", label: "Reports", icon: "/image/bar-chart.png", href: "/reports" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[288px] h-screen bg-white flex flex-col">
      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <span className="text-4xl">👤</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-black leading-[1.26]">Peterson Bruno</h3>
            <p className="text-base text-[rgba(0,0,0,0.4)] leading-[1.26]">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 pt-8">
        {menuItems.map((item) => {
          // Check if current path matches the href or starts with it (for nested routes)
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href)) ||
            (item.href === "/" && pathname === "/");
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-[10px] mb-2 transition-colors ${
                isActive
                  ? "bg-[rgba(52,124,255,0.2)] text-black"
                  : "text-[rgba(0,0,0,0.6)] hover:bg-gray-50"
              }`}
            >
              <Image 
                src={item.icon} 
                alt={item.label} 
                width={24} 
                height={24} 
                className="w-6 h-6"
              />
              <span className="font-bold text-base leading-[1.26]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <button className="w-full flex items-center gap-4 px-4 py-4 rounded-[10px] text-[rgba(0,0,0,0.6)] hover:bg-gray-50">
            <Image 
              src="/image/gear.png" 
              alt="Mpangilio" 
              width={24} 
              height={24} 
              className="w-6 h-6"
            />
            <span className="font-bold text-base leading-[1.26]">Mpangilio</span>
          </button>
        </div>
        <div>
          <button className="w-full flex items-center gap-4 px-4 py-4 rounded-[10px] text-[rgba(0,0,0,0.6)] hover:bg-gray-50">
            <Image 
              src="/image/out.png" 
              alt="Ondoka" 
              width={24} 
              height={24} 
              className="w-6 h-6"
            />
            <span className="font-bold text-base leading-[1.26] opacity-60">Ondoka</span>
          </button>
        </div>
        <div className="mt-6 flex items-center gap-3 px-4 py-3 bg-[rgba(52,124,255,0.2)] rounded-[10px]">
          <Image 
            src="/image/customer-support.png" 
            alt="Msaada" 
            width={24} 
            height={24} 
            className="w-6 h-6"
          />
          <span className="font-semibold text-base text-[rgba(0,0,0,0.6)] leading-[1.26]">Msaada</span>
        </div>
      </div>
    </div>
  );
}
