import React, { useCallback, useState } from 'react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        group relative w-full h-80 rounded-xl transition-all duration-500 ease-out cursor-pointer overflow-hidden
        ${isDragging 
          ? 'scale-[1.02] shadow-[0_0_50px_rgba(59,130,246,0.2)]' 
          : 'hover:bg-slate-900/40'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
      `}
    >
      {/* Background with Grid */}
      <div className="absolute inset-0 bg-[#0B0E14] opacity-90 backdrop-blur-sm z-0"></div>
      <div className="absolute inset-0 opacity-[0.08] z-0" 
           style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Corner Accents (HUD Style) */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 transition-colors duration-300 z-10 ${isDragging ? 'border-cyber-primary' : 'border-slate-600 group-hover:border-cyber-primary/50'}`}></div>
      <div className={`absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 transition-colors duration-300 z-10 ${isDragging ? 'border-cyber-primary' : 'border-slate-600 group-hover:border-cyber-primary/50'}`}></div>
      <div className={`absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 transition-colors duration-300 z-10 ${isDragging ? 'border-cyber-primary' : 'border-slate-600 group-hover:border-cyber-primary/50'}`}></div>
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 transition-colors duration-300 z-10 ${isDragging ? 'border-cyber-primary' : 'border-slate-600 group-hover:border-cyber-primary/50'}`}></div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        
        {/* Animated Icon Container */}
        <div className={`
          relative w-24 h-24 mb-6 flex items-center justify-center transition-all duration-500
          ${isDragging ? 'scale-110' : 'group-hover:scale-105'}
        `}>
          {/* Rotating Rings */}
          <div className={`absolute inset-0 border border-slate-700 rounded-full transition-all duration-500 ${isDragging ? 'border-cyber-primary/40 animate-[spin_3s_linear_infinite]' : ''}`}></div>
          <div className={`absolute inset-2 border border-dashed border-slate-700 rounded-full transition-all duration-500 ${isDragging ? 'border-cyber-primary/60 animate-[spin_5s_linear_infinite_reverse]' : ''}`}></div>
          
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300
            ${isDragging ? 'bg-cyber-primary/20 text-cyber-primary shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-slate-800/80 text-slate-400 group-hover:text-cyber-primary group-hover:bg-slate-800'}
          `}>
            <span className="material-symbols-rounded text-4xl">add_photo_alternate</span>
          </div>
        </div>
        
        <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${isDragging ? 'text-white' : 'text-slate-200'}`}>
          {isDragging ? 'Release to Initialize Scan' : 'Drop System Diagram'}
        </h3>
        
        <p className="text-slate-500 text-sm max-w-xs text-center leading-relaxed">
          Upload schematic (PNG, JPG). <br/>
          <span className="text-cyber-primary/80 font-mono text-xs mt-2 block tracking-wider">
            [ READY FOR ANALYSIS ]
          </span>
        </p>
      </div>
    </div>
  );
};