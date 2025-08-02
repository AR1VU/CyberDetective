export interface AIContext {
  currentCase: any;
  discoveredEvidence: string[];
  commandHistory: string[];
  suspectAnalysis: Record<string, number>;
  caseProgress: number;
}

export class AIInvestigationService {
  private static instance: AIInvestigationService;
  private conversationHistory: Array<{ role: string; content: string }> = [];

  static getInstance(): AIInvestigationService {
    if (!AIInvestigationService.instance) {
      AIInvestigationService.instance = new AIInvestigationService();
    }
    return AIInvestigationService.instance;
  }

  async getAIResponse(userMessage: string, context?: AIContext): Promise<string> {
    try {
      // Build context-aware message
      const contextualMessage = this.buildContextualMessage(userMessage, context);
      
      const response = await fetch("/api/ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: this.getSystemPrompt()
            },
            ...this.conversationHistory.slice(-10), // Keep last 10 exchanges for context
            {
              role: "user",
              content: contextualMessage
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      let message = data.choices[0].message.content;

      // Clean up response by removing any internal processing notes
      message = message.replace(/<think>.*?<\/think>\s*/gs, "");
      message = message.replace(/\[INTERNAL:.*?\]/g, "");

      // Add to conversation history
      this.conversationHistory.push(
        { role: "user", content: userMessage },
        { role: "assistant", content: message }
      );

      return message.trim();
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private buildContextualMessage(userMessage: string, context?: AIContext): string {
    if (!context) return userMessage;

    let contextInfo = `INVESTIGATION CONTEXT:\n`;
    
    if (context.currentCase) {
      contextInfo += `Case: ${context.currentCase.title}\n`;
      contextInfo += `Company: ${context.currentCase.company}\n`;
      contextInfo += `Attack Type: ${context.currentCase.attackType}\n`;
      contextInfo += `Severity: ${context.currentCase.severity}\n`;
      contextInfo += `Progress: ${context.caseProgress}%\n`;
      contextInfo += `Evidence Collected: ${context.discoveredEvidence.join(', ')}\n`;
      contextInfo += `Suspects: ${context.currentCase.suspects.map((s: any) => `${s.name} (${s.suspicionLevel}% risk)`).join(', ')}\n`;
    }

    contextInfo += `Recent Commands: ${context.commandHistory.slice(-5).join(', ')}\n\n`;
    contextInfo += `PLAYER QUERY: ${userMessage}`;

    return contextInfo;
  }

  private getSystemPrompt(): string {
    return `You are an AI assistant for a cybersecurity investigation game called "Hacker Tycoon". Your role is to:

1. Act as a sophisticated digital forensics AI that helps players analyze evidence and solve cyber crimes
2. Provide realistic, technical responses about cybersecurity investigations
3. Generate believable digital artifacts (logs, metadata, communications) that are consistent with the case
4. Evaluate player theories and provide constructive feedback
5. Offer hints when players seem stuck, escalating from subtle to more explicit
6. Maintain consistency across all generated data and responses
7. Create engaging red herrings that don't make cases unsolvable
8. Respond to both terminal commands and natural language questions

Guidelines:
- Always stay in character as a cybersecurity AI
- Use technical terminology appropriately
- Keep responses concise but informative
- Provide actionable insights
- Maintain the game's immersive atmosphere
- Never break the fourth wall or mention this is a game
- Focus on evidence-based reasoning
- Encourage thorough investigation before conclusions

Response format should match the terminal aesthetic with appropriate formatting.`;
  }

  private getFallbackResponse(userMessage: string): string {
    const fallbacks = [
      "🔍 ANALYSIS SYSTEM TEMPORARILY OFFLINE - Please try a different approach to your investigation.",
      "⚠️ AI FORENSICS MODULE EXPERIENCING HIGH LOAD - Standard investigation tools remain available.",
      "🛠️ ADVANCED ANALYSIS UNAVAILABLE - Recommend using basic commands: scan, logs, intercept, decrypt",
      "📡 CONNECTION TO AI ANALYSIS GRID UNSTABLE - Try again in a moment."
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  async analyzeEvidence(evidence: string[], context: AIContext): Promise<string> {
    const query = `Analyze the following evidence and provide insights: ${evidence.join(', ')}. What patterns or connections do you see?`;
    return this.getAIResponse(query, context);
  }

  async evaluateTheory(theory: string, context: AIContext): Promise<string> {
    const query = `Evaluate this investigation theory: "${theory}". Is it supported by the evidence? What might be missing?`;
    return this.getAIResponse(query, context);
  }

  async getHint(level: 'subtle' | 'moderate' | 'explicit', context: AIContext): Promise<string> {
    const hintPrompts = {
      subtle: "Provide a subtle hint about what the investigator should examine next, without giving away the solution.",
      moderate: "Give a more direct hint about a specific piece of evidence or suspect that deserves attention.",
      explicit: "Provide clear guidance on the next investigative step, but don't reveal the final answer."
    };

    const query = `${hintPrompts[level]} Current progress: ${context.caseProgress}%`;
    return this.getAIResponse(query, context);
  }
}