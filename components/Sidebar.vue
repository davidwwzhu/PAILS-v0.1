<template>
  <div class="w-64 bg-pails-900 text-white h-screen flex flex-col shadow-xl z-10">
    <div class="p-6 border-b border-pails-800 flex items-center gap-3">
      <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-pails-900 font-bold text-xl">P</div>
      <div>
        <h1 class="font-bold text-lg tracking-tight">PAILS</h1>
        <p class="text-xs text-pails-100 opacity-70">Litigation Service</p>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto py-6 px-3 space-y-6">
      <div>
        <p class="px-4 text-[10px] uppercase font-bold text-pails-400 tracking-wider mb-2">Operations</p>
        <nav class="space-y-1">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="$emit('update:activeView', item.id)"
            :class="['w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200', activeView === item.id ? 'bg-white/10 text-white shadow-sm' : 'text-pails-100 hover:bg-white/5 hover:text-white']"
          >
            <span class="text-lg">{{ item.icon }}</span>
            {{ item.label }}
          </button>
        </nav>
      </div>

      <div>
        <p class="px-4 text-[10px] uppercase font-bold text-pails-400 tracking-wider mb-2">Commercial</p>
        <nav class="space-y-1">
          <button
            v-for="item in financialItems"
            :key="item.id"
            @click="$emit('update:activeView', item.id)"
            :class="['w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200', activeView === item.id ? 'bg-white/10 text-white shadow-sm' : 'text-pails-100 hover:bg-white/5 hover:text-white']"
          >
            <span class="text-lg">{{ item.icon }}</span>
            {{ item.label }}
          </button>
        </nav>
      </div>
    </div>

    <div class="p-4 border-t border-pails-800">
      <div class="bg-pails-800/50 rounded-lg p-3">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span class="text-xs font-medium text-pails-100">System Operational</span>
        </div>
        <p class="text-[10px] text-pails-300">Secure Connection (TLS 1.3)</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  activeView: string;
}>();

defineEmits(['update:activeView']);

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'cases', label: 'Case Management', icon: '📁' },
  { id: 'documents', label: 'Document Vault', icon: '📄' },
];

const financialItems = [
  { id: 'subscription', label: 'Subscription', icon: '💎' },
  { id: 'billing', label: 'Financials', icon: '💳' },
  { id: 'audit', label: 'Audit Logs', icon: '🛡️' },
];
</script>