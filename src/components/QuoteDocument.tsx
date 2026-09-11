import React, { useRef } from 'react';
import { Quote, SigneeInfo } from '../types';
import { calculateQuoteTotals, formatCurrency } from '../utils/formatters';
import { DEFAULT_STAMP_SVG } from '../data/defaultData';

interface QuoteDocumentProps {
  quote: Quote;
  onEditItem?: (index: number) => void;
  isPrinting?: boolean;
  onChangeSignee?: (signee: SigneeInfo) => void;
  onOpenSignatureModal?: (tab?: 'draw' | 'upload-sig' | 'stamp' | 'position') => void;
}

export const QuoteDocument: React.FC<QuoteDocumentProps> = ({
  quote,
  isPrinting = false,
  onChangeSignee,
  onOpenSignatureModal,
}) => {
  const totals = calculateQuoteTotals(quote);
  const { brand } = quote;
  const theme = brand.backgroundTheme || 'minimalist';

  // Helper to convert hex to rgba safely for canvas and PDF export without color parsing defects
  const hexToRgba = (hex: string, alpha: number): string => {
    if (!hex) return `rgba(146, 64, 14, ${alpha})`;
    let clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    if (clean.length >= 6) {
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }
    return `rgba(146, 64, 14, ${alpha})`;
  };

  // Dragging interaction for signature and stamp
  const dragRef = useRef<{
    item: 'signature' | 'stamp';
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  const handleStartDrag = (
    item: 'signature' | 'stamp',
    e: React.MouseEvent | React.TouchEvent
  ) => {
    if (isPrinting || !onChangeSignee) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const initialX =
      item === 'signature'
        ? (quote.signee.signatureOffsetX ?? 0)
        : (quote.signee.stampOffsetX ?? 0);
    const initialY =
      item === 'signature'
        ? (quote.signee.signatureOffsetY ?? 0)
        : (quote.signee.stampOffsetY ?? 0);

    dragRef.current = { item, startX: clientX, startY: clientY, initialX, initialY };

    const handleMove = (ev: MouseEvent | TouchEvent) => {
      if (!dragRef.current) return;
      const curX = 'touches' in ev ? ev.touches[0].clientX : ev.clientX;
      const curY = 'touches' in ev ? ev.touches[0].clientY : ev.clientY;
      const dx = Math.round(curX - dragRef.current.startX);
      const dy = Math.round(curY - dragRef.current.startY);

      if (dragRef.current.item === 'signature') {
        onChangeSignee({
          ...quote.signee,
          signatureOffsetX: dragRef.current.initialX + dx,
          signatureOffsetY: dragRef.current.initialY + dy,
        });
      } else {
        onChangeSignee({
          ...quote.signee,
          stampOffsetX: dragRef.current.initialX + dx,
          stampOffsetY: dragRef.current.initialY + dy,
        });
      }
    };

    const handleEnd = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
  };

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

  return (
    <div
      id="quotation-document-sheet"
      className={`relative w-full max-w-[794px] min-h-[1123px] mx-auto p-8 sm:p-12 transition-all duration-200 ${bodyFontClass} text-stone-800 flex flex-col justify-between print:w-full print:max-w-none print:min-h-0 print:h-[100vh] print:max-h-[100vh] print:p-6 print:m-0 print:border-none print:shadow-none print:rounded-none ${
        isPrinting
          ? 'shadow-none border-none'
          : 'shadow-2xl rounded-sm border border-stone-200/90'
      }`}
      style={{
        backgroundColor: '#ffffff',
        color: '#1a1a1a',
        paddingTop: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* PROFESSIONAL THEME: Top Corporate Accent Bar */}
      {theme === 'professional' && (
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            backgroundColor: brand.primaryColor,
          }}
        />
      )}

      {/* MODERN THEME: Decorative Header Shape (Preserves golden/brown tones in PDF canvas without turning dark) */}
      {theme === 'modern' && (
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none overflow-hidden select-none z-0">
          <svg
            viewBox="0 0 160 160"
            className="w-full h-full"
            style={{ display: 'block' }}
          >
            <defs>
              <linearGradient id="modernHeaderAccentShape" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={brand.accentColor || '#92400e'} stopOpacity="0.38" />
                <stop offset="60%" stopColor={brand.accentColor || '#92400e'} stopOpacity="0.14" />
                <stop offset="100%" stopColor={brand.accentColor || '#92400e'} stopOpacity="0" />
              </linearGradient>
              <linearGradient id="modernHeaderFacet2" x1="100%" y1="0%" x2="30%" y2="70%">
                <stop offset="0%" stopColor={brand.primaryColor || '#78350f'} stopOpacity="0.2" />
                <stop offset="100%" stopColor={brand.primaryColor || '#78350f'} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Primary architectural triangle in warm golden/brown tone */}
            <polygon points="160,0 35,0 160,125" fill="url(#modernHeaderAccentShape)" />
            {/* Overlapping facet adding depth */}
            <polygon points="160,0 85,0 160,75" fill="url(#modernHeaderFacet2)" />
          </svg>
        </div>
      )}

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col">
        {/* Top Header: Company info on Left, Crisp Logo on Right */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 sm:mb-10 print:mb-3 print:gap-4 print-avoid-break">
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
                  className="object-contain transition-transform print:max-h-20"
                  style={{
                    width: `${brand.logoWidth}px`,
                    maxHeight: '120px',
                    imageRendering: 'auto',
                  }}
                />
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-stone-300 rounded p-4 text-center text-xs text-stone-400 print:p-2"
                style={{ width: `${brand.logoWidth}px` }}
              >
                Logo de la empresa
              </div>
            )}
          </div>
        </div>

        {/* Recipient & Quotation Title Row */}
        <div
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-5 mb-6 print:pb-2.5 print:mb-2.5 print:gap-3 print-avoid-break ${
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
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-1 print:mb-0.5 print:py-0.5 print:px-2"
                style={{
                  backgroundColor: hexToRgba(brand.primaryColor || '#78350f', 0.08),
                  color: brand.primaryColor,
                  border: `1px solid ${hexToRgba(brand.primaryColor || '#78350f', 0.22)}`,
                }}
              >
                {quote.title || 'COTIZACIÓN'}
              </div>
            ) : (
              <h1
                className={`text-2xl sm:text-3xl font-light tracking-wider text-stone-900 print:text-2xl ${headingFontClass}`}
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
        <div className="mb-6 print:mb-2.5 print-avoid-break">
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
                  <th className="py-2.5 px-2 text-center w-20 rounded-l-xs print:py-1.5">
                    CANTIDAD
                  </th>
                  <th className="py-2.5 px-4 print:py-1.5">
                    DESCRIPCIÓN
                  </th>
                  <th className="py-2.5 px-3 text-right w-36 print:py-1.5">
                    PRECIO UNITARIO
                  </th>
                  <th className="py-2.5 px-3 text-right w-36 rounded-r-xs print:py-1.5">
                    TOTAL
                  </th>
                </tr>
              ) : theme === 'modern' ? (
                <tr
                  style={{
                    backgroundColor: hexToRgba(brand.primaryColor || '#78350f', 0.06),
                    color: brand.primaryColor,
                    borderBottom: `2px solid ${hexToRgba(brand.primaryColor || '#78350f', 0.25)}`,
                  }}
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  <th className="py-2.5 px-2 text-center w-20 print:py-1.5">
                    CANTIDAD
                  </th>
                  <th className="py-2.5 px-4 print:py-1.5">
                    DESCRIPCIÓN
                  </th>
                  <th className="py-2.5 px-3 text-right w-36 print:py-1.5">
                    PRECIO UNITARIO
                  </th>
                  <th className="py-2.5 px-3 text-right w-36 print:py-1.5">
                    TOTAL
                  </th>
                </tr>
              ) : (
                /* Minimalist Header */
                <tr className="border-b-2 border-stone-800 text-stone-900">
                  <th className="py-2.5 px-2 text-xs font-bold uppercase tracking-wider text-center w-20 print:py-1.5">
                    CANTIDAD
                  </th>
                  <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider print:py-1.5">
                    DESCRIPCIÓN
                  </th>
                  <th className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-right w-36 print:py-1.5">
                    PRECIO UNITARIO
                  </th>
                  <th className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-right w-36 print:py-1.5">
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
                    className="hover:bg-stone-50/50 transition-colors print-avoid-break"
                  >
                    <td className="py-3.5 px-2 text-center text-sm font-medium align-top print:py-1.5">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-4 align-top print:py-1.5">
                      <div className="font-medium text-stone-900 text-sm">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-xs text-stone-600 mt-0.5 font-normal">
                          {item.subtitle}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right text-sm font-medium align-top whitespace-nowrap text-stone-700 print:py-1.5">
                      {formatCurrency(item.unitPrice, quote.currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-sm font-semibold align-top whitespace-nowrap text-stone-900 print:py-1.5">
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
        <div className="flex justify-end mb-8 print:mb-2.5 print-avoid-break">
          <div
            className={`w-full sm:w-80 space-y-2 text-sm print:space-y-1 print:p-2.5 ${
              theme === 'modern'
                ? 'p-4 rounded-xl border'
                : theme === 'professional'
                ? 'p-4 rounded-md border border-stone-200 bg-stone-50/60'
                : ''
            }`}
            style={
              theme === 'modern'
                ? {
                    backgroundColor: hexToRgba(brand.primaryColor || '#78350f', 0.03),
                    borderColor: hexToRgba(brand.primaryColor || '#78350f', 0.16),
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
              <div className="flex justify-between items-center py-0.5 text-stone-900 font-semibold border-t border-stone-200 pt-1.5 print:pt-1">
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
              className="flex justify-between items-center pt-2 mt-1.5 border-t-2 border-stone-800 font-bold print:pt-1.5 print:mt-1"
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
          <div className="mb-8 pt-2 print:mb-2 print:pt-0.5 print-avoid-break">
            <h4 className="text-xs uppercase tracking-wider font-bold text-stone-800 mb-2 print:mb-1">
              Notas aclaratorias :
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-700 list-disc pl-5 leading-relaxed print:space-y-0.5">
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
        className={`pt-5 mt-auto print:pt-2 print:mt-auto print-avoid-break relative ${
          theme === 'professional'
            ? 'border-t-2 border-stone-200'
            : 'border-t border-stone-200/80'
        }`}
      >
        {(() => {
          const layoutMode = quote.signee.layoutMode || 'split';
          const isCentered = layoutMode === 'center';
          const isRight = layoutMode === 'right';
          const isLeft = layoutMode === 'left';
          const stampPos = quote.signee.stampPosition || 'beside-right';

          const stampSource =
            quote.signee.stampType ||
            (quote.signee.useGeneratedStamp
              ? 'generated'
              : quote.signee.customStampImage && quote.signee.stampImage === quote.signee.customStampImage
              ? 'custom'
              : 'default');

          const activeStampImg =
            stampSource === 'custom'
              ? quote.signee.customStampImage || quote.signee.stampImage || DEFAULT_STAMP_SVG
              : quote.signee.defaultStampImage || quote.signee.stampImage || DEFAULT_STAMP_SVG;

          const sigX = quote.signee.signatureOffsetX ?? 0;
          const sigY = quote.signee.signatureOffsetY ?? 0;
          const stampX = quote.signee.stampOffsetX ?? 0;
          const stampY = quote.signee.stampOffsetY ?? 0;
          const stampRot = quote.signee.stampRotation ?? 2;
          const stampScale = quote.signee.stampScale ?? 1;

          return (
            <div
              className={`flex flex-col sm:flex-row gap-6 relative print:gap-3 ${
                isCentered
                  ? 'justify-center items-center text-center'
                  : isRight
                  ? 'justify-end items-end text-right'
                  : isLeft
                  ? 'justify-start items-start text-left'
                  : 'justify-between items-start sm:items-end'
              }`}
            >
              {/* Signee Details & Signature Stroke */}
              <div
                onMouseDown={(e) => handleStartDrag('signature', e)}
                onTouchStart={(e) => handleStartDrag('signature', e)}
                style={{
                  transform: `translate(${sigX}px, ${sigY}px)`,
                  cursor: !isPrinting && onChangeSignee ? 'grab' : 'default',
                }}
                className={`space-y-1 max-w-sm relative z-10 transition-transform ${
                  isCentered
                    ? 'text-center flex flex-col items-center'
                    : isRight
                    ? 'text-right flex flex-col items-end'
                    : 'text-left flex flex-col items-start'
                }`}
                title={!isPrinting && onChangeSignee ? 'Arrastrar para mover la firma' : undefined}
              >
                {/* Signature image / stroke */}
                {quote.signee.showSignature && quote.signee.signatureImage && (
                  <div
                    className={`h-14 w-48 mb-1 flex items-end print:h-10 print:mb-0.5 ${
                      isCentered
                        ? 'justify-center mx-auto'
                        : isRight
                        ? 'justify-end ml-auto'
                        : 'justify-start'
                    }`}
                  >
                    <img
                      src={quote.signee.signatureImage}
                      alt="Firma Digital"
                      className="max-h-14 max-w-full object-contain filter contrast-125 print:max-h-10 pointer-events-none select-none"
                    />
                  </div>
                )}

                {/* Line for signature */}
                <div
                  className={`w-52 h-[1px] bg-stone-400/80 mb-2 print:mb-1 ${
                    isCentered ? 'mx-auto' : isRight ? 'ml-auto' : ''
                  }`}
                ></div>

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
                <div
                  onMouseDown={(e) => handleStartDrag('stamp', e)}
                  onTouchStart={(e) => handleStartDrag('stamp', e)}
                  style={{
                    transform: `translate(${stampX}px, ${stampY}px) rotate(${stampRot}deg) scale(${stampScale})`,
                    transformOrigin: 'center center',
                    cursor: !isPrinting && onChangeSignee ? 'grab' : 'default',
                  }}
                  className={`select-none transition-transform z-20 ${
                    stampPos === 'overlap'
                      ? 'absolute top-0 right-2 sm:right-10'
                      : 'relative self-center sm:self-auto my-1 sm:my-0'
                  }`}
                  title={!isPrinting && onChangeSignee ? 'Arrastrar para mover el sello' : undefined}
                >
                  {stampSource !== 'generated' ? (
                    <div className="relative">
                      <img
                        src={activeStampImg}
                        alt="Sello Oficial"
                        className="max-h-24 sm:max-h-28 object-contain opacity-90 drop-shadow-xs print:max-h-16 pointer-events-none"
                      />
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed rounded-lg p-2.5 text-center min-w-[200px] max-w-[240px] opacity-85 select-none print:p-1.5 print:min-w-[180px] bg-white/40"
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
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
