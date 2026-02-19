
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex items-start gap-4 ${isAssistant ? '' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
        isAssistant ? 'bg-indigo-600 text-white' : 'bg-amber-500 text-white'
      }`}>
        {isAssistant ? <i className="fa-solid fa-graduation-cap"></i> : <i className="fa-solid fa-user"></i>}
      </div>
      
      <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm border ${
        isAssistant 
          ? 'bg-white border-slate-200 rounded-tl-none' 
          : 'bg-indigo-50 border-indigo-100 rounded-tr-none text-slate-800'
      }`}>
        <div className={`prose prose-slate max-w-none text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
          isAssistant ? 'text-slate-700' : 'text-slate-800'
        }`}>
          {message.content}
        </div>
        
        <div className={`mt-2 flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold ${
          isAssistant ? 'text-slate-400' : 'text-indigo-400'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isAssistant && (
            <div className="flex items-center gap-2 ml-auto">
              <button className="hover:text-indigo-600 transition-colors"><i className="fa-regular fa-copy"></i></button>
              <button className="hover:text-indigo-600 transition-colors"><i className="fa-regular fa-thumbs-up"></i></button>
              <button className="hover:text-indigo-600 transition-colors"><i className="fa-regular fa-thumbs-down"></i></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
