import React from 'react';
import { Question } from '../types';
import QuestionCard from './QuestionCard';

interface QuestionBankProps {
  questions: Question[];
  onClear: () => void;
}

const QuestionBank: React.FC<QuestionBankProps> = ({ questions, onClear }) => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-indigo-500/10 p-6 md:p-8 border border-gray-700">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          بنك الأسئلة المولدة
        </h2>
        {questions.length > 0 && (
            <button
            onClick={onClear}
            className="bg-red-600/20 text-red-400 font-semibold py-2 px-4 rounded-lg border border-red-500/50 hover:bg-red-600/40 hover:text-red-300 transition-colors"
            >
            مسح البنك
            </button>
        )}
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-400">البنك فارغ حالياً</h3>
          <p className="text-gray-500 mt-2">
            الأسئلة التي تنشئها في وضع "الاختبار الذكي" ستظهر هنا تلقائياً.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
            <p className="text-gray-400 text-center mb-4">تم العثور على {questions.length} سؤال محفوظ.</p>
          {questions.map((q, index) => (
            <QuestionCard
              key={index}
              question={q}
              index={index}
              examState="BANK_VIEW"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionBank;