import * as authService from './authService';
import * as storageService from './storageService';

export interface AdminStats {
  userCount: number;
  questionCount: number;
}

export const getDashboardStats = async (): Promise<AdminStats> => {
  // Simulate an async fetch in case we need to call a real backend later
  return new Promise(resolve => {
    setTimeout(() => {
        const userCount = authService.getUserCount();
        const questionCount = storageService.getStoredQuestions().length;
        resolve({ userCount, questionCount });
    }, 300);
  });
};