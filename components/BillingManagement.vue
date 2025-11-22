<template>
  <div class="max-w-6xl mx-auto p-8 h-screen overflow-y-auto">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold text-slate-900">Billing & Invoices</h2>
      <div class="flex gap-2 bg-white p-1 rounded-lg border border-slate-200">
        <button 
          @click="activeTab = 'orders'"
          :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-all', activeTab === 'orders' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50']"
        >
          Order History
        </button>
        <button 
          @click="activeTab = 'invoices'"
          :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-all', activeTab === 'invoices' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50']"
        >
          Invoices
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'orders'" class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-6 py-4 font-medium text-slate-500">Order ID</th>
            <th class="px-6 py-4 font-medium text-slate-500">Package</th>
            <th class="px-6 py-4 font-medium text-slate-500">Date</th>
            <th class="px-6 py-4 font-medium text-slate-500">Amount</th>
            <th class="px-6 py-4 font-medium text-slate-500">Status</th>
            <th class="px-6 py-4 font-medium text-slate-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="order in MOCK_ORDERS" :key="order.order_id" class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 font-mono text-slate-600">{{ order.order_id }}</td>
            <td class="px-6 py-4 font-medium text-slate-900">{{ order.package_name }}</td>
            <td class="px-6 py-4 text-slate-500">{{ new Date(order.create_time).toLocaleDateString() }}</td>
            <td class="px-6 py-4 text-slate-900 font-mono">¥{{ (order.amount / 100).toFixed(2) }}</td>
            <td class="px-6 py-4">
              <span :class="getOrderStatusClass(order.status)">
                {{ getOrderStatusLabel(order.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button class="text-pails-600 hover:text-pails-700 font-medium text-xs">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'invoices'" class="space-y-4">
      <div class="flex justify-end">
        <button class="bg-pails-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-pails-700">
          + Apply for Invoice
        </button>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-medium text-slate-500">Invoice ID</th>
              <th class="px-6 py-4 font-medium text-slate-500">Subject</th>
              <th class="px-6 py-4 font-medium text-slate-500">Date</th>
              <th class="px-6 py-4 font-medium text-slate-500">Amount</th>
              <th class="px-6 py-4 font-medium text-slate-500">Status</th>
              <th class="px-6 py-4 font-medium text-slate-500 text-right">Download</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="inv in MOCK_INVOICES" :key="inv.invoice_id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 font-mono text-slate-600">{{ inv.invoice_id }}</td>
              <td class="px-6 py-4 font-medium text-slate-900">{{ inv.title }}</td>
              <td class="px-6 py-4 text-slate-500">{{ new Date(inv.create_time).toLocaleDateString() }}</td>
              <td class="px-6 py-4 text-slate-900 font-mono">¥{{ (inv.amount / 100).toFixed(2) }}</td>
              <td class="px-6 py-4">
                <span :class="getInvoiceStatusClass(inv.status)">
                  {{ getInvoiceStatusLabel(inv.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-slate-400 hover:text-pails-600 transition-colors">
                  ⬇ PDF
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MOCK_ORDERS, MOCK_INVOICES } from '../constants';
import { OrderStatus, InvoiceStatus } from '../types';

const activeTab = ref('orders');

const getOrderStatusClass = (status: OrderStatus) => {
  switch(status) {
    case OrderStatus.PAID: return 'px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold';
    case OrderStatus.PENDING: return 'px-2 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-bold';
    default: return 'px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold';
  }
};

const getOrderStatusLabel = (status: OrderStatus) => {
  switch(status) {
    case OrderStatus.PAID: return 'PAID';
    case OrderStatus.PENDING: return 'PENDING';
    default: return 'CANCELLED';
  }
};

const getInvoiceStatusClass = (status: InvoiceStatus) => {
  switch(status) {
    case InvoiceStatus.ISSUED: return 'px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold';
    default: return 'px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold';
  }
};

const getInvoiceStatusLabel = (status: InvoiceStatus) => {
  switch(status) {
    case InvoiceStatus.ISSUED: return 'ISSUED';
    default: return 'PROCESSING';
  }
};
</script>