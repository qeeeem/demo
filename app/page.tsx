"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { Search, Clock, X } from "lucide-react"
import type { Customer } from "../types/customers"

export default function CustomerServiceInterface() {
  // State for UI
  const [showInsights, setShowInsights] = useState(true)
  const [typingText, setTypingText] = useState("")
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  // State for customers
  const [customers, setCustomers] = useState<Customer[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [mode, setMode] = useState<"auto" | "manual">("manual")
  const [queue, setQueue] = useState<any[]>([])
  const [rawData, setRawData] = useState<any[]>([])

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Current customer
  const currentCustomer = customers.find((c) => c.id === currentId) || null

  // 在fetchData函数之前添加这个备用数据函数
  const getBackupData = () => {
    return [
      {
        id: "excel-1",
        name: "用户1",
        avatar: "🧑",
        urgency: "新",
        difficulty: "简单",
        question: "这个得充多久啊？怎么知道充满了？",
        ai_reply:
          "1、首次使用前建议 先把设备充满电再使用（大约3个小时左右 电池指示灯绿色常亮就是充满了）\n2、激活认证（按照收到的蓝色说明书步骤去激活设备或者联系我给您发送视频教程）",
        ai_suggestions: [
          "1、首次使用前建议 先把设备充满电再使用（大约3个小时左右 电池指示灯绿色常亮就是充满了）\n2、激活认证（按照收到的蓝色说明书步骤去激活设备或者联系我给您发送视频教程）",
          "您好，首次使用前建议先把设备充满电再使用哦~充满大约需要3个小时左右电池指示灯绿色常亮就是充满了~\n激活认证您可以按照收到的蓝色说明书步骤去激活设备哦~或者联系我给您发送视频教程~",
          "亲~首次使用前先把设备充满电再使用哦~充满大约需要3个小时左右，电池指示灯绿色常亮就是充满了！激活认证亲可以按照收到的蓝色说明书步骤去激活设备哦~",
        ],
        insight: {
          phone: "170****6634",
          status: "未激活",
          realName: "已完成",
          plan: "4G全国通用套餐",
          history: ["2025-11-22 - 套餐升级", "2025-07-04 - 实名问题"],
        },
      },
      {
        id: "excel-2",
        name: "用户2",
        avatar: "🧑",
        urgency: "新",
        difficulty: "简单",
        question: "刚到货能直接用吗还是得先充电？",
        ai_reply:
          "1、首次使用前建议 先把设备充满电再使用（大约3个小时左右 电池指示灯绿色常亮就是充满了）\n2、激活认证（按照收到的蓝色说明书步骤去激活设备或者联系我给您发送视频教程）",
        ai_suggestions: [
          "1、首次使用前建议 先把设备充满电再使用（大约3个小时左右 电池指示灯绿色常亮就是充满了）\n2、激活认证（按照收到的蓝色说明书步骤去激活设备哦~或者联系我给您发送视频教程）",
          "您好，首次使用前建议先把设备充满电再使用哦~充满大约需要4个小时左右电池指示灯绿色常亮就是充满了~\n激活认证您可以按照收到的蓝色说明书步骤去激活设备哦~或者联系我给您发送视频教程~",
          "亲~首次使用前先把设备充满电再使用哦~充满大约需要4个小时左右，电池指示灯绿色常亮就是充满了！激活认证亲可以按照收到的蓝色说明书步骤去激活设备哦~",
        ],
        insight: {
          phone: "168****7427",
          status: "已激活",
          realName: "已完成",
          plan: "5G全国通用套餐",
          history: ["2024-08-24 - 实名问题", "2024-03-19 - 好评问题", "2025-04-27 - 套餐升级"],
        },
      },
      {
        id: "excel-3",
        name: "用户3",
        avatar: "🧑",
        urgency: "新",
        difficulty: "简单",
        question: "指示灯一直红是怎么回事？是不是坏了？",
        ai_reply:
          "1、首次使用前建议 先把设备充满电再使用（大约3个小时左右 电池指示灯绿色常亮就是充满了）\n2、激活认证（按照收到的蓝色说明书步骤去激活设备或者联系我给您发送视频教程）",
        ai_suggestions: [
          "1、首次使用前建议 先把设备充满电再使用（大约3个小时左右 电池指示灯绿色常亮就是充满了）\n2、激活认证（按照收到的蓝色说明书步骤去激活设备哦~或者联系我给您发送视频教程~",
          "您好，首次使用前建议先把设备充满电再使用哦~充满大约需要5个小时左右电池指示灯绿色常亮就是充满了~\n激活认证您可以按照收到的蓝色说明书步骤去激活设备哦~或者联系我给您发送视频教程~",
          "亲~首次使用前先把设备充满电再使用哦~充满大约需要5个小时左右，电池指示灯绿色常亮就是充满了！激活认证亲可以按照收到的蓝色说明书步骤去激活设备哦~",
        ],
        insight: {
          phone: "138****7429",
          status: "未激活",
          realName: "已完成",
          plan: "5G专用流量",
          history: [
            "2025-01-12 - 激活问题",
            "2024-08-03 - 实名问题",
            "2024-01-03 - 套餐升级",
            "2025-05-03 - 报告网络连接问题",
          ],
        },
      },
    ]
  }

  // Load data
  useEffect(() => {
    // 修改数据加载逻辑，添加更好的错误处理和硬编码的备用数据
    // 在useEffect中修改fetchData函数

    const fetchData = async () => {
      try {
        // 首先尝试加载增强版的客户数据
        let response = await fetch("/generated_customers_augmented.json")

        // 检查响应是否为JSON
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json") && response.ok) {
          const data = await response.json()
          setRawData(data)
        } else {
          // 如果不是JSON，尝试加载原始数据
          console.warn("无法加载增强版JSON文件，尝试加载原始数据")
          response = await fetch("/generated_customers.json")

          if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
            const fallbackData = await response.json()
            setRawData(fallbackData)
          } else {
            // 如果两个文件都无法加载，使用硬编码的备用数据
            console.warn("无法加载任何JSON文件，使用硬编码的备用数据")
            setRawData(getBackupData())
          }
        }
      } catch (error) {
        console.error("加载数据出错:", error)
        // 出错时使用硬编码的备用数据
        setRawData(getBackupData())
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Initialize queue when raw data is loaded
  useEffect(() => {
    if (rawData.length > 0) {
const shuffled = [...rawData].sort(() => Math.random() - 0.5);
const initializedQueue = shuffled.map((c) => ({
  ...c,
  status: c.difficulty === "转人工" ? "manual" : "waiting",
  messages: c.messages || [{ from: "user", text: c.question }],
  createdAt: Date.now(),
}));
setQueue(initializedQueue);

    }
  }, [rawData])

  // Inject customers periodically
  useEffect(() => {
    if (queue.length === 0) return

    const interval = setInterval(
      () => {
        const count = Math.min(Math.floor(Math.random() * 3) + 1, queue.length)
        if (count === 0) return

        const toInject = queue.splice(0, count).map((c) => ({
          ...c,
          messages: c.messages || [{ from: "user", text: c.question }],
          createdAt: Date.now(),
        }))

        if (toInject.length > 0) {
          setCustomers((prev) => [...prev, ...toInject])
          if (!currentId) setCurrentId(toInject[0].id)
          setQueue([...queue])
        }
      },
      Math.random() * 9000 + 1000,
    )
    return () => clearInterval(interval)
  }, [queue, currentId])

  // Auto-reply effect
  useEffect(() => {
    if (!currentCustomer || mode !== "auto") return
    if (currentCustomer.status !== "waiting") return

    const last = currentCustomer.messages.at(-1)
    if (!last || last.from !== "user") return

    // Check if already replied
    const alreadyReplied = currentCustomer.messages.some((m) => m.from === "agent")
    if (alreadyReplied) return

    const fullText = currentCustomer.ai_reply
    let index = 0
    setTypingText("")

    const interval = setInterval(() => {
      index++
      setTypingText(fullText.slice(0, index))
      if (index >= fullText.length) {
        clearInterval(interval)
        setTimeout(() => {
          handleReply(currentCustomer.id, fullText)
          setTypingText("")
        }, 1000)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [currentCustomer, mode])

  // Auto-switch to next customer
  useEffect(() => {
    if (mode !== "auto") return
    if (!currentCustomer) return
    if (currentCustomer.status === "done" || currentCustomer.status === "manual") {
      const next = customers.find((c) => c.status === "waiting")
      if (next) setCurrentId(next.id)
    }
  }, [customers, currentCustomer, mode])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentCustomer?.messages.length])

  // Handle reply
  const handleReply = useCallback(
    (id: string, msg: string) => {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: "done",
                repliedAt: Date.now(),
                messages: [...c.messages, { from: "agent", text: msg }],
              }
            : c,
        ),
      )

      const next = customers.find((c) => c.status === "waiting" && c.id !== id)
      if (next) setCurrentId(next.id)
    },
    [customers],
  )

  // Render customer list item
  const renderCustomerItem = useCallback(
    (c: Customer) => (
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
    ),
    [currentId],
  )

  // Filter customers by status
  const manualCustomers = [...customers].filter((c) => c.status === "manual").reverse()
  const waitingCustomers = [...customers].filter((c) => c.status === "waiting").reverse()
  const doneCustomers = [...customers].filter((c) => c.status === "done").reverse()

  // Loading state
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>
  }

  // 渲染历史记录项
  const renderHistoryItem = (historyItem: string) => {
    // 解析历史记录，格式为 "YYYY-MM-DD - 事件描述"
    const parts = historyItem.split(" - ")
    if (parts.length !== 2) return null

    const [date, description] = parts

    // 根据描述类型设置不同的图标颜色
    let iconColor = "bg-blue-500"
    let iconSymbol = "i"

    if (description.includes("报告网络连接问题")) {
      iconColor = "bg-yellow-500"
      iconSymbol = "!"
    } else if (description.includes("套餐升级")) {
      iconColor = "bg-green-500"
      iconSymbol = "✓"
    } else if (description.includes("激活问题")) {
      iconColor = "bg-orange-500"
      iconSymbol = "!"
    } else if (description.includes("实名问题")) {
      iconColor = "bg-purple-500"
      iconSymbol = "i"
    } else if (description.includes("好评问题")) {
      iconColor = "bg-pink-500"
      iconSymbol = "★"
    }

    return (
      <div key={historyItem} className="flex items-start gap-2">
        <div className={`mt-1 w-4 h-4 rounded-full ${iconColor} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white text-[8px]">{iconSymbol}</span>
        </div>
        <div>
          <div className="text-xs text-gray-500">{date}</div>
          <div className="text-sm">{description}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left sidebar - customer list */}
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

      {/* Main content area */}
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
              
{/* {currentCustomer?.insight && (
  <div className="mt-2 text-sm text-gray-600 space-y-1">
    <div>📱 手机号：{currentCustomer.insight.phone}</div>
    <div>📌 实名状态：{currentCustomer.insight.realName}</div>
    <div>🟢 激活状态：{currentCustomer.insight.status}</div>
    <div>📶 套餐：{currentCustomer.insight.plan}</div>
    <div>
      🕘 历史记录：
      <ul className="list-disc list-inside text-xs text-gray-500">
        {currentCustomer.insight.history.map((h: string, idx: number) => (
          <li key={idx}>{h}</li>
        ))}
      </ul>
    </div>
  </div>
)} */}
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

        {/* Message area and insights panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Message area */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 min-w-0 ${showInsights ? "" : "w-full"}`}>
            {currentCustomer?.messages.map((msg, idx) => (
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

          {/* Customer insights panel */}
          {showInsights && (
            <div className="w-72 border-l border-gray-200 p-4 overflow-y-auto bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">客户洞察</h3>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowInsights(false)}>
                  <span className="sr-only">关闭</span>
                  <X size={20} />
                </button>
              </div>

              {currentCustomer && (
                <>
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-500 mb-2">客户信息</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">姓名</span>
                        <span className="text-sm font-medium">{currentCustomer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">手机号</span>
                        <span className="text-sm font-medium">{currentCustomer.insight?.phone || "138****5678"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">账户状态</span>
                        <span
                          className={`text-sm ${currentCustomer.insight?.status === "已激活" ? "text-green-500" : "text-orange-500"}`}
                        >
                          {currentCustomer.insight?.status || "未激活"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">实名认证</span>
                        <span className="text-sm text-green-500">{currentCustomer.insight?.realName || "已完成"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">当前套餐</span>
                        <span className="text-sm font-medium">{currentCustomer.insight?.plan || "5G全国通用套餐"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm text-gray-500 mb-2">历史记录</h4>
                    <div className="space-y-3">
                      {currentCustomer.insight?.history && currentCustomer.insight.history.length > 0 ? (
                        currentCustomer.insight.history.map(renderHistoryItem)
                      ) : (
                        <div className="text-sm text-gray-400">暂无历史记录</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Reply area */}
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
                          setDrafts((prev) => ({ ...prev, [currentCustomer.id]: suggestion }))
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
                value={mode === "auto" ? typingText : currentCustomer ? drafts[currentCustomer.id] || "" : ""}
                onChange={(e) => {
                  if (currentCustomer) {
                    setDrafts((prev) => ({ ...prev, [currentCustomer.id]: e.target.value }))
                  }
                }}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded self-center"
                disabled={mode === "auto"}
                onClick={() => {
                  const val = inputRef.current?.value.trim()
                  if (val && currentCustomer) {
                    handleReply(currentCustomer.id, val)

                    setDrafts((prev) => {
                      const updated = { ...prev }
                      delete updated[currentCustomer.id]
                      return updated
                    })
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
}
