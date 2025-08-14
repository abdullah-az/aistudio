import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Question, QuestionType, Difficulty, Specialization, ExamMode, ExamState, ViewState, User } from './types';
import { generateExamQuestions } from './services/geminiService';
import { getStandardQuestions } from './services/mockDatabase';
import { extractTextFromPdf } from './utils/pdfParser';
import * as storage from './services/storageService';
import * as authService from './services/authService';
import Header from './components/Header';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';
import Footer from './components/Footer';
import Results from './components/Results';
import QuestionBank from './components/QuestionBank';
import Auth from './components/Auth';
import Profile from './components/Profile';
import Spinner from './components/Spinner';
import AdminPanel from './components/AdminPanel';

function App(): React.ReactNode {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Global View State
  const [view, setView] = useState<ViewState>('EXAM');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  // Exam Configuration State
  const [specialization, setSpecialization] = useState<Specialization>(Specialization.SOFTWARE_ENGINEERING);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.MULTIPLE_CHOICE);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [examMode, setExamMode] = useState<ExamMode>('Smart');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Exam Lifecycle State
  const [examState, setExamState] = useState<ExamState>('CONFIG');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);
  
  // Cross-cutting State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Question Bank State
  const [storedQuestions, setStoredQuestions] = useState<Question[]>([]);
  
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setIsAuthLoading(false);
    
    if (user) {
      setStoredQuestions(storage.getStoredQuestions());
    }
  }, []);
  
  const changeView = (newView: ViewState) => {
    if (view === newView || isTransitioning) return;
    
    if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
    }
    
    setIsTransitioning(true);
    transitionTimeoutRef.current = window.setTimeout(() => {
        setView(newView);
        setIsTransitioning(false);
    }, 150); // half of the transition duration
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setStoredQuestions(storage.getStoredQuestions());
    if (user.role === 'admin') {
      changeView('ADMIN');
    } else {
      changeView('EXAM');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setStoredQuestions([]);
    changeView('EXAM');
  };


  const handleStartExam = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setQuestions([]);
    try {
      let result: Question[];
      if (examMode === 'Standard') {
        setLoadingMessage('جاري تحضير الأسئلة القياسية...');
        await new Promise(resolve => setTimeout(resolve, 500));
        result = getStandardQuestions(specialization, numQuestions);
      } else if (examMode === 'PDF') {
        if (!pdfFile) {
          throw new Error('الرجاء تحديد ملف PDF أولاً.');
        }
        setLoadingMessage('جاري قراءة ملف PDF وتحليله...');
        const pdfText = await extractTextFromPdf(pdfFile);
        if (!pdfText.trim()) {
            throw new Error('ملف PDF فارغ أو لا يمكن قراءة النص منه.');
        }
        setLoadingMessage('جاري إنشاء الأسئلة من الملف...');
        result = await generateExamQuestions(specialization, numQuestions, questionType, difficulty, pdfText);
        if (result.length === 0) {
            throw new Error('لم يتمكن الذكاء الاصطناعي من إنشاء أي أسئلة من المحتوى المقدم. يرجى تجربة ملف آخر.');
        }
        const updatedBank = storage.addGeneratedQuestions(result);
        setStoredQuestions(updatedBank);
      } else { // Smart Mode
        setLoadingMessage('جاري إنشاء الأسئلة بالذكاء الاصطناعي...');
        result = await generateExamQuestions(specialization, numQuestions, questionType, difficulty);
         if (result.length === 0) {
            throw new Error('فشل الذكاء الاصطناعي في إنشاء الأسئلة. يرجى المحاولة مرة أخرى.');
        }
        const updatedBank = storage.addGeneratedQuestions(result);
        setStoredQuestions(updatedBank);
      }
      setQuestions(result);
      setUserAnswers({});
      setScore(0);
      setExamState('ACTIVE');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير معروف.';
      setError(`فشل إنشاء الاختبار: ${errorMessage}`);
      setQuestions([]);
      setExamState('CONFIG');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [specialization, numQuestions, questionType, difficulty, examMode, pdfFile]);
  
  const handleAnswerChange = (questionIndex: number, answer: string) => {
      setUserAnswers(prev => ({...prev, [questionIndex]: answer}));
  };

  const handleSubmitExam = () => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        if (userAnswer && userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
            correctAnswers++;
        }
    });
    setScore(correctAnswers);
    if (currentUser) {
        storage.updateUserStats(currentUser.id, correctAnswers, questions.length);
    }
    setExamState('FINISHED');
  };
  
  const handleRestartExam = () => {
    setExamState('CONFIG');
    setQuestions([]);
    setUserAnswers({});
    setPdfFile(null);
  };

  const handleReview = () => {
    setExamState('REVIEW');
  }

  const handleClearBank = () => {
    storage.clearStoredQuestions();
    setStoredQuestions([]);
  }

  const handleSetExamMode = (mode: ExamMode) => {
    setExamMode(mode);
    if(mode !== 'PDF') {
      setPdfFile(null);
    }
  }
  
  const updateStoredQuestions = (updatedQuestions: Question[]) => {
      storage.setStoredQuestions(updatedQuestions);
      setStoredQuestions(updatedQuestions);
  }

  const renderExamView = () => {
    if (isLoading) {
       return <QuestionList questions={[]} isLoading={true} error={null} examState={'CONFIG'} loadingMessage={loadingMessage}/>;
    }
     if (error && examState === 'CONFIG') {
       return <QuestionList questions={[]} isLoading={false} error={error} examState={'CONFIG'} loadingMessage={null}/>;
    }

    switch (examState) {
      case 'CONFIG':
        return <QuestionForm
            specialization={specialization} setSpecialization={setSpecialization}
            numQuestions={numQuestions} setNumQuestions={setNumQuestions}
            questionType={questionType} setQuestionType={setQuestionType}
            difficulty={difficulty} setDifficulty={setDifficulty}
            examMode={examMode} setExamMode={handleSetExamMode}
            pdfFile={pdfFile} setPdfFile={setPdfFile}
            isLoading={isLoading} onStartExam={handleStartExam}
          />;
      case 'ACTIVE':
        return <>
            <QuestionList questions={questions} examState="ACTIVE" userAnswers={userAnswers} onAnswerChange={handleAnswerChange} isLoading={false} error={null} loadingMessage={null} />
            <div className="mt-8 text-center">
                <button onClick={handleSubmitExam} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 transition-all duration-300 ease-in-out transform hover:scale-105">
                    تسليم الاختبار
                </button>
            </div>
        </>;
      case 'FINISHED':
        return <Results score={score} total={questions.length} onRestart={handleRestartExam} onReview={handleReview} />;
       case 'REVIEW':
        return <>
            <QuestionList questions={questions} examState="REVIEW" userAnswers={userAnswers} isLoading={false} error={null} loadingMessage={null} />
            <div className="mt-8 text-center">
                 <button onClick={handleRestartExam} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 ease-in-out transform hover:scale-105">
                    البدء من جديد
                </button>
            </div>
        </>;
      default:
        return null;
    }
  }
  
  const renderMainContent = () => {
    switch (view) {
        case 'EXAM':
            return (
                <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-indigo-500/10 p-6 md:p-8 border border-gray-700">
                   <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-6">
                     {examState === 'CONFIG' ? 'إعدادات الاختبار' : examState === 'ACTIVE' ? 'الاختبار جاري' : 'نتيجتك النهائية'}
                   </h2>
                   {renderExamView()}
                </div>
            );
        case 'BANK':
            return <QuestionBank questions={storedQuestions} onClear={handleClearBank} />;
        case 'PROFILE':
             return <Profile user={currentUser!} onLogout={handleLogout} />;
        case 'ADMIN':
             if (currentUser?.role !== 'admin') {
                changeView('EXAM'); // Fallback for non-admins
                return null;
             }
             return <AdminPanel currentUser={currentUser} questions={storedQuestions} setQuestions={updateStoredQuestions} />;
        default:
            return null;
    }
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!currentUser) {
    return <Auth onLoginSuccess={handleLogin} />;
  }


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col" dir="rtl">
      <Header view={view} setView={changeView} user={currentUser} onLogout={handleLogout} examState={examState} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className={`max-w-4xl mx-auto transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {renderMainContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;