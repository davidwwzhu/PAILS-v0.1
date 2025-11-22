<template>
  <div class="flex flex-col h-full overflow-hidden bg-slate-50">
    <!-- Header -->
    <div class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
      <div>
        <div class="flex items-center gap-3">
          <button @click="$emit('back')" class="text-slate-400 hover:text-slate-600 mr-2">←</button>
          <h2 class="text-xl font-bold text-pails-900">{{ caseData.title }}</h2>
          <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', caseData.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600']">
            {{ caseData.status }}
          </span>
        </div>
        <p class="text-slate-500 text-xs mt-1 ml-6">{{ caseData.clientName }} • Ref: {{ caseData.id }}</p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="runWorkflow"
          class="flex items-center gap-2 px-5 py-2 bg-pails-600 text-white rounded-lg hover:bg-pails-700 transition-all shadow-sm text-sm font-medium"
        >
          ▶ Start Analysis
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white border-b border-slate-200 px-6 flex gap-8 shrink-0">
      <button
        v-for="tab in ['overview', 'documents', 'workflow', 'results']"
        :key="tab"
        @click="activeTab = tab"
        :class="['py-3 text-sm font-medium border-b-2 transition-colors', activeTab === tab ? 'border-pails-600 text-pails-600' : 'border-transparent text-slate-500 hover:text-slate-800']"
      >
        {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-6">
      <div class="max-w-7xl mx-auto">
        
        <!-- OVERVIEW -->
        <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 class="font-bold text-slate-900 mb-3">Case Brief</h3>
              <p class="text-slate-600 text-sm leading-relaxed">{{ caseData.description }}</p>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div class="flex justify-between items-center mb-6">
                <h3 class="font-bold text-slate-900">Recent Activity</h3>
              </div>
              <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                <div v-for="(log, idx) in caseData.logs" :key="idx" class="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div :class="['shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border', 
                    log.agentType === 'IRU' ? 'bg-purple-100 text-purple-700 border-purple-200' : 
                    log.agentType === 'SGU' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    'bg-white text-slate-600 border-slate-200']">
                    {{ log.agentType }}
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between">
                      <span class="text-xs font-bold text-slate-700">{{ log.agentType }} Activity</span>
                      <span class="text-[10px] text-slate-400">{{ new Date(log.timestamp).toLocaleTimeString() }}</span>
                    </div>
                    <p class="text-sm text-slate-600 mt-1">{{ log.message }}</p>
                  </div>
                </div>
                <p v-if="caseData.logs.length === 0" class="text-slate-400 text-sm italic">No logs available.</p>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <AgentVisualizer :statuses="agentStatuses" />
          </div>
        </div>

        <!-- DOCUMENTS -->
        <div v-if="activeTab === 'documents'" class="space-y-6">
          <div class="flex justify-between items-center bg-pails-50 p-4 rounded-lg border border-pails-100">
            <div>
              <h3 class="font-bold text-pails-900">Secure Document Vault</h3>
              <p class="text-xs text-pails-600">Physical Isolation: {{ caseData.userId.substring(0,8) }}/{{ caseData.id }}/</p>
            </div>
            <div class="flex gap-2">
              <div class="flex items-center gap-2 mr-4 bg-white px-3 py-1 rounded border border-slate-200">
                <span class="text-xs text-slate-500">View Mode:</span>
                <button 
                  @click="togglePrivacyView"
                  :class="['text-xs font-bold', !showRawData ? 'text-green-600' : 'text-slate-400']"
                >
                  Masked (Safe)
                </button>
                <span class="text-slate-300">|</span>
                <button 
                  @click="togglePrivacyView"
                  :class="['text-xs font-bold', showRawData ? 'text-red-600' : 'text-slate-400']"
                >
                  Raw (Audit)
                </button>
              </div>
              <button 
                @click="triggerFileUpload"
                class="px-4 py-2 bg-white border border-pails-200 text-pails-700 text-sm font-medium rounded-lg hover:bg-white hover:border-pails-400 hover:shadow-sm transition-all flex items-center gap-2"
              >
                <span>📄</span> Upload Document
              </button>
            </div>
            <input 
              type="file" 
              ref="fileInputRef" 
              class="hidden" 
              @change="handleFileUpload"
              accept=".pdf,.doc,.docx,.txt,.jpg,.png" 
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="file in caseData.files" :key="file.id" class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 group hover:border-pails-300 transition-all">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                    <span v-if="file.status === DocStatus.PROCESSING || file.status === DocStatus.UPLOADING" class="animate-spin">⏳</span>
                    <span v-else>{{ file.type.includes('pdf') ? '📕' : '📄' }}</span>
                  </div>
                  <div class="overflow-hidden">
                    <h4 class="font-medium text-slate-900 text-sm truncate w-48" :title="file.name">{{ file.name }}</h4>
                    <p class="text-xs text-slate-500 flex items-center gap-2">
                      {{ (file.size / 1024).toFixed(0) }} KB • {{ new Date(file.uploadedAt).toLocaleDateString() }}
                    </p>
                  </div>
                </div>
                <span :class="['text-[10px] px-2 py-0.5 rounded border', 
                  file.status === DocStatus.COMPLETED ? 'bg-green-50 text-green-700 border-green-200' :
                  file.status === DocStatus.FAILED ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-blue-50 text-blue-700 border-blue-200']">
                  {{ getDocStatusLabel(file.status) }}
                </span>
              </div>
              
              <!-- Async Result Display -->
              <div v-if="file.status === DocStatus.COMPLETED" class="bg-slate-50 p-3 rounded text-xs text-slate-600 mt-2 border border-slate-100 max-h-32 overflow-y-auto font-mono">
                <strong class="block text-slate-700 mb-1">DAU Extraction ({{ showRawData ? 'RAW' : 'MASKED' }}):</strong>
                {{ showRawData ? (file.parsedContentRaw || "No raw content available") : (file.parsedContentMasked || "No masked content available") }}
              </div>
              <div v-if="file.status === DocStatus.PROCESSING" class="mt-2 text-xs text-blue-600 animate-pulse">
                Processing document (OCR & PII Scan)...
              </div>
            </div>
          </div>
          <div v-if="caseData.files.length === 0" class="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
            <p class="text-slate-400">Drop files here or use the upload button.</p>
          </div>
        </div>

        <!-- WORKFLOW -->
        <div v-if="activeTab === 'workflow'" class="flex flex-col gap-8">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-slate-900">Agent Workflow Execution</h3>
              <p class="text-sm text-slate-500">Current Step: <span class="text-pails-600 font-medium">{{ currentWorkflowStep || "Ready to start" }}</span></p>
            </div>
            <div class="h-2 w-64 bg-slate-100 rounded-full overflow-hidden">
              <div :class="['h-full bg-pails-500 transition-all duration-500', currentWorkflowStep.includes('Complete') ? 'w-full' : currentWorkflowStep ? 'w-1/2 animate-pulse' : 'w-0']"></div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AgentVisualizer :statuses="agentStatuses" />
            
            <div class="space-y-4">
              <h4 class="font-bold text-slate-700">Live Agent Outputs</h4>
              <div v-for="log in caseData.logs.filter(l => l.resultData).slice(0, 3)" :key="log.id" class="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                <div class="flex justify-between mb-2">
                  <span class="font-bold text-xs text-pails-700 uppercase">{{ log.agentType }} Output</span>
                  <span class="text-[10px] text-slate-400">{{ new Date(log.timestamp).toLocaleTimeString() }}</span>
                </div>
                <div class="text-sm text-slate-600 whitespace-pre-wrap max-h-40 overflow-y-auto font-mono text-xs bg-slate-50 p-2 rounded">
                  {{ showRawData ? log.resultData : PrivacyProtector.maskPii(log.resultData) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RESULTS -->
        <div v-if="activeTab === 'results'" class="space-y-8">
          <section>
            <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span class="w-6 h-6 rounded bg-pails-100 text-pails-600 flex items-center justify-center text-sm">S</span>
              Strategic Analysis
            </h3>
            <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200 prose prose-sm max-w-none">
              <div v-if="getAgentResult('SGU')" class="whitespace-pre-wrap">
                {{ showRawData ? getAgentResult('SGU') : PrivacyProtector.maskPii(getAgentResult('SGU')) }}
              </div>
              <p v-else class="text-slate-400 italic">Pending Strategy Generation...</p>
            </div>
          </section>

          <section>
            <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span class="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center text-sm">D</span>
              Drafted Documents
            </h3>
            <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200 prose prose-sm max-w-none">
              <div v-if="getAgentResult('DGU')" class="whitespace-pre-wrap">
                {{ showRawData ? getAgentResult('DGU') : PrivacyProtector.maskPii(getAgentResult('DGU')) }}
              </div>
              <p v-else class="text-slate-400 italic">Pending Document Generation...</p>
            </div>
          </section>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, defineEmits } from 'vue';
import { Case, AgentStatus, AgentType, DocStatus } from '../types';
import AgentVisualizer from './AgentVisualizer.vue';
import { callAgent } from '../services/geminiService';
import { mockDb } from '../services/mockDb';
import { PrivacyProtector } from '../services/privacyService';

const props = defineProps<{
  caseData: Case;
  currentUserId: string;
}>();

defineEmits(['back']);

const activeTab = ref('overview');
const caseData = ref<Case>(props.caseData);
const agentStatuses = ref<Record<AgentType, AgentStatus>>({
  [AgentType.DAU]: AgentStatus.Idle,
  [AgentType.EAU]: AgentStatus.Idle,
  [AgentType.DIU]: AgentStatus.Idle,
  [AgentType.LEU]: AgentStatus.Idle,
  [AgentType.SGU]: AgentStatus.Idle,
  [AgentType.DGU]: AgentStatus.Idle,
  [AgentType.RGU]: AgentStatus.Idle,
  [AgentType.AGU]: AgentStatus.Idle,
  [AgentType.SPU]: AgentStatus.Idle,
  [AgentType.IRU]: AgentStatus.Idle,
});

const showRawData = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const currentWorkflowStep = ref("");
let pollInterval: number;

onMounted(() => {
  pollInterval = setInterval(() => {
    const updatedCase = mockDb.getCase(props.currentUserId, caseData.value.id);
    if (updatedCase) {
      caseData.value = updatedCase;
    }
  }, 2000);
});

onUnmounted(() => {
  clearInterval(pollInterval);
});

const triggerFileUpload = () => {
  fileInputRef.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  currentWorkflowStep.value = `Uploading ${file.name}...`;
  
  const reader = new FileReader();
  reader.onload = async (e) => {
    const result = e.target?.result as string;
    const base64Data = result.split(',')[1];
    
    // 1. Upload to Mock Backend
    await mockDb.uploadFile(props.currentUserId, caseData.value.id, file, base64Data);

    const updatedCase = mockDb.getCase(props.currentUserId, caseData.value.id);
    if (updatedCase) caseData.value = updatedCase;

    currentWorkflowStep.value = "File queued for background analysis...";
  };
  
  reader.readAsDataURL(file);
};

const runWorkflow = async () => {
  const readyFiles = caseData.value.files.filter(f => f.status === DocStatus.COMPLETED);
  if (readyFiles.length === 0) {
    alert("Please wait for documents to finish processing (COMPLETED status) before running the workflow.");
    return;
  }

  activeTab.value = 'workflow';
  
  const runAgent = async (agent: AgentType, dependencyOutput: string = "") => {
    agentStatuses.value[agent] = AgentStatus.Thinking;
    currentWorkflowStep.value = `Running ${agent}...`;
    
    const result = await callAgent(agent, readyFiles, caseData.value.description, dependencyOutput);
    
    const newLog = {
      id: Date.now().toString(),
      agentType: agent,
      message: `${agent} completed task.`,
      timestamp: new Date().toISOString(),
      resultData: result
    };
    
    const updated = mockDb.updateCase(props.currentUserId, caseData.value.id, {
      logs: [newLog, ...caseData.value.logs]
    });
    if (updated) caseData.value = updated;
    
    agentStatuses.value[agent] = AgentStatus.Completed;
    return result;
  };

  try {
    const eauRes = await runAgent(AgentType.EAU);
    const diuRes = await runAgent(AgentType.DIU, eauRes);
    const leuRes = await runAgent(AgentType.LEU, diuRes);
    
    const sguRes = await runAgent(AgentType.SGU, `${diuRes}\n${leuRes}`);
    
    await Promise.all([
      runAgent(AgentType.DGU, sguRes),
      runAgent(AgentType.SPU, "Analyze deadlines from DAU output"),
      runAgent(AgentType.AGU, sguRes)
    ]);

    await runAgent(AgentType.IRU, "Review all previous outputs");
    
    currentWorkflowStep.value = "Workflow Complete";

  } catch (e) {
    console.error(e);
    currentWorkflowStep.value = "Workflow Error";
  }
};

const togglePrivacyView = () => {
  if (!showRawData.value) {
    mockDb.logAudit(props.currentUserId, 'VIEW_RAW', caseData.value.id);
  }
  showRawData.value = !showRawData.value;
};

const getDocStatusLabel = (status: DocStatus) => {
  switch (status) {
    case DocStatus.UPLOADING: return 'UPLOADING';
    case DocStatus.PROCESSING: return 'PROCESSING';
    case DocStatus.COMPLETED: return 'COMPLETED';
    case DocStatus.FAILED: return 'FAILED';
    default: return '';
  }
}

const getAgentResult = (type: string) => {
  return caseData.value.logs.find(l => l.agentType === type)?.resultData;
}
</script>