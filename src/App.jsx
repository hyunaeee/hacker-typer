import React, { useState, useEffect, useRef, useMemo } from 'react';

// --- Google Fonts & Custom Styles ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

    :root {
      --hacker-green: #0f0;
      --hacker-dark: #001100;
      --hacker-red: #ff3333;
    }

    body {
      background-color: black;
      margin: 0;
      overflow: hidden;
      font-family: 'VT323', monospace;
    }

    /* CRT Scanline Effect */
    .scanlines {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(
        to bottom,
        rgba(255,255,255,0),
        rgba(255,255,255,0) 50%,
        rgba(0,0,0,0.2) 50%,
        rgba(0,0,0,0.2)
      );
      background-size: 100% 4px;
      pointer-events: none;
      z-index: 50;
    }

    .scanlines::before {
      content: " ";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(18, 16, 16, 0.1);
      opacity: 0;
      z-index: 50;
      animation: flicker 0.15s infinite;
    }

    /* Text Glow */
    .glow-text {
      text-shadow: 0 0 5px var(--hacker-green), 0 0 10px var(--hacker-green);
    }
    .glow-text-red {
      text-shadow: 0 0 5px var(--hacker-red), 0 0 10px var(--hacker-red);
      color: var(--hacker-red);
    }

    /* Cursor Blink */
    .cursor {
      display: inline-block;
      width: 10px;
      height: 1.2em;
      background-color: var(--hacker-green);
      animation: blink 1s step-end infinite;
      vertical-align: bottom;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    @keyframes flicker {
      0% { opacity: 0.02; }
      5% { opacity: 0.05; }
      10% { opacity: 0.02; }
      15% { opacity: 0.06; }
      20% { opacity: 0.02; }
      50% { opacity: 0.02; }
      55% { opacity: 0.05; }
      60% { opacity: 0.02; }
      65% { opacity: 0.04; }
      70% { opacity: 0.01; }
      100% { opacity: 0.02; }
    }

    /* Glitch Effect for Titles */
    .glitch {
      position: relative;
    }
    .glitch::before, .glitch::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .glitch::before {
      left: 2px;
      text-shadow: -1px 0 red;
      clip: rect(24px, 550px, 90px, 0);
      animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
    }
    .glitch::after {
      left: -2px;
      text-shadow: -1px 0 blue;
      clip: rect(85px, 550px, 140px, 0);
      animation: glitch-anim-2 3s infinite linear alternate-reverse;
    }

    @keyframes glitch-anim-1 {
      0% { clip: rect(20px, 9999px, 10px, 0); }
      100% { clip: rect(80px, 9999px, 90px, 0); }
    }
    @keyframes glitch-anim-2 {
      0% { clip: rect(10px, 9999px, 80px, 0); }
      100% { clip: rect(90px, 9999px, 20px, 0); }
    }

    /* Scrollbar hidden */
    ::-webkit-scrollbar {
        display: none;
    }
  `}</style>
);

// --- Background Matrix Rain Component ---
const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const columns = Math.floor(width / 20);
    const drops = Array(columns).fill(1);

    // Matrix characters - Changed to Binary
    const chars = "01";

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#0f0';
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 opacity-30" />;
};

// --- Boot Sequence Component ---
const BootSequence = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const scrollRef = useRef(null);

  const bootText = [
    "INITIALIZING KERNEL...",
    "LOADING MODULES: [ OK ]",
    "BYPASSING FIREWALL...",
    "DECRYPTING SSL/TLS...",
    "ACCESSING MAINFRAME...",
    "ESTABLISHING SECURE CONNECTION...",
    "UPLOADING SHELL...",
    "ROOT ACCESS GRANTED.",
    "WELCOME, USER."
  ];

  useEffect(() => {
    let delay = 0;
    bootText.forEach((text, index) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setLines(prev => [...prev, text]);
        if (index === bootText.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, delay);
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full z-10 relative">
      <div className="w-full max-w-2xl p-8 border-2 border-green-500 bg-black bg-opacity-90 rounded shadow-[0_0_20px_rgba(0,255,0,0.3)]">
        <h1 className="text-4xl text-green-500 mb-4 font-bold glitch" data-text="SYSTEM BOOT">SYSTEM BOOT</h1>
        <div ref={scrollRef} className="h-64 overflow-y-auto font-mono text-lg text-green-400 space-y-1">
          {lines.map((line, i) => (
            <div key={i} className="border-l-2 border-green-500 pl-2 animate-pulse">
              {`> ${line}`}
            </div>
          ))}
          <div className="animate-pulse">_</div>
        </div>
      </div>
    </div>
  );
};

// --- Main Typing Game Component ---
const HackingInterface = ({ onLogout }) => {
  const codeSnippets = [
    "function bypassFirewall(target) { return target.securityLevel < 0; }",
    "const rootAccess = await system.decrypt('SHA-256', privateKey);",
    "if (user.isAdmin) { system.grantPermission('RWX'); launchPayload(); }",
    "while(connection.isAlive) { packets.send(malwareBuffer); sleep(10); }",
    "sudo rm -rf /var/logs/audit/* && echo 'Tracks covered successfully';",
    "import os; os.system('nmap -sS -T4 192.168.1.1'); // Scanning ports",
    "SELECT * FROM users WHERE password_hash LIKE '%admin%'; -- SQL Injection",
    "docker run -d --net=host --name=bruteforce exploit/script:latest",
  ];

  const [currentSnippet, setCurrentSnippet] = useState("");
  const [input, setInput] = useState("");
  const [stats, setStats] = useState({ wpm: 0, accuracy: 100, timeLeft: 60, score: 0 });
  const [gameState, setGameState] = useState('idle'); // idle, playing, finished
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize game
  const startGame = () => {
    setGameState('playing');
    setInput("");
    setStats({ wpm: 0, accuracy: 100, timeLeft: 60, score: 0 });
    nextSnippet();
    inputRef.current?.focus();
  };

  const nextSnippet = () => {
    const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    setCurrentSnippet(randomSnippet);
    setInput("");
  };

  // Timer Logic
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setStats(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(timerRef.current);
            setGameState('finished');
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // Calculate WPM & Accuracy
  const calculateStats = (currentInput) => {
    const words = stats.score + (currentInput.length / 5);
    const timeElapsed = 60 - stats.timeLeft;
    const wpm = timeElapsed > 0 ? Math.round((words / timeElapsed) * 60) : 0;

    return wpm;
  };

  const handleInput = (e) => {
    if (gameState !== 'playing') return;

    const val = e.target.value;
    setInput(val);

    // Check if completed
    if (val === currentSnippet) {
      setStats(prev => ({ ...prev, score: prev.score + 1, wpm: calculateStats(val) }));
      nextSnippet();
    }
  };

  // Focus keeper
  useEffect(() => {
    if (gameState === 'playing') inputRef.current?.focus();
  }, [gameState, currentSnippet]);


  // Render styled text
  const renderText = () => {
    return currentSnippet.split('').map((char, index) => {
      let className = "text-gray-500"; // Untyped
      if (index < input.length) {
        className = input[index] === char ? "text-green-400 glow-text" : "text-red-500 glow-text-red line-through";
      }
      return <span key={index} className={className}>{char}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full z-10 relative p-4">
      {/* Stats HUD */}
      <div className="absolute top-4 left-4 p-4 border border-green-800 bg-black bg-opacity-80 text-green-500 font-mono rounded w-64">
        <div className="flex justify-between border-b border-green-900 pb-2 mb-2">
          <span>STATUS</span>
          <span className={gameState === 'playing' ? "text-green-400 animate-pulse" : "text-yellow-500"}>
            {gameState === 'playing' ? "INTRUSION ACTIVE" : "STANDBY"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-green-700">TIME LEFT</div>
            <div className="text-2xl">{stats.timeLeft}s</div>
          </div>
          <div>
            <div className="text-xs text-green-700">COMPLETED</div>
            <div className="text-2xl">{stats.score}</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-green-700">WPM (EST)</div>
            <div className="text-2xl">{stats.wpm}</div>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="w-full max-w-4xl relative">
        {gameState === 'idle' && (
          <div className="text-center space-y-6 animate-fade-in-up">
            <h1 className="text-6xl text-green-500 font-bold mb-4 glitch" data-text="TARGET LOCKED">TARGET LOCKED</h1>
            <p className="text-xl text-green-300 mb-8">Ready to breach the system firewall?</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-green-900 text-green-100 text-xl border border-green-500 hover:bg-green-700 hover:shadow-[0_0_20px_#0f0] transition-all duration-200"
            >
              [ INITIATE HACK ]
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="bg-black bg-opacity-90 border-2 border-green-600 p-8 rounded shadow-[0_0_30px_rgba(0,255,0,0.2)] backdrop-blur-sm">
            <div className="text-xs text-green-700 mb-2 flex justify-between">
              <span>/bin/execute_payload.sh</span>
              <span>ROOT PRIVILEGES REQUIRED</span>
            </div>
            <div className="text-2xl md:text-3xl font-mono leading-relaxed tracking-wide break-all min-h-[100px]" onClick={() => inputRef.current.focus()}>
              {renderText()}
              <span className="cursor"></span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInput}
              className="opacity-0 absolute top-0 left-0 w-full h-full cursor-default"
              autoFocus
            />
          </div>
        )}

        {gameState === 'finished' && (
          <div className="text-center bg-black bg-opacity-95 border-2 border-green-500 p-10 rounded-lg shadow-[0_0_50px_rgba(0,255,0,0.4)] z-50">
            <h2 className="text-5xl text-green-500 mb-6 glitch" data-text="MISSION REPORT">MISSION REPORT</h2>
            <div className="text-2xl text-green-300 space-y-2 mb-8">
              <p>LINES CRACKED: {stats.score}</p>
              <p>SPEED: {stats.wpm} WPM</p>
              <p className="text-sm text-green-600 mt-4">Log trace deleted...</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={startGame}
                className="px-6 py-2 border border-green-500 text-green-400 hover:bg-green-900 transition"
              >
                RETRY BREACH
              </button>
              <button
                onClick={onLogout}
                className="px-6 py-2 border border-red-500 text-red-400 hover:bg-red-900 transition"
              >
                ABORT CONNECTION
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- App Container ---
export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-green-500 overflow-hidden selection:bg-green-900 selection:text-white">
      <GlobalStyles />
      <div className="scanlines"></div>
      <MatrixRain />

      {!booted ? (
        <BootSequence onComplete={() => setBooted(true)} />
      ) : (
        <HackingInterface onLogout={() => setBooted(false)} />
      )}
    </div>
  );
}