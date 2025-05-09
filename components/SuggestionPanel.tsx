"use client";
import React from "react";

interface Message {
  from: "user" | "agent";
  text: string;
}
interface Customer {
  id: string;
  name: string;
  avatar: string;
  urgency: string;
  difficulty: "简单" | "困难" | "转人工";
  question: string;
  ai_reply: string;
  status: "waiting" | "done" | "manual";
  messages: Message[];
}

interface SuggestionPanelProps {
  customer: Customer;
}

export default function SuggestionPanel({ customer }: SuggestionPanelProps) {
  return <div className="w-72 border-l p-4">建议回复区：{customer.name}</div>;
}
