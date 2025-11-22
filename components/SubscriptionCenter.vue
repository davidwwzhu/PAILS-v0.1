<template>
  <div class="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
    <div class="flex justify-between items-end pb-4 border-b border-slate-200">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Subscription Center</h2>
        <p class="text-slate-500">Manage your plan, quotas, and billing cycle.</p>
      </div>
    </div>

    <!-- Current Status Card -->
    <div class="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
      <div class="flex-1 w-full">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-slate-500 uppercase tracking-wider">Current Plan</span>
          <span :class="['px-3 py-1 rounded-full text-xs font-bold bg-opacity-10', currentPlanColor.bg, currentPlanColor.text]">
            {{ user.subscriptionTier.toUpperCase() }}
          </span>
        </div>
        <h3 class="text-3xl font-bold text-slate-900 mb-1">{{ user.name }}</h3>
        <p class="text-slate-400 text-sm">Team ID: {{ user.teamId || 'Individual' }}</p>
      </div>

      <div class="h-16 w-px bg-slate-100 hidden md:block"></div>

      <div class="flex-1 w-full">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-slate-600">Monthly Case Quota</span>
          <span class="text-sm font-bold text-slate-900">
            {{ user.quota.casesUsed }} / {{ user.quota.casesLimit === -1 ? '∞' : user.quota.casesLimit }}
          </span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div 
            :class="['h-full rounded-full transition-all duration-500', currentPlanColor.bg]"
            :style="{ width: `${calculateUsagePercentage()}%` }"
          ></div>
        </div>
        <p class="text-xs text-slate-400 mt-2 text-right">Resets on 2025-12-01</p>
      </div>
    </div>

    <!-- Pricing Table -->
    <div>
      <h3 class="text-xl font-bold text-slate-900 mb-6">Available Plans</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="plan in PRICING_PLANS" 
          :key="plan.id"
          :class="['relative bg-white rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg flex flex-col',
            user.subscriptionTier === plan.id ? `${PLAN_COLORS[plan.id].border} shadow-md` : 'border-slate-100 hover:border-slate-300']"
        >
          <div v-if="plan.recommended && user.subscriptionTier !== plan.id" class="absolute -top-3 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
            HOT 🔥
          </div>
          <div v-if="user.subscriptionTier === plan.id" :class="['absolute -top-3 right-4 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm', PLAN_COLORS[plan.id].bg]">
            CURRENT PLAN
          </div>

          <h4 :class="['text-lg font-bold mb-2', PLAN_COLORS[plan.id].text]">{{ plan.name }}</h4>
          <div class="flex items-baseline gap-1 mb-6">
            <span class="text-3xl font-bold text-slate-900">¥{{ plan.price }}</span>
            <span class="text-sm text-slate-500">{{ plan.period }}</span>
          </div>

          <ul class="space-y-3 mb-8 flex-1">
            <li v-for="(feature, idx) in plan.features" :key="idx" class="flex items-center gap-3 text-sm text-slate-600">
              <span :class="['w-1.5 h-1.5 rounded-full', PLAN_COLORS[plan.id].bg]"></span>
              {{ feature }}
            </li>
          </ul>

          <button
            @click="$emit('upgrade', plan.id)"
            :disabled="user.subscriptionTier === plan.id"
            :class="['w-full py-3 rounded-lg font-bold text-sm transition-all',
              user.subscriptionTier === plan.id 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200']"
          >
            {{ user.subscriptionTier === plan.id ? 'Active Plan' : 'Upgrade Now' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { UserProfile, SubscriptionTier } from '../types';
import { PRICING_PLANS, PLAN_COLORS } from '../constants';

const props = defineProps<{
  user: UserProfile;
}>();

defineEmits(['upgrade']);

const currentPlanColor = computed(() => PLAN_COLORS[props.user.subscriptionTier]);

const calculateUsagePercentage = () => {
  if (props.user.quota.casesLimit === -1) return 5;
  return Math.min((props.user.quota.casesUsed / props.user.quota.casesLimit) * 100, 100);
};
</script>