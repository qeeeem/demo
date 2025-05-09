import { Search, MoreVertical, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export default function CustomerServiceInterface() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧聊天列表 */}
      <div className="w-72 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="搜索客户..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <h3 className="text-xs font-semibold text-gray-500 px-2 py-1">待处理 (3)</h3>

            {/* 活跃聊天 - 当前选中 */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-md p-3 my-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">张先生</h4>
                  <p className="text-sm text-gray-600 truncate">设备无法连接到互联网</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">10:42</span>
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 mt-1">紧急</span>
                </div>
              </div>
            </div>

            {/* 其他待处理聊天 */}
            <div className="hover:bg-gray-100 rounded-md p-3 my-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">李女士</h4>
                  <p className="text-sm text-gray-600 truncate">关于账单问题的咨询</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">10:38</span>
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 mt-1">新</span>
                </div>
              </div>
            </div>

            <div className="hover:bg-gray-100 rounded-md p-3 my-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">王先生</h4>
                  <p className="text-sm text-gray-600 truncate">如何更换套餐？</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">10:30</span>
                </div>
              </div>
            </div>

            <h3 className="text-xs font-semibold text-gray-500 px-2 py-1 mt-4">已处理 (2)</h3>

            <div className="hover:bg-gray-100 rounded-md p-3 my-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">赵女士</h4>
                  <p className="text-sm text-gray-600 truncate">账户激活成功</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">09:55</span>
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                </div>
              </div>
            </div>

            <div className="hover:bg-gray-100 rounded-md p-3 my-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">刘先生</h4>
                  <p className="text-sm text-gray-600 truncate">套餐升级问题已解决</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">09:42</span>
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 中间聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 聊天头部 */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">张</span>
              </div>
            </div>
            <div>
              <h2 className="font-semibold">张先生</h2>
              <div className="flex items-center text-sm text-gray-500">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" /> 等待时间: 4分钟
                </span>
                <span className="mx-2">•</span>
                <span className="text-red-500 font-medium">紧急问题</span>
              </div>
            </div>
          </div>
          <button className="text-gray-500">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {/* 聊天消息区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 系统消息 */}
          <div className="flex justify-center">
            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-3 py-1">今天 10:40</span>
          </div>

          {/* 客户消息 */}
          <div className="flex flex-col items-start space-y-1 max-w-[80%]">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">张</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg py-2 px-3">
                <p className="text-gray-800">设备无法连接到互联网。</p>
              </div>
            </div>
            <span className="text-xs text-gray-500 ml-10">10:42 上午</span>
          </div>

          {/* 客服消息 */}
          <div className="flex flex-col items-end space-y-1 ml-auto max-w-[80%]">
            <div className="flex items-start space-x-2">
              <div className="bg-blue-500 rounded-lg py-2 px-3">
                <p className="text-white">很抱歉听到这个情况。您是否已经完成了实名认证？</p>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-semibold text-sm">我</span>
              </div>
            </div>
            <span className="text-xs text-gray-500 mr-10">10:42 上午</span>
          </div>

          {/* 客户回复 */}
          <div className="flex flex-col items-start space-y-1 max-w-[80%]">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">张</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg py-2 px-3">
                <p className="text-gray-800">是的，已经全部设置好了。</p>
              </div>
            </div>
            <span className="text-xs text-gray-500 ml-10">10:43 上午</span>
          </div>
        </div>

        {/* 消息输入区域 */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-1 relative">
              {/* AI提示弹窗 */}
              <div className="absolute bottom-full mb-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className="text-sm font-medium text-gray-700">AI建议回复</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="space-y-1.5">
                  <div className="bg-gray-50 hover:bg-gray-100 rounded-md p-2 cursor-pointer text-sm transition-colors">
                    您可以尝试重启设备，然后再次尝试连接网络。
                  </div>
                  <div className="bg-gray-50 hover:bg-gray-100 rounded-md p-2 cursor-pointer text-sm transition-colors">
                    请确认您的SIM卡是否正确插入并且没有损坏。
                  </div>
                </div>
              </div>

              <textarea
                placeholder="输入回复消息..."
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex space-x-2">
              <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 9H9.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 9H15.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 10L12 15L17 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15V3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div>
              <button className="bg-blue-500 text-white rounded-md px-4 py-2 font-medium">发送</button>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧洞察区域 */}
      <div className="w-80 border-l border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-lg">客户洞察</h2>
          <button className="text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* 客户信息 */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold mb-3">客户信息</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">姓名</span>
              <span className="font-medium">张明</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">手机号</span>
              <span className="font-medium">138****5678</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">账户状态</span>
              <span className="font-medium text-green-500">已激活</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">实名认证</span>
              <span className="font-medium text-green-500">已完成</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">当前套餐</span>
              <span className="font-medium">5G全国通用套餐</span>
            </div>
          </div>
        </div>

        {/* 历史记录 */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold mb-3">历史记录</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm">
                  <span className="font-medium">2023-05-01</span> -
                  <span className="text-gray-600"> 报告网络连接问题</span>
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm">
                  <span className="font-medium">2023-04-15</span> -<span className="text-gray-600"> 套餐升级</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 建议回复 */}
        <div className="p-4">
          <h3 className="font-semibold mb-3">建议回复</h3>
          <div className="space-y-2">
            <div className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50">
              <p className="text-sm">请检查设备是否已激活并在线</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50">
              <p className="text-sm">请尝试更换SIM卡</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50">
              <p className="text-sm">您可以尝试重启设备，然后再次连接网络</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50">
              <p className="text-sm">我可以为您提供一个关于切换网络运营商的视频指南</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
