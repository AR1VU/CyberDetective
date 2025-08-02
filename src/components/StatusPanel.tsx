import React from 'react';
import { Shield, User, FileText, Database, MessageSquare, Clock, AlertTriangle, Zap, Coins, Image } from 'lucide-react';
import { GameState } from '../types/game';

interface StatusPanelProps {
  gameState: GameState;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ gameState }) => {
  const evidenceIcons = {
    system_logs: Database,
    email_records: MessageSquare,
    chat_logs: MessageSquare,
    file_metadata: FileText,
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400 bg-red-900/30 border-red-500/50';
      case 'HIGH': return 'text-orange-400 bg-orange-900/30 border-orange-500/50';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500/50';
      case 'LOW': return 'text-green-400 bg-green-900/30 border-green-500/50';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500/50';
    }
  };

  const hackBalance = gameState.discoveredEvidence.length * 150 + gameState.caseProgress * 10;

  if (!gameState.currentCase) {
    return (
      <div className="h-full bg-transparent p-4 font-mono text-purple-400">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Cyber Detective
          </h2>
          <p className="text-gray-400">No active mission</p>
          <p className="text-sm text-gray-500 mt-2">Type "hack" to begin</p>
          
          {/* Wallet Info */}
          <div className="mt-8 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Coins className="w-5 h-5 mr-2 text-yellow-400" />
              <span className="text-yellow-400 font-bold">WALLET</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {hackBalance.toLocaleString()} $HACK
            </div>
            <div className="text-xs text-gray-400">
              {Math.floor(hackBalance / 500)} NFTs owned
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-transparent p-4 font-mono text-purple-400 overflow-y-auto">
      {/* Mission Header */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ACTIVE MISSION
          </h2>
        </div>
        <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getSeverityColor(gameState.currentCase.severity)}`}>
          {gameState.currentCase.severity} THREAT
        </div>
      </div>

      {/* Mission Details */}
      <div className="mb-6 space-y-3 text-sm">
        <div className="p-3 bg-gray-900/30 border border-purple-500/20 rounded-lg">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Target Corporation</span>
          <div className="text-purple-300 font-bold">{gameState.currentCase.company}</div>
        </div>
        <div className="p-3 bg-gray-900/30 border border-purple-500/20 rounded-lg">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Operation Type</span>
          <div className="text-purple-300 font-bold">{gameState.currentCase.attackType}</div>
        </div>
        <div className="p-3 bg-gray-900/30 border border-purple-500/20 rounded-lg">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Timeline</span>
          <div className="text-purple-300 font-bold">{gameState.currentCase.timeframe}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm uppercase tracking-wide">Mission Progress</span>
          <span className="text-cyan-400 text-sm font-bold">{gameState.caseProgress}%</span>
        </div>
        <div className="w-full bg-gray-800/50 rounded-full h-3 border border-purple-500/20">
          <div 
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{ width: `${gameState.caseProgress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Wallet Status */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Coins className="w-4 h-4 mr-2 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">$HACK BALANCE</span>
          </div>
          <div className="text-green-400 font-bold">
            {hackBalance.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">NFTs Owned</span>
          <span className="text-purple-400">{Math.floor(hackBalance / 500)}</span>
        </div>
      </div>

      {/* Intel Collected */}
      <div className="mb-6">
        <h3 className="text-purple-400 font-bold mb-3 flex items-center text-sm uppercase tracking-wide">
          <Database className="w-4 h-4 mr-2" />
          INTEL ACQUIRED ({gameState.discoveredEvidence.length})
        </h3>
        <div className="space-y-2">
          {gameState.discoveredEvidence.map((evidence, index) => {
            const IconComponent = evidenceIcons[evidence as keyof typeof evidenceIcons] || FileText;
            return (
              <div key={index} className="flex items-center text-sm bg-gradient-to-r from-gray-900/50 to-purple-900/20 p-3 rounded-lg border border-purple-500/20">
                <IconComponent className="w-4 h-4 mr-3 text-cyan-400" />
                <div className="flex-1">
                  <div className="text-purple-300 font-medium">
                    {evidence.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-400">+{150} $HACK</div>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            );
          })}
          {gameState.discoveredEvidence.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No intel acquired yet
            </div>
          )}
        </div>
      </div>

      {/* Target Analysis */}
      <div className="mb-6">
        <h3 className="text-purple-400 font-bold mb-3 flex items-center text-sm uppercase tracking-wide">
          <User className="w-4 h-4 mr-2" />
          TARGET ANALYSIS ({gameState.currentCase.suspects.length})
        </h3>
        <div className="space-y-2">
          {gameState.currentCase.suspects
            .sort((a, b) => b.suspicionLevel - a.suspicionLevel)
            .slice(0, 4)
            .map((suspect, index) => (
              <div key={suspect.id} className="text-sm bg-gradient-to-r from-gray-900/50 to-purple-900/20 p-3 rounded-lg border border-purple-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-300 font-medium">{suspect.name}</span>
                  <div className={`text-xs px-2 py-1 rounded-full border ${
                    suspect.suspicionLevel > 70 ? 'bg-red-900/50 text-red-400 border-red-500/50' :
                    suspect.suspicionLevel > 40 ? 'bg-yellow-900/50 text-yellow-400 border-yellow-500/50' :
                    'bg-green-900/50 text-green-400 border-green-500/50'
                  }`}>
                    {suspect.suspicionLevel}% RISK
                  </div>
                </div>
                <div className="text-gray-400 text-xs">
                  {suspect.role} • {suspect.accessLevel} ACCESS
                </div>
                <div className="text-xs text-purple-400 mt-1">
                  Last Active: {suspect.lastLogin}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Quick Commands */}
      <div className="border-t border-purple-500/20 pt-4">
        <h3 className="text-purple-400 font-bold mb-3 text-sm uppercase tracking-wide">QUICK ACCESS</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button className="p-2 bg-gray-900/30 border border-purple-500/20 rounded text-purple-300 hover:bg-purple-900/20 transition-colors">
            scan
          </button>
          <button className="p-2 bg-gray-900/30 border border-purple-500/20 rounded text-purple-300 hover:bg-purple-900/20 transition-colors">
            logs
          </button>
          <button className="p-2 bg-gray-900/30 border border-purple-500/20 rounded text-purple-300 hover:bg-purple-900/20 transition-colors">
            intercept
          </button>
          <button className="p-2 bg-gray-900/30 border border-purple-500/20 rounded text-purple-300 hover:bg-purple-900/20 transition-colors">
            decrypt
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="border-t border-purple-500/20 pt-4 mt-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            BLOCKCHAIN SYNC
          </div>
          <span className="text-gray-400">100%</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-gray-400">Gas Price</span>
          <span className="text-purple-400">21 gwei</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-gray-400">Block Height</span>
          <span className="text-cyan-400">#18,542,337</span>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;