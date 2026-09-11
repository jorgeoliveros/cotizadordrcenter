import { Client, Quote } from '../types';

// Crisp default logo representing the Vitapiel dermatology butterfly logo
export const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160" width="320" height="160">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4a4238"/>
      <stop offset="50%" stop-color="#b89358"/>
      <stop offset="100%" stop-color="#d4af6e"/>
    </linearGradient>
    <linearGradient id="wingGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2d2926"/>
      <stop offset="60%" stop-color="#8c6d3b"/>
      <stop offset="100%" stop-color="#c59b4e"/>
    </linearGradient>
  </defs>
  <!-- Stylized Butterfly Icon -->
  <g transform="translate(160, 48) scale(0.7)">
    <!-- Left Wing Upper -->
    <path d="M-8,-5 C-28,-42 -65,-36 -70,-8 C-74,18 -45,32 -10,12 Z" fill="url(#goldGrad)" opacity="0.95"/>
    <!-- Left Wing Lower -->
    <path d="M-6,14 C-35,32 -48,60 -24,68 C-6,74 -2,42 -4,18 Z" fill="url(#wingGrad2)" opacity="0.85"/>
    <!-- Right Wing Upper -->
    <path d="M8,-5 C28,-42 65,-36 70,-8 C74,18 45,32 10,12 Z" fill="url(#goldGrad)" opacity="0.95"/>
    <!-- Right Wing Lower -->
    <path d="M6,14 C35,32 48,60 24,68 C6,74 2,42 4,18 Z" fill="url(#wingGrad2)" opacity="0.85"/>
    <!-- Center Body -->
    <ellipse cx="0" cy="18" rx="2.5" ry="16" fill="#3f372d" />
  </g>
  <!-- Vitapiel Text -->
  <text x="160" y="118" text-anchor="middle" font-family="'Cormorant Garamond', 'Cinzel', serif" font-size="34" letter-spacing="4" fill="#332f2b" font-weight="500">vitapiel</text>
  <text x="160" y="138" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="10" letter-spacing="7" fill="#999187" font-weight="600">DERMATOLOGIA</text>
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
  <rect x="6" y="6" width="268" height="128" rx="14" fill="none" stroke="#4b5d6b" stroke-width="2" stroke-dasharray="6,2" opacity="0.82" />
  <rect x="11" y="11" width="258" height="118" rx="10" fill="none" stroke="#4b5d6b" stroke-width="1.2" opacity="0.65" />
  
  <text x="140" y="42" text-anchor="middle" font-family="'Cormorant Garamond', serif" font-size="16" font-weight="600" fill="#334155" letter-spacing="1">Dra. Laura M. Oliveros Valencia</text>
  <text x="140" y="66" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="12" font-weight="500" fill="#475569" letter-spacing="1.5">Dermatología Clínica y Estética</text>
  <text x="140" y="88" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="11" font-weight="400" fill="#64748b" letter-spacing="1">Atención Adultos y Niños</text>
  <text x="140" y="112" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="15" font-weight="700" fill="#1e293b" letter-spacing="3">CÓD. 9620</text>
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
    name: 'Dra. Laura M. Oliveros Valencia',
    specialty: 'Dermatologa',
    taxId: 'Cedula 801100379',
    addressLine1: 'Calle 12 Av 16 Heredia.',
    addressLine2: 'Oficentro Valar, Segundo Piso',
    phone: '+(506) 7261-4743',
    email: 'info@vitapielcr.com',
    website: 'www.vitapielcr.com'
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
      quantity: 6,
      title: 'PRP (con microagujas e infiltración)',
      subtitle: 'Sesiones Requeridas: 6',
      unitPrice: 100000,
      total: 600000,
      isPriceManual: false
    }
  ],
  applyDiscount: true,
  discountPercentage: 20,
  includeIva: false,
  ivaRate: 13,
  notes: [
    {
      id: 'note-1',
      text: 'Al pagar las 6 sesiones por anticipado le ofrecemos un descuento especial del 20% sobre el total'
    },
    {
      id: 'note-3',
      text: 'Esta cotización es válida por un período de 1 mes.'
    }
  ],
  signee: {
    name: 'Dra. Laura Oliveros',
    role: 'Dermatologa (9620)',
    company: 'Vitapiel',
    whatsapp: '+(506) 7261-4743',
    signatureImage: DEFAULT_SIGNATURE_SVG,
    stampImage: DEFAULT_STAMP_SVG,
    showSignature: true,
    showStamp: true,
    useGeneratedStamp: true,
    stampDetails: {
      title: 'Dra. Laura M. Oliveros Valencia',
      subtitle: 'Dermatología Clínica y Estética',
      extraText: 'Atención Adultos y Niños',
      code: '9620',
      color: '#475569',
      shape: 'rect'
    }
  },
  currency: {
    symbol: '¢',
    code: 'CRC',
    decimals: 0,
    placement: 'prefix'
  },
  brand: {
    logoUrl: DEFAULT_LOGO_SVG,
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
