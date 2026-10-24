export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Correction {
  before: string;
  after: string;
  note: string;
}

export interface TutorReply {
  reply: string;
  correction?: Correction;
}

export interface AIContext {
  level: string;
  topic?: string;
}

export interface AIProvider {
  chat(messages: ChatMessage[], context: AIContext): Promise<TutorReply>;
}
