import React, { useState } from 'react';
import { X, Mail, Send, Copy, Check, MessageSquare, Download, Sparkles } from 'lucide-react';
import { Quote } from '../types';
import { calculateQuoteTotals, formatCurrency } from '../utils/formatters';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote;
  onDownloadPdf: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  quote,
  onDownloadPdf,
}) => {
  const totals = calculateQuoteTotals(quote);

  // Default subject line
  const defaultSubject = `Cotización ${quote.quoteNumber || ''} - ${quote.company.name || 'Clínica'}`;

  // Default professional body message
  const generateDefaultBody = () => {
    const itemsSummary = quote.items
      .map(
        (it) =>
          `• ${it.quantity}x ${it.title} - ${formatCurrency(
            it.isPriceManual ? it.total : it.quantity * it.unitPrice,
            quote.currency
          )}`
      )
      .join('\n');

    const totalLines = [
      `Subtotal: ${formatCurrency(totals.subtotal, quote.currency)}`,
      quote.applyDiscount
        ? `Descuento aplicado (${quote.discountPercentage}%): -${formatCurrency(
            totals.discountAmount,
            quote.currency
          )}`
        : '',
      quote.applyDiscount
        ? `Total con descuento: ${formatCurrency(totals.totalWithDiscount, quote.currency)}`
        : '',
      quote.includeIva
        ? `IVA (${quote.ivaRate}%): ${formatCurrency(totals.ivaAmount, quote.currency)}`
        : 'IVA: No incluido (aplica en caso de requerir factura electrónica)',
      `\nTOTAL FINAL: ${formatCurrency(totals.grandTotal, quote.currency)}`,
    ]
      .filter(Boolean)
      .join('\n');

    const notesSummary =
      quote.notes && quote.notes.length > 0
        ? `\n\nNotas y condiciones:\n${quote.notes
            .map((n) => `• ${n.text}`)
            .join('\n')}`
        : '';

    return `Estimado/a ${quote.client.name || 'Cliente'},\n\nEs un gusto saludarle. Adjunto le compartimos los detalles de su cotización formal solicitada:\n\n${itemsSummary}\n\nResumen de costos:\n${totalLines}${notesSummary}\n\nQuedamos a su completa disposición para coordinar su tratamiento o agendar sus sesiones.\n\nAtentamente,\n${quote.signee.name}\n${quote.signee.role} - ${quote.signee.company}\nWhatsApp: ${quote.signee.whatsapp || quote.company.phone}`;
  };

  const [recipient, setRecipient] = useState(quote.client.email || '');
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(generateDefaultBody());
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleMailto = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
  };

  const handleWhatsApp = () => {
    // Clean phone number
    const rawPhone = (quote.client.phone || quote.signee.whatsapp || '').replace(/[^0-9]/g, '');
    const textEncoded = encodeURIComponent(`*${subject}*\n\n${message}`);
    const waUrl = rawPhone ? `https://wa.me/${rawPhone}?text=${textEncoded}` : `https://wa.me/?text=${textEncoded}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-700" />
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Enviar Cotización al Cliente
              </h3>
              <p className="text-xs text-stone-500">
                Envío por correo electrónico o WhatsApp con resumen desglosado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Destinatario (Correo Electrónico)
            </label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="cliente@ejemplo.com"
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:border-stone-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Asunto del Correo
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:border-stone-500 bg-white"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-stone-700">
                Mensaje personalizado
              </label>
              <button
                type="button"
                onClick={() => setMessage(generateDefaultBody())}
                className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                Regenerar plantilla
              </button>
            </div>
            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:border-stone-500 bg-stone-50/50 font-mono leading-relaxed"
            />
          </div>

          {/* Quick PDF Attachment Tip */}
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900">
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-700 shrink-0" />
              Recuerde descargar el documento PDF para adjuntarlo a su correo.
            </span>
            <button
              type="button"
              onClick={onDownloadPdf}
              className="px-2.5 py-1 bg-blue-700 text-white rounded text-[11px] font-bold hover:bg-blue-800 transition-colors shrink-0"
            >
              Descargar PDF
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 bg-stone-50 border-t border-stone-200">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyMessage}
              className="px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copiado al portapapeles
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar Mensaje
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              Enviar por WhatsApp
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handleMailto}
              className="px-4 py-2 text-xs font-bold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Abrir en Correo (Mailto)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
