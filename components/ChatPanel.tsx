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
interface ChatPanelProps {
  customer: Customer;
  mode: "manual" | "auto";
  onReply: (id: string, msg: string) => void;
}

export default function ChatPanel({ customer }: ChatPanelProps) {
  return <div className="p-4">ChatPanel for {customer.name}</div>;
}
