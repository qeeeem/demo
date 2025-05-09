"use client";
import { useEffect, useRef, useState } from "react";
import { Search, Clock } from "lucide-react";
import CustomerSupportSim from "./CustomerSupportSim";
import type { Customer } from "../types/customers";

export default function CustomerServiceInterface() {
  const [typingText, setTypingText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <CustomerSupportSim>
      {({
        customers,
        currentCustomer,
        handleReply,
        mode,
        setMode,
        setCurrentId,
      }: {
        customers: Customer[];
        currentCustomer: Customer | null;
        handleReply: (id: string, msg: string) => void;
        mode: "auto" | "manual";
        setMode: (m: "auto" | "manual") => void;
        setCurrentId: (id: string) => void;
      }) => {
        const inputRef = useRef<HTMLTextAreaElement>(null);

        useEffect(() => {
          scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [currentCustomer?.messages.length]);

        useEffect(() => {
          if (!currentCustomer || mode !== "auto") return;
          if (currentCustomer.status !== "waiting") return;
          const last = currentCustomer.messages.at(-1);
          if (last?.from !== "user") return;

          const fullText = currentCustomer.ai_reply;
          let index = 0;
          setTypingText("");

          const interval = setInterval(() => {
            index++;
            setTypingText(fullText.slice(0, index));
            if (index >= fullText.length) {
              clearInterval(interval);
              setTimeout(() => {
                handleReply(currentCustomer.id, fullText);
                setTypingText("");
              }, 1000);
            }
          }, 60);

          return () => clearInterval(interval);
        }, [currentCustomer, mode]);

        const manualCustomers = [...customers].filter((c) => c.status === "manual").reverse();
        const waitingCustomers = [...customers].filter((c) => c.status === "waiting").reverse();
        const doneCustomers = [...customers].filter((c) => c.status === "done").reverse();

        const renderCustomerItem = (c: Customer) => (
          <div
            key={c.id}
            className={`p-2 rounded cursor-pointer text-sm ${
              currentCustomer?.id === c.id ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"
            }`}
            onClick={() => setCurrentId(c.id)}
          >
            <div className="truncate">{c.name}</div>
            <div className="text-xs text-gray-500 truncate">{c.messages.at(-1)?.text}</div>
          </div>
        );

        return (
          <div className="flex h-screen bg-gray-50">
            <div className="w-72 border-r border-gray-200 p-4 overflow-y-auto">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="搜索客户..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-4 space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto text-sm">
                {manualCustomers.length > 0 && (
                  <div>
                    <h3 className="text-xs text-gray-500 mb-1">转人工</h3>
                    {manualCustomers.map(renderCustomerItem)}
                  </div>
                )}
                {waitingCustomers.length > 0 && (
                  <div>
                    <h3 className="text-xs text-gray-500 mb-1">待处理</h3>
                    {waitingCustomers.map(renderCustomerItem)}
                  </div>
                )}
                {doneCustomers.length > 0 && (
                  <div>
                    <h3 className="text-xs text-gray-500 mb-1">已处理</h3>
                    {doneCustomers.map(renderCustomerItem)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{currentCustomer?.name?.[0]}</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="font-semibold">{currentCustomer?.name}</h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        等待时间:
                        {currentCustomer?.createdAt
                          ? (() => {
                            const baseTime = currentCustomer.repliedAt ?? Date.now();
                            const secs = Math.floor((baseTime - currentCustomer.createdAt) / 1000); 
                            const min = Math.floor(secs / 60);
                            const sec = secs % 60;
                            return ` ${min}分${sec}秒`;
                            })()
                          : " -"}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="text-red-500 font-medium">{currentCustomer?.urgency}问题</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`px-2 py-1 rounded border ${mode === "auto" ? "bg-blue-500 text-white" : "bg-white"}`}
                    onClick={() => setMode("auto")}
                  >
                    AI驾驶
                  </button>
                  <button
                    className={`px-2 py-1 rounded border ${mode === "manual" ? "bg-blue-500 text-white" : "bg-white"}`}
                    onClick={() => setMode("manual")}
                  >
                    人工模式
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentCustomer?.messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.from === "agent" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[60%] px-4 py-2 rounded-lg ${
                      msg.from === "agent" ? "bg-blue-500 text-white" : "bg-white border"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex flex-col gap-2">
                  {mode === "manual" && currentCustomer?.ai_reply && (
                    <div
                      className="text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        if (inputRef.current) inputRef.current.value = currentCustomer.ai_reply;
                      }}
                      title="点击可填入输入框"
                    >
                      AI建议回复：{currentCustomer.ai_reply}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <textarea
                      ref={inputRef}
                      placeholder="请输入回复..."
                      className="flex-1 border rounded p-2"
                      rows={2}
                      readOnly={mode === "auto"}
                      value={mode === "auto" ? typingText : undefined}
                    />
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      disabled={mode === "auto"}
                      onClick={() => {
                        const val = inputRef.current?.value.trim();
                        if (val && currentCustomer) {
                          handleReply(currentCustomer.id, val);
                          if (inputRef.current) inputRef.current.value = "";
                        }
                      }}
                    >
                      发送
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </CustomerSupportSim>
  );
}
