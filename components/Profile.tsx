import React, { useState } from 'react';
import { User, UserStats } from '../types';
import * as storage from '../services/storageService';
import { LogoutIcon } from './icons/LogoutIcon';
import { UserIcon } from './icons/UserIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { TargetIcon } from './icons/TargetIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';


interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [stats, setStats] = useState<UserStats>(storage.getUserStats(user.id));
  
  const handleResetStats = () => {
      if(window.confirm("هل أنت متأكد من رغبتك في إعادة تعيين إحصائياتك؟ لا يمكن التراجع عن هذا الإجراء.")) {
          storage.resetUserStats(user.id);
          setStats(storage.getUserStats(user.id)); // Refresh stats in UI
      }
  }
  
  const averageScore = stats.totalQuestionsAnswered > 0 
    ? ((stats.correctAnswers / stats.totalQuestionsAnswered) * 100).toFixed(1)
    : 0;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-indigo-500/10 p-6 md:p-8 border border-gray-700">
      {/* User Info Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-gray-700">
        <div className="p-4 bg-gray-900/50 rounded-full border-2 border-indigo-500 flex-shrink-0">
           <UserIcon className="w-16 h-16 text-indigo-400" />
        </div>
        <div className="text-center md:text-right">
            <h2 className="text-2xl font-bold text-gray-100">{user.email}</h2>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${user.role === 'admin' ? 'bg-purple-600/30 text-purple-300' : 'bg-sky-600/30 text-sky-300'}`}>
                    {user.role === 'admin' ? 'مشرف' : 'طالب'}
                </span>
                <span className="text-sm text-gray-400">
                    تاريخ الانضمام: {new Date(user.joinDate).toLocaleDateString('ar-EG')}
                </span>
            </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full mt-8">
           <h3 className="text-lg font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-6">
                إحصائيات الأداء
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard 
                    icon={<ClipboardListIcon className="w-7 h-7" />} 
                    label="الاختبارات المنجزة" 
                    value={stats.examsTaken}
                    color="sky"
                />
                 <StatCard 
                    icon={<TargetIcon className="w-7 h-7" />} 
                    label="متوسط الدقة" 
                    value={`${averageScore}%`}
                    color="green"
                />
                <StatCard 
                    icon={<CheckBadgeIcon className="w-7 h-7" />} 
                    label="الإجابات الصحيحة" 
                    value={stats.correctAnswers}
                    color="yellow"
                />
           </div>
      </div>
      
      {/* Actions Section */}
      <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-center gap-4">
           <button
                onClick={handleResetStats}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-600/20 text-yellow-400 font-semibold py-2 px-4 rounded-lg border border-yellow-500/50 hover:bg-yellow-600/30 hover:text-yellow-300 transition-colors"
            >
                <TrashIcon className="w-4 h-4"/>
                إعادة تعيين الإحصائيات
            </button>
            <button
                onClick={onLogout}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-red-600/20 text-red-400 font-semibold py-2 px-4 rounded-lg border border-red-500/50 hover:bg-red-600/40 hover:text-red-300 transition-colors"
            >
                <LogoutIcon className="w-5 h-5"/>
                تسجيل الخروج
            </button>
      </div>
    </div>
  );
};

// StatCard sub-component
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: 'sky' | 'green' | 'yellow';
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
    const colors = {
        sky: 'bg-sky-600/20 text-sky-400',
        green: 'bg-green-600/20 text-green-400',
        yellow: 'bg-yellow-600/20 text-yellow-400'
    };
    
    return (
        <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-700 flex items-center gap-4">
            <div className={`p-3 rounded-full ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-400">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};

export default Profile;