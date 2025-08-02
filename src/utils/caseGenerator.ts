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
  const actions = ['LOGIN', 'LOGOUT', 'FILE_ACCESS', 'FILE_MODIFY', 'FILE_DELETE', 'SYSTEM_ADMIN', 'DATA_EXPORT', 'VPN_CONNECT', 'PRIVILEGE_ESCALATION', 'DATABASE_QUERY'];
  const resources = ['/secure/customer_data.db', '/admin/user_accounts', '/backup/financial_records', '/temp/download.zip', '/system/config.xml', '/logs/audit.log', '/crypto/wallet_keys', '/network/firewall_rules'];
  
  // Choose culprit first to create suspicious patterns
  const culprit = suspects[Math.floor(Math.random() * suspects.length)];
  
  for (let i = 0; i < 75; i++) {
    const suspect = suspects[Math.floor(Math.random() * suspects.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const resource = resources[Math.floor(Math.random() * resources.length)];
    
    // Create suspicious patterns for the culprit
    let isSuspicious = false;
    if (suspect.id === culprit.id && Math.random() > 0.6) {
      isSuspicious = true;
    }
    
    logs.push({
      timestamp: generateTimestamp(baseDate, isSuspicious ? -Math.floor(Math.random() * 24) : -Math.floor(Math.random() * 72)),
      user: suspect.name.toLowerCase().replace(' ', '.'),
      ip: isSuspicious && Math.random() > 0.7 ? generateIP() : suspect.ip, // Suspicious IP changes
      action: isSuspicious ? ['DATA_EXPORT', 'PRIVILEGE_ESCALATION', 'FILE_DELETE'][Math.floor(Math.random() * 3)] : action,
      resource,
      status: isSuspicious ? 'SUCCESS' : (Math.random() > 0.1 ? 'SUCCESS' : 'FAILED'),
      details: `${action} attempt on ${resource}`
    });
  }
  
  return logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function generateEmails(suspects: Suspect[], baseDate: Date): Email[] {
  const emails: Email[] = [];

  // More realistic and varied email content
  const emailTemplates = [
    {
      subject: 'Urgent: System Maintenance Tonight',
      content: 'Please be advised that system maintenance will occur tonight from 11 PM to 3 AM. All systems will be offline during this period.',
      suspicious: false
    },
    {
      subject: 'RE: Quarterly Budget Review',
      content: 'I need access to the financial records for the quarterly review. Can you assist with the database permissions?',
      suspicious: false
    },
    {
      subject: 'New Security Protocols',
      content: 'The new security protocols are too restrictive. We need to discuss alternatives that won\'t impact productivity.',
      suspicious: true
    },
    {
      subject: 'Weekend Work Schedule',
      content: 'I\'ll be working this weekend to catch up on the project deliverables. Will need extended system access.',
      suspicious: true
    },
    {
      subject: 'Confidential: Data Transfer',
      content: 'The client data needs to be transferred to the secure server immediately. Time sensitive.',
      suspicious: true
    },
    {
      subject: 'System Access Issues',
      content: 'I\'m having trouble accessing the customer database. Is this a known issue? Need resolution ASAP.',
      suspicious: false
    },
    {
      subject: 'Backup Verification',
      content: 'Can someone verify the backup integrity? I noticed some inconsistencies in the logs.',
      suspicious: true
    },
    {
      subject: 'VPN Configuration',
      content: 'Need help setting up VPN access for remote work. Current configuration seems problematic.',
      suspicious: true
    }
  ];

  for (let i = 0; i < 20; i++) {
    const fromSuspect = suspects[Math.floor(Math.random() * suspects.length)];
    const toSuspect = suspects[Math.floor(Math.random() * suspects.length)];
    const template = emailTemplates[Math.floor(Math.random() * emailTemplates.length)];
    
    if (fromSuspect.id !== toSuspect.id) {
      emails.push({
        id: `email_${i + 1}`,
        from: `${fromSuspect.name.toLowerCase().replace(' ', '.')}@company.com`,
        to: `${toSuspect.name.toLowerCase().replace(' ', '.')}@company.com`,
        subject: template.subject,
        timestamp: generateTimestamp(baseDate, -Math.floor(Math.random() * 48)),
        content: template.content,
        headers: {
          'Message-ID': `<${Date.now()}@company.com>`,
          'X-Originating-IP': fromSuspect.ip,
          'User-Agent': 'Outlook Express 6.0',
          'X-Priority': template.suspicious ? 'High' : 'Normal'
        }
      });
    }
  }
  
  return emails.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function generateChats(suspects: Suspect[], baseDate: Date): ChatMessage[] {
  const chats: ChatMessage[] = [];
  const channels = ['#general', '#it-support', '#security', '#project-aurora'];
  const messageTemplates = [
    { text: 'Anyone else having network issues?', suspicious: false },
    { text: 'The server seems slow today', suspicious: false },
    { text: 'Can someone check the backup logs?', suspicious: true },
    { text: 'I need elevated access for this task', suspicious: true },
    { text: 'Something strange in the access logs', suspicious: true },
    { text: 'Working late again tonight', suspicious: true },
    { text: 'The security system flagged unusual activity', suspicious: true },
    { text: 'Database connection keeps timing out', suspicious: false },
    { text: 'Anyone know the admin password for the backup server?', suspicious: true },
    { text: 'Why are there so many failed login attempts?', suspicious: true },
    { text: 'Need to transfer some files before the audit', suspicious: true },
    { text: 'VPN is acting weird, keeps disconnecting', suspicious: false }
  ];

  for (let i = 0; i < 40; i++) {
    const suspect = suspects[Math.floor(Math.random() * suspects.length)];
    const template = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
    
    chats.push({
      timestamp: generateTimestamp(baseDate, -Math.floor(Math.random() * 72)),
      user: suspect.name.toLowerCase().replace(' ', '.'),
      channel: channels[Math.floor(Math.random() * channels.length)],
      message: template.text,
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
    'project_aurora.zip',
    'wallet_keys.enc',
    'audit_trail.log',
    'network_topology.json',
    'employee_records.db'
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
  
  // Add some red herrings - make another suspect moderately suspicious
  const redHerring = suspects.find(s => s.id !== culprit.id);
  if (redHerring) {
    redHerring.suspicionLevel = Math.floor(Math.random() * 20) + 50;
  }

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