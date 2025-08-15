import React, { useState } from 'react';
import { User } from '../../types';
import * as authService from '../../services/authService';
import { XIcon } from '../icons/XIcon';
import Spinner from '../Spinner';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (newUser: User) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onUserAdded }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.');
      return;
    }
    setIsLoading(true);
    try {
      const newUser = await authService.register(email, password, role);
      onUserAdded(newUser);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl shadow-2xl shadow-indigo-500/10 border border-gray-700 w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">إضافة مستخدم جديد</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700" aria-label="Close"><XIcon className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">البريد الإلكتروني</label>
              <input
                type="email" id="email" required
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 px-4 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">كلمة المرور</label>
              <input
                type="password" id="password" required
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 px-4 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">الدور</label>
              <select
                id="role" name="role" required
                value={role}
                onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 px-4 py-2"
              >
                <option value="user">طالب</option>
                <option value="admin">مشرف</option>
              </select>
            </div>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          </div>
          <div className="bg-gray-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl border-t border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-gray-600 text-gray-200 hover:bg-gray-700">إلغاء</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center min-w-[80px]">
              {isLoading ? <Spinner /> : 'إضافة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;