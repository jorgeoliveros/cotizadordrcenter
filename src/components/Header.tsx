import React from 'react';
import {
  FileDown,
  Printer,
  Mail,
  Users,
  Palette,
  Stamp,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Quote } from '../types';

interface HeaderProps {
  quote: Quote;
  onOpenClients: () => void;
  onOpenBrand: () => void;
  onOpenSignature: () => void;
  onOpenEmail: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onResetToTemplate: () => void;
  isExportingPdf: boolean;
  clientCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  quote,
  onOpenClients,
  onOpenBrand,
  onOpenSignature,
  onOpenEmail,
  onExportPdf,
  onPrint,
  onResetToTemplate,
  isExportingPdf,
  clientCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: App title & Document tag */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-serif font-bold text-base shadow-xs">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-stone-900 font-serif">
                  Cotizador Profesional
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                  {quote.quoteNumber || 'COT-2026'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Diseño editable, clientes frecuentes y exportación nítida en PDF
              </p>
            </div>
          </div>

          {/* Quick Reset button on mobile */}
          <button
            type="button"
            onClick={onResetToTemplate}
            className="text-stone-400 hover:text-stone-700 p-1.5 md:hidden"
            title="Cargar plantilla Vitapiel"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Center/Right: Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
          {/* Frequent Clients Button */}
          <button
            type="button"
            onClick={onOpenClients}
            className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-stone-600" />
            <span>Clientes</span>
            <span className="px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold">
              {clientCount}
            </span>
          </button>

          {/* Brand Customization Button */}
          <button
            type="button"
            onClick={onOpenBrand}
            className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Palette className="w-3.5 h-3.5 text-amber-700" />
            <span>Marca & Diseño</span>
          </button>

          {/* Signature & Stamp Button */}
          <button
            type="button"
            onClick={onOpenSignature}
            className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Stamp className="w-3.5 h-3.5 text-stone-700" />
            <span>Firma / Sello</span>
          </button>

          {/* Send via Email Modal */}
          <button
            type="button"
            onClick={onOpenEmail}
            className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-900 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5 text-blue-700" />
            <span>Enviar</span>
          </button>

          {/* Browser Print Button */}
          <button
            type="button"
            onClick={onPrint}
            className="p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
            title="Imprimir directamente"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Export High-Res PDF Button */}
          <button
            type="button"
            onClick={onExportPdf}
            disabled={isExportingPdf}
            className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            {isExportingPdf ? 'Generando PDF...' : 'Exportar PDF'}
          </button>
        </div>
      </div>
    </header>
  );
};
