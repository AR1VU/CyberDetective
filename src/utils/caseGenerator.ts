import { CaseFile, Suspect, LogEntry, Email, ChatMessage, FileMetadata } from '../types/game';

const companies = ['TechCorp Industries', 'DataFlow Solutions', 'CyberSecure Inc', 'QuantumByte LLC', 'NexusNet Systems'];
const attackTypes = ['Data Breach', 'Ransomware Attack', 'Insider Threat', 'APT Infiltration', 'Financial Fraud'];
const departments = ['IT', 'Finance', 'HR', 'Operations', 'Marketing', 'Security'];
const roles = ['Developer', 'Analyst', 'Manager', 'Administrator', 'Consultant', 'Intern'];

const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Anna', 'Robert', 'Jennifer'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

function generateIP(): string {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function generateTimestamp(baseDate: Date, offsetHours: number): string {
  const date = new Date(baseDate);
  date.setHours(date.getHours() + offsetHours);
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

function generateSuspect(id: string): Suspect {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName}`;
  const role = roles[Math.floor(Math.random() * roles.length)];
  const department = departments[Math.floor(Math.random() * departments.length)];
  
  const motives = [
    'Recently passed over for promotion',
    'Financial difficulties due to divorce',
    'Disagreement with company policies',
    'Planning to leave for competitor',
    'Revenge against management',
    'Gambling debts',
    'No apparent motive'
  ];

  const alibis = [
    'Claims to have been working late in the office',
    'Says was attending a client meeting',
    'States was at home with family',
    'Reports being on vacation',
    'Mentions working from home',
    'Claims system access was compromised'
  ];

  return {
    id,
    name,
    role,
    department,
    accessLevel: Math.random() > 0.7 ? 'ADMIN' : Math.random() > 0.4 ? 'ELEVATED' : 'STANDARD',
    lastLogin: generateTimestamp(new Date(), -Math.floor(Math.random() * 48)),
    ip: generateIP(),
    backstory: `${name} has been with the company for ${Math.floor(Math.random() * 8) + 1} years as a ${role} in ${department}.`,
    motive: motives[Math.floor(Math.random() * motives.length)],
    alibi: alibis[Math.floor(Math.random() * alibis.length)],
    suspicionLevel: Math.floor(Math.random() * 100)
  };
}

function generateLogs(suspects: Suspect[], baseDate: Date): LogEntry[] {
  const logs: LogEntry[] = [];
  const actions = ['LOGIN', 'LOGOUT', 'FILE_ACCESS', 'FILE_MODIFY', 'FILE_DELETE', 'SYSTEM_ADMIN', 'DATA_EXPORT'];
  const resources = ['/secure/customer_data.db', '/admin/user_accounts', '/backup/financial_records', '/temp/download.zip', '/system/config.xml'];
  
  for (let i = 0; i < 50; i++) {
    const suspect = suspects[Math.floor(Math.random() * suspects.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const resource = resources[Math.floor(Math.random() * resources.length)];
    
    logs.push({
      timestamp: generateTimestamp(baseDate, -Math.floor(Math.random() * 72)),
      user: suspect.name.toLowerCase().replace(' ', '.'),
      ip: Math.random() > 0.8 ? generateIP() : suspect.ip,
      action,
      resource,
      status: Math.random() > 0.1 ? 'SUCCESS' : 'FAILED',
      details: `${action} attempt on ${resource}`
    });
  }
  
  return logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function generateEmails(suspects: Suspect[], baseDate: Date): Email[] {
  const emails: Email[] = [];
  const subjects = [
    'Urgent: System Maintenance Tonight',
    'RE: Quarterly Budget Review',
    'New Security Protocols',
    'Weekend Work Schedule',
    'Confidential: Project Aurora',
    'System Access Issues'
  ];

  const contents = [
    'Please be advised that system maintenance will occur tonight from 11 PM to 3 AM.',
    'I need access to the financial records for the quarterly review. Can you assist?',
    'The new security protocols are too restrictive. We need to discuss alternatives.',
    'I\'ll be working this weekend to catch up on the project deliverables.',
    'Project Aurora data needs to be transferred to the secure server immediately.',
    'I\'m having trouble accessing the customer database. Is this a known issue?'
  ];

  for (let i = 0; i < 15; i++) {
    const fromSuspect = suspects[Math.floor(Math.random() * suspects.length)];
    const toSuspect = suspects[Math.floor(Math.random() * suspects.length)];
    
    if (fromSuspect.id !== toSuspect.id) {
      emails.push({
        id: `email_${i + 1}`,
        from: `${fromSuspect.name.toLowerCase().replace(' ', '.')}@company.com`,
        to: `${toSuspect.name.toLowerCase().replace(' ', '.')}@company.com`,
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        timestamp: generateTimestamp(baseDate, -Math.floor(Math.random() * 48)),
        content: contents[Math.floor(Math.random() * contents.length)],
        headers: {
          'Message-ID': `<${Date.now()}@company.com>`,
          'X-Originating-IP': fromSuspect.ip,
          'User-Agent': 'Outlook Express 6.0'
        }
      });
    }
  }
  
  return emails.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function generateChats(suspects: Suspect[], baseDate: Date): ChatMessage[] {
  const chats: ChatMessage[] = [];
  const channels = ['#general', '#it-support', '#security', '#project-aurora'];
  const messages = [
    'Anyone else having network issues?',
    'The server seems slow today',
    'Can someone check the backup logs?',
    'I need elevated access for this task',
    'Something strange in the access logs',
    'Working late again tonight',
    'The security system flagged unusual activity'
  ];

  for (let i = 0; i < 30; i++) {
    const suspect = suspects[Math.floor(Math.random() * suspects.length)];
    chats.push({
      timestamp: generateTimestamp(baseDate, -Math.floor(Math.random() * 72)),
      user: suspect.name.toLowerCase().replace(' ', '.'),
      channel: channels[Math.floor(Math.random() * channels.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      edited: Math.random() > 0.9
    });
  }
  
  return chats.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function generateFiles(suspects: Suspect[], baseDate: Date): FileMetadata[] {
  const files: FileMetadata[] = [];
  const filenames = [
    'customer_data.db',
    'financial_records.xlsx',
    'user_accounts.csv',
    'backup_config.xml',
    'security_log.txt',
    'project_aurora.zip'
  ];

  filenames.forEach((filename, index) => {
    const owner = suspects[Math.floor(Math.random() * suspects.length)];
    files.push({
      filename,
      hash: `sha256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      size: Math.floor(Math.random() * 1000000) + 1000,
      created: generateTimestamp(baseDate, -Math.floor(Math.random() * 168)),
      modified: generateTimestamp(baseDate, -Math.floor(Math.random() * 48)),
      accessed: generateTimestamp(baseDate, -Math.floor(Math.random() * 24)),
      owner: owner.name.toLowerCase().replace(' ', '.'),
      permissions: Math.random() > 0.5 ? '755' : '644'
    });
  });

  return files;
}

export function generateCase(): CaseFile {
  const company = companies[Math.floor(Math.random() * companies.length)];
  const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
  const baseDate = new Date();
  baseDate.setHours(baseDate.getHours() - Math.floor(Math.random() * 72));

  const suspects: Suspect[] = [];
  for (let i = 0; i < 6; i++) {
    suspects.push(generateSuspect(`suspect_${i + 1}`));
  }

  // Choose a culprit
  const culprit = suspects[Math.floor(Math.random() * suspects.length)];
  culprit.suspicionLevel = Math.floor(Math.random() * 30) + 70; // Higher suspicion

  const logs = generateLogs(suspects, baseDate);
  const emails = generateEmails(suspects, baseDate);
  const chats = generateChats(suspects, baseDate);
  const files = generateFiles(suspects, baseDate);

  return {
    id: `case_${Date.now()}`,
    title: `Operation: ${attackType} Investigation`,
    company,
    attackType,
    description: `${company} has reported a ${attackType.toLowerCase()} incident. Initial analysis suggests internal involvement. Digital forensics required to identify the perpetrator and attack vector.`,
    severity: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)] as any,
    timeframe: `${Math.floor(Math.random() * 72) + 24} hours ago`,
    suspects,
    logs,
    emails,
    chats,
    files,
    solution: {
      culprit: culprit.name,
      method: `Used ${culprit.accessLevel} privileges to access sensitive data during off-hours`,
      evidence: [`Suspicious login patterns`, `Unusual file access`, `Contradictory statements`]
    }
  };
}