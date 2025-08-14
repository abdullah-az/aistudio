import React, { useState } from 'react';
import { User } from '../types';
import * as authService from '../services/authService';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import Spinner from './Spinner';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { UserIcon } from './icons/UserIcon';


interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const demoUsers = authService.getDemoCredentials();

  const handleDemoLogin = (user: {email: string, password: string}) => {
    setEmail(user.email);
    setPassword(user.password);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isLoginView && password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }
    
    if(password.length < 6) {
        setError('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.');
        return;
    }

    setIsLoading(true);
    try {
      const user = isLoginView
        ? await authService.login(email, password)
        : await authService.register(email, password, role);
      onLoginSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-4" dir="rtl">
        <div className="w-full max-w-md">
             <div className="flex flex-col items-center mb-8">
                <BrainCircuitIcon className="w-16 h-16 text-indigo-400" />
                <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 mt-4">
                    منصة اختبار الهندسة المعلوماتية
                </h1>
                <p className="text-gray-400 mt-2">
                    {isLoginView ? 'سجل الدخول للمتابعة' : 'أنشئ حساباً جديداً للبدء'}
                </p>
            </div>

            <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-indigo-500/10 p-8 border border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            البريد الإلكتروني
                        </label>
                        <input
                            type="email" id="email" required
                            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-200 px-4 py-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                     <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                            كلمة المرور
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'} id="password" required
                                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-200 px-4 py-2"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 left-0 px-3 flex items-center text-gray-400 hover:text-gray-200"
                            >
                                {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
                            </button>
                        </div>
                    </div>
                    {!isLoginView && (
                        <>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                    تأكيد كلمة المرور
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'} id="confirmPassword" required
                                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-200 px-4 py-2"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">تسجيل كـ:</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <RoleButton text="طالب" isActive={role === 'user'} onClick={() => setRole('user')} />
                                    <RoleButton text="مشرف" isActive={role === 'admin'} onClick={() => setRole('admin')} />
                                </div>
                            </div>
                        </>
                    )}
                    
                    {error && (
                        <p className="text-sm text-red-400 bg-red-900/20 border border-red-500/50 rounded-md p-3 text-center">{error}</p>
                    )}

                    <div>
                         <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Spinner /> : (isLoginView ? 'تسجيل الدخول' : 'إنشاء حساب')}
                        </button>
                    </div>
                </form>

                 {isLoginView && (
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-800 text-gray-400">
                                    أو استخدم حساب تجريبي
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {demoUsers.map(user => (
                                <button
                                    key={user.email}
                                    type="button"
                                    onClick={() => handleDemoLogin(user)}
                                    className="w-full text-left p-4 rounded-lg bg-gray-900/50 border-2 border-gray-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${user.role === 'admin' ? 'bg-purple-600/20 text-purple-400' : 'bg-sky-600/20 text-sky-400'}`}>
                                            {user.role === 'admin' ? <ShieldCheckIcon className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white capitalize">{user.role === 'admin' ? 'مشرف' : 'طالب'}</p>
                                            <p className="text-sm text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-xs text-gray-500 bg-gray-800 p-2 rounded text-center">
                                        <p>كلمة المرور: <strong className="font-mono">{user.password}</strong></p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                <p className="mt-6 text-center text-sm text-gray-400">
                    {isLoginView ? 'ليس لديك حساب؟' : 'هل لديك حساب بالفعل؟'}
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(null); }} className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors mr-2">
                        {isLoginView ? 'أنشئ حساباً' : 'سجل الدخول'}
                    </button>
                </p>
            </div>
        </div>
    </div>
  );
};

const RoleButton = ({ text, isActive, onClick }: { text: string; isActive: boolean; onClick: () => void; }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full p-3 rounded-lg text-center font-semibold transition-all duration-200 border-2 ${
            isActive 
            ? 'bg-indigo-600/30 border-indigo-500 text-white' 
            : 'bg-gray-900/50 border-gray-600 text-gray-400 hover:border-gray-500'
        }`}
    >
        {text}
    </button>
);

export default Auth;