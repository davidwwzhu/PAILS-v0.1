import { AgentType, Case, CaseStatus, Order, OrderStatus, Invoice, InvoiceStatus, SubscriptionTier } from './types';

export const AGENT_DESCRIPTIONS: Record<AgentType, string> = {
  [AgentType.DAU]: "Parses legal documents (PDF/Word), extracts entities, and digitizes structure.",
  [AgentType.EAU]: "Analyzes evidence depth, authenticity, and chain of custody.",
  [AgentType.DIU]: "Identifies core disputes and legal conflicts within the dataset.",
  [AgentType.LEU]: "Conducts legal research, finding relevant case law and statutes.",
  [AgentType.SGU]: "Generates litigation strategies (SWOT analysis, risk assessment).",
  [AgentType.DGU]: "Drafts legal documents (complaints, answers, motions).",
  [AgentType.RGU]: "Compiles comprehensive case reports.",
  [AgentType.AGU]: "Creates executive summaries and abstracts.",
  [AgentType.SPU]: "Manages deadlines and scheduling based on civil procedure rules.",
  [AgentType.IRU]: "Reviews outputs for errors, logic gaps, and quality assurance."
};

// PRD 8.4.1 Color Standards
export const PLAN_COLORS = {
  [SubscriptionTier.BASIC]: { bg: 'bg-[#1E88E5]', text: 'text-[#1E88E5]', border: 'border-[#1E88E5]' }, // Blue
  [SubscriptionTier.PROFESSIONAL]: { bg: 'bg-[#4CAF50]', text: 'text-[#4CAF50]', border: 'border-[#4CAF50]' }, // Green
  [SubscriptionTier.ENTERPRISE]: { bg: 'bg-[#FF9800]', text: 'text-[#FF9800]', border: 'border-[#FF9800]' }, // Orange
  [SubscriptionTier.CUSTOM]: { bg: 'bg-[#9C27B0]', text: 'text-[#9C27B0]', border: 'border-[#9C27B0]' } // Purple
};

export const PRICING_PLANS = [
  {
    id: SubscriptionTier.BASIC,
    name: 'Basic Plan',
    price: 999,
    period: '/ month',
    features: ['DAU Basic Parsing', '1 EAU Serial Analysis', '5 Document Types', 'Max 5 Cases/Mo'],
    limit: 5
  },
  {
    id: SubscriptionTier.PROFESSIONAL,
    name: 'Professional',
    price: 2999,
    period: '/ month',
    features: ['DAU Full Parsing + OCR', 'Double EAU Analysis', 'LEU Research + Case Law', 'Max 20 Cases/Mo'],
    recommended: true,
    limit: 20
  },
  {
    id: SubscriptionTier.ENTERPRISE,
    name: 'Enterprise',
    price: 8999,
    period: '/ month',
    features: ['All Agents Unlocked', 'Team Management', 'Priority Support', 'Unlimited Cases'],
    limit: -1
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    order_id: 'ORD20251114001',
    package_name: 'Professional Plan (Yearly)',
    amount: 2519160, // cents
    status: OrderStatus.PAID,
    create_time: '2024-11-14T10:00:00Z',
    pay_method: 'WeChat'
  },
  {
    order_id: 'ORD20251001055',
    package_name: 'Basic Plan (Monthly)',
    amount: 99900,
    status: OrderStatus.PAID,
    create_time: '2024-10-01T09:30:00Z',
    pay_method: 'Alipay'
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    invoice_id: 'INV-001',
    amount: 2519160,
    title: 'Legal Tech Services - Annual',
    status: InvoiceStatus.ISSUED,
    create_time: '2024-11-15T14:00:00Z'
  }
];

export const MOCK_CASES: Case[] = [
  {
    id: 'C-2024-001',
    userId: 'U20251114001',
    title: 'TechCorp v. Innovate LLC',
    clientName: 'TechCorp Inc.',
    status: CaseStatus.Active,
    lastUpdated: '2024-05-20T10:30:00Z',
    description: 'Intellectual property dispute regarding patent infringement in semiconductor design.',
    files: [],
    logs: []
  },
  {
    id: 'C-2024-002',
    userId: 'U20251114001',
    title: 'Estate of J. Smith',
    clientName: 'Sarah Smith',
    status: CaseStatus.Pending,
    lastUpdated: '2024-05-19T14:15:00Z',
    description: 'Probate matter involving contested will and asset distribution.',
    files: [],
    logs: []
  },
  {
    id: 'C-2024-003',
    userId: 'U20251114001',
    title: 'Global Trade v. Logistics Co',
    clientName: 'Global Trade Ltd.',
    status: CaseStatus.Active,
    lastUpdated: '2024-05-18T09:00:00Z',
    description: 'Breach of contract regarding international shipping delays and damages.',
    files: [],
    logs: []
  }
];