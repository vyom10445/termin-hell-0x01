import React, { useState, useEffect, useCallback, useRef } from "react";
import { NUMBER_SEQUENCE, SCAN_INTERVAL } from "./constants";
import { LogEntry, AppState } from "./types";
import TerminalLog from "./components/TerminalLog";
import { getHackerInsight } from "./services/geminiService";

const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [appState, setAppState] = useState<AppState>(AppState.INITIALIZING);
  const [progress, setProgress] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // CHANGED: Removed .slice(-14) so logs accumulate without being deleted
  const addLog = useCallback(
    (content: string, type: LogEntry["type"] = "system") => {
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString("en-GB", { hour12: false }),
        content,
        type,
      };
      setLogs((prev) => [...prev, newLog]);
    },
    []
  );

  const handleStart = () => {
    setIsStarted(true);
    setAppState(AppState.DECODING);
    addLog(">> UPLINK ESTABLISHED. BYPASSING RING-0...", "warning");
    setTimeout(() => {
      setCurrentIndex(0);
    }, 1000);
  };

  // Main Hacking Sequence Logic
  useEffect(() => {
    if (!isStarted || appState !== AppState.DECODING || currentIndex < 0)
      return;

    if (currentIndex >= NUMBER_SEQUENCE.length) {
      setAppState(AppState.FINISHED);
      finishHacking();
      return;
    }

    const num = NUMBER_SEQUENCE[currentIndex];
    addLog(num, "binary");
    setProgress(((currentIndex + 1) / NUMBER_SEQUENCE.length) * 100);

    // Check if we need to inject the "scary" lines after every 3 numbers
    const shouldInjectScary =
      (currentIndex + 1) % 3 === 0 && currentIndex + 1 < NUMBER_SEQUENCE.length;

    if (shouldInjectScary) {
      const scaryMessages = [
        "THEY ARE WATCHING YOUR KEYSTROKES.",
        "YOUR FILES ARE BREATHING.",
        "THE VOID IS CONSUMING THE BUFFER.",
        "SYSTEM ENTROPY INCREASING.",
      ];
      // Inject lines immediately without adding extra timeouts
      const msg =
        scaryMessages[Math.floor(Math.random() * scaryMessages.length)];
      addLog(`!! ${msg}`, "warning");
      addLog(">> SOLVE THE BINARY BEFORE IT'S TOO LATE.", "hacker");
    }

    // Standard 2s pause between number groups
    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, SCAN_INTERVAL);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, appState, isStarted, addLog]);

  const finishHacking = async () => {
    await new Promise((r) => setTimeout(r, 1000));
    addLog("SEQUENCE COMPLETE. EXTRACTING PATTERNS...", "system");

    try {
      const insight = await getHackerInsight(NUMBER_SEQUENCE);
      addLog("FINAL DECODED REALITY:", "warning");
      addLog(insight, "ai");
    } catch (e) {
      addLog("DECODING FAILED. REALITY CORRUPTED.", "warning");
    }
    addLog(">> CONNECTION SEVERED.", "hacker");
  };

  return (
    <div className="relative h-screen w-screen bg-black flex flex-col p-4 md:p-6 overflow-hidden select-none">
      {!isStarted && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-md">
          <button
            onClick={handleStart}
            className="group relative px-10 py-5 border border-green-500 text-green-500 font-bold text-xl tracking-[0.4em] hover:bg-green-500 hover:text-black transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10">START_DECODING</span>
            <div className="absolute inset-0 bg-green-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </button>
        </div>
      )}

      {/* Compact HUD Header */}
      <div className="flex justify-between items-start z-10 opacity-40 mb-2 font-mono">
        <div className="border-l border-red-900 pl-2">
          <div className="text-[8px] text-red-500 uppercase tracking-widest animate-pulse">
            {isStarted ? `ACCESS_NODE_${appState}` : "SIGNAL_LOST"}
          </div>
        </div>
        <div className="text-right border-r border-green-900 pr-2">
          <div className="text-[8px] text-green-900">RATIO_16:9_LOCK</div>
        </div>
      </div>

      {/* Scaled Terminal View */}
      <div className="flex-1 flex flex-col relative overflow-hidden border border-green-950/10 bg-black/20">
        <TerminalLog logs={logs} />
      </div>

      {/* Progress Bar Area */}
      <div className="mt-3 z-10">
        <div className="flex justify-between mb-1 text-[7px] text-green-900 font-bold tracking-widest uppercase">
          <span>
            {appState === AppState.FINISHED
              ? "ENCRYPTION_COMPLETE"
              : "DATA_STREAM_SYNC"}
          </span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <div className="h-[1px] w-full bg-green-950/20">
          <div
            className="h-full bg-green-500 shadow-[0_0_8px_#22c55e] transition-all duration-[2000ms] ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
