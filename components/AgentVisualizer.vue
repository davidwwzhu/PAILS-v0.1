<template>
  <div class="w-full bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
    <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Multi-Agent Workflow</h3>
    
    <div class="flex flex-col gap-8 relative">
      <!-- Connecting Lines Background -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20" style="top: 40px">
         <line x1="10%" y1="0" x2="50%" y2="0" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5" />
         <line x1="50%" y1="0" x2="90%" y2="0" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,5" />
      </svg>

      <!-- Input Layer -->
      <div class="flex justify-center items-center gap-8 z-10">
        <div class="absolute left-4 top-0 text-xs font-bold text-slate-400 -rotate-90 origin-top-left translate-y-12">INPUT</div>
        <div :class="getNodeClass(AgentType.DAU)" class="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all duration-300">
          <span class="font-bold text-lg">DAU</span>
          <span class="text-[10px] uppercase font-semibold mt-1">{{ statuses[AgentType.DAU] }}</span>
          <div class="text-[8px] text-center px-1 mt-1 leading-tight opacity-70">Doc Analysis</div>
        </div>
        <div :class="getNodeClass(AgentType.EAU)" class="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all duration-300">
          <span class="font-bold text-lg">EAU</span>
          <span class="text-[10px] uppercase font-semibold mt-1">{{ statuses[AgentType.EAU] }}</span>
          <div class="text-[8px] text-center px-1 mt-1 leading-tight opacity-70">Evidence</div>
        </div>
      </div>

      <!-- Analysis Layer -->
      <div class="flex justify-center items-center gap-8 z-10 mt-4">
        <div class="absolute left-4 top-32 text-xs font-bold text-slate-400 -rotate-90 origin-top-left translate-y-12">ANALYSIS</div>
        <div :class="getNodeClass(AgentType.DIU)" class="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all duration-300">
          <span class="font-bold text-lg">DIU</span>
          <span class="text-[10px] uppercase font-semibold mt-1">{{ statuses[AgentType.DIU] }}</span>
          <div class="text-[8px] text-center px-1 mt-1 leading-tight opacity-70">Dispute ID</div>
        </div>
        <div :class="getNodeClass(AgentType.LEU)" class="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all duration-300">
          <span class="font-bold text-lg">LEU</span>
          <span class="text-[10px] uppercase font-semibold mt-1">{{ statuses[AgentType.LEU] }}</span>
          <div class="text-[8px] text-center px-1 mt-1 leading-tight opacity-70">Legal Research</div>
        </div>
        <div :class="getNodeClass(AgentType.SGU)" class="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all duration-300">
          <span class="font-bold text-lg">SGU</span>
          <span class="text-[10px] uppercase font-semibold mt-1">{{ statuses[AgentType.SGU] }}</span>
          <div class="text-[8px] text-center px-1 mt-1 leading-tight opacity-70">Strategy</div>
        </div>
      </div>

      <!-- Output Layer -->
      <div class="flex justify-center items-center gap-8 z-10 mt-4">
         <div class="absolute left-4 top-64 text-xs font-bold text-slate-400 -rotate-90 origin-top-left translate-y-12">OUTPUT</div>
        <div :class="getNodeClass(AgentType.DGU)" class="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all duration-300">
          <span class="font-bold text-lg">DGU</span>
          <span class="text-[10px] uppercase font-semibold mt-1">{{ statuses[AgentType.DGU] }}</span>
          <div class="text-[8px] text-center px-1 mt-1 leading-tight opacity-70">Drafting</div>
        </div>
        <div :class="getNodeClass(AgentType.RGU)" class="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all duration-300">
          <span class="font-bold text-lg">RGU</span>
          <span class="text-[10px] uppercase font-semibold mt-1">{{ statuses[AgentType.RGU] }}</span>
          <div class="text-[8px] text-center px-1 mt-1 leading-tight opacity-70">Reports</div>
        </div>
        <div :class="getNodeClass(AgentType.AGU)" class="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all duration-300">
          <span class="font-bold text-lg">AGU</span>
          <span class="text-[10px] uppercase font-semibold mt-1">{{ statuses[AgentType.AGU] }}</span>
          <div class="text-[8px] text-center px-1 mt-1 leading-tight opacity-70">Abstracts</div>
        </div>
      </div>

      <!-- Support Layer -->
      <div class="flex justify-center items-center gap-8 z-10 mt-4 border-t border-dashed border-slate-200 pt-6">
        <div class="absolute left-4 top-96 text-xs font-bold text-slate-400 -rotate-90 origin-top-left translate-y-12">SUPPORT</div>
         <div :class="getNodeClass(AgentType.SPU)" class="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all duration-300">
          <span class="font-bold text-lg">SPU</span>
          <span class="text-[10px] uppercase font-semibold mt-1">{{ statuses[AgentType.SPU] }}</span>
          <div class="text-[8px] text-center px-1 mt-1 leading-tight opacity-70">Scheduling</div>
        </div>
         <div :class="getNodeClass(AgentType.IRU)" class="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all duration-300">
          <span class="font-bold text-lg">IRU</span>
          <span class="text-[10px] uppercase font-semibold mt-1">{{ statuses[AgentType.IRU] }}</span>
          <div class="text-[8px] text-center px-1 mt-1 leading-tight opacity-70">Quality Review</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { AgentStatus, AgentType } from '../types';

const props = defineProps<{
  statuses: Record<AgentType, AgentStatus>;
}>();

const AgentTypeEnum = AgentType; // For template use

const getNodeClass = (type: AgentType) => {
  const status = props.statuses[type];
  switch (status) {
    case AgentStatus.Idle: return 'border-slate-200 bg-white text-slate-400';
    case AgentStatus.Thinking: return 'border-pails-500 bg-pails-50 text-pails-700 animate-pulse ring-2 ring-pails-200';
    case AgentStatus.Working: return 'border-blue-500 bg-blue-50 text-blue-700';
    case AgentStatus.Completed: return 'border-green-500 bg-green-50 text-green-700';
    case AgentStatus.Error: return 'border-red-500 bg-red-50 text-red-700';
    default: return 'border-slate-200 bg-white';
  }
};
</script>