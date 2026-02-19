
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, StudyMode, ChatSession } from './types';
import { geminiService } from './geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { StudyModeSelector } from './components/StudyModeSelector';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<StudyMode>(StudyMode.GENERAL);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize first session
  useEffect(() => {
    const initialSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Study Session',
      messages: [],
      lastUpdated: new Date()
    };
    setSessions([initialSession]);
    setCurrentSessionId(initialSession.id);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const aiResponse = await geminiService.generateChatResponse(newMessages, content, mode);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update session title if it's the first message
      if (messages.length === 0) {
        setSessions(prev => prev.map(s => 
          s.id === currentSessionId ? { ...s, title: content.slice(0, 30) + (content.length > 30 ? '...' : '') } : s
        ));
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Study Session',
      messages: [],
      lastUpdated: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setMode(StudyMode.GENERAL);
  };

  const selectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
      setMessages(session.messages || []);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-slate-200 h-full overflow-hidden flex flex-col`}>
        <Sidebar 
          sessions={sessions} 
          currentId={currentSessionId} 
          onSelect={selectSession} 
          onNew={createNewSession} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <i className={`fa-solid ${sidebarOpen ? 'fa-indent' : 'fa-outdent'} text-xl`}></i>
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <i className="fa-solid fa-graduation-cap text-sm"></i>
                </span>
                EduBuddy
              </h1>
            </div>
          </div>

          <StudyModeSelector currentMode={mode} onSelect={setMode} />
          
          <div className="flex items-center gap-2">
             <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors">
               <i className="fa-solid fa-bolt"></i>
               Flashcards
             </button>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8" ref={scrollRef}>
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center text-4xl mb-6">
                  <i className="fa-solid fa-brain"></i>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">How can I help you study today?</h2>
                <p className="text-slate-500 max-w-md mb-10">
                  Select a study mode above or simply ask a question to get started. 
                  I can explain concepts, solve problems, or quiz you for exams.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {[
                    { icon: 'fa-microscope', text: 'Explain Photosynthesis simply', mode: StudyMode.EXPLAIN },
                    { icon: 'fa-calculator', text: 'Step-by-step: Solve for x in 2x+5=15', mode: StudyMode.STEP_BY_STEP },
                    { icon: 'fa-vial', text: 'Quiz me on basic Chemistry', mode: StudyMode.QUIZ },
                    { icon: 'fa-book-open', text: 'Summarize Hamlet Act 1', mode: StudyMode.GENERAL }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMode(preset.mode);
                        handleSendMessage(preset.text);
                      }}
                      className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all text-left"
                    >
                      <span className="w-10 h-10 shrink-0 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center">
                        <i className={`fa-solid ${preset.icon}`}></i>
                      </span>
                      <span className="text-sm font-medium text-slate-700">{preset.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))
            )}
            {isLoading && (
              <div className="flex items-start gap-4 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                  <i className="fa-solid fa-graduation-cap text-xs"></i>
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span className="text-sm text-slate-400 font-medium">EduBuddy is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Input Area */}
        <footer className="p-4 md:p-6 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            <p className="mt-3 text-center text-xs text-slate-400">
              EduBuddy can make mistakes. Verify important information for your exams.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
