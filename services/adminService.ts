import * as authService from './authService';
import * as storageService from './storageService';
import { User, Question, QuestionType } from '../types';

export interface RegistrationTrend {
  date: string;
  count: number;
}

export interface QuestionTypeDistribution {
  type: QuestionType;
  count: number;
}

export interface AdminDashboardData {
  userCount: number;
  questionCount: number;
  registrationTrend: RegistrationTrend[];
  questionTypeDistribution: QuestionTypeDistribution[];
  recentUsers: User[];
}

// Helper to get date string 'YYYY-MM-DD'
const toISODateString = (date: Date) => date.toISOString().split('T')[0];

export const getDashboardData = async (): Promise<AdminDashboardData> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const allUsers = authService.getAllUsers();
      const allQuestions = storageService.getStoredQuestions();
      
      const userCount = allUsers.length;
      const questionCount = allQuestions.length;

      // Registration Trend (last 7 days)
      const trendData: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        trendData[toISODateString(d)] = 0;
      }
      allUsers.forEach(user => {
        try {
            const joinDate = toISODateString(new Date(user.joinDate));
            if (trendData[joinDate] !== undefined) {
              trendData[joinDate]++;
            }
        } catch(e) {
            // Ignore invalid dates
        }
      });
      const registrationTrend: RegistrationTrend[] = Object.entries(trendData).map(([date, count]) => ({ date, count }));
      
      // Question Type Distribution
      const typeDistribution: Record<string, number> = {};
      Object.values(QuestionType).forEach(type => {
          typeDistribution[type] = 0;
      });
      allQuestions.forEach(q => {
          if (typeDistribution[q.type] !== undefined) {
              typeDistribution[q.type]++;
          } else {
              typeDistribution[q.type] = 1;
          }
      });
      const questionTypeDistribution = Object.entries(typeDistribution).map(([type, count]) => ({ type: type as QuestionType, count }));
      
      // Recent Users
      const recentUsers = [...allUsers].sort((a, b) => {
          try {
              return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
          } catch(e) {
              return 0;
          }
      }).slice(0, 5);
      
      resolve({
        userCount,
        questionCount,
        registrationTrend,
        questionTypeDistribution,
        recentUsers
      });
    }, 500);
  });
};