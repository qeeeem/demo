"use client";
import { useEffect, useState } from "react";
import rawData from "../public/generated_customers.json";

export default function CustomerSupportSim({ children }: { children: any }) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [mode, setMode] = useState<"auto" | "manual">("manual");
  const [typingText, setTypingText] = useState("");

  // 初始数据池副本
  const shuffled = [...rawData].sort(() => Math.random() - 0.5);
const [queue, setQueue] = useState<any[]>(
  shuffled.map((c) => ({
    ...c,
    status: c.difficulty === "转人工" ? "manual" : "waiting",
    messages: [],
    createdAt: Date.now(),
  }))
);


  // 每 1~10 秒注入 1~3 个顾客
  useEffect(() => {
    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 3) + 1;
      const toInject = queue.splice(0, count).map((c) => ({
        ...c,
        messages: [{ from: "user", text: c.question }],
        createdAt: Date.now(),
      }));
      if (toInject.length > 0) {
        setCustomers((prev) => [...prev, ...toInject]);
        if (!currentId) setCurrentId(toInject[0].id);
        setQueue([...queue]);
      }
    }, Math.random() * 9000 + 1000);
    return () => clearInterval(interval);
  }, [queue, currentId]);

  
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

    const next = customers.find((c) => c.status === "waiting" && c.id !== id);
    if (next) setCurrentId(next.id);
  };


  // AI 自动回复：打字 + 延迟 + 回复
  useEffect(() => {
    if (mode !== "auto") return;
    const current = customers.find((c) => c.id === currentId);
    if (!current || current.status !== "waiting" || current.id !== currentId) return;

  
    const messages = current.messages;
    const last = messages.at(-1);
    const alreadyReplied = messages.some((m: { from: string }) => m.from === "agent");
  
    
    // 特殊处理：转人工
    if (current.difficulty === "转人工") {
      const fallbackMsg = "您好，当前问题小助手暂无法解决，这边帮您转人工处理，请稍候~";
      handleManualTransfer(current.id, fallbackMsg);
      return;
    }

  // 避免重复触发
    if (!last || last.from !== "user" || alreadyReplied) return;
  
    const fullText = current.ai_reply;
    let index = 0;
    setTypingText("");
  
    const interval = setInterval(() => {
      index++;
      setTypingText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(interval);
        setTypingText("");

        setTimeout(() => {
          handleReply(current.id, fullText);
        }, 1000);
      }
    }, 40);
  
    return () => clearInterval(interval); // 清理副作用
  }, [customers, currentId, mode]);
  

// 如果当前客户已处理或是转人工，自动跳到下一个待处理客户
// useEffect(() => {
//   if (mode !== "auto") return;
//   const current = customers.find((c) => c.id === currentId);
//   if (!current) return;
//   if (current.status === "done" || current.status === "manual") {
//     const next = customers.find((c) => c.status === "waiting");
//     if (next) setCurrentId(next.id);
//   }
// }, [customers, currentId, mode]);

// useEffect(() => {
//   if (mode !== "auto") return;

//   const current = customers.find((c) => c.id === currentId);
//   if (!current || !current.repliedAt) return;

//   const timeout = setTimeout(() => {
//     const next = customers.find((c) => c.status === "waiting" && c.id !== currentId);
//     if (next) setCurrentId(next.id);
//   }, 2000); // 2 秒后跳转
// console.log('当前状态', current?.name, current?.status, current?.repliedAt)
//   return () => clearTimeout(timeout);
// }, [customers, currentId, mode]);



const handleReply = (id: string, msg: string) => {
  const updatedCustomers = customers.map((c) =>
    c.id === id
      ? {
          ...c,
          status: "done",
          repliedAt: Date.now(),
          messages: [...c.messages, { from: "agent", text: msg }],
        }
      : c
  );
console.log(`[系统] 发送消息：${msg}`);
  setCustomers(updatedCustomers);

requestAnimationFrame(() => {
    setTimeout(() => {
      const next = updatedCustomers.find((c) => c.status === "waiting" && c.id !== id);
      if (next) {
        console.log(`[系统] 等待2秒后跳转到：${next.name}`);
        setCurrentId(next.id);
      }
    }, 2000);
  });
};


  const currentCustomer = customers.find((c) => c.id === currentId) || null;

  return children({
    customers,
    currentCustomer,
    handleReply,
    typingText,
    setTypingText,
    currentId,
    setCurrentId,
    mode,
    setMode,
  });
}