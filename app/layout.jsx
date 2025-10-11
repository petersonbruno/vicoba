// app/layout.jsx
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export const metadata = {
  title: "VICOBA Admin Dashboard",
  description: "Admin dashboard for VICOBA (Hisa, Jamii, Mikopo)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 antialiased">
        <div className="min-h-screen flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Topbar />
            <main className="p-6 md:p-8 lg:p-10 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
