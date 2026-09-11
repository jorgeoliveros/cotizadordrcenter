import React, { useState, useEffect } from 'react';
import {
  INITIAL_QUOTE,
  INITIAL_FREQUENT_CLIENTS,
} from './data/defaultData';
import { Quote, Client, BrandSettings, SigneeInfo } from './types';
import { Header } from './components/Header';
import { QuoteEditor } from './components/QuoteEditor';
import { QuoteDocument } from './components/QuoteDocument';
import { ClientsModal } from './components/ClientsModal';
import { BrandCustomizerModal } from './components/BrandCustomizerModal';
import { SignaturePadModal } from './components/SignaturePadModal';
import { EmailModal } from './components/EmailModal';
import { exportQuoteToPdf } from './utils/pdfExport';
import {
  FileText,
  SlidersHorizontal,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  UserCheck,
} from 'lucide-react';

const STORAGE_KEY_QUOTE = 'cotizador_active_quote';
const STORAGE_KEY_CLIENTS = 'cotizador_frequent_clients';

export default function App() {
  // Load state from local storage or defaults
  const [quote, setQuote] = useState<Quote>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUOTE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved quote:', e);
    }
    return INITIAL_QUOTE;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLIENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading saved clients:', e);
    }
    return INITIAL_FREQUENT_CLIENTS;
  });

  // UI & Modals State
  const [isClientsOpen, setIsClientsOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  // Mobile View Toggle: 'editor' | 'preview'
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('preview');

  // Exporting state
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUOTE, JSON.stringify(quote));
    } catch (e) {
      console.error('Error saving quote to localStorage:', e);
    }
  }, [quote]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
    } catch (e) {
      console.error('Error saving clients to localStorage:', e);
    }
  }, [clients]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Handlers
  const handleSelectClient = (selectedClient: Client) => {
    setQuote((prev) => ({
      ...prev,
      client: {
        id: selectedClient.id,
        name: selectedClient.name,
        email: selectedClient.email,
        phone: selectedClient.phone || '',
        taxId: selectedClient.taxId || '',
      },
    }));
    showToast(`Cliente "${selectedClient.name}" cargado en la cotización.`);
  };

  const handleSaveClient = (clientToSave: Client) => {
    setClients((prev) => {
      const exists = prev.some((c) => c.id === clientToSave.id);
      if (exists) {
        return prev.map((c) => (c.id === clientToSave.id ? clientToSave : c));
      }
      return [clientToSave, ...prev];
    });
    showToast('Cliente guardado con éxito en el registro de frecuentes.');
  };

  const handleDeleteClient = (clientId: string) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    showToast('Cliente eliminado del registro.');
  };

  const handleUpdateBrand = (updatedBrand: BrandSettings) => {
    setQuote((prev) => ({ ...prev, brand: updatedBrand }));
  };

  const handleUpdateSignee = (updatedSignee: SigneeInfo) => {
    setQuote((prev) => ({ ...prev, signee: updatedSignee }));
  };

  const handleResetToTemplate = () => {
    if (
      confirm(
        '¿Desea restablecer los datos de la cotización al ejemplo oficial de Vitapiel del PDF?'
      )
    ) {
      setQuote(INITIAL_QUOTE);
      showToast('Plantilla Vitapiel restaurada.');
    }
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    const cleanFileName = `Cotizacion_${quote.quoteNumber || 'DOC'}_${(
      quote.client.name || 'Cliente'
    )
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 30)}`;

    try {
      const success = await exportQuoteToPdf(
        'quotation-document-sheet',
        cleanFileName
      );
      if (success) {
        showToast('Documento PDF generado en alta nitidez.');
      }
    } catch (err) {
      console.error(err);
      showToast('Se abrió la ventana de impresión para guardar como PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        quote={quote}
        onOpenClients={() => setIsClientsOpen(true)}
        onOpenBrand={() => setIsBrandOpen(true)}
        onOpenSignature={() => setIsSignatureOpen(true)}
        onOpenEmail={() => setIsEmailOpen(true)}
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
        onResetToTemplate={handleResetToTemplate}
        isExportingPdf={isExportingPdf}
        clientCount={clients.length}
      />

      {/* Mobile Tab Switcher (Editor vs Document) */}
      <div className="lg:hidden sticky top-[57px] z-20 bg-stone-200/90 backdrop-blur-sm p-2 flex gap-2 border-b border-stone-300 no-print">
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'editor'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Editar Parámetros
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'preview'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Vista Previa del Documento
        </button>
      </div>

      {/* Main Workspace: Split Screen Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor controls */}
        <section
          className={`lg:col-span-5 space-y-6 no-print ${
            mobileTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Quick Context Card */}
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-4 rounded-xl shadow-xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
                Diseño Activo
              </span>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                {quote.brand.fontHeading} · {quote.brand.backgroundTheme === 'modern' ? 'Fondo Moderno' : quote.brand.backgroundTheme === 'professional' ? 'Fondo Profesional' : 'Fondo Minimalista'}
              </h2>
              <p className="text-[11px] text-stone-300">
                IVA {quote.includeIva ? 'Incluido (13%)' : 'No incluido'} · Tamaño de hoja A4 listo para imprimir
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetToTemplate}
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors text-xs flex items-center gap-1"
              title="Restablecer ejemplo oficial Vitapiel"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px]">Plantilla PDF</span>
            </button>
          </div>

          {/* Form Editor */}
          <QuoteEditor
            quote={quote}
            onChangeQuote={setQuote}
            onOpenClientsModal={() => setIsClientsOpen(true)}
            onOpenSignatureModal={() => setIsSignatureOpen(true)}
            onOpenBrandModal={() => setIsBrandOpen(true)}
          />
        </section>

        {/* Right Column: Live Document Sheet */}
        <section
          className={`lg:col-span-7 flex flex-col items-center w-full ${
            mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* A4 Sheet Toolbar: Format & Quick Background Style Switcher */}
          <div className="w-full max-w-[794px] mb-3 flex flex-wrap items-center justify-between gap-2 px-2 text-xs no-print">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-stone-200 text-stone-700 font-semibold shadow-2xs text-[11px]">
                <FileText className="w-3.5 h-3.5 text-stone-500" />
                Formato A4 (210 × 297 mm)
              </span>
            </div>

            {/* Quick Background Theme Buttons */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-stone-600 px-1.5 hidden sm:inline">
                Fondo:
              </span>
              {[
                { id: 'minimalist', label: 'Minimalista' },
                { id: 'modern', label: 'Moderno' },
                { id: 'professional', label: 'Profesional' },
              ].map((style) => {
                const isCurrent = (quote.brand.backgroundTheme || 'minimalist') === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() =>
                      setQuote((prev) => ({
                        ...prev,
                        brand: {
                          ...prev.brand,
                          backgroundTheme: style.id as any,
                        },
                      }))
                    }
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                      isCurrent
                        ? 'bg-stone-900 text-white shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    {style.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Document Sheet Container */}
          <div className="w-full overflow-x-auto pb-8 flex justify-center">
            <QuoteDocument quote={quote} isPrinting={false} />
          </div>
        </section>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-700 flex items-center gap-2 text-xs font-medium animate-fade-in no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <ClientsModal
        isOpen={isClientsOpen}
        onClose={() => setIsClientsOpen(false)}
        clients={clients}
        onSelectClient={handleSelectClient}
        onSaveClient={handleSaveClient}
        onDeleteClient={handleDeleteClient}
        currentQuoteClient={quote.client}
        currentQuote={quote}
      />

      <BrandCustomizerModal
        isOpen={isBrandOpen}
        onClose={() => setIsBrandOpen(false)}
        brand={quote.brand}
        onUpdateBrand={handleUpdateBrand}
      />

      <SignaturePadModal
        isOpen={isSignatureOpen}
        onClose={() => setIsSignatureOpen(false)}
        signee={quote.signee}
        onUpdateSignee={handleUpdateSignee}
      />

      <EmailModal
        isOpen={isEmailOpen}
        onClose={() => setIsEmailOpen(false)}
        quote={quote}
        onDownloadPdf={handleExportPdf}
      />
    </div>
  );
}
