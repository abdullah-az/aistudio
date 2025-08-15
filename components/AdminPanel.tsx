import React, { useState } from 'react';
import type { User, Question } from '../types';
import AdminSidebar from './admin/AdminSidebar';
import DashboardView from './admin/DashboardView';
import UsersView from './admin/UsersView';
import QuestionsView from './admin/QuestionsView';

type AdminView = 'dashboard' | 'users' | 'questions';

interface AdminPanelProps {
    currentUser: User;
    questions: Question[];
    setQuestions: (questions: Question[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, questions, setQuestions }) => {
    const [activeView, setActiveView] = useState<AdminView>('dashboard');

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardView />;
            case 'users':
                return <UsersView currentUser={currentUser} />;
            case 'questions':
                return <QuestionsView questions={questions} setQuestions={setQuestions} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-indigo-500/10 border border-gray-700 min-h-[75vh] flex overflow-hidden">
            <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
};

export default AdminPanel;