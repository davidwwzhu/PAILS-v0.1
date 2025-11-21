
import { Case, CaseFile, AuditLog, UserProfile, SubscriptionTier, DocStatus, CaseStatus, UserRole } from '../types';
import { PrivacyProtector } from './privacyService';

// Initial Data
const INITIAL_USER: UserProfile = {
  id: 'U20251114001',
  name: 'Zhang Lawyer',
  role: UserRole.ADMIN,
  subscriptionTier: SubscriptionTier.PROFESSIONAL,
  quota: {
    casesUsed: 2,
    casesLimit: 20,
    tokensUsed: 150000,
    tokensLimit: 500000
  }
};

class MockDatabase {
  private cases: Case[] = [];
  private auditLogs: AuditLog[] = [];
  private currentUser: UserProfile = INITIAL_USER;

  constructor() {
    // Seed initial data
    this.cases = [
      {
        id: 'C-2024-001',
        userId: 'U20251114001',
        title: 'TechCorp v. Innovate LLC',
        clientName: 'TechCorp Inc.',
        status: CaseStatus.Active,
        lastUpdated: '2024-11-14T10:30:00Z',
        description: 'Intellectual property dispute regarding patent infringement.',
        files: [],
        logs: []
      }
    ];
  }

  // --- User & Auth ---
  getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  updateUserSubscription(tier: SubscriptionTier) {
    this.currentUser = {
        ...this.currentUser,
        subscriptionTier: tier,
        quota: {
            ...this.currentUser.quota,
            casesLimit: tier === SubscriptionTier.BASIC ? 5 : tier === SubscriptionTier.PROFESSIONAL ? 20 : -1
        }
    };
  }

  // --- Cases (Data Isolation) ---
  getCases(userId: string): Case[] {
    // strict isolation: only return cases belonging to userId
    return this.cases.filter(c => c.userId === userId);
  }

  getCase(userId: string, caseId: string): Case | undefined {
    return this.cases.find(c => c.id === caseId && c.userId === userId);
  }

  createCase(userId: string, title: string): Case {
    const newCase: Case = {
      id: `C-${Date.now()}`,
      userId,
      title,
      clientName: 'New Client',
      status: CaseStatus.Active,
      lastUpdated: new Date().toISOString(),
      description: '',
      files: [],
      logs: []
    };
    this.cases.push(newCase);
    this.logAudit(userId, 'CREATE_CASE', newCase.id);
    return newCase;
  }

  updateCase(userId: string, caseId: string, updates: Partial<Case>): Case | null {
     const idx = this.cases.findIndex(c => c.id === caseId && c.userId === userId);
     if (idx === -1) return null;
     
     this.cases[idx] = { ...this.cases[idx], ...updates };
     return this.cases[idx];
  }

  // --- Documents (Async & Security) ---
  async uploadFile(userId: string, caseId: string, file: File, base64Data: string): Promise<CaseFile> {
    // 1. Create file record
    const fileId = `DOC-${Date.now()}`;
    const securePath = PrivacyProtector.generateSecurePath(userId, caseId, fileId);

    const newFile: CaseFile = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      base64Data: base64Data,
      status: DocStatus.UPLOADING,
      storagePath: securePath,
      isRedacted: false
    };

    // 2. Update DB
    const caseIdx = this.cases.findIndex(c => c.id === caseId && c.userId === userId);
    if (caseIdx !== -1) {
        this.cases[caseIdx].files.push(newFile);
        this.logAudit(userId, 'UPLOAD_FILE', fileId);
    }

    // 3. Simulate Async Backend Processing (OCR -> Parsing -> Masking)
    this.simulateAsyncProcessing(userId, caseId, fileId, base64Data);

    return newFile;
  }

  private simulateAsyncProcessing(userId: string, caseId: string, fileId: string, content: string) {
    setTimeout(() => {
        const caseIdx = this.cases.findIndex(c => c.id === caseId);
        if (caseIdx === -1) return;

        const fileIdx = this.cases[caseIdx].files.findIndex(f => f.id === fileId);
        if (fileIdx === -1) return;

        // Update to PROCESSING
        this.cases[caseIdx].files[fileIdx].status = DocStatus.PROCESSING;
        
        // Simulate Processing Time (2s)
        setTimeout(() => {
            const rawContent = "Extracted content: Name: Zhang San (13800138000), ID: 110101199001011234.";
            const maskedContent = PrivacyProtector.maskPii(rawContent);

            this.cases[caseIdx].files[fileIdx].status = DocStatus.COMPLETED;
            this.cases[caseIdx].files[fileIdx].parsedContentRaw = rawContent;
            this.cases[caseIdx].files[fileIdx].parsedContentMasked = maskedContent;
            this.cases[caseIdx].files[fileIdx].summary = "Document successfully parsed and PII masked.";
            
            console.log(`[Backend] File ${fileId} processed.`);
        }, 2000);

    }, 1000);
  }

  // --- Audit Logs ---
  logAudit(userId: string, action: string, resourceId: string) {
    this.auditLogs.unshift({
        log_id: `LOG-${Date.now()}`,
        user_id: userId,
        action,
        resource_id: resourceId,
        ip_address: '127.0.0.1', // Simulated
        timestamp: new Date().toISOString()
    });
  }

  getAuditLogs(userId: string): AuditLog[] {
    // In a real app, admins might see all, regular users see their own
    return this.auditLogs.filter(log => log.user_id === userId);
  }
}

export const mockDb = new MockDatabase();
