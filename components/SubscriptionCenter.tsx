import React from 'react';
import { SubscriptionTier, UserProfile } from '../types';
import { PRICING_PLANS, PLAN_COLORS } from '../constants';

interface SubscriptionCenterProps {
  user: UserProfile;
  onUpgrade: (planId: SubscriptionTier) => void;
}

export const SubscriptionCenter: React.FC<SubscriptionCenterProps> = ({ user, onUpgrade }) => {
  
  const calculateUsagePercentage = () => {
    if (user.quota.casesLimit === -1) return 5; // Visual placeholder for unlimited
    return Math.min((user.quota.casesUsed / user.quota.casesLimit) * 100, 100);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex justify-between items-end pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Subscription Center</h2>
          <p className="text-slate-500">Manage your plan, quotas, and billing cycle.</p>
        </div>
      </div>

      {/* Current Status Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Current Plan</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-opacity-10 ${PLAN_COLORS[user.subscriptionTier].bg} ${PLAN_COLORS[user.subscriptionTier].text}`}>
                    {user.subscriptionTier.toUpperCase()}
                </span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{user.name}</h3>
            <p className="text-slate-400 text-sm">Team ID: {user.teamId || 'Individual'}</p>
        </div>

        <div className="h-16 w-px bg-slate-100 hidden md:block"></div>

        <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">Monthly Case Quota</span>
                <span className="text-sm font-bold text-slate-900">
                    {user.quota.casesUsed} / {user.quota.casesLimit === -1 ? '∞' : user.quota.casesLimit}
                </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${PLAN_COLORS[user.subscriptionTier].bg}`}
                    style={{ width: `${calculateUsagePercentage()}%` }}
                ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">Resets on 2025-12-01</p>
        </div>
      </div>

      {/* Pricing Table (PRD 8.4.1) */}
      <div>
          <h3 className="text-xl font-bold text-slate-900 mb-6">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan) => {
                const isCurrent = user.subscriptionTier === plan.id;
                const colorSet = PLAN_COLORS[plan.id as SubscriptionTier];
                
                return (
                    <div 
                        key={plan.id} 
                        className={`relative bg-white rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg flex flex-col
                            ${isCurrent ? `${colorSet.border} shadow-md` : 'border-slate-100 hover:border-slate-300'}
                        `}
                    >
                        {plan.recommended && !isCurrent && (
                            <div className="absolute -top-3 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                HOT 🔥
                            </div>
                        )}
                        {isCurrent && (
                            <div className={`absolute -top-3 right-4 ${colorSet.bg} text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm`}>
                                CURRENT PLAN
                            </div>
                        )}

                        <h4 className={`text-lg font-bold mb-2 ${colorSet.text}`}>{plan.name}</h4>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-3xl font-bold text-slate-900">¥{plan.price}</span>
                            <span className="text-sm text-slate-500">{plan.period}</span>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className={`w-1.5 h-1.5 rounded-full ${colorSet.bg}`}></span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => onUpgrade(plan.id as SubscriptionTier)}
                            disabled={isCurrent}
                            className={`w-full py-3 rounded-lg font-bold text-sm transition-all
                                ${isCurrent 
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
                                }
                            `}
                        >
                            {isCurrent ? 'Active Plan' : 'Upgrade Now'}
                        </button>
                    </div>
                );
            })}
          </div>
      </div>
    </div>
  );
};