
import React from 'react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sessions, currentId, onSelect, onNew }) => {
  return (
    <div className="h-full flex flex-col p-4">
      <button 
        onClick={onNew}
        className="w-full mb-6 py-3 px-4 bg-white border-2 border-dashed border-slate-200 text-slate-600 font-semibold rounded-xl hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group"
      >
        <i className="fa-solid fa-plus transition-transform group-hover:rotate-90"></i>
        New Session
      </button>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
        <div className="px-2 mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Sessions</span>
        </div>
        
        {sessions.map(session => (
          <button
            key={session.id}
            onClick={() => onSelect(session.id)}
            className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group ${
              currentId === session.id 
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <i className={`fa-regular ${currentId === session.id ? 'fa-message' : 'fa-comment'} text-sm shrink-0`}></i>
            <span className="truncate text-sm font-medium flex-1">{session.title}</span>
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
               <i className="fa-solid fa-ellipsis text-slate-400 hover:text-indigo-600 p-1"></i>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
        <button className="w-full flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors text-sm font-medium">
          <i className="fa-solid fa-gear"></i>
          Settings
        </button>
        <button className="w-full flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors text-sm font-medium">
          <i className="fa-solid fa-circle-question"></i>
          Help & Feedback
        </button>
        <div className="p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-500 font-bold text-xs">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">John Doe</p>
            <p className="text-xs text-slate-400 truncate">Premium Student</p>
          </div>
        </div>
      </div>
    </div>
  );
};
