// app/CustomerSupportSim.tsx
"use client";
import { useEffect, useState } from "react";
import rawData from "../public/generated_customers.json";

interface CustomerSupportSimProps {
  mode: "auto" | "manual";
  children: (props: {
    customers: any[];
    currentCustomer: any | null;
    handleReply: (id: string, msg: string) => void;
    typingText: string;
    setTypingText: React.Dispatch<React.SetStateAction<string>>;
    currentId: string | null;
    setCurrentId: React.Dispatch<React.SetStateAction<string | null>>;
  }) => React.ReactNode;
}

export default function CustomerSupportSim({
  mode,
  children,
}: CustomerSupportSimProps) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [typingText, setTypingText] = useState("");

  // 初始化：打乱 rawData，放入 queue
  const [queue, setQueue] = useState<any[]>(() => {
    const shuffled = [...rawData].sort(() => Math.random() - 0.5);
    return shuffled.map((c) => ({
      ...c,
      status: c.difficulty === "转人工" ? "manual" : "waiting",
      messages: [{ from: "user", text: c.question }],
      createdAt: Date.now(),
    }));
  });

  // —— 注入新客户 ——  
  useEffect(() => {
// if (mode !== "auto") return;
    if (queue.length === 0) return;

    const interval = setInterval(() => {
      const count = Math.min(Math.floor(Math.random() * 3) + 1, queue.length);
      if (count === 0) return;

      const toInject = queue.splice(0, count);
      setQueue([...queue]);
      setCustomers((prev) => [...prev, ...toInject]);

      if (!currentId && toInject.length) {
        setCurrentId(toInject[0].id);
      }
    }, Math.random() * 9000 + 1000);

    return () => clearInterval(interval);
  }, [mode, queue, currentId]);

  // —— AI 自动回复 ——  
  useEffect(() => {
if (mode !== "auto") return;
    if (!currentId) return;

    const current = customers.find((c) => c.id === currentId);
    if (!current || current.status !== "waiting") return;

    // 转人工 优先处理
    if (current.difficulty === "转人工") {
      const fallback = "您好，当前问题小助手暂无法解决，已为您转人工处理，请稍候～";
      handleManualTransfer(current.id, fallback);
      return;
    }

    // 检查最后一条是否来自用户
    const last = current.messages.at(-1);
    if (!last || last.from !== "user") return;

    const replyText = current.ai_reply;
    let idx = 0;
    setTypingText("");

    const typer = setInterval(() => {
      idx++;
      setTypingText(replyText.slice(0, idx));
      if (idx >= replyText.length) {
        clearInterval(typer);
        setTypingText("");
        setTimeout(() => {
          handleReply(current.id, replyText);
        }, 500);
      }
    }, 40);

    return () => clearInterval(typer);
  }, [mode, customers, currentId]);

  // —— 手动转人工的 helper ——  
  const handleManualTransfer = (id: string, msg: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "manual",
              repliedAt: Date.now(),
              messages: [...c.messages, { from: "agent", text: msg }],
            }
          : c
      )
    );
    // 切到下一个 waiting
    const next = customers.find((c) => c.status === "waiting" && c.id !== id);
    if (next) setCurrentId(next.id);
  };

  // —— 最终的 handleReply ——  
  const handleReply = (id: string, msg: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "done",
              repliedAt: Date.now(),
              messages: [...c.messages, { from: "agent", text: msg }],
            }
          : c
      )
    );
    // 回复后延迟切到下一个
    setTimeout(() => {
      const next = customers.find((c) => c.status === "waiting" && c.id !== id);
      if (next) setCurrentId(next.id);
    }, 2000);
  };

  const currentCustomer = customers.find((c) => c.id === currentId) || null;

  return (
    <>
      {children({
        customers,
        currentCustomer,
        handleReply,
        typingText,
        setTypingText,
        currentId,
        setCurrentId,
      })}
    </>
  );
}
