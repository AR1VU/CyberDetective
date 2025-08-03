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
      { type: 'system', content: '║ CYBER DETECTIVE v2.0 - Digital Forensics Terminal           ║' },
      { type: 'system', content: '║ Advanced Investigation & Evidence Analysis Platform          ║' },
      { type: 'system', content: '╚══════════════════════════════════════════════════════════════╝' },
      { type: 'output', content: '' },
      { type: 'crypto', content: '🔗 Connecting to forensics database...' },
      { type: 'crypto', content: '⛓️  Evidence chain verified' },
      { type: 'crypto', content: '💎 Digital certificates loaded' },
      { type: 'success', content: '✅ Secure connection established: ID-7f3a9b2c8d1e5f6a...' },
      { type: 'output', content: '' },
      { type: 'output', content: 'Welcome to the digital forensics investigation platform.' },
      { type: 'output', content: 'Type \'help\' to see available commands.' },
      { type: 'warning', content: '⚡ New: Earn investigation points for evidence discovery!' },
      { type: 'output', content: '' }
    ]);
  };

  const addLine = async (type: TerminalLine['type'], content: string, useTypewriter: boolean = false) => {
    const timestamp = new Date().toLocaleTimeString();
    
    if (useTypewriter && (type === 'crypto' || type === 'warning' || type === 'success')) {
      await typewriterEffect(content, type);
    } else {
      setLines(prev => [...prev, { type, content, timestamp }]);
    }
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
    await addLine('input', `┌─[detective@cyber-forensics]─[~]`);
    await addLine('input', `└─$ ${command}`);

    if (!gameState.currentCase && cmd !== 'investigate' && cmd !== 'help' && cmd !== 'profile' && cmd !== 'evidence') {
      await addLine('error', '❌ No active case. Type "investigate" to begin investigation.');
      return;
    }

    switch (cmd) {
      case 'help':
        await addLine('output', '');
        await addLine('system', '╔═══════════════ AVAILABLE COMMANDS ═══════════════╗');
        await addLine('crypto', '║ 🔍 investigate       - Start new investigation   ║');
        await addLine('crypto', '║ 📊 case              - Display case status       ║');
        await addLine('crypto', '║ 🎯 scan              - Scan for suspects         ║');
        await addLine('crypto', '║ 👤 suspect <name>    - Analyze specific suspect  ║');
        await addLine('crypto', '║ 💾 logs              - Access system logs        ║');
        await addLine('crypto', '║ 📧 intercept         - Intercept communications  ║');
        await addLine('crypto', '║ 🔓 decrypt           - Decrypt captured data     ║');
        await addLine('crypto', '║ 🔬 forensics         - Run forensic analysis     ║');
        await addLine('crypto', '║ 🤖 analyze           - AI evidence analysis      ║');
        await addLine('crypto', '║ 💡 hint              - Get investigation hint    ║');
        await addLine('crypto', '║ 🧠 ask <question>    - Ask AI investigator       ║');
        await addLine('crypto', '║ 📝 theory <theory>   - Test your theory          ║');
        await addLine('crypto', '║ ⚖️  solve <name>      - Accuse final suspect      ║');
        await addLine('crypto', '║ 👮 profile           - Check detective profile   ║');
        await addLine('crypto', '║ 📁 evidence          - View evidence collection  ║');
        await addLine('crypto', '║ 🧹 clear             - Clear terminal            ║');
        await addLine('system', '╚═══════════════════════════════════════════════════╝');
        await addLine('output', '');
        break;

      case 'investigate':
        await addLine('system', '🔍 INITIALIZING INVESTIGATION...');
        await addLine('crypto', '⛓️  Accessing case database...', true);
        await new Promise(resolve => setTimeout(resolve, 800));
        await addLine('crypto', '🔐 Establishing secure evidence chain...', true);
        await new Promise(resolve => setTimeout(resolve, 600));
        await addLine('crypto', '🌐 Connecting to forensics network...', true);
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
        
        await addLine('success', '╔═══════════════ CASE BRIEFING ═══════════════╗');
        await typewriterEffect(`║ CASE_ID: ${newCase.id.toUpperCase()}`);
        await typewriterEffect(`║ COMPANY: ${newCase.company}`);
        await typewriterEffect(`║ INCIDENT: ${newCase.attackType.toUpperCase()}`);
        await typewriterEffect(`║ SEVERITY: ${newCase.severity}`);
        await typewriterEffect(`║ TIMEFRAME: ${newCase.timeframe}`);
        await addLine('success', '╚═══════════════════════════════════════════════╝');
        await addLine('output', '');
        await typewriterEffect(`🎯 OBJECTIVE: ${newCase.description}`);
        await addLine('output', '');
        await addLine('crypto', '💎 Reward: Investigation points + Evidence badges', true);
        await addLine('system', '✅ Case loaded. Begin investigation.');
        break;

      case 'case':
        if (!gameState.currentCase) break;
        await addLine('system', '╔═══════════════ CASE STATUS ═══════════════╗');
        await addLine('crypto', `║ Case: ${gameState.currentCase.title}`);
        await addLine('crypto', `║ Company: ${gameState.currentCase.company}`);
        await addLine('crypto', `║ Incident: ${gameState.currentCase.attackType}`);
        await addLine('crypto', `║ Severity: ${gameState.currentCase.severity}`);
        await addLine('crypto', `║ Progress: ${gameState.caseProgress}%`);
        await addLine('crypto', `║ Evidence: ${gameState.discoveredEvidence.length} items`);
        await addLine('system', '╚═══════════════════════════════════════════════╝');
        break;

      case 'scan':
        if (!gameState.currentCase) break;
        await addLine('system', '🔍 SCANNING FOR SUSPECTS...');
        await addLine('output', '');
        await addLine('system', '╔═══════════════ SUSPECT ANALYSIS ═══════════════╗');
        for (const [index, suspect] of gameState.currentCase.suspects.entries()) {
          const riskLevel = suspect.suspicionLevel > 70 ? '🔴 HIGH' : 
                           suspect.suspicionLevel > 40 ? '🟡 MED' : '🟢 LOW';
          await addLine('crypto', `║ [${(index + 1).toString().padStart(2, '0')}] ${suspect.name.padEnd(20)} ${riskLevel}`);
          await addLine('output', `║     Role: ${suspect.role} | Dept: ${suspect.department}`);
          await addLine('output', `║     Access: ${suspect.accessLevel} | Last: ${suspect.lastLogin}`);
          await addLine('output', '║');
        }
        await addLine('system', '╚═══════════════════════════════════════════════╝');
        break;

      case 'logs':
        if (!gameState.currentCase) break;
        await addLine('system', '💾 ACCESSING SYSTEM LOGS...');
        await addLine('crypto', '🔐 Decrypting log files...', true);
        await addLine('output', '');
        await addLine('system', '╔═══════════════ ACCESS LOGS ═══════════════╗');
        await addLine('output', '║ TIMESTAMP        │ USER         │ ACTION      │ STATUS ║');
        await addLine('output', '╠══════════════════╪══════════════╪═════════════╪════════╣');
        for (const log of gameState.currentCase.logs.slice(-8)) {
          const status = log.status === 'SUCCESS' ? '✅' : '❌';
          const user = log.user.substring(0, 12).padEnd(12);
          const action = log.action.substring(0, 11).padEnd(11);
          await addLine('crypto', `║ ${log.timestamp} │ ${user} │ ${action} │ ${status}     ║`);
        }
        await addLine('system', '╚═══════════════════════════════════════════════╝');
        
        if (!gameState.discoveredEvidence.includes('system_logs')) {
          setGameState(prev => ({
            ...prev,
            discoveredEvidence: [...prev.discoveredEvidence, 'system_logs'],
            caseProgress: Math.min(prev.caseProgress + 15, 100)
          }));
          await addLine('success', '💎 [EVIDENCE ACQUIRED: System Access Logs] +150 Points', true);
        }
        break;

      case 'intercept':
        if (!gameState.currentCase) break;
        await addLine('system', '📧 INTERCEPTING COMMUNICATIONS...');
        await addLine('crypto', '🛰️  Forensic tap established...', true);
        await addLine('output', '');
        await addLine('system', '╔═══════════════ EMAIL INTERCEPTS ═══════════════╗');
        for (const [index, email] of gameState.currentCase.emails.slice(-4).entries()) {
          await addLine('crypto', `║ [MSG_${(index + 1).toString().padStart(3, '0')}] From: ${email.from}`);
          await addLine('output', `║         To: ${email.to}`);
          await addLine('output', `║         Subject: ${email.subject}`);
          await addLine('output', `║         Time: ${email.timestamp}`);
          await addLine('warning', `║         Content: ${email.content}`);
          await addLine('output', '║');
        }
        await addLine('system', '╚═══════════════════════════════════════════════╝');
        
        if (!gameState.discoveredEvidence.includes('email_records')) {
          setGameState(prev => ({
            ...prev,
            discoveredEvidence: [...prev.discoveredEvidence, 'email_records'],
            caseProgress: Math.min(prev.caseProgress + 20, 100)
          }));
          await addLine('success', '💎 [EVIDENCE ACQUIRED: Email Communications] +200 Points', true);
        }
        break;

      case 'decrypt':
        if (!gameState.currentCase) break;
        await addLine('system', '🔓 DECRYPTING SECURE CHANNELS...');
        await addLine('crypto', '🧮 Advanced decryption in progress...', true);
        await addLine('output', '');
        await addLine('system', '╔═══════════════ DECRYPTED CHATS ═══════════════╗');
        for (const chat of gameState.currentCase.chats.slice(-6)) {
          const edited = chat.edited ? ' [EDITED]' : '';
          const channel = chat.channel.padEnd(12);
          const user = chat.user.substring(0, 10).padEnd(10);
          await addLine('crypto', `║ [${chat.timestamp}] ${channel} <${user}>:`);
          await addLine('warning', `║ ${chat.message}${edited}`);
          await addLine('output', '║');
        }
        await addLine('system', '╚═══════════════════════════════════════════════╝');
        
        if (!gameState.discoveredEvidence.includes('chat_logs')) {
          setGameState(prev => ({
            ...prev,
            discoveredEvidence: [...prev.discoveredEvidence, 'chat_logs'],
            caseProgress: Math.min(prev.caseProgress + 15, 100)
          }));
          await addLine('success', '💎 [EVIDENCE ACQUIRED: Encrypted Communications] +150 Points', true);
        }
        break;

      case 'forensics':
        if (!gameState.currentCase) break;
        await addLine('system', '🔬 RUNNING FORENSIC ANALYSIS...');
        await addLine('crypto', '🔍 Analyzing file system...', true);
        await addLine('output', '');
        await addLine('system', '╔═══════════════ FILE SYSTEM ANALYSIS ═══════════════╗');
        for (const file of gameState.currentCase.files) {
          await addLine('crypto', `║ File: ${file.filename}`);
          await addLine('output', `║   Hash: ${file.hash.substring(0, 32)}...`);
          await addLine('output', `║   Owner: ${file.owner} | Size: ${file.size} bytes`);
          await addLine('output', `║   Modified: ${file.modified}`);
          await addLine('output', '║');
        }
        await addLine('system', '╚═══════════════════════════════════════════════╝');
        
        if (!gameState.discoveredEvidence.includes('file_metadata')) {
          setGameState(prev => ({
            ...prev,
            discoveredEvidence: [...prev.discoveredEvidence, 'file_metadata'],
            caseProgress: Math.min(prev.caseProgress + 25, 100)
          }));
          await addLine('success', '💎 [EVIDENCE ACQUIRED: System Files] +250 Points', true);
        }
        break;

      case 'profile':
        const balance = gameState.discoveredEvidence.length * 150 + gameState.caseProgress * 10;
        await addLine('system', '👮 CHECKING DETECTIVE PROFILE...');
        await addLine('crypto', '🔗 Accessing personnel database...', true);
        await addLine('output', '');
        await addLine('system', '╔═══════════════ DETECTIVE PROFILE ═══════════════╗');
        await addLine('crypto', `║ Badge ID: DET-7f3a9b2c8d1e5f6a4b8c9d2e1f3a5b7c ║`);
        await addLine('crypto', `║ Points: ${balance.toLocaleString()} Investigation Points     ║`);
        await addLine('crypto', `║ Badges: ${Math.floor(balance / 500)} Evidence Badges        ║`);
        await addLine('crypto', `║ Rank: ${Math.floor(balance * 0.1).toLocaleString()} Experience Points       ║`);
        await addLine('system', '╚═══════════════════════════════════════════════╝');
        break;

      case 'evidence':
        await addLine('system', '📁 LOADING EVIDENCE COLLECTION...');
        await addLine('crypto', '🎨 Accessing evidence vault...', true);
        await addLine('output', '');
        await addLine('system', '╔═══════════════ EVIDENCE COLLECTION ═══════════════╗');
        await addLine('crypto', '║ 🔍 "Digital Fingerprint #1337" - Legendary   ║');
        await addLine('crypto', '║ 💻 "System Log Analysis #42" - Epic          ║');
        await addLine('crypto', '║ 🔐 "Encryption Breach #256" - Rare           ║');
        await addLine('crypto', '║ 🌐 "Network Trace #13" - Common              ║');
        await addLine('system', '╚═══════════════════════════════════════════════╝');
        await addLine('output', '');
        await addLine('warning', '💡 Tip: Collect evidence to earn investigation points!', true);
        break;

      case 'analyze':
        if (!gameState.currentCase) break;
        if (gameState.discoveredEvidence.length === 0) {
          await addLine('warning', '⚠️ No evidence collected yet. Gather evidence first using: scan, logs, intercept, decrypt');
          break;
        }
        
        await addLine('system', '🤖 INITIALIZING AI FORENSICS ANALYSIS...');
        await addLine('crypto', '🧠 Neural networks processing evidence...', true);
        await addLine('crypto', '🔍 Pattern recognition algorithms active...', true);
        
        try {
          const analysis = await aiService.analyzeEvidence(gameState.discoveredEvidence, {
            currentCase: gameState.currentCase,
            discoveredEvidence: gameState.discoveredEvidence,
            commandHistory: gameState.commandHistory,
            suspectAnalysis: gameState.suspectAnalysis,
            caseProgress: gameState.caseProgress
          });
          
          await addLine('output', '');
          await addLine('system', '╔═══════════════ AI ANALYSIS REPORT ═══════════════╗');
          const analysisLines = analysis.split('\n');
          for (const line of analysisLines) {
            if (line.trim()) {
              await typewriterEffect(`║ ${line.trim()}`, 'crypto');
            }
          }
          await addLine('system', '╚═══════════════════════════════════════════════════╝');
          
          if (!gameState.discoveredEvidence.includes('ai_analysis')) {
            setGameState(prev => ({
              ...prev,
              discoveredEvidence: [...prev.discoveredEvidence, 'ai_analysis'],
              caseProgress: Math.min(prev.caseProgress + 10, 100)
            }));
            await addLine('success', '💎 [EVIDENCE ACQUIRED: AI Analysis] +100 Points', true);
          }
        } catch (error) {
          await addLine('error', '❌ AI analysis system temporarily unavailable');
        }
        break;

      case 'hint':
        if (!gameState.currentCase) break;
        
        await addLine('system', `💡 REQUESTING ${hintLevel.toUpperCase()} HINT...`);
        await addLine('crypto', '🔮 Consulting investigation database...', true);
        
        try {
          const hint = await aiService.getHint(hintLevel, {
            currentCase: gameState.currentCase,
            discoveredEvidence: gameState.discoveredEvidence,
            commandHistory: gameState.commandHistory,
            suspectAnalysis: gameState.suspectAnalysis,
            caseProgress: gameState.caseProgress
          });
          
          await addLine('output', '');
          await addLine('system', '╔═══════════════ INVESTIGATION HINT ═══════════════╗');
          const hintLines = hint.split('\n');
          for (const line of hintLines) {
            if (line.trim()) {
              await typewriterEffect(`║ ${line.trim()}`, 'warning');
            }
          }
          await addLine('system', '╚═══════════════════════════════════════════════════╝');
          
          // Escalate hint level for next time
          if (hintLevel === 'subtle') setHintLevel('moderate');
          else if (hintLevel === 'moderate') setHintLevel('explicit');
          
        } catch (error) {
          await addLine('error', '❌ Hint system temporarily unavailable');
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
            await addLine('error', '❌ Usage: ask <your question>');
            break;
          }
          
          await addLine('system', '🤖 CONSULTING AI INVESTIGATOR...');
          await addLine('crypto', '🧠 Processing natural language query...', true);
          
          try {
            const response = await aiService.getAIResponse(question, {
              currentCase: gameState.currentCase,
              discoveredEvidence: gameState.discoveredEvidence,
              commandHistory: gameState.commandHistory,
              suspectAnalysis: gameState.suspectAnalysis,
              caseProgress: gameState.caseProgress
            });
            
            await addLine('output', '');
            await addLine('system', '╔═══════════════ AI INVESTIGATOR RESPONSE ═══════════════╗');
            const responseLines = response.split('\n');
            for (const line of responseLines) {
              if (line.trim()) {
                await typewriterEffect(`║ ${line.trim()}`, 'crypto');
              }
            }
            await addLine('system', '╚═══════════════════════════════════════════════════════╝');
            
          } catch (error) {
            await addLine('error', '❌ AI investigator temporarily unavailable');
          }
        } else if (cmd.startsWith('theory ')) {
          const theory = command.substring(7).trim();
          if (!theory) {
            await addLine('error', '❌ Usage: theory <your theory about the case>');
            break;
          }
          
          await addLine('system', '📝 EVALUATING INVESTIGATION THEORY...');
          await addLine('crypto', '🔍 Cross-referencing with evidence database...', true);
          
          try {
            const evaluation = await aiService.evaluateTheory(theory, {
              currentCase: gameState.currentCase,
              discoveredEvidence: gameState.discoveredEvidence,
              commandHistory: gameState.commandHistory,
              suspectAnalysis: gameState.suspectAnalysis,
              caseProgress: gameState.caseProgress
            });
            
            await addLine('output', '');
            await addLine('system', '╔═══════════════ THEORY EVALUATION ═══════════════╗');
            const evalLines = evaluation.split('\n');
            for (const line of evalLines) {
              if (line.trim()) {
                await typewriterEffect(`║ ${line.trim()}`, 'warning');
              }
            }
            await addLine('system', '╚═══════════════════════════════════════════════════╝');
            
            // Award points for theory testing
            setGameState(prev => ({
              ...prev,
              caseProgress: Math.min(prev.caseProgress + 5, 100)
            }));
            await addLine('success', '💎 [CRITICAL THINKING BONUS] +50 Points', true);
            
          } catch (error) {
            await addLine('error', '❌ Theory evaluation system temporarily unavailable');
          }
        } else if (cmd.startsWith('suspect ')) {
          const suspectName = command.substring(8).trim();
          const suspect = gameState.currentCase?.suspects.find(s => 
            s.name.toLowerCase().includes(suspectName.toLowerCase())
          );
          
          if (suspect) {
            await addLine('system', `👤 ANALYZING SUSPECT: ${suspect.name.toUpperCase()}`);
            await addLine('crypto', '🔍 Deep background check in progress...', true);
            await addLine('output', '');
            await addLine('system', '╔═══════════════ SUSPECT PROFILE ═══════════════╗');
            await addLine('crypto', `║ Name: ${suspect.name}`);
            await addLine('crypto', `║ Role: ${suspect.role} | Dept: ${suspect.department}`);
            await addLine('crypto', `║ Clearance: ${suspect.accessLevel}`);
            await addLine('crypto', `║ Last Activity: ${suspect.lastLogin}`);
            await addLine('crypto', `║ IP Address: ${suspect.ip}`);
            await addLine('output', '║');
            await addLine('warning', `║ Background: ${suspect.backstory}`);
            await addLine('warning', `║ Motive: ${suspect.motive}`);
            await addLine('warning', `║ Alibi: ${suspect.alibi}`);
            await addLine('error', `║ Suspicion Level: ${suspect.suspicionLevel}%`);
            await addLine('system', '╚═══════════════════════════════════════════════╝');
            
            if (!gameState.discoveredEvidence.includes(`profile_${suspect.id}`)) {
              setGameState(prev => ({
                ...prev,
                discoveredEvidence: [...prev.discoveredEvidence, `profile_${suspect.id}`],
                caseProgress: Math.min(prev.caseProgress + 10, 100)
              }));
              await addLine('success', `💎 [EVIDENCE ACQUIRED: ${suspect.name} Profile] +100 Points`, true);
            }
          } else {
            await addLine('error', `❌ Suspect not found: ${suspectName}`);
          }
        } else if (cmd.startsWith('solve ')) {
          const accusedName = command.substring(6).trim();
          if (!accusedName) {
            await addLine('error', '❌ Usage: solve <suspect name>');
            break;
          }
          
          const accused = gameState.currentCase?.suspects.find(s => 
            s.name.toLowerCase().includes(accusedName.toLowerCase())
          );
          
          if (!accused) {
            await addLine('error', `❌ Suspect not found: ${accusedName}`);
            break;
          }
          
          await addLine('system', '⚖️ SUBMITTING FINAL ACCUSATION...');
          await addLine('crypto', '🔍 Cross-referencing all evidence...', true);
          await addLine('crypto', '📊 Calculating probability matrix...', true);
          await addLine('crypto', '🎯 Validating accusation against case data...', true);
          await addLine('output', '');
          
          const isCorrect = accused.name === gameState.currentCase?.solution.culprit;
          
          if (isCorrect) {
            await addLine('success', '╔═══════════════ CASE SOLVED! ═══════════════╗');
            await addLine('success', `║ ✅ CORRECT! ${accused.name} is the culprit!`);
            await addLine('success', `║ Method: ${gameState.currentCase?.solution.method}`);
            await addLine('success', `║ Key Evidence: ${gameState.currentCase?.solution.evidence.join(', ')}`);
            await addLine('success', '╚═══════════════════════════════════════════════╝');
            await addLine('output', '');
            await addLine('crypto', '🏆 CASE CLOSED - EXCELLENT DETECTIVE WORK!', true);
            await addLine('success', '💎 [CASE COMPLETION BONUS] +500 Points', true);
            
            setGameState(prev => ({
              ...prev,
              caseProgress: 100,
              casesCompleted: prev.casesCompleted + 1
            }));
          } else {
            await addLine('error', '╔═══════════════ INCORRECT ACCUSATION ═══════════════╗');
            await addLine('error', `║ ❌ ${accused.name} is not the culprit.`);
            await addLine('error', '║ Review the evidence and try again.');
            await addLine('error', '║ Consider using "analyze" or "hint" for guidance.');
            await addLine('error', '╚═══════════════════════════════════════════════════╝');
            await addLine('output', '');
            await addLine('warning', '⚠️ Incorrect accusation may impact your detective rating.', true);
          }
        } else {
          await addLine('error', `❌ Unknown command: ${cmd}. Type 'help' for available commands.`);
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
        <span className="text-xs">CYBER DETECTIVE v2.0 - Forensics Terminal</span>
        <div className="ml-auto flex items-center gap-2 text-xs">
          <Shield className="w-3 h-3" />
          <span>SECURE</span>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-track-gray-900/50 scrollbar-thumb-green-500/50 hover:scrollbar-thumb-green-400/70"
        style={{ 
          height: 'calc(100vh - 200px)',
          maxHeight: 'calc(100vh - 200px)',
          minHeight: 'calc(100vh - 200px)'
        }}
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
      
      <div className="flex-shrink-0 p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">┌─[detective@cyber-forensics]─[~]</span>
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
    </div>
  );
};

export default Terminal;