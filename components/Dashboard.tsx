import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { UserProfile } from '../types';

interface DashboardProps {
  user: UserProfile;
}

const efficiencyData = [
  { name: 'Doc Processing', Manual: 10, PAILS: 0.5 }, // 95% reduction
  { name: 'Legal Research', Manual: 8, PAILS: 2 },    // 75% reduction
  { name: 'Drafting', Manual: 6, PAILS: 1.5 },        // 75% reduction
];

const painPointData = [
  { name: 'Doc Review', value: 30, color: '#0ea5e9' },
  { name: 'Research', value: 25, color: '#3b82f6' },
  { name: 'Drafting', value: 25, color: '#6366f1' },
  { name: 'Context Loss', value: 15, color: '#8b5cf6' },
  { name: 'QC', value: 5, color: '#a855f7' },
];

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-pails-900">Executive Dashboard</h2>
          <p className="text-slate-500 mt-1">Welcome back, {user.name} • {user.role}</p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-green-700">10 Agents Online</span>
          </div>
          <p className="text-sm text-slate-400">Version 2.4.0 (Build 882)</p>
        </div>
      </header>

      {/* Usage & Quota Banner */}
      <div className="bg-slate-900 rounded-xl p-6 text-white flex justify-between items-center shadow-lg">
         <div>
            <h3 className="font-bold text-lg mb-1">{user.subscriptionTier} Plan Active</h3>
            <p className="text-slate-400 text-sm">Your billing cycle resets in 14 days.</p>
         </div>
         <div className="flex gap-8">
            <div className="text-right">
                <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Case Quota</p>
                <p className="text-2xl font-bold">{user.quota.casesUsed} <span className="text-slate-500 text-sm">/ {user.quota.casesLimit === -1 ? '∞' : user.quota.casesLimit}</span></p>
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-400 uppercase tracking-wide font-bold">Tokens Processed</p>
                <p className="text-2xl font-bold">{(user.quota.tokensUsed / 1000).toFixed(1)}k</p>
            </div>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group hover:border-pails-300 transition-colors">
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Efficiency Gain</div>
          <div className="text-3xl font-bold text-pails-600 mt-2">12-40x</div>
          <div className="text-slate-400 text-xs mt-2">Faster than manual workflow</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group hover:border-pails-300 transition-colors">
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Accuracy</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">95%+</div>
          <div className="text-slate-400 text-xs mt-2">Verified by IRU Agent</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group hover:border-pails-300 transition-colors">
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Avg Case Time</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">22m</div>
          <div className="text-green-600 text-xs mt-2">↓ from 8 hours</div>
        </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group hover:border-pails-300 transition-colors">
          <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Cost Saving</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">60%</div>
          <div className="text-slate-400 text-xs mt-2">Projected Annual</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        {/* Efficiency Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Workflow Time Comparison (Hours)</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={efficiencyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="Manual" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Traditional" />
                <Bar dataKey="PAILS" fill="#0284c7" radius={[4, 4, 0, 0]} name="PAILS AI" />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pain Point Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Solved Pain Points</h3>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={painPointData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {painPointData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};