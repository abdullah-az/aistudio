import { Question, Specialization, QuestionType } from '../types';

const db: Record<Specialization, Omit<Question, 'id' | 'isGenerated'>[]> = {
  [Specialization.SOFTWARE_ENGINEERING]: [
    {
      question: 'ما هو الغرض الأساسي للدالة البانية (constructor) في البرمجة كائنية التوجه؟',
      type: QuestionType.MULTIPLE_CHOICE,
      options: [
        'لتحطيم كائن',
        'لتهيئة حالة الكائن الأولية',
        'لإجراء نسخة عميقة',
        'لتعريف واجهة',
      ],
      answer: 'لتهيئة حالة الكائن الأولية',
    },
    {
      question: 'الأمر "git clone" يستخدم لإنشاء فرع جديد في المستودع.',
      type: QuestionType.TRUE_FALSE,
      answer: 'خطأ',
    },
    {
      question: 'في تطوير البرمجيات السريع (Agile)، ما هو "السبرنت" (sprint)؟',
      type: QuestionType.SHORT_ANSWER,
      answer: 'فترة زمنية قصيرة ومحددة يتم خلالها إنجاز كمية معينة من العمل.'
    },
    {
      question: 'أي مما يلي ليس من مبادئ SOLID الأساسية في التصميم؟',
      type: QuestionType.MULTIPLE_CHOICE,
      options: [
        'مبدأ المسؤولية الواحدة',
        'مبدأ الفتح/الإغلاق',
        'مبدأ استبدال ليسكوف',
        'مبدأ قابلية إعادة استخدام المكون',
      ],
      answer: 'مبدأ قابلية إعادة استخدام المكون',
    },
  ],
  [Specialization.NETWORK_ENGINEERING]: [
    {
      question: 'أي طبقة من نموذج OSI مسؤولة عن توجيه الرزم بين الشبكات؟',
      type: QuestionType.MULTIPLE_CHOICE,
      options: ['طبقة ربط البيانات', 'طبقة النقل', 'طبقة الشبكة', 'الطبقة الفيزيائية'],
      answer: 'طبقة الشبكة',
    },
    {
      question: 'ما هو قناع الشبكة الفرعية الافتراضي لعنوان IP من الفئة C؟',
      type: QuestionType.SHORT_ANSWER,
      answer: '255.255.255.0',
    },
    {
      question: 'بروتوكول التحكم في الإرسال (TCP) هو بروتوكول غير متصل.',
      type: QuestionType.TRUE_FALSE,
      answer: 'خطأ'
    }
  ],
  [Specialization.ARTIFICIAL_INTELLIGENCE]: [
    {
      question: 'ما نوع خوارزمية التعلم الآلي المستخدمة للتنبؤ بقيمة مستمرة، مثل سعر المنزل؟',
      type: QuestionType.MULTIPLE_CHOICE,
      options: ['التصنيف', 'التجميع', 'الانحدار', 'التعلم المعزز'],
      answer: 'الانحدار',
    },
    {
      question: 'في الشبكة العصبونية، ما هي وظيفة دالة التنشيط؟',
      type: QuestionType.SHORT_ANSWER,
      answer: 'لإدخال اللاخطية إلى خرج العصبون.'
    },
    {
        question: 'يحدث "التخصيص المفرط" (Overfitting) عندما يعمل النموذج جيدًا على بيانات التدريب ولكن بشكل سيء على بيانات الاختبار غير المرئية.',
        type: QuestionType.TRUE_FALSE,
        answer: 'صحيح'
    }
  ],
  [Specialization.GENERAL]: [
    {
      question: 'ماذا يعني اختصار CPU؟',
      type: QuestionType.SHORT_ANSWER,
      answer: 'وحدة المعالجة المركزية',
    },
    {
      question: 'أي بنية بيانات تعمل على أساس "آخر من يدخل، أول من يخرج" (LIFO)؟',
      type: QuestionType.MULTIPLE_CHOICE,
      options: ['الطابور', 'المكدس', 'القائمة المترابطة', 'الشجرة'],
      answer: 'المكدس',
    },
  ],
};

// Function to add IDs and isGenerated flag to the mock questions
const processQuestions = (questions: Omit<Question, 'id' | 'isGenerated'>[]): Question[] => {
    return questions.map((q, index) => ({
        ...q,
        id: `std-${q.type}-${index}`, // simple unique ID for standard questions
        isGenerated: false,
    }));
};

// Function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getStandardQuestions(specialization: Specialization, count: number): Question[] {
  const questionsForSpec = db[specialization] || [];
  if (questionsForSpec.length === 0) {
    throw new Error(`لا توجد أسئلة قياسية متاحة للتخصص: ${specialization}`);
  }
  
  const processedQuestions = processQuestions(questionsForSpec);
  const shuffledQuestions = shuffleArray(processedQuestions);
  return shuffledQuestions.slice(0, count);
}