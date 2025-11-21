
import { CaseFile } from '../types';

// Regular expressions defined in the PRD for PII detection
const PATTERNS = {
  PHONE: /(1[3-9]\d)\d{4}(\d{4})/g, // Matches Chinese mobile numbers
  ID_CARD: /(\d{6})\d{8}(\w{4})/g,  // Matches Chinese ID cards
  EMAIL: /([A-Za-z0-9._%+-]+)@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/g
};

export class PrivacyProtector {
  /**
   * Masks Personally Identifiable Information (PII) in the text.
   * Used before displaying data to the frontend or sending to logs.
   */
  static maskPii(text: string): string {
    if (!text) return "";

    // Mask Phone Numbers: 138****1234
    let masked = text.replace(PATTERNS.PHONE, '$1****$2');

    // Mask ID Cards: 110101********123X
    masked = masked.replace(PATTERNS.ID_CARD, '$1********$2');

    // Mask Emails: ***@domain.com
    masked = masked.replace(PATTERNS.EMAIL, '***@$2');

    return masked;
  }

  /**
   * Simulates generating a secure, hashed storage path for physical isolation.
   * secure_storage/{user_hash}/{case_id}/{file_uuid}.dat
   */
  static generateSecurePath(userId: string, caseId: string, fileId: string): string {
    // Simple hash simulation
    const userHash = btoa(userId).substring(0, 8);
    return `secure_storage/${userHash}/${caseId}/${fileId}.dat`;
  }
}
