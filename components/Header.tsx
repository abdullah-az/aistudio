import React, { useState, useEffect } from 'react';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { UserIcon } from './icons/UserIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { ViewState, User, ExamState } from '../types';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';

interface HeaderProps {
    view: ViewState;
    setView: (view: ViewState) => void;
    user: User | null;
    onLogout: () => void;
    examState: ExamState;
}

const Header: React.FC<HeaderProps> = ({ view, setView, user, onLogout, examState }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isExamActive = examState === 'ACTIVE';
  
  // Close menu when view changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [view]);

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
            <button
                onClick={() => setView('EXAM')}
                disabled={isExamActive}
                className={`flex items-center gap-3 transition-opacity disabled:cursor-not-allowed disabled:opacity-70 hover:opacity-80`}
                aria-label="العودة إلى الصفحة الرئيسية"
            >
                <BrainCircuitIcon className="w-8 h-8 text-indigo-400" />
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400">
                    منصة اختبار الهندسة المعلوماتية
                </h1>
            </button>
            {user && (
                 <div className="flex items-center gap-4">
                    {/* Desktop Navigation */}
                    <nav className="hidden sm:flex items-center gap-2 p-1 rounded-full bg-gray-900/50 border border-gray-700">
                        <NavButton text="الاختبار" currentView={view} targetView="EXAM" setView={setView} disabled={isExamActive} />
                        <NavButton text="بنك الأسئلة" currentView={view} targetView="BANK" setView={setView} disabled={isExamActive} />
                        <NavButton text="الملف الشخصي" currentView={view} targetView="PROFILE" setView={setView} disabled={isExamActive} />
                        {user.role === 'admin' && (
                            <NavButton 
                                text="لوحة التحكم" 
                                currentView={view} 
                                targetView="ADMIN" 
                                setView={setView}
                                icon={<ShieldCheckIcon className="w-4 h-4" />}
                                disabled={isExamActive}
                            />
                        )}
                    </nav>
                     <div className="flex items-center gap-2">
                        <button
                            onClick={() => setView('PROFILE')}
                            title="الملف الشخصي"
                            disabled={isExamActive}
                            className={`flex items-center gap-2 text-sm rounded-full p-2 transition-colors ${
                                view === 'PROFILE'
                                    ? 'bg-indigo-600/20 text-indigo-300'
                                    : 'text-gray-300 hover:bg-gray-700/50'
                            } ${isExamActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                             <UserIcon className="w-5 h-5"/>
                             <span className="hidden md:inline">{user.email}</span>
                        </button>
                        <button
                            onClick={onLogout}
                            title="تسجيل الخروج"
                            className="p-2 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        >
                           <LogoutIcon className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Mobile Menu Button */}
                    <div className="sm:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-300 hover:bg-gray-700">
                           {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>
                    </div>
                 </div>
            )}
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && user && (
            <nav className="sm:hidden mt-4 bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-2">
                <NavButton text="الاختبار" currentView={view} targetView="EXAM" setView={setView} disabled={isExamActive} isMobile={true} />
                <NavButton text="بنك الأسئلة" currentView={view} targetView="BANK" setView={setView} disabled={isExamActive} isMobile={true} />
                <NavButton text="الملف الشخصي" currentView={view} targetView="PROFILE" setView={setView} disabled={isExamActive} isMobile={true} />
                {user.role === 'admin' && (
                    <NavButton 
                        text="لوحة التحكم" 
                        currentView={view} 
                        targetView="ADMIN" 
                        setView={setView}
                        icon={<ShieldCheckIcon className="w-4 h-4" />}
                        disabled={isExamActive}
                        isMobile={true}
                    />
                )}
            </nav>
        )}
      </div>
    </header>
  );
};

interface NavButtonProps {
    text: string;
    currentView: ViewState;
    targetView: ViewState;
    setView: (view: ViewState) => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    isMobile?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ text, currentView, targetView, setView, icon, disabled, isMobile }) => (
     <button 
        onClick={() => setView(targetView)}
        disabled={disabled}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isMobile ? 'justify-start' : 'py-1.5 rounded-full'
        } ${
            currentView === targetView ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-700/50'
        }`}
    >
        {icon}
        {text}
    </button>
);


export default Header;