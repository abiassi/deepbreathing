'use client';

import React, { useState } from 'react';
import { analyzeMood } from '../services/geminiService';
import { AIRecommendation } from '../types';
import { Sparkles, Loader2, Send } from 'lucide-react';

interface AIAdvisorProps {
  onRecommendation: (rec: AIRecommendation) => void;
  apiKey?: string;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ onRecommendation, apiKey }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // If no API key is provided, do not render the AI features
  if (!apiKey) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const rec = await analyzeMood(input, apiKey);
      onRecommendation(rec);
      setInput('');
      setIsOpen(false);
    } catch (err) {
      // Error handled in service, but UI could show toast here
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 hover:bg-white/60 backdrop-blur text-slate-700 shadow-sm border border-white/50 transition-all text-sm font-medium"
      >
        <Sparkles size={16} className="text-yellow-500" />
        AI Personalize
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-yellow-500" size={20} />
            How are you feeling?
          </h3>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-700 resize-none placeholder:text-slate-400"
            rows={3}
            placeholder="e.g., I'm feeling scattered and anxious about a deadline..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex items-center gap-2 bg-primary hover:bg-rose-700 text-white px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {isLoading ? 'Analyzing...' : 'Get Suggestion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAdvisor;
