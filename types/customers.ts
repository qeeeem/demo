export interface Message {
  from: "user" | "agent";
  text: string;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  urgency: string;
  difficulty: "简单" | "困难" | "转人工";
  question: string;
  ai_reply: string;
  ai_suggestions: string[];
  status: "waiting" | "done" | "manual";
  createdAt?: number;
  repliedAt?: number;
  messages: Message[];
  insight?: Insight;
  isNewCustomer?: boolean
  source?: string
}

export interface Insight {
  phone: string;
  status: string;
  realName: string;
  plan: string;
  history: string[];
}