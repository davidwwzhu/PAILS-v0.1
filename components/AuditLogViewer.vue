<template>
  <div class="p-8 h-screen overflow-y-auto">
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-slate-900">Security Audit Logs</h2>
      <p class="text-slate-500">Immutable record of all sensitive actions for compliance.</p>
    </div>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-6 py-4 font-medium text-slate-500">Timestamp</th>
            <th class="px-6 py-4 font-medium text-slate-500">Action</th>
            <th class="px-6 py-4 font-medium text-slate-500">Resource ID</th>
            <th class="px-6 py-4 font-medium text-slate-500">IP Address</th>
            <th class="px-6 py-4 font-medium text-slate-500">Log ID</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <template v-if="logs.length > 0">
            <tr v-for="log in logs" :key="log.log_id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 text-slate-600 font-mono">{{ new Date(log.timestamp).toLocaleString() }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-1 rounded text-xs font-bold', log.action === 'VIEW_RAW' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700']">
                  {{ log.action }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-600 font-mono text-xs">{{ log.resource_id }}</td>
              <td class="px-6 py-4 text-slate-500">{{ log.ip_address }}</td>
              <td class="px-6 py-4 text-slate-400 text-xs">{{ log.log_id }}</td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="5" class="px-6 py-8 text-center text-slate-400">No audit records found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { mockDb } from '../services/mockDb';
import { UserProfile } from '../types';

const props = defineProps<{
  user: UserProfile;
}>();

const logs = computed(() => mockDb.getAuditLogs(props.user.id));
</script>