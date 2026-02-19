
import React from 'react';
import { StudyMode } from '../types';

interface StudyModeSelectorProps {
  currentMode: StudyMode;
  onSelect: (mode: StudyMode) => void;
}

export const StudyModeSelector: React.FC<StudyModeSelectorProps> = ({ currentMode, onSelect }) => {
  const modes = [
    { id: StudyMode.GENERAL, label: 'General', icon: 'fa-brain' },
    { id: StudyMode.EXPLAIN, label: 'Explain', icon: 'fa-lightbulb' },
    { id: StudyMode.STEP_BY_STEP, label: 'Steps', icon: 'fa-list-check' },
    { id: StudyMode.QUIZ, label: 'Quiz', icon: 'fa-puzzle-piece' },
  ];

  return (
    <div className="bg-slate-100 p-1 rounded-xl flex items-center shadow-inner">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
            currentMode === mode.id
              ? 'bg-white text-indigo-600 shadow-sm transform scale-105'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
          }`}
        >
          <i className={`fa-solid ${mode.icon} ${currentMode === mode.id ? 'text-indigo-600' : 'text-slate-400'}`}></i>
          <span className="hidden xs:inline">{mode.label}</span>
        </button>
      ))}
    </div>
  );
};
