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
  status: "waiting" | "done" | "manual";
  messages: Message[];
  createdAt: number; // ✅ 添加这行
  repliedAt?: number;
}
