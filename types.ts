
export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

export enum StudyMode {
  EXPLAIN = 'EXPLAIN',
  STEP_BY_STEP = 'STEP_BY_STEP',
  QUIZ = 'QUIZ',
  GENERAL = 'GENERAL'
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}
