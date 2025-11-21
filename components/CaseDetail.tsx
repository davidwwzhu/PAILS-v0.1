
import React, { useState, useRef, useEffect } from 'react';
import { Case, AgentStatus, AgentType, CaseFile, DocStatus } from '../types';
import { AgentVisualizer } from './AgentVisualizer';
import { callAgent } from '../services/geminiService';
import { mockDb } from '../services/mockDb';
import { PrivacyProtector } from '../services/privacyService';

interface CaseDetailProps {
  caseData: Case;
  currentUserId: string;
  onBack: () => void;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({ caseData: initialCaseData, currentUserId, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'workflow' | 'results'>('overview');
  const [caseData, setCaseData] = useState<Case>(initialCaseData);
  const [agentStatuses, setAgentStatuses] = useState<Record<AgentType, AgentStatus>>({
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
  
  const [showRawData, setShowRawData] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState<string>("");

  // Polling for File Status Updates (Simulating Backend)
  useEffect(() => {
    const interval = setInterval(() => {
        const updatedCase = mockDb.getCase(currentUserId, caseData.id);
        if (updatedCase) {
            setCaseData(updatedCase);
        }
    }, 2000);
    return () => clearInterval(interval);
  }, [caseData.id, currentUserId]);


  // --- File Handling ---

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCurrentWorkflowStep(`Uploading ${file.name}...`);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      const base64Data = result.split(',')[1];
      
      // 1. Upload to Mock Backend (Simulates secure storage + Async Task Trigger)
      await mockDb.uploadFile(currentUserId, caseData.id, file, base64Data);

      // Update local state immediately to show "Uploading" status
      const updatedCase = mockDb.getCase(currentUserId, caseData.id);
      if (updatedCase) setCaseData(updatedCase);

      setCurrentWorkflowStep("File queued for background analysis...");
    };
    
    reader.readAsDataURL(file);
  };

  // --- Workflow Orchestration ---

  const runWorkflow = async () => {
    const readyFiles = caseData.files.filter(f => f.status === DocStatus.COMPLETED);
    if (readyFiles.length === 0) {
        alert("Please wait for documents to finish processing (COMPLETED status) before running the workflow.");
        return;
    }

    setActiveTab('workflow');
    
    const runAgent = async (agent: AgentType, dependencyOutput: string = "") => {
        setAgentStatuses(prev => ({ ...prev, [agent]: AgentStatus.Thinking }));
        setCurrentWorkflowStep(`Running ${agent}...`);
        
        const result = await callAgent(agent, readyFiles, caseData.description, dependencyOutput);
        
        // Update Logs in DB via Mock
        const newLog = {
            id: Date.now().toString(),
            agentType: agent,
            message: `${agent} completed task.`,
            timestamp: new Date().toISOString(),
            resultData: result
        };
        
        const updated = mockDb.updateCase(currentUserId, caseData.id, {
            logs: [newLog, ...caseData.logs]
        });
        if (updated) setCaseData(updated);
        
        setAgentStatuses(prev => ({ ...prev, [agent]: AgentStatus.Completed }));
        return result;
    };

    try {
        // Phase 1: Analysis
        const eauRes = await runAgent(AgentType.EAU);
        const diuRes = await runAgent(AgentType.DIU, eauRes);
        const leuRes = await runAgent(AgentType.LEU, diuRes);
        
        // Phase 2: Strategy
        const sguRes = await runAgent(AgentType.SGU, `${diuRes}\n${leuRes}`);
        
        // Phase 3: Output & Support
        await Promise.all([
            runAgent(AgentType.DGU, sguRes),
            runAgent(AgentType.SPU, "Analyze deadlines from DAU output"),
            runAgent(AgentType.AGU, sguRes)
        ]);

        // Phase 4: Review
        await runAgent(AgentType.IRU, "Review all previous outputs");
        
        setCurrentWorkflowStep("Workflow Complete");

    } catch (e) {
        console.error(e);
        setCurrentWorkflowStep("Workflow Error");
    }
  };

  const togglePrivacyView = () => {
      if (!showRawData) {
          // Audit the "View Raw" action
          mockDb.logAudit(currentUserId, 'VIEW_RAW', caseData.id);
      }
      setShowRawData(!showRawData);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-10">
        <div>
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="text-slate-400 hover:text-slate-600 mr-2">←</button>
                <h2 className="text-xl font-bold text-pails-900">{caseData.title}</h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${caseData.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {caseData.status}
                </span>
            </div>
            <p className="text-slate-500 text-xs mt-1 ml-6">{caseData.clientName} • Ref: {caseData.id}</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={runWorkflow}
                className="flex items-center gap-2 px-5 py-2 bg-pails-600 text-white rounded-lg hover:bg-pails-700 transition-all shadow-sm text-sm font-medium"
             >
                ▶ Start Analysis
             </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex gap-8 shrink-0">
        {['overview', 'documents', 'workflow', 'results'].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab 
                    ? 'border-pails-600 text-pails-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
            
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-900 mb-3">Case Brief</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{caseData.description}</p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-900">Recent Activity</h3>
                            </div>
                             <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {caseData.logs.map((log, idx) => (
                                    <div key={idx} className="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                                            log.agentType === AgentType.IRU ? 'bg-purple-100 text-purple-700 border-purple-200' : 
                                            log.agentType === AgentType.SGU ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                            'bg-white text-slate-600 border-slate-200'
                                        }`}>
                                            {log.agentType}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <span className="text-xs font-bold text-slate-700">{log.agentType} Activity</span>
                                                <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-1">{log.message}</p>
                                        </div>
                                    </div>
                                ))}
                                {caseData.logs.length === 0 && <p className="text-slate-400 text-sm italic">No logs available.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <AgentVisualizer statuses={agentStatuses} />
                    </div>
                </div>
            )}

            {/* DOCUMENTS */}
            {activeTab === 'documents' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-pails-50 p-4 rounded-lg border border-pails-100">
                        <div>
                            <h3 className="font-bold text-pails-900">Secure Document Vault</h3>
                            <p className="text-xs text-pails-600">Physical Isolation: {caseData.userId.substring(0,8)}/{caseData.id}/</p>
                        </div>
                        <div className="flex gap-2">
                             <div className="flex items-center gap-2 mr-4 bg-white px-3 py-1 rounded border border-slate-200">
                                <span className="text-xs text-slate-500">View Mode:</span>
                                <button 
                                    onClick={togglePrivacyView}
                                    className={`text-xs font-bold ${!showRawData ? 'text-green-600' : 'text-slate-400'}`}
                                >
                                    Masked (Safe)
                                </button>
                                <span className="text-slate-300">|</span>
                                <button 
                                    onClick={togglePrivacyView}
                                    className={`text-xs font-bold ${showRawData ? 'text-red-600' : 'text-slate-400'}`}
                                >
                                    Raw (Audit)
                                </button>
                             </div>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-white border border-pails-200 text-pails-700 text-sm font-medium rounded-lg hover:bg-white hover:border-pails-400 hover:shadow-sm transition-all flex items-center gap-2"
                            >
                                <span>📄</span> Upload Document
                            </button>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.txt,.jpg,.png" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {caseData.files.map(file => (
                            <div key={file.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 group hover:border-pails-300 transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                                            {file.status === DocStatus.PROCESSING || file.status === DocStatus.UPLOADING ? (
                                                <span className="animate-spin">⏳</span>
                                            ) : (
                                                file.type.includes('pdf') ? '📕' : '📄'
                                            )}
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className="font-medium text-slate-900 text-sm truncate w-48" title={file.name}>{file.name}</h4>
                                            <p className="text-xs text-slate-500 flex items-center gap-2">
                                                {(file.size / 1024).toFixed(0)} KB • {new Date(file.uploadedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                        file.status === DocStatus.COMPLETED ? 'bg-green-50 text-green-700 border-green-200' :
                                        file.status === DocStatus.FAILED ? 'bg-red-50 text-red-700 border-red-200' :
                                        'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                        {DocStatus[file.status]}
                                    </span>
                                </div>
                                
                                {/* Async Result Display */}
                                {file.status === DocStatus.COMPLETED && (
                                    <div className="bg-slate-50 p-3 rounded text-xs text-slate-600 mt-2 border border-slate-100 max-h-32 overflow-y-auto font-mono">
                                        <strong className="block text-slate-700 mb-1">DAU Extraction ({showRawData ? 'RAW' : 'MASKED'}):</strong>
                                        {showRawData 
                                            ? (file.parsedContentRaw || "No raw content available") 
                                            : (file.parsedContentMasked || "No masked content available")
                                        }
                                    </div>
                                )}
                                {file.status === DocStatus.PROCESSING && (
                                    <div className="mt-2 text-xs text-blue-600 animate-pulse">
                                        Processing document (OCR & PII Scan)...
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {caseData.files.length === 0 && (
                         <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl">
                            <p className="text-slate-400">Drop files here or use the upload button.</p>
                         </div>
                    )}
                </div>
            )}

            {/* WORKFLOW */}
            {activeTab === 'workflow' && (
                <div className="flex flex-col gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-slate-900">Agent Workflow Execution</h3>
                            <p className="text-sm text-slate-500">Current Step: <span className="text-pails-600 font-medium">{currentWorkflowStep || "Ready to start"}</span></p>
                        </div>
                        <div className="h-2 w-64 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full bg-pails-500 transition-all duration-500 ${
                                 currentWorkflowStep.includes("Complete") ? "w-full" : 
                                 currentWorkflowStep ? "w-1/2 animate-pulse" : "w-0"
                             }`}></div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         <AgentVisualizer statuses={agentStatuses} />
                         
                         <div className="space-y-4">
                            <h4 className="font-bold text-slate-700">Live Agent Outputs</h4>
                            {caseData.logs.filter(l => l.resultData).slice(0, 3).map(log => (
                                <div key={log.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-xs text-pails-700 uppercase">{log.agentType} Output</span>
                                        <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="text-sm text-slate-600 whitespace-pre-wrap max-h-40 overflow-y-auto font-mono text-xs bg-slate-50 p-2 rounded">
                                        {showRawData ? log.resultData : PrivacyProtector.maskPii(log.resultData)}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            )}

            {/* RESULTS */}
            {activeTab === 'results' && (
                <div className="space-y-8">
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-pails-100 text-pails-600 flex items-center justify-center text-sm">S</span>
                            Strategic Analysis
                        </h3>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 prose prose-sm max-w-none">
                            {caseData.logs.find(l => l.agentType === AgentType.SGU)?.resultData ? (
                                <div className="whitespace-pre-wrap">
                                    {showRawData 
                                        ? caseData.logs.find(l => l.agentType === AgentType.SGU)?.resultData 
                                        : PrivacyProtector.maskPii(caseData.logs.find(l => l.agentType === AgentType.SGU)?.resultData)
                                    }
                                </div>
                            ) : <p className="text-slate-400 italic">Pending Strategy Generation...</p>}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center text-sm">D</span>
                            Drafted Documents
                        </h3>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 prose prose-sm max-w-none">
                            {caseData.logs.find(l => l.agentType === AgentType.DGU)?.resultData ? (
                                <div className="whitespace-pre-wrap">
                                     {showRawData 
                                        ? caseData.logs.find(l => l.agentType === AgentType.DGU)?.resultData 
                                        : PrivacyProtector.maskPii(caseData.logs.find(l => l.agentType === AgentType.DGU)?.resultData)
                                    }
                                </div>
                            ) : <p className="text-slate-400 italic">Pending Document Generation...</p>}
                        </div>
                    </section>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
