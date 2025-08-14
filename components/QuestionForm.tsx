import React from 'react';
import { QuestionType, Difficulty, Specialization, ExamMode } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { DocumentArrowUpIcon } from './icons/DocumentArrowUpIcon';
import { translations } from '../utils/localization';
import FileUpload from './FileUpload';

interface QuestionFormProps {
  specialization: Specialization;
  setSpecialization: (spec: Specialization) => void;
  numQuestions: number;
  setNumQuestions: (num: number) => void;
  questionType: QuestionType;
  setQuestionType: (type: QuestionType) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  examMode: ExamMode;
  setExamMode: (mode: ExamMode) => void;
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  isLoading: boolean;
  onStartExam: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  specialization, setSpecialization,
  numQuestions, setNumQuestions,
  questionType, setQuestionType,
  difficulty, setDifficulty,
  examMode, setExamMode,
  pdfFile, setPdfFile,
  isLoading, onStartExam,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartExam();
  };
  
  const handleFileSelect = (file: File) => {
    // Basic validation
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('حجم الملف كبير جداً. الحد الأقصى هو 10 ميغابايت.');
      return;
    }
    setPdfFile(file);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">نمط الاختبار</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModeButton 
            title="الاختبار الذكي"
            description="إنشاء أسئلة جديدة باستخدام الذكاء الاصطناعي."
            isActive={examMode === 'Smart'}
            onClick={() => setExamMode('Smart')}
          />
          <ModeButton 
            title="توليد من ملف"
            description="إنشاء أسئلة من ملف PDF تقوم بتحميله."
            isActive={examMode === 'PDF'}
            onClick={() => setExamMode('PDF')}
            icon={<DocumentArrowUpIcon className="w-5 h-5 ml-2" />}
          />
          <ModeButton 
            title="الاختبار القياسي"
            description="استخدام بنك أسئلة مُعد مسبقاً."
            isActive={examMode === 'Standard'}
            onClick={() => setExamMode('Standard')}
          />
        </div>
      </div>
      
      {examMode === 'PDF' && (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">ملف المحتوى (PDF)</label>
            <FileUpload 
                selectedFile={pdfFile}
                onFileSelect={handleFileSelect}
                onClear={() => setPdfFile(null)}
            />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className={`transition-opacity duration-300 ${examMode === 'PDF' ? 'opacity-50' : 'opacity-100'}`}>
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-300 mb-2">
            التخصص
          </label>
          <select
            id="specialization"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-200 px-4 py-2 disabled:cursor-not-allowed"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value as Specialization)}
            disabled={examMode === 'PDF'}
          >
            {Object.values(Specialization).map((spec) => (
              <option key={spec} value={spec}>
                {translations[spec]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-300 mb-2">
            عدد الأسئلة
          </label>
          <input
            type="number" id="numQuestions"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-200 px-4 py-2"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value, 10)))}
            min="1" max="20" required
          />
        </div>
      </div>
       
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${examMode === 'Standard' ? 'opacity-50' : 'opacity-100'}`}>
        <div>
          <label htmlFor="questionType" className="block text-sm font-medium text-gray-300 mb-2">
            نوع السؤال
          </label>
          <select
            id="questionType"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-200 px-4 py-2 disabled:cursor-not-allowed"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value as QuestionType)}
            disabled={examMode === 'Standard'}
          >
            {Object.values(QuestionType).map((type) => (
              <option key={type} value={type}>{translations[type]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-2">
            مستوى الصعوبة
          </label>
          <select
            id="difficulty"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-200 px-4 py-2 disabled:cursor-not-allowed"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            disabled={examMode === 'Standard'}
          >
            {Object.values(Difficulty).map((level) => (
              <option key={level} value={level}>{translations[level]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || (examMode === 'PDF' && !pdfFile)}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
        >
          {isLoading ? ( 'جار التحميل...' ) : (
            <>
              {(examMode === 'Smart' || examMode === 'PDF') && <SparklesIcon className="w-5 h-5" />}
              بدء الاختبار
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const ModeButton = ({ title, description, isActive, onClick, icon }: { title: string, description: string, isActive: boolean, onClick: () => void, icon?: React.ReactNode }) => (
    <button
        type="button"
        onClick={onClick}
        className={`p-4 rounded-lg text-right transition-all duration-200 flex flex-col justify-between h-full ${
        isActive ? 'bg-indigo-600/30 border-2 border-indigo-500 shadow-lg' : 'bg-gray-900/50 border-2 border-gray-600 hover:border-gray-500'
        }`}
    >
        <div>
            <h3 className="font-bold text-white flex items-center">{icon}{title}</h3>
            <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
    </button>
);


export default QuestionForm;
