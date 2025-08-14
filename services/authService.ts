import { User } from '../types';

const USERS_KEY = 'examAppUsers';
const SESSION_KEY = 'examAppSession';

// Simple in-memory hash for demonstration. In a real app, use a proper library like bcrypt.
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};

type StoredUser = User & { passwordHash: string };

const DEMO_ACCOUNTS = {
    admin: { email: 'admin@demo.com', password: 'password123', role: 'admin' as 'admin' | 'user', joinDate: '2024-01-01T12:00:00.000Z' },
    student: { email: 'student@demo.com', password: 'password123', role: 'user' as 'admin' | 'user', joinDate: '2024-01-01T12:00:00.000Z' },
};

export const getDemoCredentials = () => {
    return [DEMO_ACCOUNTS.admin, DEMO_ACCOUNTS.student];
};

const saveUsers = (users: Record<string, any>): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const initializeUsers = () => {
    try {
        const usersRaw = localStorage.getItem(USERS_KEY);
        if (!usersRaw || Object.keys(JSON.parse(usersRaw)).length === 0) {
            const initialUsers: Record<string, StoredUser> = {};

            const admin = DEMO_ACCOUNTS.admin;
            initialUsers[admin.email] = {
                id: 'demo-admin-id',
                email: admin.email,
                role: admin.role,
                joinDate: admin.joinDate,
                passwordHash: simpleHash(admin.password),
            };

            const student = DEMO_ACCOUNTS.student;
            initialUsers[student.email] = {
                id: 'demo-student-id',
                email: student.email,
                role: student.role,
                joinDate: student.joinDate,
                passwordHash: simpleHash(student.password),
            };
            saveUsers(initialUsers);
        }
    } catch (e) {
        console.error("Error initializing users, re-seeding.", e);
        // Fallback to re-seeding if parsing fails
        const fallbackUsers: Record<string, StoredUser> = {};
        const admin = DEMO_ACCOUNTS.admin;
        fallbackUsers[admin.email] = { id: 'demo-admin-id', email: admin.email, role: admin.role, joinDate: admin.joinDate, passwordHash: simpleHash(admin.password) };
        const student = DEMO_ACCOUNTS.student;
        fallbackUsers[student.email] = { id: 'demo-student-id', email: student.email, role: student.role, joinDate: student.joinDate, passwordHash: simpleHash(student.password) };
        saveUsers(fallbackUsers);
    }
};

// Run initialization once when the module is loaded
initializeUsers();


const getUsers = (): Record<string, StoredUser> => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch (error) {
    return {};
  }
};

export const register = async (email: string, password: string, role: 'admin' | 'user'): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            const users = getUsers();
            if (users[email]) {
                return reject(new Error('هذا البريد الإلكتروني مسجل بالفعل.'));
            }

            const passwordHash = simpleHash(password);
            const id = new Date().toISOString() + Math.random();
            
            const newUser: User = { id, email, role, joinDate: new Date().toISOString() };
            
            users[email] = { ...newUser, passwordHash };
            saveUsers(users);

            localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
            resolve(newUser);
        }, 500);
    });
};


export const login = async (email: string, password: string): Promise<User> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            const users = getUsers();
            const userRecord = users[email];

            if (!userRecord) {
                return reject(new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة.'));
            }

            const passwordHash = simpleHash(password);
            if (userRecord.passwordHash !== passwordHash) {
                return reject(new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة.'));
            }
            
            const user: User = { id: userRecord.id, email: userRecord.email, role: userRecord.role, joinDate: userRecord.joinDate };
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
            resolve(user);
        }, 500);
    });
};

export const logout = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    return null;
  }
};

export const getUserCount = (): number => {
    const users = getUsers();
    return Object.keys(users).length;
};

// Admin functions
export const getAllUsers = (): User[] => {
    const users = getUsers();
    return Object.values(users).map(({ passwordHash, ...user }) => user);
};

export const updateUser = (userId: string, updates: Partial<User>): User | null => {
    const users = getUsers();
    const userEmail = Object.keys(users).find(email => users[email].id === userId);
    if (userEmail && users[userEmail]) {
        const updatedUser = { ...users[userEmail], ...updates };
        users[userEmail] = updatedUser;
        saveUsers(users);
        const { passwordHash, ...user } = updatedUser;
        return user;
    }
    return null;
};

export const deleteUser = (userId: string): boolean => {
    const users = getUsers();
    const userEmail = Object.keys(users).find(email => users[email].id === userId);
    if (userEmail) {
        delete users[userEmail];
        saveUsers(users);
        return true;
    }
    return false;
};