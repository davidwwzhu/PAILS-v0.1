import React, { useState } from 'react';
import { MOCK_ORDERS, MOCK_INVOICES } from '../constants';
import { OrderStatus, InvoiceStatus } from '../types';

export const BillingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'invoices'>('orders');

  const getStatusBadge = (status: OrderStatus | InvoiceStatus, type: 'order' | 'invoice') => {
    if (type === 'order') {
        switch(status) {
            case OrderStatus.PAID: return <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold">PAID</span>;
            case OrderStatus.PENDING: return <span className="px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-bold">PENDING</span>;
            default: return <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">CANCELLED</span>;
        }
    } else {
        switch(status) {
            case InvoiceStatus.ISSUED: return <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">ISSUED</span>;
            default: return <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">PROCESSING</span>;
        }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Billing & Invoices</h2>
            <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200">
                <button 
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    Order History
                </button>
                <button 
                    onClick={() => setActiveTab('invoices')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'invoices' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    Invoices
                </button>
            </div>
        </div>

        {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-medium text-slate-500">Order ID</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Package</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Date</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Amount</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Status</th>
                            <th className="px-6 py-4 font-medium text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_ORDERS.map(order => (
                            <tr key={order.order_id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-slate-600">{order.order_id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{order.package_name}</td>
                                <td className="px-6 py-4 text-slate-500">{new Date(order.create_time).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-slate-900 font-mono">¥{(order.amount / 100).toFixed(2)}</td>
                                <td className="px-6 py-4">{getStatusBadge(order.status, 'order')}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-pails-600 hover:text-pails-700 font-medium text-xs">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {activeTab === 'invoices' && (
            <div className="space-y-4">
                <div className="flex justify-end">
                    <button className="bg-pails-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-pails-700">
                        + Apply for Invoice
                    </button>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-medium text-slate-500">Invoice ID</th>
                                <th className="px-6 py-4 font-medium text-slate-500">Subject</th>
                                <th className="px-6 py-4 font-medium text-slate-500">Date</th>
                                <th className="px-6 py-4 font-medium text-slate-500">Amount</th>
                                <th className="px-6 py-4 font-medium text-slate-500">Status</th>
                                <th className="px-6 py-4 font-medium text-slate-500 text-right">Download</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_INVOICES.map(inv => (
                                <tr key={inv.invoice_id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-600">{inv.invoice_id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{inv.title}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(inv.create_time).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-slate-900 font-mono">¥{(inv.amount / 100).toFixed(2)}</td>
                                    <td className="px-6 py-4">{getStatusBadge(inv.status, 'invoice')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-pails-600 transition-colors">
                                            ⬇ PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
  );
};