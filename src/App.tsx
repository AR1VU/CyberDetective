import React, { useState } from 'react';
import Terminal from './components/Terminal';
import StatusPanel from './components/StatusPanel';
import { GameState } from './types/game';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    isGameActive: false,
    currentCase: null,
    discoveredEvidence: [],
    suspectAnalysis: {},
    caseProgress: 0,
    commandHistory: [],
    gameMetrics: {
      commandCount: 0,
      casesCompleted: 0,
      evidenceFound: 0,
      hackingLevel: 1,
      reputation: 0
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 border-b border-cyan-500/30 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">HT</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    CYBER DETECTIVE
                  </h1>
                  <p className="text-xs text-gray-400">Digital Forensics Terminal v2.0</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400">ONLINE</span>
              </div>
              <div className="text-sm text-gray-400">
                Case: <span className="text-cyan-400 font-mono">CD-7f3a9b</span>
              </div>
              <div className="text-sm text-gray-400">
                DB: <span className="text-purple-400 font-mono">v2.1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto p-6 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Terminal - Main interface */}
          <div className="lg:col-span-3">
            <div className="h-full bg-black/90 backdrop-blur-sm border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/10 overflow-hidden">
              {/* Terminal Header */}
              <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 px-4 py-3 border-b border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-cyan-400 font-mono text-sm">hacker@tycoon-terminal</span>
                    <span className="text-cyan-400 font-mono text-sm">detective@cyber-forensics</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>Secure: 192.168.1.337</span>
                    <span>Port: 8443</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                      <span className="text-cyan-400">ENCRYPTED</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Terminal Content */}
              <div className="h-full">
                <Terminal gameState={gameState} setGameState={setGameState} />
              </div>
            </div>
          </div>
          
          {/* Status Panel */}
          <div className="lg:col-span-1">
            <div className="h-full bg-black/90 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/10 overflow-hidden">
              {/* Status Panel Header */}
              <div className="bg-gradient-to-r from-purple-800/90 to-pink-800/90 px-4 py-3 border-b border-purple-500/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-300 font-mono text-sm">CASE_STATUS.exe</span>
                </div>
              </div>
              
              {/* Status Panel Content */}
              <div className="h-[calc(100%-60px)]">
                <StatusPanel gameState={gameState} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default App;