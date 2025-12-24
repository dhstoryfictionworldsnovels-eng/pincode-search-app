
import React, { useState } from 'react';
import { Search, LocateFixed, Mic, Sparkles, X, BrainCircuit } from 'lucide-react';

interface SearchBoxProps {
  onSearch: (query: string, isAI?: boolean) => void;
  onNearMe: () => void;
  isLocating: boolean;
  isAIProcessing: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, onNearMe, isLocating, isAIProcessing }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.start();
    setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      onSearch(transcript, true);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="relative group">
        <form 
          onSubmit={handleSubmit}
          className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,112,184,0.15)] border border-slate-100 p-2 flex items-center gap-2 ring-1 ring-slate-200/50 hover:ring-blue-400/30 transition-all duration-500"
        >
          <div className="flex-1 relative flex items-center">
            <div className="pl-6 pr-4 text-blue-600">
              <BrainCircuit size={24} className={isAIProcessing ? 'animate-pulse' : ''} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Pincode or Area (e.g. 500016 or Ameerpet)"
              className="w-full py-5 text-lg font-medium text-slate-800 focus:outline-none placeholder:text-slate-300"
            />
            
            <div className="flex items-center gap-1 pr-2">
              {query && (
                <button 
                  type="button" 
                  onClick={() => setQuery('')}
                  className="p-2 text-slate-300 hover:text-slate-500"
                >
                  <X size={18} />
                </button>
              )}
              <button
                type="button"
                onClick={startVoiceSearch}
                className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
              >
                <Mic size={22} />
              </button>
              <button
                type="button"
                onClick={() => onSearch(query, true)}
                disabled={isAIProcessing || !query.trim()}
                className={`p-3 rounded-full transition-all ${isAIProcessing ? 'animate-spin text-purple-600' : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50'}`}
              >
                <Sparkles size={22} />
              </button>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onNearMe}
            disabled={isLocating}
            className="hidden sm:flex p-5 bg-slate-50 text-slate-500 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            <LocateFixed size={22} className={isLocating ? 'animate-spin' : ''} />
          </button>
          
          <button
            type="submit"
            className="px-8 py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-full hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
          >
            <Search size={22} />
          </button>
        </form>
        
        <div className="absolute -bottom-10 left-10 flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Unified Search</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> AI Detection</span>
        </div>
      </div>
    </div>
  );
};
