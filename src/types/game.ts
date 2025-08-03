export interface Suspect {
  id: string;
  name: string;
  role: string;
  department: string;
  accessLevel: string;
  lastLogin: string;
  ip: string;
  backstory: string;
  motive: string;
  alibi: string;
  suspicionLevel: number;
}

export interface LogEntry {
  timestamp: string;
  user: string;
  ip: string;
  action: string;
  resource: string;
  status: string;
  details: string;
}

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  timestamp: string;
  content: string;
  headers: Record<string, string>;
  attachments?: string[];
}

export interface ChatMessage {
  timestamp: string;
  user: string;
  channel: string;
  message: string;
  edited?: boolean;
}

export interface FileMetadata {
  filename: string;
  hash: string;
  size: number;
  created: string;
  modified: string;
  accessed: string;
  owner: string;
  permissions: string;
}

export interface CaseFile {
  id: string;
  title: string;
  company: string;
  attackType: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timeframe: string;
  suspects: Suspect[];
  logs: LogEntry[];
  emails: Email[];
  chats: ChatMessage[];
  files: FileMetadata[];
  solution: {
    culprit: string;
    method: string;
    evidence: string[];
  };
}

export interface GameState {
  currentCase: CaseFile | null;
  commandHistory: string[];
  discoveredEvidence: string[];
  suspectAnalysis: Record<string, number>;
  caseProgress: number;
  isGameActive: boolean;
  gameMetrics: {
    startTime: number;
    commandCount: number;
    queriesIssued: number;
    hintsUsed: number;
    theoriesSubmitted: number;
    accuracy: number;
  };
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  playerLevel: number;
  casesCompleted: number;
}