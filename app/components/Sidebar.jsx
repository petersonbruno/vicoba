"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BookOpen, CreditCard, Wallet } from "lucide-react";

const NavItem = ({ href, label, Icon }) => {
  const pathname = usePathname();
  const active = pathname?.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        active
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
      } text-sm`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {label}
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">VICOBA Admin</h1>

      <nav className="flex-1 flex flex-col gap-2">
        {/* Dashboard */}
        <NavItem href="/" label="Dashboard" Icon={Home} />

        {/* Members */}
        <NavItem href="/members" label="Members" Icon={Users} />
        {/* Attendence */}
        <NavItem href="/attendance" label="Attendances" Icon={Users} />

        {/* First Book */}
        <div className="mt-4">
          <span className="text-xs font-semibold text-gray-400 uppercase mb-2 block">
            First Book
          </span>
          <NavItem href="/first-book/hisa" label="Hisa" Icon={BookOpen} />
          <NavItem href="/first-book/jamii" label="Jamii" Icon={BookOpen} />
        </div>

        {/* Second Book */}
        <div className="mt-4">
          <span className="text-xs font-semibold text-gray-400 uppercase mb-2 block">
            Second Book
          </span>
          <NavItem
            href="/second-book/biashara"
            label="Mikopo - Biashara"
            Icon={CreditCard}
          />
          <NavItem
            href="/second-book/jamii"
            label="Mikopo - Jamii"
            Icon={Wallet}
          />
        </div>
        {/* Theard Book */}
        <div className="mt-4">
          <span className="text-xs font-semibold text-gray-400 uppercase mb-2 block">
            Account Book
          </span>
          <NavItem
            href="/weekly-summary"
            label="Weekly-Summary"
            Icon={CreditCard}
          />
          <NavItem
            href="*"
            label="Mikopo - Jamii"
            Icon={Wallet}
          />
        </div>
      </nav>
    </aside>
  );
}
