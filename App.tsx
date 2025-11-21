
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CaseDetail } from './components/CaseDetail';
import { SubscriptionCenter } from './components/SubscriptionCenter';
import { BillingManagement } from './components/BillingManagement';
import { AuditLogViewer } from './components/AuditLogViewer';
import { Case, UserRole, SubscriptionTier, UserProfile } from './types';
import { mockDb } from './services/mockDb';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [user, setUser] = useState<UserProfile>(mockDb.getCurrentUser());
  
  // Polling to sync user data (quota updates etc.) from Mock DB
  useEffect(() => {
      const interval = setInterval(() => {
          setUser(mockDb.getCurrentUser());
      }, 2000);
      return () => clearInterval(interval);
  }, []);

  // Simulate Role/Plan Switching
  const switchRole = (role: UserRole, tier: SubscriptionTier) => {
    mockDb.updateUserSubscription(tier);
    setUser(mockDb.getCurrentUser());
  };

  const handleCreateCase = () => {
      if (user.quota.casesLimit !== -1 && user.quota.casesUsed >= user.quota.casesLimit) {
          alert("Quota Exceeded");
          return;
      }
      const newCase = mockDb.createCase(user.id, "New Litigation Case");
      setSelectedCase(newCase);
  };

  const renderContent = () => {
    if (selectedCase) {
      return (
        <div className="h-screen flex flex-col">
          <CaseDetail 
            caseData={selectedCase} 
            currentUserId={user.id}
            onBack={() => setSelectedCase(null)} 
          />
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return (
            <div className="p-8 h-screen overflow-y-auto">
                <Dashboard user={user} />
            </div>
        );
      case 'subscription':
        return (
            <div className="p-8 h-screen overflow-y-auto">
                <SubscriptionCenter 
                    user={user} 
                    onUpgrade={(planId) => switchRole(user.role, planId)} 
                />
            </div>
        );
      case 'billing':
        return <BillingManagement />;
      case 'audit':
        return <AuditLogViewer user={user} />;
      case 'cases':
        return (
          <div className="p-8 h-screen overflow-y-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Case Management</h2>
                    <p className="text-slate-500">Active litigation and analysis</p>
                </div>
                <button 
                    onClick={handleCreateCase}
                    disabled={user.quota.casesLimit !== -1 && user.quota.casesUsed >= user.quota.casesLimit}
                    className="bg-pails-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pails-700 transition-colors shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    {user.quota.casesLimit !== -1 && user.quota.casesUsed >= user.quota.casesLimit ? 'Quota Exceeded' : '+ New Case'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockDb.getCases(user.id).map(c => (
                <div 
                    key={c.id} 
                    onClick={() => setSelectedCase(c)}
                    className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-pails-300 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-serif text-xl group-hover:bg-pails-50 group-hover:text-pails-600 transition-colors">
                        §
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {c.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{c.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{c.description || "No description provided."}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">{c.clientName}</span>
                    <span className="text-xs font-medium text-pails-600 group-hover:translate-x-1 transition-transform">Open Case →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
            <div className="p-8 h-screen flex items-center justify-center text-slate-400">
                Module under development
            </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar activeView={selectedCase ? 'cases' : activeView} setActiveView={(view) => {
        setActiveView(view);
        setSelectedCase(null);
      }} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navigation Bar for Demo User Switching */}
        <div className="bg-white border-b border-slate-200 py-2 px-6 flex justify-between items-center text-xs">
            <span className="font-mono text-slate-400">PAILS S.A.A.S v2.0 (Commercial Build)</span>
            <div className="flex gap-2">
                <span className="text-slate-500 self-center mr-2">Simulate Role:</span>
                <button 
                    onClick={() => switchRole(UserRole.USER, SubscriptionTier.BASIC)}
                    className={`px-2 py-1 rounded ${user.role === UserRole.USER && user.subscriptionTier === SubscriptionTier.BASIC ? 'bg-pails-100 text-pails-700 font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    Basic User
                </button>
                <button 
                    onClick={() => switchRole(UserRole.ADMIN, SubscriptionTier.PROFESSIONAL)}
                    className={`px-2 py-1 rounded ${user.role === UserRole.ADMIN && user.subscriptionTier === SubscriptionTier.PROFESSIONAL ? 'bg-green-100 text-green-700 font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    Pro Admin
                </button>
                <button 
                    onClick={() => switchRole(UserRole.SUPER_ADMIN, SubscriptionTier.ENTERPRISE)}
                    className={`px-2 py-1 rounded ${user.role === UserRole.SUPER_ADMIN && user.subscriptionTier === SubscriptionTier.ENTERPRISE ? 'bg-orange-100 text-orange-700 font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    Enterprise
                </button>
            </div>
        </div>

        {/* Privacy/Security Banner */}
        <div className="bg-slate-900 text-slate-300 text-[10px] py-1 px-4 text-center tracking-wide flex justify-between">
          <span>PAILS SECURITY MODE: ACTIVE</span>
          <span>ENCRYPTION: AES-256 • AUDIT LOGGING: ENABLED</span>
        </div>
        
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
