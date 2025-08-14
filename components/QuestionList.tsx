import React from 'react';
import { Question, ExamState } from '../types';
import QuestionCard from './QuestionCard';
import Spinner from './Spinner';

interface QuestionListProps {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  examState: ExamState;
  userAnswers?: Record<number, string>;
  onAnswerChange?: (questionIndex: number, answer: string) => void;
  loadingMessage: string | null;
}

const QuestionList: React.FC<QuestionListProps> = ({ 
  questions, 
  isLoading, 
  error,
  examState,
  userAnswers,
  onAnswerChange,
  loadingMessage
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Spinner />
        <p className="mt-4 text-lg text-gray-400">{loadingMessage || 'جار تحضير اختبارك... يرجى الانتظار.'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-red-900/20 border border-red-500/50 rounded-lg">
        <p className="text-red-400 font-semibold">حدث خطأ</p>
        <p className="text-red-400/80 mt-2">{error}</p>
      </div>
    );
  }

  if (questions.length === 0 && examState === 'CONFIG') {
    return (
      <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-400">جاهز للبدء</h3>
        <p className="text-gray-500 mt-2">قم بضبط إعدادات الاختبار واضغط على "بدء الاختبار".</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
        <QuestionCard 
          key={index} 
          question={q} 
          index={index}
          examState={examState}
          userAnswer={userAnswers ? userAnswers[index] : undefined}
          onAnswerChange={onAnswerChange}
        />
      ))}
    </div>
  );
};

export default QuestionList;
