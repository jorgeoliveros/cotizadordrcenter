import { Client, Quote } from '../types';

// Crisp default logo representing the medical emblem of Dr. Franklin Escobar Zarate
export const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160" width="320" height="160">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="50%" stop-color="#b89358"/>
      <stop offset="100%" stop-color="#d4af6e"/>
    </linearGradient>
    <linearGradient id="wingGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="60%" stop-color="#8c6d3b"/>
      <stop offset="100%" stop-color="#c59b4e"/>
    </linearGradient>
  </defs>
  <!-- Medical Crest / Monogram -->
  <g transform="translate(160, 48) scale(0.8)">
    <circle cx="0" cy="0" r="34" fill="none" stroke="#b89358" stroke-width="1.8" stroke-dasharray="4,2" opacity="0.75"/>
    <circle cx="0" cy="0" r="29" fill="none" stroke="#1e293b" stroke-width="1.4"/>
    <path d="M0,-20 L0,22" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="0" cy="-21" r="3.5" fill="#b89358"/>
    <path d="M-12,-10 C-14,-2 -2,4 0,8 C2,12 12,18 0,22" fill="none" stroke="#8c6d3b" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12,-10 C14,-2 2,4 0,8" fill="none" stroke="#b89358" stroke-width="1.8" stroke-linecap="round"/>
  </g>
  <!-- Brand Text -->
  <text x="160" y="116" text-anchor="middle" font-family="'Cormorant Garamond', 'Cinzel', serif" font-size="22" letter-spacing="3" fill="#1e293b" font-weight="600">DR. FRANKLIN ESCOBAR</text>
  <text x="160" y="136" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="9" letter-spacing="5" fill="#8c6d3b" font-weight="600">GINECOLOGÍA Y OBSTETRICIA</text>
</svg>
`)}`;

// Default realistic signature curve
export const DEFAULT_SIGNATURE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 100" width="240" height="100">
  <path d="M 30,70 Q 45,15 50,65 T 60,35 Q 75,90 90,50 T 110,60 Q 130,20 145,55 T 180,48 Q 200,45 220,55" 
        fill="none" stroke="#1c2b36" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M 40,55 Q 70,50 100,52" 
        fill="none" stroke="#1c2b36" stroke-width="2" stroke-linecap="round" />
</svg>
`)}`;

// Default stamp image SVG
export const DEFAULT_STAMP_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 140" width="280" height="140">
  <!-- Tilted medical stamp frame -->
  <rect x="6" y="6" width="268" height="128" rx="14" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="6,2" opacity="0.85" />
  <rect x="11" y="11" width="258" height="118" rx="10" fill="none" stroke="#334155" stroke-width="1.2" opacity="0.65" />
  
  <text x="140" y="42" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-size="16" font-weight="600" fill="#1e293b" letter-spacing="1">Dr. Franklin Escobar Zarate</text>
  <text x="140" y="66" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="12" font-weight="500" fill="#334155" letter-spacing="1.5">Ginecólogo y Obstetra</text>
  <text x="140" y="88" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="11" font-weight="400" fill="#475569" letter-spacing="1">Oficentro Valar, Piso 3</text>
  <text x="140" y="112" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="15" font-weight="700" fill="#0f172a" letter-spacing="2">CÓD. 3-102-913099</text>
</svg>
`)}`;

export const INITIAL_FREQUENT_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Ericka Sanchez Segura',
    email: 'Sanchez.ericka33@gmail.com',
    phone: '+(506) 8834-1920',
    taxId: '1-1452-0891',
    address: 'San Rafael, Escazú, San José',
    preferences: 'Tratamientos faciales los viernes por la tarde. Piel mixta con tendencia a sensibilidad.',
    tags: ['Estética', 'PRP', 'Frecuente VIP'],
    createdAt: '2025-11-10',
    lastQuotedAt: '2026-02-18',
    notes: 'Aprobó paquete de 6 sesiones en febrero 2026 con 20% descuento.'
  },
  {
    id: 'cli-2',
    name: 'Carlos Mendez Quesada',
    email: 'cmendez.costarica@gmail.com',
    phone: '+(506) 7012-3490',
    taxId: '1-0892-0311',
    address: 'Barrio Escalante, San José',
    preferences: 'Requiere factura electrónica con IVA desglosado. Atención solo fines de semana.',
    tags: ['Dermatología Clínica', 'Factura Requerida'],
    createdAt: '2025-08-14',
    lastQuotedAt: '2026-01-22',
    notes: 'Tratamiento de acné y manchas solares.'
  },
  {
    id: 'cli-3',
    name: 'Maria Elena Brenes Solano',
    email: 'mariatbrenes@hotmail.com',
    phone: '+(506) 8345-6712',
    taxId: '3-0211-0544',
    address: 'Mercedes Norte, Heredia',
    preferences: 'Recordatorio 2 días antes por WhatsApp. Prefiere pago por transferencia/Sinpe.',
    tags: ['Rejuvenecimiento', 'Láser'],
    createdAt: '2025-06-02',
    lastQuotedAt: '2026-02-05',
    notes: 'Interesada en toxina botulínica e hidratación profunda.'
  }
];

export const INITIAL_QUOTE: Quote = {
  id: 'cot-2026-001',
  quoteNumber: 'COT-2026-001',
  showQuoteNumber: true,
  title: 'COTIZACIÓN',
  date: '18 Feb, 2026',
  validUntilDate: '18 Mar, 2026',
  showValidUntil: true,
  company: {
    name: 'Dr. Franklin Escobar Zarate',
    specialty: 'Ginecólogo y Obstetra',
    taxId: 'Cedula 3-102-913099',
    addressLine1: 'Oficentro Valar, Piso 3',
    addressLine2: 'Frente al Hospital San Vicente de Paul',
    phone: '+(506) 8796-2540',
    email: 'info@drcentercr.com',
    website: 'www.drcentercr.com'
  },
  client: {
    id: 'cli-1',
    name: 'Ericka Sanchez Segura',
    email: 'Sanchez.ericka33@gmail.com',
    phone: '+(506) 8834-1920',
    taxId: '1-1452-0891'
  },
  items: [
    {
      id: 'item-1',
      quantity: 1,
      title: 'Consulta Médica Ginecológica + Ultrasonido Especializado',
      subtitle: 'Evaluación integral y reporte médico',
      unitPrice: 85000,
      total: 85000,
      isPriceManual: false
    }
  ],
  applyDiscount: false,
  discountPercentage: 0,
  includeIva: false,
  ivaRate: 13,
  notes: [
    {
      id: 'note-1',
      text: 'Cotización médica emitida por Dr. Franklin Escobar Zarate, Ginecólogo y Obstetra.'
    },
    {
      id: 'note-2',
      text: 'Esta cotización es válida por un período de 1 mes.'
    }
  ],
  signee: {
    name: 'Dr. Franklin Escobar Zarate',
    role: 'Ginecólogo y Obstetra',
    company: 'Dr. Center',
    whatsapp: '+(506) 8796-2540',
    signatureImage: DEFAULT_SIGNATURE_SVG,
    stampImage: undefined,
    defaultStampImage: undefined,
    customStampImage: undefined,
    stampType: 'generated',
    showSignature: true,
    showStamp: true,
    useGeneratedStamp: true,
    stampDetails: {
      title: 'Dr. Franklin Escobar Zarate',
      subtitle: 'Ginecólogo y Obstetra',
      extraText: 'Oficentro Valar, Piso 3',
      code: '3-102-913099',
      color: '#1e293b',
      shape: 'rect'
    },
    layoutMode: 'split',
    stampPosition: 'beside-right',
    signatureOffsetX: 0,
    signatureOffsetY: 0,
    stampOffsetX: 0,
    stampOffsetY: 0,
    stampRotation: 1,
    stampScale: 1,
  },
  currency: {
    symbol: '¢',
    code: 'CRC',
    decimals: 0,
    placement: 'prefix'
  },
  brand: {
    logoUrl: '/logo-drcenter.png',
    logoWidth: 200,
    logoAlignment: 'right',
    fontHeading: 'Cormorant Garamond',
    fontBody: 'Montserrat',
    primaryColor: '#1c1917',
    accentColor: '#92400e',
    headerTextColor: '#0c0a09',
    paperBg: 'white',
    borderStyle: 'minimal',
    backgroundTheme: 'minimalist',
  },
  status: 'draft',
  createdAt: '2026-02-18',
  updatedAt: '2026-02-18'
};
