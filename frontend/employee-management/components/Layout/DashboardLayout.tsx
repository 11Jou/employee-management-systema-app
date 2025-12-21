import SideBar from "./SideBar";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Avatar from "./Avatar";
import { AuthService } from "../../services/HttpClient";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const userName = AuthService.getUserName();
  const userRole = AuthService.getUserRole();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
      
      <SideBar isOpen={isSidebarOpen} onToggle={toggleSidebar} isMobile={isMobile} />
      
      <div className="flex-1 flex flex-col h-full w-full md:w-auto">
        <div 
          className={`bg-white fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${
            isMobile
              ? 'h-auto py-3 px-3'
              : 'h-16 py-0'
          } ${
            !isMobile && isSidebarOpen 
              ? 'md:left-64 md:w-[calc(100%-256px)]' 
              : !isMobile && !isSidebarOpen
                ? 'md:left-20 md:w-[calc(100%-80px)]'
                : ''
          } ${
            isMobile ? 'flex-col gap-3' : 'flex-row gap-4'
          } flex items-center justify-between px-4 md:px-6`}>
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="flex items-center justify-between w-full mb-2">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg bg-[#1A2530] hover:bg-[#2A3540] transition-colors"
                aria-label="Toggle menu">
                <Menu className="text-white" size={20} />
              </button>
              <span className="text-lg font-semibold text-[#1A2530]">Dashboard</span>
            </div>
          )}

        <div className="flex items-center w-full justify-end">
            <Avatar name={userName || 'Admin User'} title={userRole || 'Administrator'} />
          </div>
        </div>
        
        <div 
          className={`flex-1 overflow-y-auto transition-all duration-300 px-3 sm:px-4 md:px-6 pt-6 ${
            isMobile
              ? 'ml-0 mt-[170px]'
              : isSidebarOpen 
                ? 'md:ml-64 mt-20' 
                : 'md:ml-20 mt-20'
          }`}>
          {children}
        </div>
      </div>
    </div>
  );
}