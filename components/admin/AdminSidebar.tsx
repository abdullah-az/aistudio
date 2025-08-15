import React from 'react';
import { DashboardIcon } from '../icons/DashboardIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { QuestionMarkCircleIcon } from '../icons/QuestionMarkCircleIcon';

type AdminView = 'dashboard' | 'users' | 'questions';

interface AdminSidebarProps {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-gray-800/50 p-4 border-l border-gray-700 flex-shrink-0">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            لوحة التحكم
        </h2>
        <p className="text-sm text-gray-400">إدارة النظام</p>
      </div>
      <nav className="space-y-2">
        <NavItem
          icon={<DashboardIcon className="w-6 h-6" />}
          text="لوحة المعلومات"
          isActive={activeView === 'dashboard'}
          onClick={() => setActiveView('dashboard')}
        />
        <NavItem
          icon={<UsersIcon className="w-6 h-6" />}
          text="إدارة المستخدمين"
          isActive={activeView === 'users'}
          onClick={() => setActiveView('users')}
        />
        <NavItem
          icon={<QuestionMarkCircleIcon className="w-6 h-6" />}
          text="إدارة الأسئلة"
          isActive={activeView === 'questions'}
          onClick={() => setActiveView('questions')}
        />
      </nav>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, text, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right font-semibold transition-colors duration-200 ${
      isActive
        ? 'bg-indigo-600/30 text-indigo-300'
        : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
    }`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

export default AdminSidebar;