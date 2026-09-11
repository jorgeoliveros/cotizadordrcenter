export interface CurrencyConfig {
  symbol: string;
  code: string;
  decimals: number;
  placement: 'prefix' | 'suffix';
}

export interface CompanyInfo {
  name: string;
  specialty: string;
  taxId: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  email: string;
  website?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  taxId?: string;
  address?: string;
  preferences?: string;
  tags?: string[];
  createdAt: string;
  lastQuotedAt?: string;
  notes?: string;
}

export interface QuoteItem {
  id: string;
  quantity: number;
  title: string;
  subtitle?: string;
  unitPrice: number;
  total: number;
  isPriceManual?: boolean;
}

export interface QuoteNote {
  id: string;
  text: string;
}

export interface StampDetails {
  title: string;
  subtitle: string;
  extraText: string;
  code: string;
  color: string;
  shape: 'rect' | 'round' | 'capsule';
}

export interface SigneeInfo {
  name: string;
  role: string;
  company: string;
  whatsapp: string;
  signatureImage?: string; // base64 / data URL
  stampImage?: string; // base64 / data URL
  showSignature: boolean;
  showStamp: boolean;
  useGeneratedStamp: boolean;
  stampDetails: StampDetails;
}

export interface BrandSettings {
  logoUrl: string;
  logoWidth: number; // in pixels (e.g., 140 - 280)
  logoAlignment: 'left' | 'center' | 'right';
  fontHeading: 'Cinzel' | 'Cormorant Garamond' | 'Playfair Display' | 'Montserrat' | 'Outfit' | 'Plus Jakarta Sans';
  fontBody: 'Montserrat' | 'Plus Jakarta Sans' | 'Outfit';
  primaryColor: string;
  accentColor: string;
  headerTextColor: string;
  paperBg: 'white' | 'ivory' | 'warm-stone' | 'slate-tint';
  borderStyle: 'minimal' | 'modern' | 'classic' | 'none';
  backgroundTheme: 'minimalist' | 'modern' | 'professional';
}

export interface Quote {
  id: string;
  quoteNumber: string;
  showQuoteNumber?: boolean;
  title: string;
  date: string;
  validUntilDate?: string;
  showValidUntil?: boolean;
  company: CompanyInfo;
  client: {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    taxId?: string;
  };
  items: QuoteItem[];
  applyDiscount: boolean;
  discountPercentage: number;
  includeIva: boolean; // 13% Costa Rica IVA
  ivaRate: number; // 13
  notes: QuoteNote[];
  signee: SigneeInfo;
  currency: CurrencyConfig;
  brand: BrandSettings;
  status: 'draft' | 'sent' | 'approved' | 'invoiced';
  createdAt: string;
  updatedAt: string;
}
