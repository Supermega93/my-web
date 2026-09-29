/**
 * Centralized EFT / Bank Transfer Configuration for Mega AI Labs.
 *
 * Used across the customer checkout workflow and admin verification screens.
 * Contains official Standard Bank account details.
 *
 * NOTE: Branch code is NOT yet provided by Mega AI Labs.
 * It is configurable via VITE_EFT_BRANCH_CODE environment variable and must NEVER be guessed.
 */

export interface EftBankingConfig {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  accountType: string;
  branchCode: string;
  universalBranchCode: string;
  swiftBicCode: string;
  swiftBicNote: string;
  branchCodeStatus: 'not_provided' | 'configured';
  universalElectronicBranchNote: string;
  whatsAppNumber: string;
  whatsAppDisplay: string;
  supportEmail: string;
  referencePrefix: string;
}

const envBranchCode = 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_EFT_BRANCH_CODE) ||
  (typeof process !== 'undefined' && process.env?.VITE_EFT_BRANCH_CODE) ||
  (typeof process !== 'undefined' && process.env?.EFT_BRANCH_CODE) ||
  '';

export const EFT_BANKING_DETAILS: EftBankingConfig = {
  bankName: 'Standard Bank',
  accountHolder: 'Megonza Digital',
  accountNumber: '10 23 601 346 5',
  accountType: 'Cheque / Current Account',
  branchCode: envBranchCode.trim() || '051001',
  universalBranchCode: '051001',
  swiftBicCode: 'SBZAZAJJ',
  swiftBicNote: 'If you are receiving money from overseas, use SBZAZAJJ.',
  branchCodeStatus: 'configured',
  universalElectronicBranchNote: 'Universal Branch Code 051001 works for all electronic funds transfers (EFT) to Standard Bank South Africa.',
  whatsAppNumber: '27644611412',
  whatsAppDisplay: '+27 64 461 1412',
  supportEmail: 'supermegafx1@gmail.com',
  referencePrefix: 'EFT',
};

/**
 * Generates an official payment reference for the customer's EFT transfer.
 * Uses order ID suffix for easy cross-referencing in bank statements.
 */
export function generateEftReference(orderId: string): string {
  const cleanId = orderId.replace(/^ord_/, '').replace(/^eft_/, '').toUpperCase();
  const shortCode = cleanId.substring(0, 8);
  return `EFT-${shortCode}`;
}

/**
 * Builds the pre-filled WhatsApp message URL for sending proof of payment (POP).
 */
export function buildEftWhatsAppUrl(params: {
  orderId: string;
  reference: string;
  productName: string;
  amountZar: number | string;
  customerName?: string;
  customerEmail: string;
}): string {
  const { orderId, reference, productName, amountZar, customerName, customerEmail } = params;
  const formattedAmount = typeof amountZar === 'number' 
    ? amountZar.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : amountZar;

  const messageText = [
    `*MEGA AI LABS — PROOF OF PAYMENT*`,
    `Hello Support, I have made a manual EFT / Bank Transfer for my order.`,
    ``,
    `📋 *Order ID:* ${orderId}`,
    `🔖 *Payment Reference:* ${reference}`,
    `📦 *Product:* ${productName}`,
    `💰 *Amount Transferred:* R ${formattedAmount} ZAR`,
    `👤 *Customer Name:* ${customerName || 'Customer'}`,
    `📧 *Account Email:* ${customerEmail}`,
    ``,
    `📎 Attached is my bank Proof of Payment (POP) PDF/screenshot. Please verify and approve access to my account.`,
  ].join('\n');

  return `https://wa.me/${EFT_BANKING_DETAILS.whatsAppNumber}?text=${encodeURIComponent(messageText)}`;
}
