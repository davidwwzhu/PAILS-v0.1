
<template>
  <div class="flex h-screen bg-slate-50 font-sans text-slate-900">
    <Sidebar 
      :activeView="selectedCase ? 'cases' : activeView" 
      @update:activeView="handleViewChange" 
    />
    
    <main class="flex-1 flex flex-col overflow-hidden relative">
      <!-- Top Navigation Bar for Demo User Switching -->
      <div class="bg-white border-b border-slate-200 py-2 px-6 flex justify-between items-center text-xs">
        <span class="font-mono text-slate-400">PAILS S.A.A.S v2.0 (Commercial Build)</span>
        <div class="flex gap-2">
          <span class="text-slate-500 self-center mr-2">Simulate Role:</span>
          <button 
            @click="switchRole(UserRole.USER, SubscriptionTier.BASIC)"
            :class="['px-2 py-1 rounded', user.role === UserRole.USER && user.subscriptionTier === SubscriptionTier.BASIC ? 'bg-pails-100 text-pails-700 font-bold' : 'text-slate-500 hover:bg-slate-100']"
          >
            Basic User
          </button>
          <button 
            @click="switchRole(UserRole.ADMIN, SubscriptionTier.PROFESSIONAL)"
            :class="['px-2 py-1 rounded', user.role === UserRole.ADMIN && user.subscriptionTier === SubscriptionTier.PROFESSIONAL ? 'bg-green-100 text-green-700 font-bold' : 'text-slate-500 hover:bg-slate-100']"
          >
            Pro Admin
          </button>
          <button 
            @click="switchRole(UserRole.SUPER_ADMIN, SubscriptionTier.ENTERPRISE)"
            :class="['px-2 py-1 rounded', user.role === UserRole.SUPER_ADMIN && user.subscriptionTier === SubscriptionTier.ENTERPRISE ? 'bg-orange-100 text-orange-700 font-bold' : 'text-slate-500 hover:bg-slate-100']"
          >
            Enterprise
          </button>
        </div>
      </div>

      <!-- Privacy/Security Banner -->
      <div class="bg-slate-900 text-slate-300 text-[10px] py-1 px-4 text-center tracking-wide flex justify-between">
        <span>PAILS SECURITY MODE: ACTIVE</span>
        <span>ENCRYPTION: AES-256 • AUDIT LOGGING: ENABLED</span>
      </div>
      
      <!-- Main Content Area -->
      <div class="flex-1 overflow-hidden relative">
        <CaseDetail 
          v-if="selectedCase"
          :caseData="selectedCase" 
          :currentUserId="user.id"
          @back="setSelectedCase(null)" 
        />

        <div v-else-if="activeView === 'dashboard'" class="p-8 h-full overflow-y-auto">
          <Dashboard :user="user" />
        </div>

        <div v-else-if="activeView === 'subscription'" class="p-8 h-full overflow-y-auto">
          <SubscriptionCenter 
            :user="user" 
            @upgrade="handleUpgrade" 
          />
        </div>

        <BillingManagement v-else-if="activeView === 'billing'" />
        
        <AuditLogViewer v-else-if="activeView === 'audit'" :user="user" />

        <div v-else-if="activeView === 'cases'" class="p-8 h-full overflow-y-auto">
          <div class="flex justify-between items-end mb-6">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">Case Management</h2>
              <p class="text-slate-500">Active litigation and analysis</p>
            </div>
            <button 
              @click="openCreateModal"
              :disabled="user.quota.casesLimit !== -1 && user.quota.casesUsed >= user.quota.casesLimit"
              class="bg-pails-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pails-700 transition-colors shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {{ user.quota.casesLimit !== -1 && user.quota.casesUsed >= user.quota.casesLimit ? 'Quota Exceeded' : '+ New Case' }}
            </button>
          </div>

          <!-- Filters -->
          <div class="flex items-center gap-4 mb-6 bg-white p-2 pl-4 pr-2 rounded-lg border border-slate-200 shadow-sm w-fit">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
              <span>⚡</span> Filters:
            </div>
            
            <!-- Status Filter -->
            <div class="relative">
              <select v-model="statusFilter" class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium py-1.5 pl-3 pr-8 rounded-md focus:outline-none focus:border-pails-500 focus:ring-1 focus:ring-pails-500 cursor-pointer">
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Closed">Closed</option>
                <option value="Archived">Archived</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg class="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <!-- Priority Filter -->
            <div class="relative">
              <select v-model="priorityFilter" class="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium py-1.5 pl-3 pr-8 rounded-md focus:outline-none focus:border-pails-500 focus:ring-1 focus:ring-pails-500 cursor-pointer">
                <option value="All">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg class="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            
            <!-- Clear Filters -->
            <button 
              v-if="statusFilter !== 'All' || priorityFilter !== 'All'" 
              @click="statusFilter = 'All'; priorityFilter = 'All'" 
              class="text-xs text-red-500 hover:text-red-700 font-medium ml-2 flex items-center gap-1"
            >
              ✕ Clear
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div 
              v-for="c in filteredCases" 
              :key="c.id" 
              @click="setSelectedCase(c)"
              class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-pails-300 transition-all cursor-pointer group"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-serif text-xl group-hover:bg-pails-50 group-hover:text-pails-600 transition-colors">
                  §
                </div>
                <div class="flex flex-col items-end gap-1">
                  <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border', getPriorityBadgeClass(c.priority)]">
                    {{ c.priority }}
                  </span>
                  <span :class="['px-2 py-0.5 rounded text-xs font-medium', c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600']">
                    {{ c.status }}
                  </span>
                </div>
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-1">{{ c.title }}</h3>
              <p class="text-sm text-slate-500 mb-4 line-clamp-2">{{ c.description || "No description provided." }}</p>
              
              <div class="flex items-center justify-between pt-4 border-t border-slate-100">
                <span class="text-xs text-slate-400">{{ c.clientName }}</span>
                <span class="text-xs font-medium text-pails-600 group-hover:translate-x-1 transition-transform">Open Case →</span>
              </div>
            </div>
            <div v-if="filteredCases.length === 0" class="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
              No cases match your filters.
            </div>
          </div>

          <!-- Create Case Modal -->
          <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm" @click.self="showCreateModal = false">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all scale-100">
              <h3 class="text-lg font-bold text-slate-900 mb-4">Create New Case</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">Case Title</label>
                  <input 
                    v-model="newCaseForm.title" 
                    type="text" 
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-pails-500 focus:ring-1 focus:ring-pails-500" 
                    placeholder="e.g. Smith v. Jones" 
                    @keyup.enter="submitCreateCase"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Priority</label>
                  <div class="flex gap-3">
                    <button 
                      v-for="p in priorities" 
                      :key="p"
                      @click="newCaseForm.priority = p"
                      :class="['flex-1 py-2 rounded-lg text-xs font-medium border transition-all', newCaseForm.priority === p ? getPrioritySelectClass(p) : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50']"
                    >
                      {{ p }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex justify-end gap-3 mt-8">
                <button @click="showCreateModal = false" class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
                <button @click="submitCreateCase" class="px-4 py-2 text-sm font-medium text-white bg-pails-600 rounded-lg hover:bg-pails-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!newCaseForm.title">Create Case</button>
              </div>
            </div>
          </div>

        </div>

        <div v-else class="p-8 h-full flex items-center justify-center text-slate-400">
          Module under development
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Dashboard from './components/Dashboard.vue';
import CaseDetail from './components/CaseDetail.vue';
import SubscriptionCenter from './components/SubscriptionCenter.vue';
import BillingManagement from './components/BillingManagement.vue';
import AuditLogViewer from './components/AuditLogViewer.vue';
import { Case, UserRole, SubscriptionTier, UserProfile, Priority } from './types';
import { mockDb } from './services/mockDb';

const activeView = ref('dashboard');
const selectedCase = ref<Case | null>(null);
const user = ref<UserProfile>(mockDb.getCurrentUser());
const casesList = ref<Case[]>(mockDb.getCases(user.value.id));

// Filter States
const statusFilter = ref('All');
const priorityFilter = ref('All');

const filteredCases = computed(() => {
  return casesList.value.filter(c => {
    const statusMatch = statusFilter.value === 'All' || c.status === statusFilter.value;
    const priorityMatch = priorityFilter.value === 'All' || c.priority === priorityFilter.value;
    return statusMatch && priorityMatch;
  });
});

const UserRoleEnum = UserRole;
const SubscriptionTierEnum = SubscriptionTier;

// Create Case Logic
const showCreateModal = ref(false);
const newCaseForm = reactive<{ title: string, priority: Priority }>({ title: '', priority: 'Medium' });
const priorities: Priority[] = ['High', 'Medium', 'Low'];

let pollInterval: number;

onMounted(() => {
  pollInterval = setInterval(() => {
    user.value = mockDb.getCurrentUser();
    // Ensure list is up to date with DB
    casesList.value = mockDb.getCases(user.value.id);
  }, 2000);
});

onUnmounted(() => {
  clearInterval(pollInterval);
});

const switchRole = (role: UserRole, tier: SubscriptionTier) => {
  mockDb.updateUserSubscription(tier);
  user.value = mockDb.getCurrentUser();
};

const openCreateModal = () => {
  if (user.value.quota.casesLimit !== -1 && user.value.quota.casesUsed >= user.value.quota.casesLimit) {
    alert("Quota Exceeded");
    return;
  }
  newCaseForm.title = '';
  newCaseForm.priority = 'Medium';
  showCreateModal.value = true;
};

const submitCreateCase = () => {
  if (!newCaseForm.title.trim()) return;
  const newCase = mockDb.createCase(user.value.id, newCaseForm.title, newCaseForm.priority);
  showCreateModal.value = false;
  setSelectedCase(newCase);
  // Update list immediately
  casesList.value = mockDb.getCases(user.value.id);
};

const setSelectedCase = (c: Case | null) => {
  selectedCase.value = c;
};

const handleViewChange = (view: string) => {
  activeView.value = view;
  selectedCase.value = null;
};

const handleUpgrade = (planId: SubscriptionTier) => {
  switchRole(user.value.role, planId);
};

const getPriorityBadgeClass = (p: Priority) => {
  switch(p) {
    case 'High': return 'bg-red-50 text-red-600 border-red-100';
    case 'Medium': return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'Low': return 'bg-blue-50 text-blue-600 border-blue-100';
    default: return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

const getPrioritySelectClass = (p: Priority) => {
   switch(p) {
    case 'High': return 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-200';
    case 'Medium': return 'bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-200';
    case 'Low': return 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200';
    default: return '';
  }
}
</script>
