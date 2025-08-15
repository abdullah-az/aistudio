import React, { useState, useEffect } from 'react';
import { Question, QuestionType, Specialization } from '../../types';
import { translations } from '../../utils/localization';
import { XIcon } from '../icons/XIcon';

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: Question) => void;
  question: Question | null;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({ isOpen, onClose, onSave, question }) => {
  const [formData, setFormData] = useState<Partial<Question>>({
    question: '',
    type: QuestionType.MULTIPLE_CHOICE,
    specialization: Specialization.GENERAL,
    options: ['', '', '', ''],
    answer: '',
    isGenerated: false,
  });

  useEffect(() => {
    if (question) {
      setFormData({
        ...question,
        options: question.options && question.options.length > 0 ? [...question.options] : ['', '', '', ''],
      });
    } else {
      setFormData({
        question: '',
        type: QuestionType.MULTIPLE_CHOICE,
        specialization: Specialization.GENERAL,
        options: ['', '', '', ''],
        answer: '',
        isGenerated: false,
      });
    }
  }, [question, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as QuestionType;
    setFormData(prev => ({
        ...prev,
        type: newType,
        options: newType === QuestionType.MULTIPLE_CHOICE ? (prev.options?.length === 4 ? prev.options : ['', '', '', '']) : [],
        answer: newType === QuestionType.TRUE_FALSE ? 'صحيح' : ''
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.question && formData.type && formData.answer && formData.specialization) {
        onSave(formData as Question);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl shadow-2xl shadow-indigo-500/10 border border-gray-700 w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-bold text-white">{question ? 'تعديل السؤال' : 'إضافة سؤال جديد'}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700" aria-label="Close"><XIcon className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-2">نص السؤال</label>
              <textarea
                id="question" name="question" required
                value={formData.question} onChange={handleInputChange}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 px-4 py-2"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">نوع السؤال</label>
                  <select
                    id="type" name="type" required
                    value={formData.type} onChange={handleTypeChange}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 px-4 py-2"
                  >
                    {Object.values(QuestionType).map(type => (
                      <option key={type} value={type}>{translations[type]}</option>
                    ))}
                  </select>
                </div>
                 <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-300 mb-2">التخصص</label>
                  <select
                    id="specialization" name="specialization" required
                    value={formData.specialization} onChange={handleInputChange}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 px-4 py-2"
                  >
                    {Object.values(Specialization).map(spec => (
                      <option key={spec} value={spec}>{translations[spec]}</option>
                    ))}
                  </select>
                </div>
            </div>
            
            {formData.type === QuestionType.MULTIPLE_CHOICE && (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">الخيارات</label>
                    <div className="space-y-2">
                        {formData.options?.map((option, index) => (
                            <input
                                key={index}
                                type="text"
                                placeholder={`الخيار ${index + 1}`} required
                                value={option}
                                onChange={e => handleOptionChange(index, e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 px-4 py-2"
                            />
                        ))}
                    </div>
                </div>
            )}
            
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-300 mb-2">الإجابة الصحيحة</label>
               {formData.type === QuestionType.MULTIPLE_CHOICE && (
                   <select
                        id="answer" name="answer" required
                        value={formData.answer} onChange={handleInputChange}
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 px-4 py-2"
                   >
                       <option value="" disabled>اختر الإجابة الصحيحة</option>
                       {formData.options?.filter(opt => opt && opt.trim() !== '').map((option, index) => (
                           <option key={index} value={option}>{option}</option>
                       ))}
                   </select>
               )}
               {formData.type === QuestionType.TRUE_FALSE && (
                   <select
                        id="answer" name="answer" required
                        value={formData.answer} onChange={handleInputChange}
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 px-4 py-2"
                   >
                       <option value="صحيح">صحيح</option>
                       <option value="خطأ">خطأ</option>
                   </select>
               )}
               {formData.type === QuestionType.SHORT_ANSWER && (
                   <input
                        type="text"
                        id="answer" name="answer" required
                        value={formData.answer} onChange={handleInputChange}
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 px-4 py-2"
                   />
               )}
            </div>
          </div>
          <div className="bg-gray-800/50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl flex-shrink-0 border-t border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-gray-600 text-gray-200 hover:bg-gray-700">إلغاء</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">حفظ التغييرات</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionModal;