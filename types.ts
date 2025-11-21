
import React from 'react';

export enum CaseStatus {
  Active = 'Active',
  Pending = 'Pending',
  Closed = 'Closed',
  Archived = 'Archived'
}

export enum AgentStatus {
  Idle = 'Idle',
  Queued = 'Queued',
  Thinking = 'Thinking',
  Working = 'Working',
  Completed = 'Completed',
  Error = 'Error'
}

export enum AgentType {
  DAU = 'DAU', // Document Analysis Unit
  EAU = 'EAU', // Evidence Analysis Unit
  DIU = 'DIU', // Dispute Identify Unit
  LEU = 'LEU', // Law Explore Unit
  SGU = 'SGU', // Strategy Generation Unit
  DGU = 'DGU', // Document Generation Unit
  RGU = 'RGU', // Report Generation Unit
  AGU = 'AGU', // Abstract Generation Unit
  SPU = 'SPU', // Schedule Planning Unit
  IRU = 'IRU'  // Intelligent Review Unit
}

// --- Commercial / SaaS Types ---

export enum UserRole {
  USER = 'User',           // Individual Lawyer
  ADMIN = 'Admin',         // Team Admin
  SUPER_ADMIN = 'SuperAdmin', // System Admin
  OP_ADMIN = 'OpAdmin'     // Operations Admin
}

export enum SubscriptionTier {
  BASIC = 'Basic',
  PROFESSIONAL = 'Professional',
  ENTERPRISE = 'Enterprise',
  CUSTOM = 'Custom'
}

export enum OrderStatus {
  PENDING = 1,
  PAID = 2,
  CANCELLED = 3,
  REFUNDED = 4
}

export enum InvoiceStatus {
  PENDING_REVIEW = 1,
  ISSUED = 2,
  MAILED = 3,
  REJECTED = 4
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  teamId?: string;
  avatarUrl?: string;
  quota: {
    casesUsed: number;
    casesLimit: number; // -1 for unlimited
    tokensUsed: number;
    tokensLimit: number;
  }
}

export interface Order {
  order_id: string;
  package_name: string;
  amount: number; // in cents
  status: OrderStatus;
  create_time: string;
  pay_method: 'WeChat' | 'Alipay' | 'BankTransfer';
}

export interface Invoice {
  invoice_id: string;
  amount: number;
  title: string;
  status: InvoiceStatus;
  create_time: string;
  pdf_url?: string;
}

// --- Audit & Security Types ---

export enum DocStatus {
  UPLOADING = 1,
  PROCESSING = 2,
  COMPLETED = 3,
  FAILED = 4
}

export interface AuditLog {
  log_id: string;
  user_id: string;
  action: string; // UPLOAD, VIEW_RAW, EXPORT
  resource_id: string;
  ip_address: string;
  timestamp: string;
}

// --- Case Types ---

export interface CaseFile {
  id: string;
  name: string;
  type: string; // MIME type
  size: number;
  uploadedAt: string;
  content?: string; // Text content if extracted
  base64Data?: string; // Base64 string for API
  status: DocStatus; // Async processing status
  
  // Privacy & Storage
  storagePath: string; // Simulated secure path
  isRedacted?: boolean;
  
  // Analysis Results
  summary?: string;
  piiReport?: string;
  parsedContentMasked?: string;
  parsedContentRaw?: string;
}

export interface AgentLog {
  id: string;
  agentType: AgentType;
  message: string;
  timestamp: string;
  resultData?: any;
}

export interface Case {
  id: string;
  userId: string; // Owner ID for isolation
  title: string;
  clientName: string;
  status: CaseStatus;
  lastUpdated: string;
  description: string;
  files: CaseFile[];
  logs: AgentLog[];
  strategy?: string;
  workflowStatus?: {
    currentStage: number;
    completedAgents: AgentType[];
  }
}

export interface NavItem {
    id: string;
    label: string;
    icon: string;
}
