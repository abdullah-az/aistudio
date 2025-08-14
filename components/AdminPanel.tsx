import React, { useState, useEffect, useMemo } from 'react';
import * as adminService from '../services/adminService';
import * as authService from '../services/authService';
import type { AdminStats } from '../services/adminService';
import type { User, Question, QuestionType } from '../types';
import Spinner from './Spinner';
import { UsersIcon } from './icons/UsersIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import EditQuestionModal from './modals/EditQuestionModal';
import ConfirmDialog from './modals/ConfirmDialog';

type AdminTab = 'dashboard' | 'users' | 'questions';

interface AdminPanelProps {
    currentUser: User;
    questions: Question[];
    setQuestions: (questions: Question[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, questions, setQuestions }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    
    return (
        <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-indigo-500/10 p-6 md:p-8 border border-gray-700">
            <div className="mb-6 pb-4 border-b border-gray-700">
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                    لوحة تحكم المشرف
                </h2>
                <p className="text-gray-400 mt-1">إدارة شاملة للمستخدمين والأسئلة ومراقبة النظام.</p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-700 mb-6">
                <TabButton text="لوحة المعلومات" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <TabButton text="إدارة المستخدمين" isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                <TabButton text="إدارة الأسئلة" isActive={activeTab === 'questions'} onClick={() => setActiveTab('questions')} />
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'dashboard' && <DashboardTab questionCount={questions.length} />}
                {activeTab === 'users' && <UsersTab currentUser={currentUser} />}
                {activeTab === 'questions' && <QuestionsTab questions={questions} setQuestions={setQuestions} />}
            </div>
        </div>
    );
};

const TabButton: React.FC<{text: string, isActive: boolean, onClick: () => void}> = ({ text, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 border-b-2 ${
            isActive
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
        }`}
    >
        {text}
    </button>
);


// Dashboard Tab Component
const DashboardTab: React.FC<{questionCount: number}> = ({questionCount}) => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        adminService.getDashboardStats().then(fetchedStats => {
            setStats({...fetchedStats, questionCount});
            setIsLoading(false);
        });
    }, [questionCount]);
    
    if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <StatCard title="إجمالي المستخدمين" value={stats?.userCount.toString() ?? '0'} icon={<UsersIcon className="w-8 h-8" />} />
           <StatCard title="إجمالي الأسئلة" value={stats?.questionCount.toString() ?? '0'} icon={<BookOpenIcon className="w-8 h-8" />} />
        </div>
    );
};

// Users Tab Component
const UsersTab: React.FC<{ currentUser: User }> = ({ currentUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    useEffect(() => {
        setUsers(authService.getAllUsers());
        setIsLoading(false);
    }, []);

    const handleRoleChange = (user: User, newRole: 'admin' | 'user') => {
        authService.updateUser(user.id, { role: newRole });
        setUsers(authService.getAllUsers());
    };
    
    const handleDeleteUser = (userId: string) => {
        authService.deleteUser(userId);
        setUsers(authService.getAllUsers());
        setUserToDelete(null);
    };

    if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;

    return (
        <>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">البريد الإلكتروني</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">الدور</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">تاريخ الانضمام</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-800/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user, e.target.value as 'admin' | 'user')}
                                        disabled={user.id === currentUser.id}
                                        className="bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                                    >
                                        <option value="user">طالب</option>
                                        <option value="admin">مشرف</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(user.joinDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button 
                                        onClick={() => setUserToDelete(user)}
                                        disabled={user.id === currentUser.id}
                                        className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="حذف المستخدم"
                                    >
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {userToDelete && (
                <ConfirmDialog
                    isOpen={!!userToDelete}
                    title="تأكيد الحذف"
                    message={`هل أنت متأكد من رغبتك في حذف المستخدم ${userToDelete.email}؟ لا يمكن التراجع عن هذا الإجراء.`}
                    onConfirm={() => handleDeleteUser(userToDelete.id)}
                    onCancel={() => setUserToDelete(null)}
                />
            )}
        </>
    );
};


// Questions Tab Component
const QuestionsTab: React.FC<{ questions: Question[]; setQuestions: (q: Question[]) => void; }> = ({ questions, setQuestions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

    const filteredQuestions = useMemo(() => 
        questions.filter(q => q.question.toLowerCase().includes(searchTerm.toLowerCase())),
        [questions, searchTerm]
    );
    
    const openAddModal = () => {
        setEditingQuestion(null);
        setIsModalOpen(true);
    };

    const openEditModal = (question: Question) => {
        setEditingQuestion(question);
        setIsModalOpen(true);
    };

    const handleSaveQuestion = (question: Question) => {
        let updatedQuestions;
        if (editingQuestion) { // Update existing
            updatedQuestions = questions.map(q => q.id === question.id ? question : q);
        } else { // Add new
            updatedQuestions = [...questions, { ...question, id: crypto.randomUUID() }];
        }
        setQuestions(updatedQuestions);
        setIsModalOpen(false);
        setEditingQuestion(null);
    };

    const handleDeleteQuestion = (questionId: string) => {
        const updatedQuestions = questions.filter(q => q.id !== questionId);
        setQuestions(updatedQuestions);
        setQuestionToDelete(null);
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                    type="text"
                    placeholder="ابحث عن سؤال..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow w-full bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-200 px-4 py-2"
                />
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5"/>
                    إضافة سؤال
                </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {filteredQuestions.length > 0 ? filteredQuestions.map(q => (
                    <div key={q.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                        <div className="flex-1">
                            <p className="font-semibold text-white">{q.question}</p>
                            <p className="text-sm text-gray-400">النوع: {q.type} - الإجابة: {q.answer}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <button onClick={() => openEditModal(q)} className="p-2 text-yellow-400 hover:text-yellow-300 rounded-full hover:bg-yellow-500/10"><PencilIcon className="w-5 h-5"/></button>
                            <button onClick={() => setQuestionToDelete(q)} className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-red-500/10"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-8">لا توجد أسئلة تطابق بحثك.</p>
                )}
            </div>
             {isModalOpen && (
                <EditQuestionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveQuestion}
                    question={editingQuestion}
                />
            )}
            {questionToDelete && (
                 <ConfirmDialog
                    isOpen={!!questionToDelete}
                    title="تأكيد الحذف"
                    message={`هل أنت متأكد من رغبتك في حذف السؤال: "${questionToDelete.question}"؟`}
                    onConfirm={() => handleDeleteQuestion(questionToDelete.id)}
                    onCancel={() => setQuestionToDelete(null)}
                />
            )}
        </>
    );
};


// StatCard sub-component
interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}
const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 flex items-center gap-6">
        <div className="bg-indigo-600/20 text-indigo-400 p-4 rounded-full">
           {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    </div>
);

export default AdminPanel;