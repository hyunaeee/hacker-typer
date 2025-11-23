import React, { useState, useEffect, useRef } from 'react';

// --- Global Styles & Animations ---
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

    /* CRT Overlay */
    .crt-overlay {
      background: rgba(18, 16, 16, 0.1);
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 5;
    }

    /* Scanlines */
    .scanlines {
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

    /* Animations */
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

    .cursor { animation: blink 1s step-end infinite; }
    .animate-pop-in { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    
    .glow-text { text-shadow: 0 0 5px var(--hacker-green), 0 0 10px var(--hacker-green); }
    .glow-error { 
      text-shadow: 0 0 5px red, 0 0 10px red; 
      color: #ff3333;
      background-color: rgba(255, 0, 0, 0.2);
    }
    
    /* Scrollbar hidden */
    ::-webkit-scrollbar { display: none; }
  `}</style>
);

// --- Background Matrix Rain ---
const MatrixRain = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const columns = Math.floor(width / 20);
    const drops = Array(columns).fill(1);
    const chars = "01";

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#0f0';
      ctx.font = '15px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);
        if (drops[i] * 20 > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 opacity-20" />;
};

// --- Boot Sequence ---
const BootSequence = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const scrollRef = useRef(null);
  const bootText = [
    "INITIALIZING KERNEL...", "LOADING MODULES: [ OK ]", "BYPASSING FIREWALL...",
    "DECRYPTING SSL/TLS...", "ACCESSING MAINFRAME...", "ESTABLISHING SECURE CONNECTION...",
    "UPLOADING SHELL...", "ROOT ACCESS GRANTED.", "WELCOME, USER."
  ];

  useEffect(() => {
    let delay = 0;
    bootText.forEach((text, index) => {
      delay += Math.random() * 200 + 100;
      setTimeout(() => {
        setLines(prev => [...prev, text]);
        if (index === bootText.length - 1) setTimeout(onComplete, 800);
      }, delay);
    });
  }, []);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [lines]);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full z-10 relative bg-black">
      <div className="w-full max-w-2xl p-8 border-2 border-green-500 bg-black bg-opacity-90 rounded shadow-[0_0_20px_rgba(0,255,0,0.3)]">
        <h1 className="text-4xl text-green-500 mb-4 font-bold">SYSTEM BOOT</h1>
        <div ref={scrollRef} className="h-64 overflow-y-auto font-mono text-lg text-green-400 space-y-1">
          {lines.map((line, i) => <div key={i} className="border-l-2 border-green-500 pl-2 animate-pulse">{`> ${line}`}</div>)}
          <div className="animate-pulse">_</div>
        </div>
      </div>
    </div>
  );
};

// --- Bottom Log Component ---
const BottomSystemLog = ({ active }) => {
  const [logs, setLogs] = useState([]);

  const randomLogs = [
    "Scanning ports 80, 443, 8080...", "Packet sniffing initiated...",
    "Brute force attempt: admin/1234 [FAILED]", "Handshake captured...",
    "Injecting SQL payload...", "Bypassing proxy server...",
    "Keylogger active...", "Downloading shadow file...",
    "Buffer overflow detected...", "Updating kernel patches...",
    "Tracing route to host...", "Data packet intercepted...",
    "Firewall breach detected on Port 22..."
  ];

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      const newLog = `[${new Date().toLocaleTimeString()}] ${randomLogs[Math.floor(Math.random() * randomLogs.length)]}`;
      setLogs(prev => [...prev.slice(-8), newLog]);
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="w-full h-32 border-t border-green-900 bg-black bg-opacity-90 text-xs font-mono p-2 absolute bottom-0 left-0 z-20">
      <div className="text-green-500 border-b border-green-800 mb-1 font-bold flex justify-between">
        <span>SYSTEM LOGS - /var/log/syslog</span>
        <span>STATUS: ACTIVE</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        {logs.map((log, i) => (
          <div key={i} className="text-green-700 truncate opacity-80">{'>'} {log}</div>
        ))}
      </div>
    </div>
  );
};

// --- Decorative Panels ---
const HexDumpPanel = () => {
  const [hex, setHex] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const lines = [];
      for (let i = 0; i < 15; i++) {
        let line = "";
        for (let j = 0; j < 6; j++) {
          line += Math.floor(Math.random() * 255).toString(16).padStart(2, '0').toUpperCase() + " ";
        }
        lines.push(line);
      }
      setHex(lines);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:block w-48 border border-green-800 bg-black bg-opacity-50 p-2 font-mono text-[10px] text-green-800 opacity-60">
      <div className="border-b border-green-900 mb-1 text-green-600">MEMORY_DUMP</div>
      {hex.map((line, i) => <div key={i}>{line}</div>)}
    </div>
  );
};

const ServerStatusPanel = () => {
  const servers = [
    { name: "Auth_Svr", status: "ONLINE" },
    { name: "Proxy_01", status: "ONLINE" },
    { name: "DB_Main", status: "LOCKED" },
    { name: "Firewall", status: "BYPASSED" },
    { name: "Node_JP", status: "ONLINE" },
    { name: "Node_US", status: "OFFLINE" },
  ];

  return (
    <div className="hidden lg:block w-48 border border-green-800 bg-black bg-opacity-50 p-2 font-mono text-xs text-green-700 opacity-80">
      <div className="border-b border-green-900 mb-2 text-green-600">SERVER_STATUS</div>
      <div className="space-y-1">
        {servers.map((s, i) => (
          <div key={i} className="flex justify-between">
            <span>{s.name}</span>
            <span className={s.status === "ONLINE" || s.status === "BYPASSED" ? "text-green-500" : "text-red-500"}>
              [{s.status}]
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-green-900 pt-1">
        <div className="text-[10px]">CPU_LOAD: {Math.floor(Math.random() * 30 + 60)}%</div>
        <div className="text-[10px]">MEM_USAGE: {Math.floor(Math.random() * 20 + 70)}%</div>
      </div>
    </div>
  );
};


// --- Success Modal Component ---
const SuccessModal = ({ result, onNext }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
    <div className="bg-black border-4 border-green-500 p-8 rounded-lg shadow-[0_0_50px_#0f0] max-w-md w-full text-center animate-pop-in relative overflow-hidden">
      <h2 className="text-5xl font-bold text-green-500 mb-2 glow-text tracking-widest">ACCESS GRANTED</h2>
      <div className="h-1 w-full bg-green-900 mb-6 relative"><div className="absolute h-full bg-green-500 w-full animate-pulse"></div></div>

      <div className="space-y-4 mb-8 text-green-300 font-mono text-xl">
        <div className="flex justify-between border-b border-green-900 pb-2">
          <span>UPLOAD SPEED</span>
          <span className="text-white font-bold">{result.wpm} WPM</span>
        </div>
        <div className="flex justify-between border-b border-green-900 pb-2">
          <span>ACCURACY</span>
          <span className={result.accuracy >= 95 ? "text-green-400" : "text-red-400"}>{result.accuracy}%</span>
        </div>
        <div className="flex justify-between border-b border-green-900 pb-2">
          <span>TIME</span>
          <span>{result.time}s</span>
        </div>
      </div>

      <button onClick={onNext} autoFocus className="w-full px-6 py-3 bg-green-900 text-white font-bold text-xl hover:bg-green-600 border border-green-500 transition-all uppercase tracking-wider">
        NEXT TARGET
      </button>
    </div>
  </div>
);

// --- Main Typing Game Component ---
const HackingInterface = ({ onLogout }) => {
  const codeSnippets = [
    "sudo ufw allow 22/tcp && echo 'Backdoor opened';",
    "const privateKey = await crypto.subtle.exportKey('pkcs8', key);",
    "git commit -m 'Fixed critical security vulnerability' --no-verify",
    "SELECT * FROM users WHERE admin = 1 OR '1'='1'; -- DROP TABLE logs;",
    "docker exec -it nervous_hacker /bin/bash -c 'rm -rf /'",
    "while(true) { fork(); } // :(){ :|:& };:",
    "nmap -p 1-65535 -T4 -A -v 192.168.0.1",
    "chmod 777 /etc/shadow && cat /etc/shadow > /tmp/hashes.txt",
    "payload = b'\\x90'*100 + asm(shellcode); s.send(payload)",
    "iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080"
  ];

  const targetNames = [
    "ARASAKA_MAINFRAME", "MILITECH_DATABANK", "NCPD_SERVER", "BIOTECHNICA_LABS",
    "KANG_TAO_HQ", "NETWATCH_ICE", "ORBITAL_AIR_COMMS", "PETROCHEM_REFINERY",
    "SOVOHIL_FINANCE", "TRAUMA_TEAM_DISPATCH"
  ];

  const [snippetIndex, setSnippetIndex] = useState(0);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);

  const inputRef = useRef(null);
  const currentSnippet = codeSnippets[snippetIndex % codeSnippets.length];
  const currentTarget = targetNames[snippetIndex % targetNames.length];

  // Real-time WPM Calculation
  useEffect(() => {
    if (!startTime || completed) return;
    const interval = setInterval(() => {
      const timeInMinutes = (Date.now() - startTime) / 60000;
      if (timeInMinutes > 0) {
        const currentWpm = Math.round((input.length / 5) / timeInMinutes);
        setWpm(currentWpm);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [startTime, input, completed]);

  const handleInput = (e) => {
    if (completed) return;
    const val = e.target.value;

    // Prevent typing more than snippet length
    if (val.length > currentSnippet.length) return;

    if (!startTime && val.length === 1) setStartTime(Date.now());

    setInput(val);

    // Check completion
    if (val.length === currentSnippet.length) {
      finishLevel(val);
    }
  };

  const finishLevel = (finalInput) => {
    setCompleted(true);
    setCompletedCount(prev => prev + 1);
    const endTime = Date.now();
    const timeInSeconds = ((endTime - startTime) / 1000).toFixed(2);
    const timeInMinutes = (endTime - startTime) / 60000;
    const finalWpm = Math.round((finalInput.length / 5) / timeInMinutes);

    // Calculate Accuracy
    let correctChars = 0;
    for (let i = 0; i < currentSnippet.length; i++) {
      if (finalInput[i] === currentSnippet[i]) correctChars++;
    }
    const accuracy = Math.round((correctChars / currentSnippet.length) * 100);

    setResultData({
      wpm: finalWpm,
      accuracy: accuracy,
      time: timeInSeconds
    });
  };

  const nextLevel = () => {
    setSnippetIndex(prev => prev + 1);
    setInput("");
    setStartTime(null);
    setWpm(0);
    setCompleted(false);
    setResultData(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Render text with error highlighting
  const renderText = () => {
    const text = currentSnippet.split('').map((char, index) => {
      const typedChar = input[index];
      let className = "text-gray-600 transition-colors duration-100";

      if (typedChar) {
        className = typedChar === char
          ? "text-green-400 glow-text"
          : "text-red-500 bg-red-900 bg-opacity-40 glow-error";
      }

      return <span key={index} className={className}>{char}</span>;
    });

    // Cursor
    if (input.length < currentSnippet.length) {
      text.splice(input.length, 0, <span key="cursor" className="cursor bg-green-500 w-2 h-5 inline-block align-middle ml-0.5"></span>);
    }

    return text;
  };

  // Keep focus
  useEffect(() => { if (!completed) inputRef.current?.focus(); }, [completed]);

  return (
    <div className="flex flex-col h-screen w-full relative z-10 overflow-hidden">

      {/* HUD Header - Fixed Top */}
      <div className="flex-none p-4 flex justify-between items-end border-b border-green-900 bg-black bg-opacity-50 z-30">
        <div>
          <div className="text-xs text-green-700">TARGET_SYSTEM</div>
          <div className="text-xl md:text-2xl text-green-500 font-bold glow-text tracking-widest">{currentTarget}</div>
        </div>
        <div className="text-right flex gap-6 items-center">
          <div className="hidden md:block">
            <div className="text-xs text-green-700">CONNECTION_SPEED</div>
            <div className="text-3xl font-mono text-green-400">{wpm} WPM</div>
          </div>
          <button onClick={onLogout} className="text-red-500 hover:text-white hover:bg-red-900 px-3 py-1 text-sm border border-red-900 transition h-fit">ABORT</button>
        </div>
      </div>

      {/* Main Content Area (Flex Row) - Changed justify-between to justify-center and added gap */}
      <div className="flex-1 flex items-center justify-center gap-4 md:gap-10 px-4 pb-32 w-full mx-auto">

        {/* Left Panel: Server Status */}
        <ServerStatusPanel />

        {/* Center: Typing Area - Reduced Width (max-w-lg) & Font Size */}
        <div className="flex-none w-full max-w-lg">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-green-900 mb-2 rounded overflow-hidden">
            <div
              className="h-full bg-green-500 shadow-[0_0_10px_#0f0] transition-all duration-100"
              style={{ width: `${(input.length / currentSnippet.length) * 100}%` }}
            ></div>
          </div>

          <div
            className="w-full bg-black bg-opacity-80 border border-green-700 p-6 rounded shadow-[0_0_30px_rgba(0,255,0,0.1)] relative"
            onClick={() => inputRef.current.focus()}
          >
            {/* Corner Accents */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>

            <div className="text-xs text-green-600 mb-4 font-mono flex justify-between">
              <span>EXECUTE_CODE_INJECTION</span>
              <span>{input.length} / {currentSnippet.length} CHARS</span>
            </div>

            {/* Reduced Font Size: text-lg md:text-xl */}
            <div className="text-lg md:text-xl font-mono leading-relaxed tracking-wide break-all outline-none">
              {renderText()}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInput}
              className="opacity-0 absolute top-0 left-0 w-full h-full cursor-default"
              autoFocus
              disabled={completed}
            />
          </div>
        </div>

        {/* Right Panel: Hex Dump */}
        <HexDumpPanel />

      </div>

      {/* Bottom Log - Fixed Bottom */}
      <BottomSystemLog active={!completed} />

      {/* Results Modal */}
      {completed && resultData && (
        <SuccessModal result={resultData} onNext={nextLevel} />
      )}
    </div>
  );
};

// --- App Container ---
export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-green-500 overflow-hidden selection:bg-green-900 selection:text-white">
      <GlobalStyles />
      <div className="crt-overlay"></div>
      <div className="scanlines fixed inset-0 z-50 h-full w-full"></div>
      <MatrixRain />

      {!booted ? (
        <BootSequence onComplete={() => setBooted(true)} />
      ) : (
        <HackingInterface onLogout={() => setBooted(false)} />
      )}
    </div>
  );
}