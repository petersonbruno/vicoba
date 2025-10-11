// components/Sidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItem = ({ href, label }) => {
  const pathname = usePathname();
  const active = pathname?.startsWith(href);
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg text-sm ${
        active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-72 hidden md:block border-r border-gray-200 bg-white">
      <div className="p-6">
        <div className="text-xl font-semibold mb-6">VICOBA Admin</div>

        <nav className="space-y-1">
          <NavItem href="/" label="Dashboard" />
          <NavItem href="/members" label="Members" />
          <div className="mt-4 text-xs text-gray-400 px-4">First Book</div>
          <NavItem href="/first-book/hisa" label="Hisa" />
          <NavItem href="/first-book/jamii" label="Jamii" />
          <div className="mt-4 text-xs text-gray-400 px-4">Second Book</div>
          <NavItem href="/second-book/biashara" label="Mikopo - Biashara" />
          <NavItem href="/second-book/jamii" label="Mikopo - Jamii" />
        </nav>
      </div>
    </aside>
  );
}
