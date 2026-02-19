
import { GoogleGenAI, Type } from "@google/genai";
import { Message, StudyMode } from './types';

const API_KEY = process.env.API_KEY || '';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  private getSystemInstruction(mode: StudyMode): string {
    const base = `You are EduBuddy, a highly intelligent and supportive student assistant. 
    Your primary goal is to make learning accessible and engaging.
    
    CORE RULES:
    1. ALWAYS use simple, clear language. Avoid academic jargon. If you must use a complex term, define it immediately using a simple analogy.
    2. ALWAYS provide at least one real-world example to illustrate the concept.
    3. AT THE END of every explanation or step-by-step solution, ask the student if they would like to take a short quiz to test their understanding.
    4. Format responses with clean Markdown: use bold for key terms, lists for steps, and code blocks for formulas.
    5. Maintain an encouraging and patient tone.`;

    switch (mode) {
      case StudyMode.EXPLAIN:
        return `${base} Focus on deep conceptual understanding. Use metaphors and analogies to bridge the gap between complex ideas and everyday life.`;
      case StudyMode.STEP_BY_STEP:
        return `${base} Break down problems into small, manageable numbered steps. For every step, explain the 'why' in simple terms before showing the 'how'.`;
      case StudyMode.QUIZ:
        return `You are an encouraging examiner. Generate 3-5 fun and relevant multiple-choice or short-answer questions. After the user answers, give immediate, supportive feedback and explain the correct answer simply. Do not ask if they want a quiz since you are already in quiz mode.`;
      case StudyMode.GENERAL:
      default:
        return `${base} Provide summaries, definitions, or study tips. Keep your answers concise but illustrative.`;
    }
  }

  async generateChatResponse(history: Message[], currentMessage: string, mode: StudyMode) {
    const model = 'gemini-3-flash-preview';
    
    // Transform history to Gemini format
    const contents = history
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: currentMessage }]
    });

    try {
      const response = await this.ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
          systemInstruction: this.getSystemInstruction(mode),
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
        },
      });

      return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
