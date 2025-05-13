'use client';


import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import type { TooltipProps } from 'recharts';
import cities from '../public/cities.json';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow border text-center">
        <div>{label}</div>
        <div style={{ color: payload[0].color, fontWeight: 500 }}>{payload[0].value}</div>
      </div>
    );
  }
  return null;
};

const tabs = [
  { label: '数据统计', key: 'stats', clickable: true },
  { label: '智能学习', key: 'ai-learn', clickable: false },
  { label: '知识库', key: 'kb', clickable: true },
  { label: 'AI设置', key: 'ai-settings', clickable: false },
  { label: '转人工机制', key: 'to-human', clickable: false },
];

const statsData = [
  { name: '03-15', value: 400 },
  { name: '03-16', value: 300 },
  { name: '03-17', value: 500 },
  { name: '03-18', value: 200 },
  { name: '03-19', value: 278 },
  { name: '03-20', value: 189 },
  { name: '03-21', value: 239 },
];
const evalData = [
  { name: '03-15', value: 80 },
  { name: '03-16', value: 90 },
  { name: '03-17', value: 70 },
  { name: '03-18', value: 100 },
  { name: '03-19', value: 110 },
  { name: '03-20', value: 95 },
  { name: '03-21', value: 120 },
];
const effData = [
  { name: '03-15', value: 60 },
  { name: '03-16', value: 65 },
  { name: '03-17', value: 70 },
  { name: '03-18', value: 80 },
  { name: '03-19', value: 90 },
  { name: '03-20', value: 100 },
  { name: '03-21', value: 110 },
];
const waitData = [
  { name: '03-15', value: 10 },
  { name: '03-16', value: 8 },
  { name: '03-17', value: 12 },
  { name: '03-18', value: 7 },
  { name: '03-19', value: 4 },
  { name: '03-20', value: 5 },
  { name: '03-21', value: 2 },
];

// 知识库子tab
const kbTabs = [
  { label: '预设知识库', key: 'preset' },
  { label: '企业知识库', key: 'company' },
  { label: '实体库', key: 'entity' },
];

// 生成模拟数据
const presetDataInit = [
  { id: 1, question: '设备充电多久？', valid: '2024-12-31', status: '启用', time: '2024-06-01 10:00', },
  { id: 2, question: '绿灯亮代表什么？', valid: '2024-12-31', status: '启用', time: '2024-06-02 11:00', },
  { id: 3, question: '如何恢复出厂设置？', valid: '2024-12-31', status: '停用', time: '2024-06-03 12:00', },
];
const companyDataInit = [
  { id: 1, question: '套餐怎么买？', valid: '2025-01-01', status: '启用', time: '2024-06-04 09:00', },
  { id: 2, question: '实名后多久能用？', valid: '2025-01-01', status: '启用', time: '2024-06-05 10:00', },
];
const entityDataInit = [
  {
    key: 'province',
    name: '省级区划',
    data: {} // 初始为空，后续用fetch加载
  },
  {
    key: 'zipcode',
    name: '邮编',
    data: {
      '北京市': '100000',
      '广州市': '510000',
      '杭州市': '310000'
    }
  }
];

export default function AISettingsPage() {
  const [activeTab, setActiveTab] = useState('stats');
  // 知识库子tab
  const [kbTab, setKbTab] = useState('preset');
  // 各库数据
  const [presetData, setPresetData] = useState(presetDataInit);
  const [companyData, setCompanyData] = useState(companyDataInit);
  const [entityData, setEntityData] = useState(entityDataInit);
  // 新增行或编辑行的状态
  const [editingRow, setEditingRow] = useState<null | {
    id?: number;
    question: string;
    valid: string;
    status: string;
    isNew?: boolean;
    oldData?: any;
  }>(null);
  // 实体库编辑弹窗
  const [entityEdit, setEntityEdit] = useState<null | { key: string; name: string; data: any; raw: string; error: string }> (null);

  // cities.json加载
  useEffect(() => {
    if (entityData[0].key === 'province' && Object.keys(entityData[0].data).length === 0) {
      fetch('/cities.json')
        .then(res => res.json())
        .then(data => {
          setEntityData(prev => prev.map(item =>
            item.key === 'province' ? { ...item, data } : item
          ));
        });
    }
  }, [entityData]);

  // 获取当前表格数据
  const getTableData = () => {
    if (kbTab === 'preset') return presetData;
    if (kbTab === 'company') return companyData;
    return entityData;
  };
  // 设置当前表格数据
  const setTableData = (data: any[]) => {
    if (kbTab === 'preset') setPresetData(data);
    else if (kbTab === 'company') setCompanyData(data);
    else setEntityData(data);
  };

  // 添加一行（可编辑，插入到表格底部）
  const handleAdd = () => {
    setEditingRow({
      question: '',
      valid: '',
      status: '启用',
      isNew: true,
    });
  };
  // 编辑一行
  const handleEdit = (row: any) => {
    setEditingRow({
      id: row.id,
      question: row.question,
      valid: row.valid,
      status: row.status,
      isNew: false,
      oldData: row,
    });
  };
  // 保存新增或编辑
  const handleSave = () => {
    if (editingRow?.isNew) {
      const newRow = {
        id: Date.now(),
        question: editingRow.question,
        valid: editingRow.valid,
        status: editingRow.status,
        time: new Date().toLocaleString('zh-CN', { hour12: false }),
      };
      setTableData([...(getTableData() as any[]).filter(row => 'id' in row), newRow]);
    } else if (editingRow?.id) {
      setTableData((getTableData() as any[]).map(row =>
        'id' in row && row.id === editingRow.id
          ? { ...row, question: editingRow.question, valid: editingRow.valid, status: editingRow.status }
          : row
      ));
    }
    setEditingRow(null);
  };
  // 取消新增或编辑
  const handleCancel = () => {
    setEditingRow(null);
  };
  // 删除一行
  const handleDelete = (id: number) => {
    setTableData((getTableData() as any[]).filter(row => 'id' in row && row.id !== id));
  };

  // 实体库编辑弹窗相关
  const openEntityEdit = (row: any) => {
    setEntityEdit({
      key: row.key,
      name: row.name,
      data: row.data,
      raw: JSON.stringify(row.data, null, 2),
      error: ''
    });
  };
  const closeEntityEdit = () => setEntityEdit(null);
  const handleEntityRawChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntityEdit(entityEdit && { ...entityEdit, raw: e.target.value, error: '' });
  };
  const saveEntityEdit = () => {
    if (!entityEdit) return;
    try {
      const parsed = JSON.parse(entityEdit.raw);
      setEntityData(entityData.map(item =>
        item.key === entityEdit.key ? { ...item, data: parsed } : item
      ));
      setEntityEdit(null);
    } catch (e) {
      setEntityEdit({ ...entityEdit, error: 'JSON格式错误' });
    }
  };

  return (
    <div className="p-6">
      {/* Tab栏 */}
      <div className="flex border-b mb-6">
        {tabs.map(tab => (
          <div
            key={tab.key}
            className={`px-6 py-2 cursor-pointer text-base font-medium transition-colors duration-150
              ${activeTab === tab.key ? 'border-b-2 border-blue-500 text-blue-600 bg-white' : 'text-gray-500'}
              hover:text-blue-500
            `}
            onClick={() => tab.clickable && setActiveTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Tab内容 */}
      {activeTab === 'stats' && (
        <>
          {/* 今日接待水平卡片 */}
          <div className="bg-white rounded-xl shadow p-6 flex justify-between mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold">2102</div>
              <div className="text-gray-500 mt-1">有效会话</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">638</div>
              <div className="text-gray-500 mt-1">接待用户</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">12%</div>
              <div className="text-gray-500 mt-1">转人工率</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2.3%</div>
              <div className="text-gray-500 mt-1">未识别占比</div>
            </div>
          </div>

          {/* 四个统计图 */}
          <div className="grid grid-cols-2 grid-rows-2 gap-6 h-[calc(100vh-300px)]">
  {/* 机器人应答统计 */}
  <div className="bg-white rounded-xl shadow p-4 h-full">
    <div className="font-semibold mb-2">机器人应答统计</div>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={statsData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={(props) => <CustomTooltip {...props} />} />
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* 对话评价 */}
  <div className="bg-white rounded-xl shadow p-4 h-full">
    <div className="font-semibold mb-2">对话评价</div>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={evalData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={(props) => <CustomTooltip {...props} />} />
        <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* 对话效率 */}
  <div className="bg-white rounded-xl shadow p-4 h-full">
    <div className="font-semibold mb-2">对话效率</div>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={effData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={(props) => <CustomTooltip {...props} />} />
        <Line type="monotone" dataKey="value" stroke="#ffc658" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* 排队等待时长 */}
  <div className="bg-white rounded-xl shadow p-4 h-full">
    <div className="font-semibold mb-2">排队等待时长(min)</div>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={waitData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={(props) => <CustomTooltip {...props} />} />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

        </>
      )}
      {activeTab === 'kb' && (
        <div className="bg-white rounded-xl shadow p-6">
          {/* 知识库子tab */}
          <div className="flex mb-4 border-b">
            {kbTabs.map(tab => (
              <div
                key={tab.key}
                className={`px-4 py-2 cursor-pointer text-base font-medium transition-colors duration-150
                  ${kbTab === tab.key ? 'border-b-2 border-blue-500 text-blue-600 bg-white' : 'text-gray-500'}
                  hover:text-blue-500
                `}
                onClick={() => setKbTab(tab.key)}
              >
                {tab.label}
              </div>
            ))}
          </div>
          {/* 表格右上按钮 */}
          <div className="flex justify-end mb-2 gap-2">
            <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleAdd} disabled={!!editingRow}>添加</button>
            <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" onClick={() => alert('导入功能暂未开放')}>导入</button>
          </div>
          {/* 表格 */}
          <div className="overflow-x-auto">
            {kbTab === 'entity' ? (
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 border">名称</th>
                    <th className="px-4 py-2 border">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {entityData.map(row => (
                    <tr key={row.key} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{row.name}</td>
                      <td className="px-4 py-2 border flex gap-2">
                        <button className="px-2 py-1 text-blue-500 hover:underline" onClick={() => openEntityEdit(row)}>编辑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 border">标准问题</th>
                    <th className="px-4 py-2 border">有效期</th>
                    <th className="px-4 py-2 border">状态</th>
                    <th className="px-4 py-2 border">时间</th>
                    <th className="px-4 py-2 border">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {getTableData().filter(row => 'id' in row).map(row => (
                    editingRow && !editingRow.isNew && editingRow.id === row.id ? (
                      <tr key={row.id} className="bg-yellow-50">
                        <td className="px-4 py-2 border">
                          <input
                            className="border rounded px-2 py-1 w-full"
                            value={editingRow.question}
                            onChange={e => setEditingRow({ ...editingRow, question: e.target.value })}
                            placeholder="请输入标准问题"
                          />
                        </td>
                        <td className="px-4 py-2 border">
                          <input
                            type="date"
                            className="border rounded px-2 py-1 w-full"
                            value={editingRow.valid}
                            onChange={e => setEditingRow({ ...editingRow, valid: e.target.value })}
                          />
                        </td>
                        <td className="px-4 py-2 border">
                          <select
                            className="border rounded px-2 py-1 w-full"
                            value={editingRow.status}
                            onChange={e => setEditingRow({ ...editingRow, status: e.target.value })}
                          >
                            <option value="启用">启用</option>
                            <option value="停用">停用</option>
                          </select>
                        </td>
                        <td className="px-4 py-2 border text-gray-400">{row.time}</td>
                        <td className="px-4 py-2 border flex gap-2">
                          <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleSave} disabled={!editingRow.question || !editingRow.valid}>保存</button>
                          <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" onClick={handleCancel}>取消</button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{row.question}</td>
                        <td className="px-4 py-2 border">{row.valid}</td>
                        <td className="px-4 py-2 border">{row.status}</td>
                        <td className="px-4 py-2 border">{row.time}</td>
                        <td className="px-4 py-2 border flex gap-2">
                          <button className="px-2 py-1 text-blue-500 hover:underline" onClick={() => handleEdit(row)} disabled={!!editingRow}>编辑</button>
                          <button className="px-2 py-1 text-red-500 hover:underline" onClick={() => handleDelete(row.id)} disabled={!!editingRow && editingRow.id === row.id}>删除</button>
                        </td>
                      </tr>
                    )
                  ))}
                  {/* 新增可编辑行 */}
                  {editingRow && editingRow.isNew && (
                    <tr className="bg-yellow-50">
                      <td className="px-4 py-2 border">
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={editingRow.question}
                          onChange={e => setEditingRow({ ...editingRow, question: e.target.value })}
                          placeholder="请输入标准问题"
                        />
                      </td>
                      <td className="px-4 py-2 border">
                        <input
                          type="date"
                          className="border rounded px-2 py-1 w-full"
                          value={editingRow.valid}
                          onChange={e => setEditingRow({ ...editingRow, valid: e.target.value })}
                        />
                      </td>
                      <td className="px-4 py-2 border">
                        <select
                          className="border rounded px-2 py-1 w-full"
                          value={editingRow.status}
                          onChange={e => setEditingRow({ ...editingRow, status: e.target.value })}
                        >
                          <option value="启用">启用</option>
                          <option value="停用">停用</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 border text-gray-400">--</td>
                      <td className="px-4 py-2 border flex gap-2">
                        <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleSave} disabled={!editingRow.question || !editingRow.valid}>保存</button>
                        <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" onClick={handleCancel}>取消</button>
                      </td>
                    </tr>
                  )}
                  {getTableData().filter(row => 'id' in row).length === 0 && !editingRow && (
                    <tr><td colSpan={5} className="text-center text-gray-400 py-6">暂无数据</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* 实体库编辑弹窗 */}
          {entityEdit && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[480px] max-w-full">
                <div className="font-bold mb-2">编辑 {entityEdit.name}</div>
                <textarea
                  className="w-full h-56 border rounded p-2 font-mono text-xs mb-2"
                  value={entityEdit.raw}
                  onChange={handleEntityRawChange}
                />
                {entityEdit.error && <div className="text-red-500 mb-2">{entityEdit.error}</div>}
                <div className="flex justify-end gap-2">
                  <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={saveEntityEdit}>保存</button>
                  <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200" onClick={closeEntityEdit}>取消</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 