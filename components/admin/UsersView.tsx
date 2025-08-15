import React, { useState, useMemo, useEffect } from 'react';
import * as authService from '../../services/authService';
import type { User } from '../../types';
import Spinner from '../Spinner';
import { TrashIcon } from '../icons/TrashIcon';
import { PlusIcon } from '../icons/PlusIcon';
import ConfirmDialog from '../modals/ConfirmDialog';
import AddUserModal from '../modals/AddUserModal';
import Pagination from './Pagination';

const USERS_PER_PAGE = 8;

const UsersView: React.FC<{ currentUser: User }> = ({ currentUser }) => {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        setAllUsers(authService.getAllUsers());
        setIsLoading(false);
    }, []);
    
    const refreshUsers = () => {
        setAllUsers(authService.getAllUsers());
    }

    const handleRoleChange = (user: User, newRole: 'admin' | 'user') => {
        authService.updateUser(user.id, { role: newRole });
        refreshUsers();
    };
    
    const handleDeleteUser = (userId: string) => {
        authService.deleteUser(userId);
        refreshUsers();
        setUserToDelete(null);
    };
    
    const handleUserAdded = (newUser: User) => {
        refreshUsers();
    }
    
    const filteredUsers = useMemo(() => 
        allUsers.filter(user => user.email.toLowerCase().includes(searchTerm.toLowerCase())),
        [allUsers, searchTerm]
    );

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * USERS_PER_PAGE;
        const end = start + USERS_PER_PAGE;
        return filteredUsers.slice(start, end);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;

    return (
        <>
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">إدارة المستخدمين</h1>
                <p className="text-gray-400">عرض، تعديل، وحذف حسابات المستخدمين.</p>
            </div>

            <div className="my-6 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="ابحث بالبريد الإلكتروني..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="flex-grow w-full bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-200 px-4 py-2"
                />
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5"/>
                    إضافة مستخدم
                </button>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-x-auto">
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
                        {paginatedUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user, e.target.value as 'admin' | 'user')}
                                        disabled={user.id === currentUser.id}
                                        className="bg-gray-700 border border-gray-600 rounded-md py-1 px-2 text-white focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="user">طالب</option>
                                        <option value="admin">مشرف</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(user.joinDate).toLocaleDateString('ar-EG')}</td>
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
                 {paginatedUsers.length === 0 && <p className="text-center text-gray-500 py-8">لا يوجد مستخدمون يطابقون بحثك.</p>}
            </div>
            
            {totalPages > 1 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {userToDelete && (
                <ConfirmDialog
                    isOpen={!!userToDelete}
                    title="تأكيد الحذف"
                    message={`هل أنت متأكد من رغبتك في حذف المستخدم ${userToDelete.email}؟ لا يمكن التراجع عن هذا الإجراء.`}
                    onConfirm={() => handleDeleteUser(userToDelete.id)}
                    onCancel={() => setUserToDelete(null)}
                />
            )}
            
            {isAddModalOpen && (
                <AddUserModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onUserAdded={handleUserAdded}
                />
            )}
        </>
    );
};

export default UsersView;