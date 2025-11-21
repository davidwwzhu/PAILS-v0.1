
import React from 'react';
import { mockDb } from '../services/mockDb';
import { UserProfile } from '../types';

interface AuditLogViewerProps {
  user: UserProfile;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ user }) => {
  const logs = mockDb.getAuditLogs(user.id);

  return (
    <div className="p-8 h-screen overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Security Audit Logs</h2>
        <p className="text-slate-500">Immutable record of all sensitive actions for compliance.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500">Timestamp</th>
              <th className="px-6 py-4 font-medium text-slate-500">Action</th>
              <th className="px-6 py-4 font-medium text-slate-500">Resource ID</th>
              <th className="px-6 py-4 font-medium text-slate-500">IP Address</th>
              <th className="px-6 py-4 font-medium text-slate-500">Log ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.length > 0 ? logs.map(log => (
              <tr key={log.log_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-600 font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    log.action === 'VIEW_RAW' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-mono text-xs">{log.resource_id}</td>
                <td className="px-6 py-4 text-slate-500">{log.ip_address}</td>
                <td className="px-6 py-4 text-slate-400 text-xs">{log.log_id}</td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No audit records found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
