export enum QuestionType {
  MULTIPLE_CHOICE = "Multiple Choice",
  TRUE_FALSE = "True/False",
  SHORT_ANSWER = "Short Answer",
}

export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export enum Specialization {
  SOFTWARE_ENGINEERING = "Software Engineering",
  NETWORK_ENGINEERING = "Network Engineering",
  ARTIFICIAL_INTELLIGENCE = "Artificial Intelligence",
  GENERAL = "General",
}

export type ExamMode = 'Standard' | 'Smart' | 'PDF';

export type ExamState = 'CONFIG' | 'ACTIVE' | 'FINISHED' | 'REVIEW';

export type ViewState = 'EXAM' | 'BANK' | 'PROFILE' | 'ADMIN';

export interface Question {
  id: string; // Unique identifier for each question
  question: string;
  type: QuestionType;
  options?: string[];
  answer: string;
  isGenerated: boolean; // Flag for AI-generated vs manually added
}

export interface UserStats {
    examsTaken: number;
    totalQuestionsAnswered: number;
    correctAnswers: number;
}

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
    joinDate: string;
}