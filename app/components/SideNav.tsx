'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  Users, 
  Settings, 
  Globe 
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  {
    label: '展板',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/dashboard',
  },
  {
    label: '对话',
    icon: <MessageSquare className="w-5 h-5" />,
    path: '/'
  },
  {
    label: '历史',
    icon: <History className="w-5 h-5" />,
    path: '/history'
  },
  {
    label: '访客',
    icon: <Users className="w-5 h-5" />,
    path: '/visitors',
  },
  {
    label: 'AI设置',
    icon: <Settings className="w-5 h-5" />,
    path: '/ai-settings'
  },
  {
    label: '公共设置',
    icon: <Globe className="w-5 h-5" />,
    path: '/public-settings',
  }
];

const SideNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-48 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-800">AI客服系统</h1>
      </div>
      <nav className="flex-1 px-2 py-4">
        {navItems.map((item) => (
          (item.label === '展板' || item.label === '访客' || item.label === '公共设置') ? (
            <button
              key={item.path}
              type="button"
              className={`flex items-center w-full text-left px-4 py-3 mb-2 rounded-lg hover:bg-gray-100 cursor-pointer ${pathname === item.path ? 'bg-gray-100' : ''}`}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                // 可加点击反馈
              }}
            >
              <span className="text-gray-600">{item.icon}</span>
              <span className="ml-3 text-gray-700">{item.label}</span>
            </button>
          ) : (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center px-4 py-3 mb-2 rounded-lg
                hover:bg-gray-100 cursor-pointer
                ${pathname === item.path ? 'bg-gray-100' : ''}
              `}
            >
              <span className="text-gray-600">{item.icon}</span>
              <span className="ml-3 text-gray-700">{item.label}</span>
            </Link>
          )
        ))}
      </nav>
    </div>
  );
};

export default SideNav; 