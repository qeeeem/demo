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

  // 处理菜单点击
  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 可以在这里添加点击反馈效果
    const target = e.currentTarget as HTMLElement;
    target.classList.add('bg-gray-100');
    setTimeout(() => {
      target.classList.remove('bg-gray-100');
    }, 200);
  };

  // 在组件内添加颜色映射
  const sourceColorMap: Record<string, { bg: string; color: string; border: string }> = {
    'H5': { bg: '#55aa7f', color: '#fff', border: '#3c795a' }, // 绿色
    '微信': { bg: '#3b82f6', color: '#fff', border: '#1d4ed8' }, // 蓝色
    '官网': { bg: '#aaaaff', color: '#fff', border: '#7373ac' }, // 紫色
  };

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
            <div className="truncate flex items-center">
              {c.name}
              <span
                className="ml-2 px-2 py-0.5 text-xs rounded-full font-normal"
                style={{
                  backgroundColor: c.isNewCustomer ? '#e0f2fe' : '#e5e7eb',
                  color: c.isNewCustomer ? '#0284c7' : '#6b7280',
                }}
              >
                {c.isNewCustomer ? '新客户' : '老客户'}
              </span>
              {c.source && (
                <span
                  className={`ml-2 text-xs px-3 py-0.5 rounded-xl font-normal
                    ${c.source === "H5"
                      ? "bg-green-100 text-green-600"
                      : c.source === "微信"
                      ? "bg-blue-100 text-blue-600"
                      : c.source === "官网"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-600"
                    }`
                  }
                >
                  {c.source}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {c.messages.at(-1)?.image ? '[图片]' : (c.messages.at(-1)?.text?.slice(0, 20) || '')}
            </div>
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
          <div className="flex h-screen bg-gray-50 p-6 gap-6">
            {/* Sidebar */}
            <div className="w-72">
              <div className="bg-white rounded-xl shadow p-4 h-full flex flex-col">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="搜索客户..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mt-4 space-y-4 flex-1 overflow-y-auto text-sm">
                  {manualCustomers.length > 0 && (
                    <div>
                      <h3 className="text-xs text-gray-500 mb-1">转人工（{manualCustomers.length}）</h3>
                      {manualCustomers.map(renderCustomerItem)}
                    </div>
                  )}
                  {waitingCustomers.length > 0 && (
                    <div>
                      <h3 className="text-xs text-gray-500 mb-1">待处理（{waitingCustomers.length}）</h3>
                      {waitingCustomers.map(renderCustomerItem)}
                    </div>
                  )}
                  {doneCustomers.length > 0 && (
                    <div>
                      <h3 className="text-xs text-gray-500 mb-1">已处理（{doneCustomers.length}）</h3>
                      {doneCustomers.map(renderCustomerItem)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Chat */}
            <div className="flex-1 flex flex-col">
              <div className="bg-white rounded-xl shadow flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold select-none" style={{background: '#d1d5db', color: '#374151'}}>用户</div>
                    </div>
                    <div>
                      <h2 className="font-semibold flex items-center">
                        {currentCustomer?.name}
                        {currentCustomer && (
                          <span
                            className="ml-2 px-2 py-0.5 text-xs rounded-full font-normal"
                            style={{
                              backgroundColor: currentCustomer.isNewCustomer ? '#e0f2fe' : '#e5e7eb',
                              color: currentCustomer.isNewCustomer ? '#0284c7' : '#6b7280',
                            }}
                          >
                            {currentCustomer.isNewCustomer ? '新客户' : '老客户'}
                          </span>
                        )}
                        {currentCustomer?.source && (
                          <span
                            className={`ml-2 text-xs px-2 py-0.5 rounded-xl font-normal
                              ${currentCustomer.source === "H5"
                                ? "bg-green-100 text-green-600"
                                : currentCustomer.source === "微信"
                                ? "bg-blue-100 text-blue-600"
                                : currentCustomer.source === "官网"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-gray-100 text-gray-600"
                              }`
                            }
                          >
                            {currentCustomer.source}
                          </span>
                        )}
                      </h2>
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

                {/* Chat area */}
                <div className="flex flex-1 overflow-hidden">
                  <div className={`flex-1 overflow-y-auto p-6 space-y-4 text-sm ${showInsights ? "" : "w-full"}`}>
                    {currentCustomer?.messages.map((msg: any, idx: number) => (
                      <div key={idx} className={`flex ${msg.from === "agent" ? "justify-end" : "justify-start"}`}>
                        {msg.from === 'user' ? (
                          <>
                            <div className="w-10 h-10 bg-gray-300 text-gray-700 text-sm rounded-full flex items-center justify-center mr-2 font-semibold select-none">用户</div>
                            {msg.text && (
                              <div
                                className={`max-w-[60%] px-4 py-2 rounded-lg bg-white border`}
                              >
                                {msg.text}
                              </div>
                            )}
                            {msg.image && (
                              <img src={msg.image} alt="图片" className="max-w-[480px] max-h-[360px] rounded-lg border ml-2 object-contain" />
                            )}
                          </>
                        ) : (
                          <>
                            {msg.text && (
                              <div className="max-w-[60%] px-4 py-2 rounded-lg bg-blue-500 text-white">
                                {msg.text}
                              </div>
                            )}
                            {msg.image && (
                              <img src={msg.image} alt="图片" className="max-w-[480px] max-h-[360px] rounded-lg border mr-2 object-contain" />
                            )}
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center ml-2 text-xs">Q</div>
                          </>
                        )}
                      </div>
                    ))}
                    <div ref={scrollRef} />
                  </div>
                  {showInsights && currentCustomer?.insight && (
                    <div className="w-80 bg-white shadow-lg rounded-2xl border-l p-6 flex flex-col gap-4">
                      {/* 基本信息 */}
                      <div>
                        <div className="font-semibold text-base mb-2 text-gray-700 flex items-center gap-2">
                          <span className="inline-block w-1.5 h-4 bg-blue-500 rounded-full mr-2"></span>
                          客户洞察
                        </div>
                        <div className="flex flex-col gap-2 text-sm">
                          <div><span className="text-gray-500">手机号：</span><span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{currentCustomer.insight.phone}</span></div>
                          <div><span className="text-gray-500">激活状态：</span><span className={`px-2 py-0.5 rounded text-xs font-semibold ${currentCustomer.insight.status === '已激活' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{currentCustomer.insight.status}</span></div>
                          <div><span className="text-gray-500">实名认证：</span><span className={`px-2 py-0.5 rounded text-xs font-semibold ${currentCustomer.insight.realName === '已完成' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{currentCustomer.insight.realName}</span></div>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <div className="text-gray-500 text-xs mb-1">套餐信息</div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{currentCustomer.insight.plan}</span>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <div className="text-gray-500 text-xs mb-1">历史记录</div>
                        {currentCustomer.isNewCustomer ? (
                          <div className="text-gray-400 text-sm italic">暂无记录</div>
                        ) : (
                          <ol className="relative border-l border-gray-200 ml-2">
                            {[...currentCustomer.insight.history]
                              .sort((a, b) => {
                                // 提取日期部分进行比较
                                const dateA = a.split(' - ')[0];
                                const dateB = b.split(' - ')[0];
                                return dateB.localeCompare(dateA); // 倒序排列
                              })
                              .map((item: string, i: number) => (
                                <li key={i} className="mb-3 ml-4">
                                  <div className="absolute w-2 h-2 bg-blue-400 rounded-full -left-1.5 mt-1"></div>
                                  <span className="text-gray-700 text-xs">{item}</span>
                                </li>
                              ))}
                          </ol>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-gray-50 rounded-b-xl">
                  {mode === "manual" && currentCustomer?.ai_suggestions?.length > 0 && (
                    <div className="mb-2 space-y-1 text-sm">
                      {currentCustomer.ai_suggestions.map((sug: string, idx: number) => (
                        <div
                          key={idx}
                          className="bg-gray-100 hover:bg-gray-200 border px-3 py-1 rounded cursor-pointer"
                          onClick={() => setTypingText(sug)}
                        >
                          {sug}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={inputRef}
                      placeholder="请输入回复..."
                      className="flex-1 border rounded p-2 min-h-[80px] resize-none"
                      readOnly={mode === "auto"}
                      value={typingText}
                      onChange={(e) => setTypingText(e.target.value)}
                    />
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
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
