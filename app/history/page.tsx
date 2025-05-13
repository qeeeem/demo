'use client';

import React, { useEffect, useState } from 'react';

const kefuList = ['客服1', '客服2', '客服3', '客服4', '客服5'];
const starList = ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐', '⭐⭐', '⭐'];

function randomDuration() {
  // 0.1~3.0min，保留1位小数
  return (Math.random() * 2.9 + 0.1).toFixed(1);
}
function randomKefu() {
  return kefuList[Math.floor(Math.random() * kefuList.length)];
}
function randomSolved() {
  return Math.random() < 0.9 ? '是' : '否';
}
function randomStar() {
  const r = Math.random();
  if (r < 0.8) return '⭐⭐⭐⭐⭐';
  if (r < 0.85) return '⭐⭐⭐⭐';
  if (r < 0.9) return '⭐⭐⭐';
  if (r < 0.95) return '⭐⭐';
  return '⭐';
}

export default function HistoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState({
    name: '',
    phone: '',
    keyword: '',
    date: '',
    kefu: '',
    star: '',
  });

  useEffect(() => {
    fetch('/generated_customers.json')
      .then(res => res.json())
      .then(list => {
        setData(list.slice(0, 100).map((item: any) => ({
          name: item.name,
          phone: item.insight?.phone || '',
          tag: item.isNewCustomer ? '新用户' : '老用户',
          duration: randomDuration(),
          kefu: randomKefu(),
          solved: randomSolved(),
          star: randomStar(),
          source: item.source,
        })));
      });
  }, []);

  // 筛选逻辑
  const filtered = data.filter(row =>
    (!filter.name || row.name.includes(filter.name)) &&
    (!filter.phone || row.phone.includes(filter.phone)) &&
    (!filter.keyword || row.tag.includes(filter.keyword)) &&
    (!filter.kefu || row.kefu === filter.kefu) &&
    (!filter.star || row.star === filter.star)
    // 日期筛选可扩展
  );

  // 分页
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageCount = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="p-6">
      {/* 筛选区 */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-4 mb-4">
  <div className="min-w-[160px] h-[72px] flex flex-col justify-between">
    <div className="text-xs text-gray-500">用户名</div>
    <input
      className="border rounded px-2 py-1 h-9 w-full"
      value={filter.name}
      onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
    />
  </div>

  <div className="min-w-[160px] h-[72px] flex flex-col justify-between">
    <div className="text-xs text-gray-500">用户电话</div>
    <input
      className="border rounded px-2 py-1 h-9 w-full"
      value={filter.phone}
      onChange={e => setFilter(f => ({ ...f, phone: e.target.value }))}
    />
  </div>

  <div className="min-w-[160px] h-[72px] flex flex-col justify-between">
    <div className="text-xs text-gray-500">关键字</div>
    <input
      className="border rounded px-2 py-1 h-9 w-full"
      value={filter.keyword}
      onChange={e => setFilter(f => ({ ...f, keyword: e.target.value }))}
    />
  </div>

  {/* <div className="min-w-[160px] h-[72px] flex flex-col justify-between">
    <div className="text-xs text-gray-500">咨询时间</div>
    <input
      type="date"
      className="border rounded px-2 py-1 h-9 w-full"
      value={filter.date}
      onChange={e => setFilter(f => ({ ...f, date: e.target.value }))}
    />
  </div> */}

  <div className="min-w-[160px] h-[72px] flex flex-col justify-between">
    <div className="text-xs text-gray-500">接洽对象</div>
    <select
      className="border rounded px-2 py-1 h-9 w-full"
      value={filter.kefu}
      onChange={e => setFilter(f => ({ ...f, kefu: e.target.value }))}
    >
      <option value="">全部</option>
      {kefuList.map(k => <option key={k}>{k}</option>)}
    </select>
  </div>

  <div className="min-w-[160px] h-[72px] flex flex-col justify-between">
    <div className="text-xs text-gray-500">评价</div>
    <select
      className="border rounded px-2 py-1 h-9 w-full"
      value={filter.star}
      onChange={e => setFilter(f => ({ ...f, star: e.target.value }))}
    >
      <option value="">全部</option>
      {starList.map(s => <option key={s}>{s}</option>)}
    </select>
  </div>
</div>

      {/* 表格右上按钮 */}
      <div className="flex justify-end gap-2 mb-2">
        <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">导出</button>
        <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">历史导出</button>
        <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">表头管理</button>
      </div>
      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border">用户信息</th>
              <th className="px-4 py-2 border">标签</th>
              <th className="px-4 py-2 border">对话时长(min)</th>
              <th className="px-4 py-2 border">接待对象</th>
              <th className="px-4 py-2 border">是否解决</th>
              <th className="px-4 py-2 border">用户评价</th>
              <th className="px-4 py-2 border">访问来源</th>
              <th className="px-4 py-2 border">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{row.name} <span className="text-xs text-gray-400 ml-2">{row.phone}</span></td>
                <td className="px-4 py-2 border">{row.tag}</td>
                <td className="px-4 py-2 border">{row.duration}</td>
                <td className="px-4 py-2 border">{row.kefu}</td>
                <td className="px-4 py-2 border">{row.solved}</td>
                <td className="px-4 py-2 border">{row.star}</td>
                <td className="px-4 py-2 border">{row.source}</td>
                <td className="px-4 py-2 border flex gap-2">
                  <button className="px-2 py-1 text-blue-500 hover:underline">明细</button>
                  <button className="px-2 py-1 text-gray-500 hover:underline">下载</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center text-gray-400 py-6">暂无数据</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* 分页器 */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">每页显示</span>
          <select
            className="border rounded px-2 py-1"
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[...Array(10)].map((_, i) => 10 * (i + 1)).filter(n => n <= 100).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500">条</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded border hover:bg-gray-100"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >上一页</button>
          <span className="text-sm">{page} / {pageCount}</span>
          <button
            className="px-2 py-1 rounded border hover:bg-gray-100"
            disabled={page === pageCount || pageCount === 0}
            onClick={() => setPage(p => Math.min(pageCount, p + 1))}
          >下一页</button>
        </div>
      </div>
    </div>
  );
} 