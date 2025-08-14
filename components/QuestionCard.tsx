import React, { useState } from 'react';
import { Question, QuestionType, ExamState } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { translations } from '../utils/localization';

interface QuestionCardProps {
  question: Question;
  index: number;
  examState: ExamState | 'BANK_VIEW';
  userAnswer?: string;
  onAnswerChange?: (questionIndex: number, answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index, examState, userAnswer, onAnswerChange }) => {
  const isReviewOrFinished = examState === 'REVIEW';
  const isActive = examState === 'ACTIVE';
  
  const getOptionClasses = (option: string) => {
    if (!isReviewOrFinished) return 'border-gray-600';
    
    const isCorrectAnswer = option === question.answer;
    const isSelectedAnswer = option === userAnswer;

    if (isCorrectAnswer) return 'border-green-500 bg-green-500/10';
    if (isSelectedAnswer) return 'border-red-500 bg-red-500/10';
    return 'border-gray-600';
  };
  
  const getOptionIcon = (option: string) => {
    if (!isReviewOrFinished) return null;

    const isCorrectAnswer = option === question.answer;
    const isSelectedAnswer = option === userAnswer;

    if (isCorrectAnswer) return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    if (isSelectedAnswer) return <XCircleIcon className="w-5 h-5 text-red-500" />;
    return null;
  };

  return (
    <div className={`relative bg-gray-800/70 border border-gray-700 rounded-xl shadow-lg transition-all duration-300 ${isReviewOrFinished ? 'hover:border-gray-700' : 'hover:border-indigo-500/50 hover:shadow-indigo-500/10'}`}>
      {question.isGenerated && (
         <div className="absolute top-0 left-0 -mt-2 -ml-2 flex items-center gap-1 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
           <SparklesIcon className="w-3 h-3"/>
           <span>مولّد بالذكاء الاصطناعي</span>
         </div>
      )}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            {index + 1}
          </div>
          <div className="flex-grow">
            <p className="text-lg font-medium text-gray-200">{question.question}</p>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-400 bg-purple-900/50 mt-2">
              {translations[question.type] || question.type}
            </span>
          </div>
        </div>

        <div className="mt-4 pr-12 space-y-3">
          {question.type === QuestionType.MULTIPLE_CHOICE && question.options && question.options.map((option, i) => (
            <label key={i} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${getOptionClasses(option)}`}>
              <input 
                type="radio" 
                name={`question-${index}`} 
                value={option}
                checked={userAnswer === option}
                disabled={!isActive}
                onChange={(e) => onAnswerChange?.(index, e.target.value)}
                className="hidden"
              />
              <span className={`flex-shrink-0 w-6 h-6 border-2 ${userAnswer === option ? 'border-indigo-500 bg-indigo-600' : 'border-gray-500'} rounded-full flex items-center justify-center text-xs font-mono text-white`}>
                {userAnswer === option && <CheckCircleIcon className="w-4 h-4" />}
              </span>
              <span className="flex-grow">{option}</span>
              {getOptionIcon(option)}
            </label>
          ))}

          {question.type === QuestionType.TRUE_FALSE && ['صحيح', 'خطأ'].map((option, i) => (
             <label key={i} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${getOptionClasses(option)}`}>
              <input 
                type="radio" 
                name={`question-${index}`} 
                value={option}
                checked={userAnswer === option}
                disabled={!isActive}
                onChange={(e) => onAnswerChange?.(index, e.target.value)}
                className="hidden"
              />
              <span className={`flex-shrink-0 w-6 h-6 border-2 ${userAnswer === option ? 'border-indigo-500 bg-indigo-600' : 'border-gray-500'} rounded-full flex items-center justify-center text-xs font-mono text-white`}>
                {userAnswer === option && <CheckCircleIcon className="w-4 h-4" />}
              </span>
              <span className="flex-grow">{option}</span>
              {getOptionIcon(option)}
            </label>
          ))}
          
          {question.type === QuestionType.SHORT_ANSWER && (
            <div className="relative">
              <input
                type="text"
                value={userAnswer || ''}
                disabled={!isActive}
                onChange={(e) => onAnswerChange?.(index, e.target.value)}
                placeholder="اكتب إجابتك هنا..."
                className="w-full bg-gray-900/50 border-2 border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-200 px-4 py-2 disabled:cursor-not-allowed"
              />
              {isReviewOrFinished && (
                 <div className="mt-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                    <p className="text-sm font-medium text-gray-400">الإجابة الصحيحة:</p>
                    <p className="text-md font-semibold text-green-300">{question.answer}</p>
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
