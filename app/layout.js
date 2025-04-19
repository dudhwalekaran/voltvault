"use client";
import './globals.css';
import Sidebar from './sidebar/page';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Define the routes where the sidebar should appear
  const sidebarRoutes = ['/users', '/history', '/data-request', '/login-request',
    '/bus', '/excitation-system', '/generator', '/ibr', '/lcc-hvdc-link', '/load', '/series-capacitor',
    '/series-fact', '/shunt-capacitor', '/shunt-fact', '/shunt-reactor', '/single-line-diagram',
    '/transformer-three-winding', '/transformer-two-winding', '/transmission-line', '/turbine-governor',
    '/vsc-hvdc-link', '/profile', 
  ]; // Add more paths as necessary

  // Check if the current path should have the sidebar
  const showSidebar = sidebarRoutes.some(route => pathname.startsWith(route));

  return (
    <html lang="en">
      <body className="flex h-screen">
        {/* Render Sidebar only on specific routes */}
        {showSidebar && (
            <Sidebar />
        )}

        {/* Main content */}
        <div className={`flex-1 ${showSidebar ? 'm-5' : ''} overflow-auto`}>
          {children}
        </div>
      </body>
    </html>
  );
}
