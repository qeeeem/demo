"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { Search, Clock, X } from "lucide-react"
import type { Customer } from "../types/customers"
import CustomerSupportSim from "./CustomerSupportSim";

export default function CustomerServiceInterface() {
  // UI state
  const [showInsights, setShowInsights] = useState(true)
  const [mode, setMode] = useState<"auto" | "manual">("manual")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  return (
    <CustomerSupportSim mode={mode}>
      {({ customers, currentCustomer, handleReply, typingText, setTypingText, currentId, setCurrentId }) => {
        // Filter customers
        const renderCustomerItem = (c: Customer) => (
          <div
            key={c.id}
            className={`p-2 rounded cursor-pointer text-sm ${
              currentId === c.id ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"
            }`}
            onClick={() => setCurrentId(c.id)}
          >
            <div className="truncate">{c.name}</div>
            <div className="text-xs text-gray-500 truncate">{c.messages.at(-1)?.text}</div>
          </div>
        )
        const manualCustomers = [...customers].filter((c) => c.status === "manual").reverse()
        const waitingCustomers = [...customers].filter((c) => c.status === "waiting").reverse()
        const doneCustomers = [...customers].filter((c) => c.status === "done").reverse()

        // Scroll effect
        useEffect(() => {
          scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, [currentCustomer?.messages.length])

        // Auto-switch to next
        useEffect(() => {
          if (mode !== "auto") return
          if (!currentCustomer) return
          if (currentCustomer.status === "done" || currentCustomer.status === "manual") {
            const next = customers.find((c) => c.status === "waiting")
            if (next) setCurrentId(next.id)
          }
        }, [customers, currentCustomer, mode, setCurrentId])

        return (
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
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

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header */}
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
                        {currentCustomer?.createdAt &&
                          (() => {
                            const base = currentCustomer.repliedAt ?? Date.now()
                            const diff = base - currentCustomer.createdAt!
                            const secs = Math.floor(diff / 1000)
                            const min = Math.floor(secs / 60)
                            const sec = secs % 60
                            return ` ${min}分${sec}秒`
                          })()}
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
                  <button className="px-2 py-1 rounded border bg-white" onClick={() => setShowInsights(!showInsights)}>
                    {showInsights ? "隐藏洞察" : "显示洞察"}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 overflow-hidden">
                <div className={`flex-1 overflow-y-auto p-4 space-y-4 min-w-0 ${showInsights ? "" : "w-full"}`}>  
                  {currentCustomer?.messages.map((msg: any, idx: number) => (
                    <div key={idx} className={`flex ${msg.from === "agent" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[60%] px-4 py-2 rounded-lg ${
                          msg.from === "agent" ? "bg-blue-500 text-white" : "bg-white border"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>
                {showInsights && (
                  <div className="w-72 border-l border-gray-200 p-4 overflow-y-auto bg-gray-50">
                    {/* Insights UI... */}
                  </div>
                )}
              </div>

              {/* Reply */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex flex-col gap-2 h-full">
                  {mode === "manual" &&
                    currentCustomer &&
                    Array.isArray(currentCustomer.ai_suggestions) &&
                    currentCustomer.ai_suggestions.length > 0 && (
                      <div className="space-y-1 text-sm text-gray-700">
                        {currentCustomer.ai_suggestions.map((suggestion: string, idx: number) => (
                          <div
                            key={idx}
                            className="bg-gray-100 hover:bg-gray-200 border p-2 rounded cursor-pointer"
                            onClick={() => {
                              if (currentCustomer) {
                                setTypingText(suggestion)
                              }
                            }}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}

                  <div className="flex gap-2 items-center">
                    <textarea
                      ref={inputRef}
                      placeholder="请输入回复..."
                      className="flex-1 border rounded p-2 resize-none min-h-[100px]"
                      readOnly={mode === "auto"}
                      value={mode === "auto" ? typingText : typingText}
                      onChange={(e) => setTypingText(e.target.value)}
                    />
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded self-center"
                      disabled={mode === "auto"}
                      onClick={() => {
                        const val = inputRef.current?.value.trim()
                        if (val && currentCustomer) {
                          handleReply(currentCustomer.id, val)
                          setTypingText("")
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
        )
      }}
    </CustomerSupportSim>
  )
}
