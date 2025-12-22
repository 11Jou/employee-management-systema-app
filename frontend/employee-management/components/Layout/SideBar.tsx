'use client';


import { House, Building2 ,LayoutPanelTop,  LogOut, Menu, User, CircleUserRound} from 'lucide-react';
import { AuthService } from '../../services/HttpClient';
import { useSyncExternalStore } from 'react';

  
  import Link from 'next/link';
  import { LucideIcon } from 'lucide-react';
  
  interface MenuItem {
    icon: LucideIcon;
    title: string;
    href: string;
  }
  
  interface SideBarProps {
    isOpen: boolean;
    onToggle: () => void;
    isMobile?: boolean;
  }
  
  const subscribe = () => () => {};
  const getSnapshot = () => AuthService.getUserRole();
  const getServerSnapshot = () => null;

  export default function SideBar({ isOpen, onToggle, isMobile = false }: SideBarProps) {

    const userRole = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    

    const menuItemsAdmin: MenuItem[] = [
      { icon: House, title: "Dashboard", href: "/dashboard" },
      { icon: Building2 , title: "Companies", href: "/dashboard/companies" },
      { icon: LayoutPanelTop, title: "Departments", href: "/dashboard/departments" },
      { icon: User, title: "Employees", href: "/dashboard/employees" },
      { icon: User, title: "Hired Employees", href: "/dashboard/hired-employees" },
      { icon: CircleUserRound, title: "User Accounts", href: "/dashboard/user-accounts" },

    ];
    const menuItemsManager: MenuItem[] =[
      { icon: House, title: "Dashboard", href: "/dashboard" },
      { icon: Building2 , title: "Companies", href: "/dashboard/companies" },
      { icon: LayoutPanelTop, title: "Departments", href: "/dashboard/departments" },
      { icon: User, title: "Employees", href: "/dashboard/employees" },
      { icon: User, title: "Hired Employees", href: "/dashboard/hired-employees" },
    ];
  
    return (
      <div className={`${
        isMobile 
          ? isOpen ? 'translate-x-0' : '-translate-x-full' 
          : ''
      } ${isOpen ? 'w-64' : 'w-20'} h-screen bg-[#225199] rounded-r-l flex flex-col fixed pt-8 transition-all duration-300 ${
        isMobile ? 'z-40' : 'z-10'
      }`}>
  
        <div className={`mb-6 flex items-center ${isOpen ? 'justify-between px-4' : 'flex-col gap-2'}`}>
          {isOpen ? (
            <h1 className="text-3xl font-normal text-white">Dashboard</h1>
          ) : (
            <h1 className="text-2xl font-bold text-white">D</h1>
          )}
          
          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Menu className="text-white" size={20} />
          </button>
        </div>
  
        <div className="flex flex-col flex-1 gap-2">
          {(userRole === 'admin' ? menuItemsAdmin : menuItemsManager).map((item, index) => {
            const Icon = item.icon;
  
            return (
              <Link
                key={index}
                href={item.href}
                className={`group flex items-center ${isOpen ? 'gap-4 px-4' : 'justify-center px-0'} py-2 rounded-lg hover:bg-white transition-colors cursor-pointer`}
                title={!isOpen ? item.title : undefined}>
                <Icon className="text-white group-hover:text-black" size={20} />
                {isOpen && (
                  <span className="text-white text-m font-regular font-inter group-hover:text-black">{item.title}</span>
                )}
              </Link>
            );
          })}
        </div>
  
        <div className={`flex items-center ${isOpen ? 'gap-2 px-4 justify-between' : 'justify-center px-2'} py-2 mb-4 mx-4 rounded-md bg-white cursor-pointer hover:bg-gray-300 transition-colors`}
        onClick={() => AuthService.logout()}
             title={!isOpen ? "Logout" : undefined}>
          {isOpen && <span className="text-black text-m font-regular font-inter">Logout</span>}
          <LogOut className="text-black" size={20} />
        </div>
      </div>
    );
  }