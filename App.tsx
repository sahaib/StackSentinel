import React, { useState } from 'react';
import { DropZone } from './components/DropZone';
import { LoadingState } from './components/LoadingState';
import { AnalysisResultView } from './components/AnalysisResult';
import { analyzeArchitecture, refineArchitecture } from './services/geminiService';
import { AnalysisStatus } from './types';

const FeatureCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="glass-card p-6 rounded-xl flex flex-col items-start hover:translate-y-[-5px] transition-all duration-300">
    <div className="w-10 h-10 rounded-lg bg-cyber-primary/10 flex items-center justify-center mb-4 text-cyber-primary border border-cyber-primary/20">
      <span className="material-symbols-rounded">{icon}</span>
    </div>
    <h3 className="text-slate-100 font-semibold mb-2 tracking-wide">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [resultMarkdown, setResultMarkdown] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRefining, setIsRefining] = useState(false);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setStatus(AnalysisStatus.SCANNING);
    
    try {
      const result = await analyzeArchitecture(file);
      setResultMarkdown(result.markdown);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleRefine = async (feedback: string) => {
    if (!selectedFile) return;
    setIsRefining(true);
    try {
      // We pass the current markdown so the model knows the context, plus the image.
      const result = await refineArchitecture(selectedFile, resultMarkdown, feedback);
      setResultMarkdown(result.markdown);
    } catch (error) {
      console.error("Refinement error:", error);
    } finally {
      setIsRefining(false);
    }
  };

  const reset = () => {
    setStatus(AnalysisStatus.IDLE);
    setResultMarkdown('');
    setSelectedFile(null);
    setIsRefining(false);
  };

  return (
    <div className="min-h-screen relative font-sans selection:bg-cyber-primary/30 selection:text-white">
      
      {/* Dynamic Glow Orbs */}
      <div className="fixed top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-cyber-primary/10 blur-[120px] pointer-events-none animate-float"></div>
      <div className="fixed bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-cyber-accent/10 blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={reset}>
            <div className="relative">
              <span className="material-symbols-rounded text-cyber-primary text-3xl relative z-10 group-hover:scale-110 transition-transform">shield_lock</span>
              <div className="absolute inset-0 bg-cyber-primary blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider text-white leading-none">
                STACK<span className="text-cyber-primary">SENTINEL</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-[0.2em] uppercase">Architecture Guardian</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-success"></span>
                </span>
                <span className="text-xs font-mono text-slate-300">SYSTEM ONLINE</span>
             </div>
             <div className="px-4 py-2 rounded bg-gradient-to-r from-cyber-primary/20 to-cyber-accent/20 border border-cyber-primary/30 text-xs font-mono text-cyan-300 flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <span className="material-symbols-rounded text-sm">bolt</span>
                Powered by Gemini 3
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          {/* Landing Hero - Only show when IDLE */}
          {status === AnalysisStatus.IDLE && (
            <div className="flex flex-col items-center text-center mb-16 max-w-4xl animate-[fadeIn_0.8s_ease-out]">
              <div className="mb-6 px-4 py-1.5 rounded-full border border-cyber-accent/30 bg-cyber-accent/10 text-cyber-accent text-xs font-bold tracking-widest uppercase inline-block">
                The Future of DevOps is Here
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
                Architect systems that <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-glow">
                  refuse to fail.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
                Upload your diagram. Our multi-modal AI analyzes data flow, identifying 
                <span className="text-slate-200 font-medium"> bottlenecks</span>, 
                <span className="text-slate-200 font-medium"> security gaps</span>, and 
                <span className="text-slate-200 font-medium"> scalability risks</span> instantly.
              </p>
            </div>
          )}

          {/* Interaction Zone */}
          <div className="w-full max-w-3xl z-20 transition-all duration-500 ease-in-out">
            {status === AnalysisStatus.IDLE && (
              <div className="animate-[fadeInUp_0.5s_ease-out_0.2s] fill-mode-forwards">
                 <DropZone onFileSelect={handleFileSelect} />
                 
                 {/* Feature Grid - Only visible in IDLE state */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
                    <FeatureCard 
                      icon="hub" 
                      title="SPOF Detection" 
                      desc="Instantly highlights single points of failure in your load balancing and database layers."
                    />
                    <FeatureCard 
                      icon="speed" 
                      title="Traffic Simulation" 
                      desc="Simulates 100x traffic spikes to predict latency and locking issues before production."
                    />
                    <FeatureCard 
                      icon="security" 
                      title="Security Audit" 
                      desc="Scans for public endpoints, unencrypted transport, and missing IAM policies."
                    />
                 </div>
              </div>
            )}

            {status === AnalysisStatus.SCANNING && (
              <div className="mt-10">
                <LoadingState />
              </div>
            )}

            {status === AnalysisStatus.COMPLETE && (
              <div className="flex flex-col items-center w-full">
                <AnalysisResultView 
                  markdown={resultMarkdown} 
                  onRefine={handleRefine}
                  isRefining={isRefining}
                />
                <button 
                  onClick={reset}
                  className="mt-12 group relative px-8 py-3 rounded-full bg-[#0B0E14] text-slate-300 font-medium border border-slate-700 overflow-hidden transition-all hover:border-cyber-primary/50 hover:text-white"
                >
                  <div className="absolute inset-0 w-0 bg-cyber-primary/10 transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                  <div className="relative flex items-center gap-2">
                    <span className="material-symbols-rounded">restart_alt</span>
                    <span>Analyze Another Architecture</span>
                  </div>
                </button>
              </div>
            )}

            {status === AnalysisStatus.ERROR && (
              <div className="text-center mt-10 p-1px rounded-xl bg-gradient-to-r from-red-500/50 to-orange-500/50 p-[1px]">
                <div className="bg-[#0B0E14] rounded-xl p-8 flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                     <span className="material-symbols-rounded text-3xl">warning</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Analysis Interrupted</h3>
                  <p className="text-slate-400 mb-6 max-w-md">Our sentinels encountered an unexpected error while traversing the neural network.</p>
                  <button 
                    onClick={reset}
                    className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
                  >
                    Retry Operation
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/5 mt-auto relative z-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 font-mono">
          <p>© 2025 STACKSENTINEL LABS. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="https://www.linkedin.com/in/sahaibsingh/" target="_blank" rel="noopener noreferrer" className="hover:text-cyber-primary cursor-pointer transition-colors">LINKEDIN</a>
            <a href="https://github.com/sahaib" target="_blank" rel="noopener noreferrer" className="hover:text-cyber-primary cursor-pointer transition-colors">GITHUB</a>
            <a href="https://work.sahaibsingh.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cyber-primary cursor-pointer transition-colors">PORTFOLIO</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fill-mode-forwards {
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default App;