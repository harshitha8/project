
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="relative flex items-end gap-2 p-2 bg-slate-50 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 rounded-2xl transition-all shadow-sm">
        <button 
          type="button" 
          className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-colors shrink-0"
        >
          <i className="fa-solid fa-paperclip"></i>
        </button>
        
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask EduBuddy anything..."
          rows={1}
          disabled={disabled}
          className="flex-1 max-h-48 py-3 px-1 bg-transparent border-none focus:ring-0 resize-none text-slate-700 placeholder-slate-400 scrollbar-hide text-base leading-relaxed"
        />

        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={`p-3 w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 shrink-0 ${
            input.trim() && !disabled 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </form>
  );
};
