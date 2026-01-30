
import React, { useEffect, useRef, useState } from 'react';
import { LogEntry } from '../types';

interface TerminalLogProps {
  logs: LogEntry[];
}

const TypedBinary: React.FC<{ text: string }> = ({ text }) => {
  const [visible, setVisible] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setVisible(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 60); 
    return () => clearInterval(interval);
  }, [text]);

  return <span className="binary-glow tracking-[0.2em] font-bold">{visible}</span>;
};

const TerminalLog: React.FC<TerminalLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto py-1 px-3 scroll-smooth"
      style={{ scrollbarWidth: 'none' }}
    >
      {logs.map((log) => (
        <div 
          key={log.id} 
          className={`flex gap-3 mb-1 animate-in slide-in-from-left-1 fade-in duration-300 ${
            log.type === 'binary' ? 'py-1 border-y border-green-950/5 bg-green-950/5' : ''
          }`}
        >
          <div className="flex-1 min-w-0">
            {log.type === 'binary' ? (
              <div className="flex items-center gap-2">
                <span className="text-red-700 font-bold text-xs animate-pulse">#</span>
                <span className="text-lg md:text-xl text-green-400">
                  <TypedBinary text={log.content} />
                </span>
              </div>
            ) : (
              <span className={`break-words text-[9px] md:text-[10px] tracking-tight ${
                log.type === 'hacker' ? 'text-green-500 font-medium' :
                log.type === 'warning' ? 'text-red-600 font-bold uppercase' :
                log.type === 'ai' ? 'text-cyan-500 italic opacity-80 border-l border-cyan-900/50 pl-2 ml-4 block my-1' :
                'text-green-900'
              }`}>
                {log.content}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TerminalLog;
