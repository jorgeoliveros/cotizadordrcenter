import React from 'react';
import { Quote } from '../types';
import { calculateQuoteTotals, formatCurrency } from '../utils/formatters';

interface QuoteDocumentProps {
  quote: Quote;
  onEditItem?: (index: number) => void;
  isPrinting?: boolean;
}

export const QuoteDocument: React.FC<QuoteDocumentProps> = ({
  quote,
  isPrinting = false,
}) => {
  const totals = calculateQuoteTotals(quote);
  const { brand } = quote;
  const theme = brand.backgroundTheme || 'minimalist';

  // Font family mappings
  const headingFontClass = {
    'Cormorant Garamond': 'font-["Cormorant_Garamond",serif]',
    'Cinzel': 'font-["Cinzel",serif]',
    'Playfair Display': 'font-["Playfair_Display",serif]',
    'Montserrat': 'font-["Montserrat",sans-serif]',
    'Outfit': 'font-["Outfit",sans-serif]',
    'Plus Jakarta Sans': 'font-["Plus_Jakarta_Sans",sans-serif]',
  }[brand.fontHeading] || 'font-serif';

  const bodyFontClass = {
    'Montserrat': 'font-["Montserrat",sans-serif]',
    'Outfit': 'font-["Outfit",sans-serif]',
    'Plus Jakarta Sans': 'font-["Plus_Jakarta_Sans",sans-serif]',
  }[brand.fontBody] || 'font-sans';

  // Base paper color
  const basePaperColor = {
    white: '#ffffff',
    ivory: '#faf8f5',
    'warm-stone': '#f7f5f2',
    'slate-tint': '#f8fafc',
  }[brand.paperBg] || '#ffffff';

  // Dynamic background styling derived from the logo's color palette
  const getDocumentBackgroundStyle = (): React.CSSProperties => {
    if (theme === 'modern') {
      return {
        backgroundColor: basePaperColor,
        backgroundImage: `
          radial-gradient(ellipse 700px 380px at 98% 2%, ${brand.accentColor}12 0%, transparent 65%),
          radial-gradient(ellipse 650px 350px at 2% 98%, ${brand.primaryColor}0d 0%, transparent 65%)
        `,
      };
    }
    if (theme === 'professional') {
      return {
        backgroundColor: basePaperColor,
        backgroundImage: `
          linear-gradient(to bottom, ${brand.primaryColor}06 0px, transparent 120px)
        `,
      };
    }
    // Minimalist: Clean paper background
    return {
      backgroundColor: basePaperColor,
    };
  };

  return (
    <div
      id="quotation-document-sheet"
      className={`relative w-full max-w-[794px] min-h-[1123px] mx-auto p-8 sm:p-12 transition-all duration-200 ${bodyFontClass} text-stone-800 flex flex-col justify-between ${
        isPrinting
          ? 'shadow-none border-none'
          : 'shadow-2xl rounded-sm border border-stone-200/90'
      }`}
      style={{
        ...getDocumentBackgroundStyle(),
        color: '#1c1917',
        boxSizing: 'border-box',
      }}
    >
      {/* PROFESSIONAL THEME: Top Corporate Gradient Accent Bar */}
      {theme === 'professional' && (
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background: `linear-gradient(90deg, ${brand.primaryColor} 0%, ${brand.accentColor} 100%)`,
          }}
        />
      )}

      {/* MODERN THEME: Delicate geometric corner accent */}
      {theme === 'modern' && (
        <div
          className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-40 overflow-hidden"
        >
          <div
            className="w-40 h-40 transform rotate-45 translate-x-16 -translate-y-24"
            style={{
              background: `linear-gradient(135deg, ${brand.accentColor}25 0%, transparent 70%)`,
            }}
          />
        </div>
      )}

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col">
        {/* Top Header: Company info on Left, Crisp Logo on Right */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 sm:mb-10">
          {/* Company & Professional details */}
          <div className="space-y-1 text-left max-w-sm">
            {quote.company.name && (
              <h2
                className={`text-lg sm:text-xl font-bold tracking-tight text-stone-900 ${headingFontClass}`}
                style={{ color: brand.headerTextColor || brand.primaryColor }}
              >
                {quote.company.name}
              </h2>
            )}
            {quote.company.specialty && (
              <p className="text-xs sm:text-sm font-medium text-stone-700">
                {quote.company.specialty}
              </p>
            )}
            {quote.company.taxId && (
              <p className="text-xs text-stone-600 font-medium">
                {quote.company.taxId}
              </p>
            )}
            {quote.company.addressLine1 && (
              <p className="text-xs text-stone-600">
                {quote.company.addressLine1}
              </p>
            )}
            {quote.company.addressLine2 && (
              <p className="text-xs text-stone-600">
                {quote.company.addressLine2}
              </p>
            )}
            {quote.company.phone && quote.company.phone.trim() && (
              <p className="text-xs text-stone-600 pt-0.5">
                {quote.company.phone.trim().toLowerCase().startsWith('tel')
                  ? quote.company.phone
                  : `Tel: ${quote.company.phone}`}
              </p>
            )}
            {quote.company.email && (
              <p className="text-xs text-stone-600">
                {quote.company.email}
              </p>
            )}
          </div>

          {/* High-Resolution Brand Logo */}
          <div
            className={`flex ${
              brand.logoAlignment === 'left'
                ? 'justify-start'
                : brand.logoAlignment === 'center'
                ? 'justify-center'
                : 'justify-end'
            } w-full sm:w-auto shrink-0`}
          >
            {brand.logoUrl ? (
              <div className="relative">
                <img
                  src={brand.logoUrl}
                  alt="Logo Empresa"
                  className="object-contain transition-transform"
                  style={{
                    width: `${brand.logoWidth}px`,
                    maxHeight: '120px',
                    imageRendering: 'auto',
                  }}
                />
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-stone-300 rounded p-4 text-center text-xs text-stone-400"
                style={{ width: `${brand.logoWidth}px` }}
              >
                Logo de la empresa
              </div>
            )}
          </div>
        </div>

        {/* Recipient & Quotation Title Row */}
        <div
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-5 mb-6 ${
            theme === 'professional'
              ? 'border-b-2 border-stone-300/90'
              : theme === 'modern'
              ? 'border-b border-stone-200/90'
              : 'border-b border-stone-200'
          }`}
        >
          {/* Client Info */}
          <div className="space-y-1">
            <span
              className="text-[11px] uppercase tracking-widest font-semibold block"
              style={{ color: brand.accentColor }}
            >
              Para
            </span>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {quote.client.name || 'Nombre del Cliente'}
            </h3>
            {quote.client.email && (
              <p className="text-xs text-stone-700">
                <span className="font-semibold text-stone-800">email : </span>
                {quote.client.email}
              </p>
            )}
            {quote.client.phone && (
              <p className="text-xs text-stone-600">
                <span className="font-semibold text-stone-800">tel : </span>
                {quote.client.phone}
              </p>
            )}
            {quote.client.taxId && (
              <p className="text-xs text-stone-500">
                Cédula / ID: {quote.client.taxId}
              </p>
            )}
          </div>

          {/* Quotation Heading and Date */}
          <div className="text-left sm:text-right space-y-1 sm:min-w-[200px]">
            {theme === 'modern' ? (
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-1"
                style={{
                  backgroundColor: `${brand.primaryColor}10`,
                  color: brand.primaryColor,
                  border: `1px solid ${brand.primaryColor}25`,
                }}
              >
                {quote.title || 'COTIZACIÓN'}
              </div>
            ) : (
              <h1
                className={`text-2xl sm:text-3xl font-light tracking-wider text-stone-900 ${headingFontClass}`}
                style={{ color: brand.primaryColor }}
              >
                {quote.title || 'COTIZACIÓN'}
              </h1>
            )}

            <p className="text-xs text-stone-600 font-medium">
              <span className="text-stone-500">Fecha: </span>
              {quote.date}
            </p>
            {quote.showValidUntil !== false && quote.validUntilDate && (
              <p className="text-[11px] text-stone-500">
                Válida hasta: {quote.validUntilDate}
              </p>
            )}
            {quote.showQuoteNumber !== false && quote.quoteNumber && (
              <p className="text-[10px] text-stone-400 font-mono">
                Nº {quote.quoteNumber}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              {theme === 'professional' ? (
                <tr
                  style={{
                    backgroundColor: brand.primaryColor,
                    color: '#ffffff',
                  }}
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  <th className="py-2.5 px-2 text-center w-20 rounded-l-xs">
                    CANTIDAD
                  </th>
                  <th className="py-2.5 px-4">
                    DESCRIPCIÓN
                  </th>
                  <th className="py-2.5 px-3 text-right w-36">
                    PRECIO UNITARIO
                  </th>
                  <th className="py-2.5 px-3 text-right w-36 rounded-r-xs">
                    TOTAL
                  </th>
                </tr>
              ) : theme === 'modern' ? (
                <tr
                  style={{
                    backgroundColor: `${brand.primaryColor}0a`,
                    color: brand.primaryColor,
                    borderBottom: `2px solid ${brand.primaryColor}30`,
                  }}
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  <th className="py-2.5 px-2 text-center w-20">
                    CANTIDAD
                  </th>
                  <th className="py-2.5 px-4">
                    DESCRIPCIÓN
                  </th>
                  <th className="py-2.5 px-3 text-right w-36">
                    PRECIO UNITARIO
                  </th>
                  <th className="py-2.5 px-3 text-right w-36">
                    TOTAL
                  </th>
                </tr>
              ) : (
                /* Minimalist Header */
                <tr className="border-b-2 border-stone-800 text-stone-900">
                  <th className="py-2.5 px-2 text-xs font-bold uppercase tracking-wider text-center w-20">
                    CANTIDAD
                  </th>
                  <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider">
                    DESCRIPCIÓN
                  </th>
                  <th className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-right w-36">
                    PRECIO UNITARIO
                  </th>
                  <th className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-right w-36">
                    TOTAL
                  </th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {quote.items.map((item) => {
                const rowTotal = item.isPriceManual
                  ? item.total
                  : item.quantity * item.unitPrice;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-2 text-center text-sm font-medium align-top">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-medium text-stone-900 text-sm">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-xs text-stone-600 mt-0.5 font-normal">
                          {item.subtitle}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right text-sm font-medium align-top whitespace-nowrap text-stone-700">
                      {formatCurrency(item.unitPrice, quote.currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-sm font-semibold align-top whitespace-nowrap text-stone-900">
                      {formatCurrency(rowTotal, quote.currency)}
                      {item.isPriceManual && (
                        <span className="block text-[9px] text-amber-700 font-normal">
                          (ajustado manual)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals & Calculations Block (Right-aligned, matching PDF style) */}
        <div className="flex justify-end mb-8">
          <div
            className={`w-full sm:w-80 space-y-2 text-sm ${
              theme === 'modern'
                ? 'p-4 rounded-xl border'
                : theme === 'professional'
                ? 'p-4 rounded-md border border-stone-200 bg-stone-50/60'
                : ''
            }`}
            style={
              theme === 'modern'
                ? {
                    backgroundColor: `${brand.primaryColor}04`,
                    borderColor: `${brand.primaryColor}18`,
                  }
                : undefined
            }
          >
            {/* Subtotal */}
            <div className="flex justify-between items-center py-0.5 font-medium text-stone-800">
              <span className="text-xs uppercase tracking-wider text-stone-700 font-bold">
                SUBTOTAL :
              </span>
              <span className="text-sm font-semibold">
                {formatCurrency(totals.subtotal, quote.currency)}
              </span>
            </div>

            {/* Descuento si está activo */}
            {quote.applyDiscount && (
              <div className="flex justify-between items-center py-0.5 text-stone-700">
                <span className="text-xs">
                  Descuento aplicado ({quote.discountPercentage}%) :
                </span>
                <span className="text-sm font-medium text-stone-700">
                  {formatCurrency(totals.discountAmount, quote.currency)}
                </span>
              </div>
            )}

            {/* Total con descuento */}
            {quote.applyDiscount && (
              <div className="flex justify-between items-center py-0.5 text-stone-900 font-semibold border-t border-stone-200 pt-1.5">
                <span className="text-xs">(*) Total con descuento :</span>
                <span className="text-sm font-bold">
                  {formatCurrency(totals.totalWithDiscount, quote.currency)}
                </span>
              </div>
            )}

            {/* IVA 13% - ONLY displayed when includeIva is active; NO visual note when inactive */}
            {quote.includeIva && (
              <div className="flex justify-between items-center py-0.5 text-stone-800 font-medium">
                <span className="text-xs">IVA ({quote.ivaRate}%) :</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(totals.ivaAmount, quote.currency)}
                </span>
              </div>
            )}

            {/* Grand Total Final */}
            <div
              className="flex justify-between items-center pt-2 mt-1.5 border-t-2 border-stone-800 font-bold"
              style={{
                borderColor: theme === 'professional' ? brand.primaryColor : '#1c1917',
                color: brand.primaryColor,
              }}
            >
              <span className="text-xs uppercase tracking-wider">
                {quote.includeIva
                  ? 'TOTAL CON IVA :'
                  : quote.applyDiscount
                  ? 'TOTAL A PAGAR :'
                  : 'TOTAL :'}
              </span>
              <span className="text-base sm:text-lg">
                {formatCurrency(totals.grandTotal, quote.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Notas aclaratorias */}
        {quote.notes && quote.notes.length > 0 && (
          <div className="mb-8 pt-2">
            <h4 className="text-xs uppercase tracking-wider font-bold text-stone-800 mb-2">
              Notas aclaratorias :
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-700 list-disc pl-5 leading-relaxed">
              {quote.notes.map((note) => (
                <li key={note.id} className="pl-1">
                  {note.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Signature and Digital Stamp Section - Sits cleanly at the base */}
      <div
        className={`pt-5 mt-auto ${
          theme === 'professional'
            ? 'border-t-2 border-stone-200'
            : 'border-t border-stone-200/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 relative">
          {/* Signee Details & Signature Stroke */}
          <div className="space-y-1 max-w-sm relative z-10">
            {/* Signature image / stroke */}
            {quote.signee.showSignature && quote.signee.signatureImage && (
              <div className="h-14 w-48 mb-1 flex items-end">
                <img
                  src={quote.signee.signatureImage}
                  alt="Firma Digital"
                  className="max-h-14 max-w-full object-contain filter contrast-125"
                />
              </div>
            )}

            {/* Line for signature */}
            <div className="w-52 h-[1px] bg-stone-400/80 mb-2"></div>

            <h5 className="text-sm font-bold text-stone-900">
              {quote.signee.name}
            </h5>
            {quote.signee.role && (
              <p className="text-xs text-stone-700">{quote.signee.role}</p>
            )}
            {quote.signee.company && (
              <p className="text-xs text-stone-600 font-medium">
                {quote.signee.company}
              </p>
            )}
            {quote.signee.whatsapp && (
              <p className="text-xs text-stone-600">
                Whatsapp: {quote.signee.whatsapp}
              </p>
            )}
          </div>

          {/* Official Professional Stamp / Sello */}
          {quote.signee.showStamp && (
            <div className="relative transform -rotate-2 sm:rotate-2 self-center sm:self-auto my-1 sm:my-0">
              {quote.signee.stampImage ? (
                <div className="relative">
                  <img
                    src={quote.signee.stampImage}
                    alt="Sello Oficial"
                    className="max-h-24 sm:max-h-28 object-contain opacity-90 drop-shadow-xs"
                  />
                </div>
              ) : quote.signee.useGeneratedStamp ? (
                <div
                  className="border-2 border-dashed rounded-lg p-2.5 text-center min-w-[200px] max-w-[240px] opacity-85 select-none"
                  style={{
                    borderColor: quote.signee.stampDetails.color || '#475569',
                    color: quote.signee.stampDetails.color || '#334155',
                  }}
                >
                  <div className="text-xs font-semibold uppercase tracking-wider">
                    {quote.signee.stampDetails.title}
                  </div>
                  <div className="text-[11px] font-medium my-0.5">
                    {quote.signee.stampDetails.subtitle}
                  </div>
                  <div className="text-[10px] opacity-80">
                    {quote.signee.stampDetails.extraText}
                  </div>
                  <div className="text-xs font-bold tracking-widest mt-1">
                    CÓD. {quote.signee.stampDetails.code}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
