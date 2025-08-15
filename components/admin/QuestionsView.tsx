import React, { useState, useMemo } from 'react';
import type { Question } from '../../types';
import { QuestionType, Specialization } from '../../types';
import { translations } from '../../utils/localization';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { FilterIcon } from '../icons/FilterIcon';
import EditQuestionModal from '../modals/EditQuestionModal';
import ConfirmDialog from '../modals/ConfirmDialog';
import Pagination from './Pagination';

const QUESTIONS_PER_PAGE = 5;

const QuestionsView: React.FC<{ questions: Question[]; setQuestions: (q: Question[]) => void; }> = ({ questions, setQuestions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<QuestionType | 'all'>('all');
    const [specFilter, setSpecFilter] = useState<Specialization | 'all'>('all');
    const [sourceFilter, setSourceFilter] = useState<'all' | 'ai' | 'manual'>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const searchMatch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
            const typeMatch = typeFilter === 'all' || q.type === typeFilter;
            const specMatch = specFilter === 'all' || q.specialization === specFilter;
            const sourceMatch = sourceFilter === 'all' || (sourceFilter === 'ai' && q.isGenerated) || (sourceFilter === 'manual' && !q.isGenerated);
            return searchMatch && typeMatch && specMatch && sourceMatch;
        });
    }, [questions, searchTerm, typeFilter, specFilter, sourceFilter]);
    
    const paginatedQuestions = useMemo(() => {
        const start = (currentPage - 1) * QUESTIONS_PER_PAGE;
        const end = start + QUESTIONS_PER_PAGE;
        return filteredQuestions.slice(start, end);
    }, [filteredQuestions, currentPage]);

    const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);

    const openAddModal = () => {
        setEditingQuestion(null);
        setIsModalOpen(true);
    };

    const openEditModal = (question: Question) => {
        setEditingQuestion(question);
        setIsModalOpen(true);
    };

    const handleSaveQuestion = (question: Question) => {
        let updatedQuestions;
        if (editingQuestion) { // Update existing
            updatedQuestions = questions.map(q => q.id === question.id ? question : q);
        } else { // Add new
            updatedQuestions = [...questions, { ...question, id: crypto.randomUUID(), isGenerated: false }];
        }
        setQuestions(updatedQuestions);
        setIsModalOpen(false);
        setEditingQuestion(null);
    };

    const handleDeleteQuestion = (questionId: string) => {
        const updatedQuestions = questions.filter(q => q.id !== questionId);
        setQuestions(updatedQuestions);
        setQuestionToDelete(null);
    };
    
    const FilterSelect: React.FC<any> = ({ value, onChange, children, defaultOption }) => (
        <select value={value} onChange={onChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-2 text-white text-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="all">{defaultOption}</option>
            {children}
        </select>
    );

    return (
        <>
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">إدارة الأسئلة</h1>
                <p className="text-gray-400">إضافة، تعديل، وحذف الأسئلة من بنك الأسئلة.</p>
            </div>
            
             <div className="my-6 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="ابحث عن سؤال..."
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                    className="flex-grow w-full bg-gray-900/50 border border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-200 px-4 py-2"
                />
                <button
                    onClick={openAddModal}
                    className="flex-shrink-0 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5"/>
                    إضافة سؤال
                </button>
            </div>
            
            {/* Filters */}
             <div className="mb-4 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div className="flex items-center gap-2 text-gray-300 font-semibold">
                       <FilterIcon className="w-5 h-5"/>
                       <span>تصفية حسب:</span>
                    </div>
                     <FilterSelect value={typeFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {setTypeFilter(e.target.value as any); setCurrentPage(1);}} defaultOption="كل الأنواع">
                        {Object.values(QuestionType).map(t => <option key={t} value={t}>{translations[t]}</option>)}
                    </FilterSelect>
                    <FilterSelect value={specFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {setSpecFilter(e.target.value as any); setCurrentPage(1);}} defaultOption="كل التخصصات">
                        {Object.values(Specialization).map(s => <option key={s} value={s}>{translations[s]}</option>)}
                    </FilterSelect>
                     <FilterSelect value={sourceFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {setSourceFilter(e.target.value as any); setCurrentPage(1);}} defaultOption="كل المصادر">
                        <option value="ai">مولّد بالذكاء الاصطناعي</option>
                        <option value="manual">مضاف يدوياً</option>
                    </FilterSelect>
                </div>
            </div>

            <div className="space-y-4">
                {paginatedQuestions.map(q => (
                    <div key={q.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="flex-1">
                            <p className="font-semibold text-white">{q.question}</p>
                            <div className="flex items-center gap-2 flex-wrap mt-2">
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-400 bg-purple-900/50">{translations[q.type] || q.type}</span>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-sky-400 bg-sky-900/50">{translations[q.specialization] || q.specialization}</span>
                                {q.isGenerated && <span className="flex items-center gap-1 text-xs font-semibold py-1 px-2 rounded-full text-yellow-400 bg-yellow-900/50"><SparklesIcon className="w-3 h-3"/> AI</span>}
                            </div>
                        </div>
                        <div className="flex gap-2 self-end sm:self-center flex-shrink-0">
                            <button onClick={() => openEditModal(q)} className="p-2 text-yellow-400 hover:text-yellow-300 rounded-full hover:bg-yellow-500/10" title="تعديل"><PencilIcon className="w-5 h-5"/></button>
                            <button onClick={() => setQuestionToDelete(q)} className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-red-500/10" title="حذف"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                ))}
                {filteredQuestions.length === 0 && <p className="text-center text-gray-500 py-8">لا توجد أسئلة تطابق بحثك.</p>}
            </div>

             {totalPages > 1 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

             {isModalOpen && (
                <EditQuestionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveQuestion}
                    question={editingQuestion}
                />
            )}
            {questionToDelete && (
                 <ConfirmDialog
                    isOpen={!!questionToDelete}
                    title="تأكيد الحذف"
                    message={`هل أنت متأكد من رغبتك في حذف السؤال: "${questionToDelete.question}"؟`}
                    onConfirm={() => handleDeleteQuestion(questionToDelete.id)}
                    onCancel={() => setQuestionToDelete(null)}
                />
            )}
        </>
    );
};

export default QuestionsView;