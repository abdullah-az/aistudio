import { Question, UserStats } from '../types';

const STORAGE_KEY = 'aiGeneratedQuestionsBank';
const STATS_KEY_PREFIX = 'userStats_';

export const getStoredQuestions = (): Question[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Ensure all questions have an ID, for backward compatibility
    const questions = stored ? JSON.parse(stored) : [];
    return questions.map((q: Question) => ({ ...q, id: q.id || crypto.randomUUID() }));
  } catch (error) {
    console.error("Failed to parse stored questions:", error);
    return [];
  }
};

export const setStoredQuestions = (questions: Question[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (error) {
    console.error("Failed to save questions to storage:", error);
  }
};

export const addGeneratedQuestions = (newQuestions: Question[]): Question[] => {
  if (typeof window === 'undefined') return [];
  const existingQuestions = getStoredQuestions();
  const existingQuestionTexts = new Set(existingQuestions.map(q => q.question));
  
  const uniqueNewQuestions = newQuestions.filter(q => !existingQuestionTexts.has(q.question));

  if (uniqueNewQuestions.length === 0) {
    return existingQuestions;
  }
  
  const updatedQuestions = [...existingQuestions, ...uniqueNewQuestions];
  setStoredQuestions(updatedQuestions);
  
  return updatedQuestions;
};

export const clearStoredQuestions = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear stored questions:", error);
  }
};

// User Stats Management
export const getUserStats = (userId: string): UserStats => {
    const defaultStats = { examsTaken: 0, totalQuestionsAnswered: 0, correctAnswers: 0 };
    if (typeof window === 'undefined') return defaultStats;
    try {
        const stored = localStorage.getItem(`${STATS_KEY_PREFIX}${userId}`);
        return stored ? JSON.parse(stored) : defaultStats;
    } catch (error) {
        console.error("Failed to parse user stats:", error);
        return defaultStats;
    }
};

export const updateUserStats = (userId: string, score: number, totalQuestions: number): void => {
    if (typeof window === 'undefined') return;
    const currentStats = getUserStats(userId);
    const updatedStats: UserStats = {
        examsTaken: currentStats.examsTaken + 1,
        totalQuestionsAnswered: currentStats.totalQuestionsAnswered + totalQuestions,
        correctAnswers: currentStats.correctAnswers + score,
    };
    try {
        localStorage.setItem(`${STATS_KEY_PREFIX}${userId}`, JSON.stringify(updatedStats));
    } catch (error) {
        console.error("Failed to save user stats:", error);
    }
};

export const resetUserStats = (userId: string): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(`${STATS_KEY_PREFIX}${userId}`);
    } catch (error) {
        console.error("Failed to reset user stats:", error);
    }
};