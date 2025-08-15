import { GoogleGenAI, Type } from "@google/genai";
import type { Question } from '../types';
import { QuestionType, Difficulty, Specialization } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "The question text.",
      },
      type: {
        type: Type.STRING,
        enum: [QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.SHORT_ANSWER],
        description: "The type of the question.",
      },
      specialization: {
        type: Type.STRING,
        enum: Object.values(Specialization),
        description: "The specialization domain of the question."
      },
      options: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "An array of options for multiple choice questions. Should be empty for other types.",
      },
      answer: {
        type: Type.STRING,
        description: "The correct answer. For multiple choice, this must be one of the provided options.",
      },
    },
    required: ["question", "type", "specialization", "answer"],
  },
};

export async function generateExamQuestions(
  specialization: Specialization,
  numQuestions: number,
  questionType: QuestionType,
  difficulty: Difficulty,
  pdfText?: string
): Promise<Question[]> {
  const contextPrompt = pdfText
    ? `
    You are an expert exam creator. Your task is to generate a list of exam questions based *only* on the provided text content from a document. Do not use any external knowledge.
    
    Provided Content (first 30,000 characters):
    ---
    ${pdfText.substring(0, 30000)}
    ---

    The specialization for these questions should be inferred from the text, or set to "${Specialization.GENERAL}" if it's ambiguous.
    `
    : `
    You are an expert exam creator for a unified informatics engineering exam. Your task is to generate a list of exam questions.
    
    The specialization for the questions is: "${specialization}".
    `;

  const prompt = `
    ${contextPrompt}
    
    Instructions:
    1.  Generate exactly ${numQuestions} questions based on the provided context.
    2.  The difficulty level for all questions should be: ${difficulty}.
    3.  The type for all questions should be: ${questionType}.
    4.  The 'specialization' field must be correctly set. For non-PDF mode, it must be "${specialization}". For PDF mode, it should be inferred from the text.
    5.  For "${QuestionType.MULTIPLE_CHOICE}" questions, provide exactly 4 distinct options. One option must be the correct answer. The 'options' array should contain these 4 strings.
    6.  For "${QuestionType.TRUE_FALSE}" and "${QuestionType.SHORT_ANSWER}" questions, the 'options' array must be empty.
    7.  The 'answer' field must always contain the correct answer. For multiple choice, it must exactly match one of the strings in the 'options' array.
    8.  Ensure the generated content strictly adheres to the provided JSON schema. If the provided context is insufficient to generate the required number of questions, generate as many as you can.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: pdfText ? 0.5 : 0.8, // Be more factual with PDF text, more creative otherwise
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    if (!Array.isArray(parsedJson)) {
        throw new Error("لم تقم الواجهة البرمجية بإرجاع مصفوفة صالحة من الأسئلة.");
    }
    
    // Mark questions as AI-generated and add a unique ID
    return parsedJson.map((q: Omit<Question, 'id' | 'isGenerated'>) => ({ 
        ...q,
        id: crypto.randomUUID(),
        isGenerated: true 
    })) as Question[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`خطأ في واجهة Gemini البرمجية: ${error.message}`);
    }
    throw new Error("حدث خطأ غير معروف أثناء الاتصال بالواجهة البرمجية.");
  }
}