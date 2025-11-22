<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <header class="flex justify-between items-end border-b border-slate-200 pb-6">
      <div>
        <h2 class="text-3xl font-bold text-pails-900">Executive Dashboard</h2>
        <p class="text-slate-500 mt-1">Welcome back, {{ user.name }} • {{ user.role }}</p>
      </div>
      <div class="text-right">
        <div class="inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100 mb-2">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span class="text-xs font-medium text-green-700">10 Agents Online</span>
        </div>
        <p class="text-sm text-slate-400">Version 2.4.0 (Build 882)</p>
      </div>
    </header>

    <!-- Usage & Quota Banner -->
    <div class="bg-slate-900 rounded-xl p-6 text-white flex justify-between items-center shadow-lg">
      <div>
        <h3 class="font-bold text-lg mb-1">{{ user.subscriptionTier }} Plan Active</h3>
        <p class="text-slate-400 text-sm">Your billing cycle resets in 14 days.</p>
      </div>
      <div class="flex gap-8">
        <div class="text-right">
          <p class="text-xs text-slate-400 uppercase tracking-wide font-bold">Case Quota</p>
          <p class="text-2xl font-bold">{{ user.quota.casesUsed }} <span class="text-slate-500 text-sm">/ {{ user.quota.casesLimit === -1 ? '∞' : user.quota.casesLimit }}</span></p>
        </div>
        <div class="text-right">
          <p class="text-xs text-slate-400 uppercase tracking-wide font-bold">Tokens Processed</p>
          <p class="text-2xl font-bold">{{ (user.quota.tokensUsed / 1000).toFixed(1) }}k</p>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group hover:border-pails-300 transition-colors">
        <div class="text-sm text-slate-500 font-medium uppercase tracking-wider">Efficiency Gain</div>
        <div class="text-3xl font-bold text-pails-600 mt-2">12-40x</div>
        <div class="text-slate-400 text-xs mt-2">Faster than manual workflow</div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group hover:border-pails-300 transition-colors">
        <div class="text-sm text-slate-500 font-medium uppercase tracking-wider">Accuracy</div>
        <div class="text-3xl font-bold text-slate-900 mt-2">95%+</div>
        <div class="text-slate-400 text-xs mt-2">Verified by IRU Agent</div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group hover:border-pails-300 transition-colors">
        <div class="text-sm text-slate-500 font-medium uppercase tracking-wider">Avg Case Time</div>
        <div class="text-3xl font-bold text-slate-900 mt-2">22m</div>
        <div class="text-green-600 text-xs mt-2">↓ from 8 hours</div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group hover:border-pails-300 transition-colors">
        <div class="text-sm text-slate-500 font-medium uppercase tracking-wider">Cost Saving</div>
        <div class="text-3xl font-bold text-slate-900 mt-2">60%</div>
        <div class="text-slate-400 text-xs mt-2">Projected Annual</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
      <!-- Efficiency Chart (Custom CSS Bar Chart) -->
      <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <h3 class="text-lg font-bold text-slate-900 mb-6">Workflow Time Comparison (Hours)</h3>
        <div class="flex-1 flex items-end gap-12 pb-6 px-4">
          <div v-for="(item, index) in efficiencyData" :key="index" class="flex-1 flex flex-col items-center gap-2">
            <div class="w-full flex items-end justify-center gap-2 h-64">
              <div class="w-8 bg-slate-400 rounded-t-sm relative group" :style="{ height: (item.Manual * 8) + '%' }">
                <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 opacity-0 group-hover:opacity-100">{{ item.Manual }}h</span>
              </div>
              <div class="w-8 bg-pails-600 rounded-t-sm relative group" :style="{ height: (item.PAILS * 8) + '%' }">
                <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-pails-600 opacity-0 group-hover:opacity-100">{{ item.PAILS }}h</span>
              </div>
            </div>
            <span class="text-xs font-medium text-slate-500">{{ item.name }}</span>
          </div>
        </div>
        <div class="flex justify-center gap-6">
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <div class="w-3 h-3 bg-slate-400 rounded-sm"></div> Traditional
          </div>
          <div class="flex items-center gap-2 text-xs text-slate-500">
            <div class="w-3 h-3 bg-pails-600 rounded-sm"></div> PAILS AI
          </div>
        </div>
      </div>

      <!-- Pain Point Distribution (Custom CSS Pie Chart Representation) -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <h3 class="text-lg font-bold text-slate-900 mb-2">Solved Pain Points</h3>
        <div class="flex-1 flex flex-col items-center justify-center">
          <!-- Simple CSS Donut Chart -->
          <div class="relative w-48 h-48 rounded-full" :style="pieStyle">
            <div class="absolute inset-0 rounded-full border-4 border-transparent"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner">
              <span class="text-xs font-bold text-slate-400">PAILS</span>
            </div>
          </div>
          <div class="mt-6 grid grid-cols-2 gap-x-4 gap-y-2">
            <div v-for="(item, index) in painPointData" :key="index" class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></div>
              <span class="text-xs text-slate-600">{{ item.name }} ({{ item.value }}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { UserProfile } from '../types';

defineProps<{
  user: UserProfile;
}>();

const efficiencyData = [
  { name: 'Doc Processing', Manual: 10, PAILS: 0.5 },
  { name: 'Legal Research', Manual: 8, PAILS: 2 },
  { name: 'Drafting', Manual: 6, PAILS: 1.5 },
];

const painPointData = [
  { name: 'Doc Review', value: 30, color: '#0ea5e9' },
  { name: 'Research', value: 25, color: '#3b82f6' },
  { name: 'Drafting', value: 25, color: '#6366f1' },
  { name: 'Context Loss', value: 15, color: '#8b5cf6' },
  { name: 'QC', value: 5, color: '#a855f7' },
];

// Create conic-gradient for pie chart
const pieStyle = computed(() => {
  let currentAngle = 0;
  const gradientParts = painPointData.map(item => {
    const start = currentAngle;
    const end = currentAngle + (item.value / 100) * 360;
    currentAngle = end;
    return `${item.color} ${start}deg ${end}deg`;
  });
  return {
    background: `conic-gradient(${gradientParts.join(', ')})`
  };
});
</script>