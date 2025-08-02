import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Shield, User, FileText, Database, MessageSquare, Search } from 'lucide-react';
import { GameState, CaseFile } from '../types/game';
import { generateCase } from '../utils/caseGenerator';
import { AIInvestigationService } from '../utils/aiService';

interface TerminalProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

interface TerminalLine {
  type: 'input' | 'output' | 'system' | 'error' | 'success' | 'warning' | 'crypto';
  content: string;
  timestamp?: string;
}

const Terminal: React.FC<TerminalProps> = ({ gameState, setGameState }) => {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hintLevel, setHintLevel] = useState<'subtle' | 'moderate' | 'explicit'>('subtle');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const aiService = AIInvestigationService.getInstance();

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (!gameState.isGameActive) {
      initializeGame();
    }
  }, []);

  const initializeGame = () => {
    setLines([
      { type: 'system', content: '╔══════════════════════════════════════════════════════════════╗' },
      { type: 'system', content: '║ HACKER TYCOON v2.0 - Web3 Terminal Interface                ║' },
      { type: 'system', content: '║ Decentralized Hacking Operations Platform                    ║' },
      { type: 'system', content: '╚══════════════════════════════════════════════════════════════╝' },
      { type: 'output', content: '' },
      { type: 'crypto', content: '🔗 Connecting to blockchain...' },
      { type: 'crypto', content: '⛓️  Smart contracts loaded' },
      { type: 'crypto', content: '💎 NFT assets verified' },
      { type: 'success', content: '✅ Web3 wallet connected: 0x7f3a9b2c8d1e5f6a...' },
      { type: 'output', content: '' },
      { type: 'output', content: 'Welcome to the decentralized hacking metaverse.' },
      { type: 'output', content: 'Type \'help\' to see available commands.' },
      { type: 'warning', content: '⚡ New: Earn $HACK tokens for successful operations!' },
      { type: 'output', content: '' }
    ]);
  };

  const addLine = (type: TerminalLine['type'], content: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLines(prev => [...prev, { type, content, timestamp }]);
  };

  const typewriterEffect = async (text: string, type: TerminalLine['type'] = 'output') => {
    setIsTyping(true);
    const chars = text.split('');
    
    // Add initial empty line that we'll update
    setLines(prev => [...prev, { type, content: '' }]);
    
    let currentText = '';
    for (let i = 0; i < chars.length; i++) {
      currentText += chars[i];
      setLines(prev => {
        const newLines = [...prev];
        // Update the last line (the one we added initially)
        newLines[newLines.length - 1] = { type, content: currentText };
        return newLines;
      });
      await new Promise(resolve => setTimeout(resolve, 15));
    }
    setIsTyping(false);
  };

  const processCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim();
    addLine('input', `┌─[hacker@tycoon]─[~]`);
    addLine('input', `└─$ ${command}`);

    if (!gameState.currentCase && cmd !== 'hack' && cmd !== 'help' && cmd !== 'wallet' && cmd !== 'nft') {
      addLine('error', '❌ No active mission. Type "hack" to begin operation.');
      return;
    }

    switch (cmd) {
      case 'help':
        addLine('output', '');
        addLine('system', '╔═══════════════ AVAILABLE COMMANDS ═══════════════╗');
        addLine('crypto', '║ 🚀 hack              - Initialize new mission    ║');
        addLine('crypto', '║ 📊 mission           - Display mission status    ║');
        addLine('crypto', '║ 🔍 scan              - Scan network targets      ║');
        addLine('crypto', '║ 🎯 target <name>     - Analyze specific target   ║');
        addLine('crypto', '║ 💾 logs              - Access system logs        ║');
        addLine('crypto', '║ 📧 intercept         - Intercept communications  ║');
        addLine('crypto', '║ 🔓 decrypt           - Decrypt captured data     ║');
        addLine('crypto', '║ ⚡ exploit           - Launch system exploit     ║');
        addLine('crypto', '║ 🎮 execute <name>    - Execute final payload     ║');
        addLine('crypto', '║ 🤖 analyze           - AI evidence analysis      ║');
        addLine('crypto', '║ 💡 hint              - Get investigation hint    ║');
        addLine('crypto', '║ 🧠 ask <question>    - Ask AI investigator       ║');
        addLine('crypto', '║ 📝 theory <theory>   - Test your theory          ║');
        addLine('crypto', '║ 💰 wallet            - Check $HACK balance       ║');
        addLine('crypto', '║ 🖼️  nft               - View NFT collection       ║');
        addLine('crypto', '║ 🧹 clear             - Clear terminal            ║');
        addLine('system', '╚═══════════════════════════════════════════════════╝');
        addLine('output', '');
        break;

      case 'hack':
        addLine('system', '🚀 INITIALIZING HACKING MISSION...');
        addLine('crypto', '⛓️  Deploying smart contracts...');
        await new Promise(resolve => setTimeout(resolve, 800));
        addLine('crypto', '🔐 Generating encryption keys...');
        await new Promise(resolve => setTimeout(resolve, 600));
        addLine('crypto', '🌐 Establishing secure channels...');
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const newCase = generateCase();
        setGameState(prev => ({
          ...prev,
          currentCase: newCase,
          isGameActive: true,
          discoveredEvidence: [],
          suspectAnalysis: {},
          caseProgress: 0
        }));
        
        addLine('success', '╔═══════════════ MISSION BRIEFING ═══════════════╗');
        await typewriterEffect(`║ MISSION_ID: ${newCase.id.toUpperCase()}`);
        await typewriterEffect(`║ TARGET_CORP: ${newCase.company}`);
        await typewriterEffect(`║ OPERATION: ${newCase.attackType.toUpperCase()}`);
        await typewriterEffect(`║ THREAT_LVL: ${newCase.severity}`);
        await typewriterEffect(`║ TIMEFRAME: ${newCase.timeframe}`);
        addLine('success', '╚═══════════════════════════════════════════════╝');
        addLine('output', '');
        await typewriterEffect(`🎯 OBJECTIVE: ${newCase.description.replace('reported a', 'has been targeted for a').replace('Digital forensics required to identify the perpetrator and attack vector.', 'Infiltrate their systems and complete the objective without detection.')}`);
        addLine('output', '');
        addLine('crypto', '💎 Reward: 1000 $HACK tokens + Rare NFT');
        addLine('system', '✅ Mission loaded. Begin reconnaissance.');
        break;

      case 'mission':
        if (!gameState.currentCase) break;
        addLine('system', '╔═══════════════ MISSION STATUS ═══════════════╗');
        addLine('crypto', `║ Mission: ${gameState.currentCase.title.replace('Investigation', 'Operation')}`);
        addLine('crypto', `║ Target: ${gameState.currentCase.company}`);
        addLine('crypto', `║ Objective: ${gameState.currentCase.attackType}`);
        addLine('crypto', `║ Difficulty: ${gameState.currentCase.severity}`);
        addLine('crypto', `║ Progress: ${gameState.caseProgress}%`);
        addLine('crypto', `║ Intel: ${gameState.discoveredEvidence.length} datasets`);
        addLine('system', '╚═══════════════════════════════════════════════╝');
        break;

      case 'scan':
        if (!gameState.currentCase) break;
        addLine('system', '🔍 SCANNING NETWORK TOPOLOGY...');
        addLine('output', '');
        addLine('system', '╔═══════════════ TARGET ANALYSIS ═══════════════╗');
        gameState.currentCase.suspects.forEach((suspect, index) => {
          const riskLevel = suspect.suspicionLevel > 70 ? '🔴 HIGH' : 
                           suspect.suspicionLevel > 40 ? '🟡 MED' : '🟢 LOW';
          addLine('crypto', `║ [${(index + 1).toString().padStart(2, '0')}] ${suspect.name.padEnd(20)} ${riskLevel}`);
          addLine('output', `║     Role: ${suspect.role} | Dept: ${suspect.department}`);
          addLine('output', `║     Access: ${suspect.accessLevel} | Last: ${suspect.lastLogin}`);
          addLine('output', '║');
        });
        addLine('system', '╚═══════════════════════════════════════════════╝');
        break;

      case 'logs':
        if (!gameState.currentCase) break;
        addLine('system', '💾 ACCESSING SYSTEM LOGS...');
        addLine('crypto', '🔐 Bypassing security protocols...');
        addLine('output', '');
        addLine('system', '╔═══════════════ ACCESS LOGS ═══════════════╗');
        addLine('output', '║ TIMESTAMP        │ USER         │ ACTION      │ STATUS ║');
        addLine('output', '╠══════════════════╪══════════════╪═════════════╪════════╣');
        gameState.currentCase.logs.slice(-8).forEach(log => {
          const status = log.status === 'SUCCESS' ? '✅' : '❌';
          const user = log.user.substring(0, 12).padEnd(12);
          const action = log.action.substring(0, 11).padEnd(11);
          addLine('crypto', `║ ${log.timestamp} │ ${user} │ ${action} │ ${status}     ║`);
        });
        addLine('system', '╚═══════════════════════════════════════════════╝');
        
        if (!gameState.discoveredEvidence.includes('system_logs')) {
          setGameState(prev => ({
            ...prev,
            discoveredEvidence: [...prev.discoveredEvidence, 'system_logs'],
            caseProgress: Math.min(prev.caseProgress + 15, 100)
          }));
          addLine('success', '💎 [INTEL ACQUIRED: System Access Logs] +150 $HACK');
        }
        break;

      case 'intercept':
        if (!gameState.currentCase) break;
        addLine('system', '📧 INTERCEPTING COMMUNICATIONS...');
        addLine('crypto', '🛰️  Satellite uplink established...');
        addLine('output', '');
        addLine('system', '╔═══════════════ EMAIL INTERCEPTS ═══════════════╗');
        gameState.currentCase.emails.slice(-4).forEach((email, index) => {
          addLine('crypto', `║ [MSG_${(index + 1).toString().padStart(3, '0')}] From: ${email.from}`);
          addLine('output', `║         To: ${email.to}`);
          addLine('output', `║         Subject: ${email.subject}`);
          addLine('output', `║         Time: ${email.timestamp}`);
          addLine('warning', `║         Content: ${email.content}`);
          addLine('output', '║');
        });
        addLine('system', '╚═══════════════════════════════════════════════╝');
        
        if (!gameState.discoveredEvidence.includes('email_records')) {
          setGameState(prev => ({
            ...prev,
            discoveredEvidence: [...prev.discoveredEvidence, 'email_records'],
            caseProgress: Math.min(prev.caseProgress + 20, 100)
          }));
          addLine('success', '💎 [INTEL ACQUIRED: Email Communications] +200 $HACK');
        }
        break;

      case 'decrypt':
        if (!gameState.currentCase) break;
        addLine('system', '🔓 DECRYPTING SECURE CHANNELS...');
        addLine('crypto', '🧮 Quantum decryption in progress...');
        addLine('output', '');
        addLine('system', '╔═══════════════ DECRYPTED CHATS ═══════════════╗');
        gameState.currentCase.chats.slice(-6).forEach(chat => {
          const edited = chat.edited ? ' [EDITED]' : '';
          const channel = chat.channel.padEnd(12);
          const user = chat.user.substring(0, 10).padEnd(10);
          addLine('crypto', `║ [${chat.timestamp}] ${channel} <${user}>:`);
          addLine('warning', `║ ${chat.message}${edited}`);
          addLine('output', '║');
        });
        addLine('system', '╚═══════════════════════════════════════════════╝');
        
        if (!gameState.discoveredEvidence.includes('chat_logs')) {
          setGameState(prev => ({
            ...prev,
            discoveredEvidence: [...prev.discoveredEvidence, 'chat_logs'],
            caseProgress: Math.min(prev.caseProgress + 15, 100)
          }));
          addLine('success', '💎 [INTEL ACQUIRED: Encrypted Communications] +150 $HACK');
        }
        break;

      case 'exploit':
        if (!gameState.currentCase) break;
        addLine('system', '⚡ LAUNCHING SYSTEM EXPLOIT...');
        addLine('crypto', '🔥 Deploying payload...');
        addLine('output', '');
        addLine('system', '╔═══════════════ FILE SYSTEM ACCESS ═══════════════╗');
        gameState.currentCase.files.forEach(file => {
          addLine('crypto', `║ File: ${file.filename}`);
          addLine('output', `║   Hash: ${file.hash.substring(0, 32)}...`);
          addLine('output', `║   Owner: ${file.owner} | Size: ${file.size} bytes`);
          addLine('output', `║   Modified: ${file.modified}`);
          addLine('output', '║');
        });
        addLine('system', '╚═══════════════════════════════════════════════╝');
        
        if (!gameState.discoveredEvidence.includes('file_metadata')) {
          setGameState(prev => ({
            ...prev,
            discoveredEvidence: [...prev.discoveredEvidence, 'file_metadata'],
            caseProgress: Math.min(prev.caseProgress + 25, 100)
          }));
          addLine('success', '💎 [INTEL ACQUIRED: System Files] +250 $HACK');
        }
        break;

      case 'wallet':
        const balance = gameState.discoveredEvidence.length * 150 + gameState.caseProgress * 10;
        addLine('system', '💰 CHECKING WALLET BALANCE...');
        addLine('crypto', '🔗 Connecting to blockchain...');
        addLine('output', '');
        addLine('system', '╔═══════════════ WALLET STATUS ═══════════════╗');
        addLine('crypto', `║ Address: 0x7f3a9b2c8d1e5f6a4b8c9d2e1f3a5b7c8d9e ║`);
        addLine('crypto', `║ Balance: ${balance.toLocaleString()} $HACK tokens              ║`);
        addLine('crypto', `║ NFTs: ${Math.floor(balance / 500)} Rare Hacker Cards           ║`);
        addLine('crypto', `║ Staked: ${Math.floor(balance * 0.1).toLocaleString()} $HACK (earning 12% APY)    ║`);
        addLine('system', '╚═══════════════════════════════════════════════╝');
        break;

      case 'nft':
        addLine('system', '🖼️  LOADING NFT COLLECTION...');
        addLine('crypto', '🎨 Fetching metadata from IPFS...');
        addLine('output', '');
        addLine('system', '╔═══════════════ NFT COLLECTION ═══════════════╗');
        addLine('crypto', '║ 🎭 "Anonymous Mask #1337" - Legendary        ║');
        addLine('crypto', '║ 💻 "Quantum Terminal #0x42" - Epic          ║');
        addLine('crypto', '║ 🔐 "Encryption Key #256" - Rare             ║');
        addLine('crypto', '║ 🌐 "Dark Web Portal #13" - Common           ║');
        addLine('system', '╚═══════════════════════════════════════════════╝');
        addLine('output', '');
        addLine('warning', '💡 Tip: Stake NFTs to earn bonus $HACK tokens!');
        break;

      case 'analyze':
        if (!gameState.currentCase) break;
        if (gameState.discoveredEvidence.length === 0) {
          addLine('warning', '⚠️ No evidence collected yet. Gather intel first using: scan, logs, intercept, decrypt');
          break;
        }
        
        addLine('system', '🤖 INITIALIZING AI FORENSICS ANALYSIS...');
        addLine('crypto', '🧠 Neural networks processing evidence...');
        addLine('crypto', '🔍 Pattern recognition algorithms active...');
        
        try {
          const analysis = await aiService.analyzeEvidence(gameState.discoveredEvidence, {
            currentCase: gameState.currentCase,
            discoveredEvidence: gameState.discoveredEvidence,
            commandHistory: gameState.commandHistory,
            suspectAnalysis: gameState.suspectAnalysis,
            caseProgress: gameState.caseProgress
          });
          
          addLine('output', '');
          addLine('system', '╔═══════════════ AI ANALYSIS REPORT ═══════════════╗');
          const analysisLines = analysis.split('\n');
          analysisLines.forEach(line => {
            if (line.trim()) {
              addLine('crypto', `║ ${line.trim()}`);
            }
          });
          addLine('system', '╚═══════════════════════════════════════════════════╝');
          
          if (!gameState.discoveredEvidence.includes('ai_analysis')) {
            setGameState(prev => ({
              ...prev,
              discoveredEvidence: [...prev.discoveredEvidence, 'ai_analysis'],
              caseProgress: Math.min(prev.caseProgress + 10, 100)
            }));
            addLine('success', '💎 [INTEL ACQUIRED: AI Analysis] +100 $HACK');
          }
        } catch (error) {
          addLine('error', '❌ AI analysis system temporarily unavailable');
        }
        break;

      case 'hint':
        if (!gameState.currentCase) break;
        
        addLine('system', `💡 REQUESTING ${hintLevel.toUpperCase()} HINT...`);
        addLine('crypto', '🔮 Consulting investigation database...');
        
        try {
          const hint = await aiService.getHint(hintLevel, {
            currentCase: gameState.currentCase,
            discoveredEvidence: gameState.discoveredEvidence,
            commandHistory: gameState.commandHistory,
            suspectAnalysis: gameState.suspectAnalysis,
            caseProgress: gameState.caseProgress
          });
          
          addLine('output', '');
          addLine('system', '╔═══════════════ INVESTIGATION HINT ═══════════════╗');
          const hintLines = hint.split('\n');
          hintLines.forEach(line => {
            if (line.trim()) {
              addLine('warning', `║ ${line.trim()}`);
            }
          });
          addLine('system', '╚═══════════════════════════════════════════════════╝');
          
          // Escalate hint level for next time
          if (hintLevel === 'subtle') setHintLevel('moderate');
          else if (hintLevel === 'moderate') setHintLevel('explicit');
          
        } catch (error) {
          addLine('error', '❌ Hint system temporarily unavailable');
        }
        break;

      case 'clear':
        setLines([]);
        aiService.clearHistory();
        break;

      default:
        if (cmd.startsWith('ask ')) {
          const question = command.substring(4).trim();
          if (!question) {
            addLine('error', '❌ Usage: ask <your question>');
            break;
          }
          
          addLine('system', '🤖 CONSULTING AI INVESTIGATOR...');
          addLine('crypto', '🧠 Processing natural language query...');
          
          try {
            const response = await aiService.getAIResponse(question, {
              currentCase: gameState.currentCase,
              discoveredEvidence: gameState.discoveredEvidence,
              commandHistory: gameState.commandHistory,
              suspectAnalysis: gameState.suspectAnalysis,
              caseProgress: gameState.caseProgress
            });
            
            addLine('output', '');
            addLine('system', '╔═══════════════ AI INVESTIGATOR RESPONSE ═══════════════╗');
            const responseLines = response.split('\n');
            responseLines.forEach(line => {
              if (line.trim()) {
                addLine('crypto', `║ ${line.trim()}`);
              }
            });
            addLine('system', '╚═══════════════════════════════════════════════════════╝');
            
          } catch (error) {
            addLine('error', '❌ AI investigator temporarily unavailable');
          }
        } else if (cmd.startsWith('theory ')) {
          const theory = command.substring(7).trim();
          if (!theory) {
            addLine('error', '❌ Usage: theory <your theory about the case>');
            break;
          }
          
          addLine('system', '📝 EVALUATING INVESTIGATION THEORY...');
          addLine('crypto', '🔍 Cross-referencing with evidence database...');
          
          try {
            const evaluation = await aiService.evaluateTheory(theory, {
              currentCase: gameState.currentCase,
              discoveredEvidence: gameState.discoveredEvidence,
              commandHistory: gameState.commandHistory,
              suspectAnalysis: gameState.suspectAnalysis,
              caseProgress: gameState.caseProgress
            });
            
            addLine('output', '');
            addLine('system', '╔═══════════════ THEORY EVALUATION ═══════════════╗');
            const evalLines = evaluation.split('\n');
            evalLines.forEach(line => {
              if (line.trim()) {
                addLine('warning', `║ ${line.trim()}`);
              }
            });
            addLine('system', '╚═══════════════════════════════════════════════════╝');
            
            // Award points for theory testing
            setGameState(prev => ({
              ...prev,
              caseProgress: Math.min(prev.caseProgress + 5, 100)
            }));
            addLine('success', '💎 [CRITICAL THINKING BONUS] +50 $HACK');
            
          } catch (error) {
            addLine('error', '❌ Theory evaluation system temporarily unavailable');
          }
        } else if (cmd.startsWith('target ')) {
          const suspectName = command.substring(7).trim();
          const suspect = gameState.currentCase?.suspects.find(s => 
            s.name.toLowerCase().includes(suspectName.toLowerCase())
          );
          
          if (suspect) {
            addLine('system', `🎯 ANALYZING TARGET: ${suspect.name.toUpperCase()}`);
            addLine('crypto', '🔍 Deep scanning in progress...');
            addLine('output', '');
            addLine('system', '╔═══════════════ TARGET PROFILE ═══════════════╗');
            addLine('crypto', `║ Name: ${suspect.name}`);
            addLine('crypto', `║ Role: ${suspect.role} | Dept: ${suspect.department}`);
            addLine('crypto', `║ Clearance: ${suspect.accessLevel}`);
            addLine('crypto', `║ Last Activity: ${suspect.lastLogin}`);
            addLine('crypto', `║ IP Address: ${suspect.ip}`);
            addLine('output', '║');
            addLine('warning', `║ Background: ${suspect.backstory}`);
            addLine('warning', `║ Vulnerability: ${suspect.motive}`);
            addLine('warning', `║ Defense: ${suspect.alibi}`);
            addLine('error', `║ Exploit Probability: ${suspect.suspicionLevel}%`);
            addLine('system', '╚═══════════════════════════════════════════════╝');
            
            if (!gameState.discoveredEvidence.includes(`profile_${suspect.id}`)) {
              setGameState(prev => ({
                ...prev,
                discoveredEvidence: [...prev.discoveredEvidence, `profile_${suspect.id}`],
                caseProgress: Math.min(prev.caseProgress + 10, 100)
              }));
              addLine('success', `💎 [INTEL ACQUIRED: ${suspect.name} Profile] +100 $HACK`);
            }
          } else {
            addLine('error', `❌ Target not found: ${suspectName}`);
          }
        } else {
          addLine('error', `❌ Unknown command: ${cmd}. Type 'help' for available commands.`);
        }
        
        setGameState(prev => ({
          ...prev,
          commandHistory: [...prev.commandHistory, command]
        }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      processCommand(input.trim());
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' && gameState.commandHistory.length > 0) {
      e.preventDefault();
      const lastCommand = gameState.commandHistory[gameState.commandHistory.length - 1];
      setInput(lastCommand);
    }
  };
  
  return (
    <div className="bg-black text-green-400 font-mono text-sm h-full flex flex-col">
      <div className="flex items-center gap-2 p-3 bg-gray-900 border-b border-gray-700">
        <TerminalIcon className="w-4 h-4" />
        <span className="text-xs">HACKER TYCOON v2.0 - Web3 Terminal</span>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <Shield className="w-3 h-3" />
          <span>SECURE</span>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0"
      >
        {lines.map((line, index) => (
          <div key={index} className={`
            ${line.type === 'input' ? 'text-cyan-400' : ''}
            ${line.type === 'output' ? 'text-green-400' : ''}
            ${line.type === 'system' ? 'text-blue-400' : ''}
            ${line.type === 'error' ? 'text-red-400' : ''}
            ${line.type === 'success' ? 'text-green-300' : ''}
            ${line.type === 'warning' ? 'text-yellow-400' : ''}
            ${line.type === 'crypto' ? 'text-purple-400' : ''}
            whitespace-pre-wrap
          `}>
            {line.content}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">┌─[hacker@tycoon]─[~]</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">└─$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-green-400"
            placeholder={isTyping ? "Processing..." : "Enter command..."}
            disabled={isTyping}
            autoFocus
          />
        </div>
      </form>
    </div>
  );
};

export default Terminal;