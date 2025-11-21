import React from 'react';
import { AgentStatus, AgentType } from '../types';

interface AgentVisualizerProps {
  statuses: Record<AgentType, AgentStatus>;
}

const AgentNode: React.FC<{ type: AgentType; status: AgentStatus; label: string }> = ({ type, status, label }) => {
  const getStatusColor = (s: AgentStatus) => {
    switch (s) {
      case AgentStatus.Idle: return 'border-slate-200 bg-white text-slate-400';
      case AgentStatus.Thinking: return 'border-pails-500 bg-pails-50 text-pails-700 animate-pulse ring-2 ring-pails-200';
      case AgentStatus.Working: return 'border-blue-500 bg-blue-50 text-blue-700';
      case AgentStatus.Completed: return 'border-green-500 bg-green-50 text-green-700';
      case AgentStatus.Error: return 'border-red-500 bg-red-50 text-red-700';
      default: return 'border-slate-200 bg-white';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all duration-300 ${getStatusColor(status)}`}>
      <span className="font-bold text-lg">{type}</span>
      <span className="text-[10px] uppercase font-semibold mt-1">{status}</span>
      <div className="text-[8px] text-center px-1 mt-1 leading-tight opacity-70">{label}</div>
    </div>
  );
};

export const AgentVisualizer: React.FC<AgentVisualizerProps> = ({ statuses }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Multi-Agent Workflow</h3>
      
      <div className="flex flex-col gap-8 relative">
        {/* Connecting Lines Background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20" style={{ top: '40px' }}>
           <line x1="10%" y1="0" x2="50%" y2="0" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
           <line x1="50%" y1="0" x2="90%" y2="0" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
        </svg>

        {/* Input Layer */}
        <div className="flex justify-center items-center gap-8 z-10">
          <div className="absolute left-4 top-0 text-xs font-bold text-slate-400 -rotate-90 origin-top-left translate-y-12">INPUT</div>
          <AgentNode type={AgentType.DAU} status={statuses[AgentType.DAU]} label="Doc Analysis" />
          <AgentNode type={AgentType.EAU} status={statuses[AgentType.EAU]} label="Evidence" />
        </div>

        {/* Analysis Layer */}
        <div className="flex justify-center items-center gap-8 z-10 mt-4">
          <div className="absolute left-4 top-32 text-xs font-bold text-slate-400 -rotate-90 origin-top-left translate-y-12">ANALYSIS</div>
          <AgentNode type={AgentType.DIU} status={statuses[AgentType.DIU]} label="Dispute ID" />
          <AgentNode type={AgentType.LEU} status={statuses[AgentType.LEU]} label="Legal Research" />
          <AgentNode type={AgentType.SGU} status={statuses[AgentType.SGU]} label="Strategy" />
        </div>

        {/* Output Layer */}
        <div className="flex justify-center items-center gap-8 z-10 mt-4">
           <div className="absolute left-4 top-64 text-xs font-bold text-slate-400 -rotate-90 origin-top-left translate-y-12">OUTPUT</div>
          <AgentNode type={AgentType.DGU} status={statuses[AgentType.DGU]} label="Drafting" />
          <AgentNode type={AgentType.RGU} status={statuses[AgentType.RGU]} label="Reports" />
          <AgentNode type={AgentType.AGU} status={statuses[AgentType.AGU]} label="Abstracts" />
        </div>

        {/* Support Layer */}
        <div className="flex justify-center items-center gap-8 z-10 mt-4 border-t border-dashed border-slate-200 pt-6">
          <div className="absolute left-4 top-96 text-xs font-bold text-slate-400 -rotate-90 origin-top-left translate-y-12">SUPPORT</div>
           <AgentNode type={AgentType.SPU} status={statuses[AgentType.SPU]} label="Scheduling" />
           <AgentNode type={AgentType.IRU} status={statuses[AgentType.IRU]} label="Quality Review" />
        </div>
      </div>
    </div>
  );
};