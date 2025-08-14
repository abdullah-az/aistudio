import { QuestionType, Difficulty, Specialization } from '../types';

export const translations: Record<string, string> = {
  // QuestionType
  [QuestionType.MULTIPLE_CHOICE]: "اختيار من متعدد",
  [QuestionType.TRUE_FALSE]: "صح / خطأ",
  [QuestionType.SHORT_ANSWER]: "إجابة قصيرة",

  // Difficulty
  [Difficulty.EASY]: "سهل",
  [Difficulty.MEDIUM]: "متوسط",
  [Difficulty.HARD]: "صعب",

  // Specialization
  [Specialization.SOFTWARE_ENGINEERING]: "هندسة البرمجيات",
  [Specialization.NETWORK_ENGINEERING]: "هندسة الشبكات",
  [Specialization.ARTIFICIAL_INTELLIGENCE]: "الذكاء الاصطناعي",
  [Specialization.GENERAL]: "عام",
};
