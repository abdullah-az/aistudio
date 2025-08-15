import React, { useState, useEffect } from 'react';
import * as adminService from '../../services/adminService';
import type { AdminDashboardData } from '../../services/adminService';
import { translations } from '../../utils/localization';
import Spinner from '../Spinner';
import { UsersIcon } from '../icons/UsersIcon';
import { BookOpenIcon } from '../icons/BookOpenIcon';
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { ClockIcon } from '../icons/ClockIcon';

const DashboardView: React.FC = () => {
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        adminService.getDashboardData().then(fetchedData => {
            setData(fetchedData);
            setIsLoading(false);
        }).catch(() => setIsLoading(false));
    }, []);

    if (isLoading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    if (!data) return <p className="text-center text-red-400">فشل في تحميل بيانات لوحة المعلومات.</p>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">لوحة المعلومات</h1>
                <p className="text-gray-400">نظرة عامة على إحصائيات وأنشطة المنصة.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="إجمالي المستخدمين" value={data.userCount} icon={<UsersIcon className="w-8 h-8" />} color="sky" />
                <StatCard title="إجمالي الأسئلة" value={data.questionCount} icon={<BookOpenIcon className="w-8 h-8" />} color="purple" />
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartCard title="تسجيل المستخدمين الجدد (آخر 7 أيام)" icon={<ChartBarIcon className="w-5 h-5" />}>
                        <RegistrationChart data={data.registrationTrend} />
                    </ChartCard>
                </div>
                <div>
                     <ActivityCard title="أحدث المستخدمين" icon={<ClockIcon className="w-5 h-5" />}>
                        <ul className="space-y-3">
                            {data.recentUsers.map(user => (
                                <li key={user.id} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-200">{user.email}</span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-600/30 text-purple-300' : 'bg-sky-600/30 text-sky-300'}`}>
                                        {user.role === 'admin' ? 'مشرف' : 'طالب'}
                                    </span>
                                </li>
                            ))}
                             {data.recentUsers.length === 0 && <p className="text-gray-500 text-center py-4">لا يوجد مستخدمون جدد.</p>}
                        </ul>
                    </ActivityCard>
                </div>
            </div>
             <ChartCard title="توزيع الأسئلة حسب النوع" icon={<ChartBarIcon className="w-5 h-5" />}>
                <QuestionTypeChart data={data.questionTypeDistribution} />
            </ChartCard>
        </div>
    );
};


// Sub-components for DashboardView

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: 'sky' | 'purple' }> = ({ title, value, icon, color }) => {
    const colors = {
        sky: 'from-sky-500 to-cyan-400',
        purple: 'from-purple-500 to-indigo-400',
    };
    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex items-center gap-6">
            <div className={`p-4 rounded-full bg-gradient-to-br ${colors[color]} text-white shadow-lg`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};

const ChartCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 h-full">
        <div className="flex items-center gap-2 text-gray-300 mb-4">
            {icon}
            <h3 className="font-semibold">{title}</h3>
        </div>
        {children}
    </div>
);

const ActivityCard = ChartCard; // Alias for similar structure

const RegistrationChart: React.FC<{ data: { date: string, count: number }[] }> = ({ data }) => {
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const dayFormatter = new Intl.DateTimeFormat('ar-EG', { weekday: 'short' });

    return (
        <div className="h-64 flex items-end justify-around gap-2 pt-4">
            {data.map(({ date, count }) => (
                <div key={date} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full h-full flex items-end">
                        <div
                            className="w-3/4 mx-auto bg-indigo-500 rounded-t-md group-hover:bg-indigo-400 transition-all duration-300"
                            style={{ height: `${(count / maxCount) * 100}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-white bg-gray-900 px-2 py-1 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            {count}
                          </div>
                        </div>
                    </div>
                    <span className="text-xs text-gray-400">{dayFormatter.format(new Date(date))}</span>
                </div>
            ))}
        </div>
    );
};

const QuestionTypeChart: React.FC<{ data: { type: string, count: number }[] }> = ({ data }) => {
    const totalCount = data.reduce((sum, item) => sum + item.count, 0);
    if (totalCount === 0) return <p className="text-gray-500 text-center py-10">لا توجد أسئلة لعرضها.</p>;
    
    return (
        <div className="space-y-3">
            {data.map(({type, count}) => (
                <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-gray-300">{translations[type] || type}</span>
                        <span className="text-gray-400">{count} سؤال</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                            className="bg-sky-500 h-2.5 rounded-full"
                            style={{ width: `${(count / totalCount) * 100}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default DashboardView;