import React, { useEffect, useState, useRef } from 'react';
import { marked } from 'marked';

// Declare mermaid globally to avoid TS errors since we load it via CDN
declare const mermaid: any;

interface AnalysisResultProps {
  markdown: string;
  onRefine: (feedback: string) => void;
  isRefining: boolean;
}

export const AnalysisResultView: React.FC<AnalysisResultProps> = ({ markdown, onRefine, isRefining }) => {
  const [feedback, setFeedback] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Convert markdown to HTML
  const htmlContent = marked.parse(markdown) as string;

  useEffect(() => {
    if (contentRef.current && typeof mermaid !== 'undefined') {
      mermaid.initialize({ 
        startOnLoad: false, 
        theme: 'dark',
        securityLevel: 'loose',
        themeVariables: {
            fontFamily: 'Inter',
            primaryColor: '#3b82f6',
            primaryTextColor: '#fff',
            primaryBorderColor: '#60a5fa',
            lineColor: '#94a3b8',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
        }
      });
      
      mermaid.run({
        nodes: contentRef.current.querySelectorAll('.language-mermaid'),
      }).catch((err: any) => console.error("Mermaid render error:", err));
    }
  }, [markdown]);

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'StackSentinel_Analysis.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmitRefinement = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onRefine(feedback);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-[slideUp_0.6s_ease-out_forwards] opacity-0 pb-20">
      <div className="glass-panel rounded-xl overflow-hidden shadow-2xl shadow-black/50">
        
        {/* Header */}
        <div className="bg-cyber-darker/80 border-b border-slate-700/50 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-rounded text-cyber-success">verified_user</span>
            <span className="text-slate-300 font-mono text-sm">ANALYSIS_COMPLETE</span>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleDownload}
              className="flex items-center space-x-1 px-3 py-1 rounded bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-cyber-primary/50 transition-colors text-xs text-slate-300 font-medium group"
              title="Download Report as Markdown"
            >
              <span className="material-symbols-rounded text-sm text-slate-400 group-hover:text-cyber-primary transition-colors">download</span>
              <span>Export</span>
            </button>
            <div className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 border border-slate-700">
               <span className="w-2 h-2 rounded-full bg-cyber-success animate-pulse"></span>
               <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 overflow-y-auto max-h-[800px] relative">
          <div 
            ref={contentRef}
            className="markdown-body font-sans text-slate-300"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        {/* Refinement Protocol */}
        <div className="bg-[#0B0E14] border-t border-slate-800 p-6">
          <h4 className="text-slate-400 text-xs font-mono mb-3 tracking-widest uppercase flex items-center">
             <span className="material-symbols-rounded text-sm mr-2 text-cyber-primary">tune</span>
             Refine Analysis Protocol
          </h4>
          <form onSubmit={handleSubmitRefinement} className="flex gap-4">
             <div className="flex-grow relative">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide context (e.g., 'We use AWS Lambda, not EC2' or 'Add a Redis layer')..."
                  className="w-full bg-[#151923] border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-cyber-primary/50 placeholder-slate-600 font-mono h-12 min-h-[48px] resize-none focus:h-24 transition-all"
                  disabled={isRefining}
                />
             </div>
             <button 
               type="submit" 
               disabled={!feedback.trim() || isRefining}
               className={`
                 px-6 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex items-center gap-2
                 ${isRefining 
                    ? 'bg-slate-800 text-slate-500 cursor-wait' 
                    : 'bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-primary hover:bg-cyber-primary hover:text-white'
                 }
               `}
             >
               {isRefining ? (
                 <>
                   <span className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></span>
                   Thinking...
                 </>
               ) : (
                 <>
                   <span>Update Analysis</span>
                   <span className="material-symbols-rounded text-lg">arrow_upward</span>
                 </>
               )}
             </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-cyber-darker/90 border-t border-slate-800 p-4 flex justify-between items-center text-xs text-slate-500 font-mono">
          <span>GENERATED BY GEMINI 3 PRO</span>
          <span>STACK_SENTINEL_V1.5</span>
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};