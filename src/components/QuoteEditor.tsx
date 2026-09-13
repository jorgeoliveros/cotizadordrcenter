import React from 'react';
import {
  Plus,
  Trash2,
  Users,
  Percent,
  Receipt,
  FileCheck,
  UserCheck,
  Building2,
  Calendar,
  Layers,
  HelpCircle,
  Hash,
  FileText,
  Phone,
  Mail,
  MapPin,
  Stamp,
  Move,
  AlignCenter,
  Columns,
  Upload,
  Sparkles,
} from 'lucide-react';
import { Quote, QuoteItem, QuoteNote } from '../types';
import { formatCurrency } from '../utils/formatters';

interface QuoteEditorProps {
  quote: Quote;
  onChangeQuote: (quote: Quote) => void;
  onOpenClientsModal: () => void;
  onOpenSignatureModal: (tab?: 'draw' | 'upload-sig' | 'stamp' | 'position') => void;
  onOpenBrandModal: () => void;
}

export const QuoteEditor: React.FC<QuoteEditorProps> = ({
  quote,
  onChangeQuote,
  onOpenClientsModal,
  onOpenSignatureModal,
  onOpenBrandModal,
}) => {
  // Handlers for company info
  const handleCompanyChange = (field: string, val: string) => {
    onChangeQuote({
      ...quote,
      company: { ...quote.company, [field]: val },
    });
  };

  // Handlers for client info
  const handleClientChange = (field: string, val: string) => {
    onChangeQuote({
      ...quote,
      client: { ...quote.client, [field]: val },
    });
  };

  // Handlers for items
  const handleItemChange = (index: number, updatedFields: Partial<QuoteItem>) => {
    const newItems = [...quote.items];
    const currentItem = newItems[index];
    const merged = { ...currentItem, ...updatedFields };

    // If unitPrice or quantity changed and NOT in manual total override
    if (!merged.isPriceManual) {
      merged.total = (merged.quantity || 1) * (merged.unitPrice || 0);
    }

    newItems[index] = merged;
    onChangeQuote({ ...quote, items: newItems });
  };

  const handleAddItem = () => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}`,
      quantity: 1,
      title: 'Nuevo Procedimiento o Servicio',
      subtitle: '',
      unitPrice: 50000,
      total: 50000,
      isPriceManual: false,
    };
    onChangeQuote({
      ...quote,
      items: [...quote.items, newItem],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (quote.items.length <= 1) return;
    const newItems = quote.items.filter((_, i) => i !== index);
    onChangeQuote({ ...quote, items: newItems });
  };

  // Handlers for notes
  const handleNoteChange = (index: number, text: string) => {
    const newNotes = [...quote.notes];
    newNotes[index] = { ...newNotes[index], text };
    onChangeQuote({ ...quote, notes: newNotes });
  };

  const handleAddNote = () => {
    const newNote: QuoteNote = {
      id: `note-${Date.now()}`,
      text: 'Nueva condición o nota específica para el cliente.',
    };
    onChangeQuote({
      ...quote,
      notes: [...quote.notes, newNote],
    });
  };

  const handleRemoveNote = (index: number) => {
    const newNotes = quote.notes.filter((_, i) => i !== index);
    onChangeQuote({ ...quote, notes: newNotes });
  };

  return (
    <div className="space-y-6 text-stone-800">
      {/* 1. Datos Generales de Cotización y Receptor */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-stone-600" />
            Datos de la Cotización & Cliente
          </h3>
          <button
            type="button"
            onClick={onOpenClientsModal}
            className="px-2.5 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg flex items-center gap-1.5 transition-colors border border-stone-200"
          >
            <Users className="w-3.5 h-3.5 text-stone-600" />
            Seleccionar de Clientes Frecuentes
          </button>
        </div>

        {/* Parámetros de la Cotización: Nº Cotización, Válido hasta, Título y Fecha */}
        <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/60 space-y-3 text-xs">
          <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-stone-500" />
            Identificación y Vigencia del Documento
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nº Cotización */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-stone-700 font-semibold flex items-center gap-1">
                  <Hash className="w-3 h-3 text-stone-500" />
                  Nº de Cotización
                </label>
                <label className="inline-flex items-center gap-1 text-[11px] text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quote.showQuoteNumber !== false}
                    onChange={(e) =>
                      onChangeQuote({ ...quote, showQuoteNumber: e.target.checked })
                    }
                    className="w-3.5 h-3.5 rounded border-stone-300 text-stone-900 focus:ring-stone-500 cursor-pointer"
                  />
                  <span>Mostrar</span>
                </label>
              </div>
              <input
                type="text"
                value={quote.quoteNumber || ''}
                onChange={(e) =>
                  onChangeQuote({ ...quote, quoteNumber: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-medium"
                placeholder="COT-2026-001"
              />
            </div>

            {/* Válido hasta */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-stone-700 font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-500" />
                  Válido hasta
                </label>
                <label className="inline-flex items-center gap-1 text-[11px] text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quote.showValidUntil !== false}
                    onChange={(e) =>
                      onChangeQuote({ ...quote, showValidUntil: e.target.checked })
                    }
                    className="w-3.5 h-3.5 rounded border-stone-300 text-stone-900 focus:ring-stone-500 cursor-pointer"
                  />
                  <span>Mostrar</span>
                </label>
              </div>
              <input
                type="text"
                value={quote.validUntilDate || ''}
                onChange={(e) =>
                  onChangeQuote({ ...quote, validUntilDate: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-medium"
                placeholder="18 Mar, 2026"
              />
            </div>

            {/* Título de Cotización */}
            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Título del Documento
              </label>
              <input
                type="text"
                value={quote.title || ''}
                onChange={(e) =>
                  onChangeQuote({ ...quote, title: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-medium"
                placeholder="COTIZACIÓN"
              />
            </div>

            {/* Fecha de Emisión */}
            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Fecha de Emisión
              </label>
              <input
                type="text"
                value={quote.date}
                onChange={(e) => onChangeQuote({ ...quote, date: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-medium"
                placeholder="18 Feb, 2026"
              />
            </div>
          </div>
        </div>

        {/* Datos del Cliente */}
        <div>
          <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-stone-500" />
            Datos del Cliente
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Nombre del Cliente
              </label>
              <input
                type="text"
                value={quote.client.name}
                onChange={(e) => handleClientChange('name', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50/40 focus:bg-white text-xs font-medium"
                placeholder="Ej. Ericka Sanchez Segura"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={quote.client.email}
                onChange={(e) => handleClientChange('email', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50/40 focus:bg-white text-xs"
                placeholder="sanchez.ericka33@gmail.com"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Teléfono / WhatsApp
              </label>
              <input
                type="text"
                value={quote.client.phone || ''}
                onChange={(e) => handleClientChange('phone', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50/40 focus:bg-white text-xs"
                placeholder="+(506) 8834-1920"
              />
            </div>

            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Cédula / Identificación Tributaria
              </label>
              <input
                type="text"
                value={quote.client.taxId || ''}
                onChange={(e) => handleClientChange('taxId', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50/40 focus:bg-white text-xs"
                placeholder="1-1452-0891"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Partidas y Ajuste Manual de Precios */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-stone-600" />
              Partidas & Ajuste Manual de Precios
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Modifique cantidad, descripción, precio unitario o active el ajuste manual del total por partida.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="px-2.5 py-1 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 flex items-center gap-1 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Partida
          </button>
        </div>

        {/* Item Rows */}
        <div className="space-y-3">
          {quote.items.map((item, idx) => (
            <div
              key={item.id}
              className="p-3.5 bg-stone-50/80 rounded-xl border border-stone-200/90 space-y-3 transition-all hover:border-stone-300"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase">
                  Partida #{idx + 1}
                </span>
                {quote.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                    title="Eliminar partida"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Title and subtitle description */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-stone-600 font-medium mb-0.5">
                    Descripción Principal
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handleItemChange(idx, { title: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 bg-white font-medium"
                    placeholder="Ej. PRP (con microagujas e infiltración)"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-600 font-medium mb-0.5">
                    Subtítulo / Sesiones / Detalle
                  </label>
                  <input
                    type="text"
                    value={item.subtitle || ''}
                    onChange={(e) =>
                      handleItemChange(idx, { subtitle: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 bg-white"
                    placeholder="Ej. Sesiones Requeridas: 6"
                  />
                </div>
              </div>

              {/* Quantity, Unit price, Manual Price Override Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end pt-1">
                <div>
                  <label className="block text-[11px] text-stone-600 font-medium mb-0.5">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(idx, {
                        quantity: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-stone-600 font-medium mb-0.5">
                    Precio Unitario ({quote.currency.symbol})
                  </label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(idx, {
                        unitPrice: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 bg-white"
                  />
                </div>

                {/* Manual Price Override checkbox */}
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] text-stone-700 font-medium mb-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!item.isPriceManual}
                      onChange={(e) =>
                        handleItemChange(idx, {
                          isPriceManual: e.target.checked,
                          total: e.target.checked
                            ? item.total
                            : item.quantity * item.unitPrice,
                        })
                      }
                      className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                    />
                    Ajuste Manual de Total
                  </label>
                  {item.isPriceManual ? (
                    <input
                      type="number"
                      value={item.total}
                      onChange={(e) =>
                        handleItemChange(idx, {
                          total: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-amber-400 bg-amber-50/50 font-bold text-amber-900"
                      title="Monto total manual para esta partida"
                    />
                  ) : (
                    <div className="py-1.5 px-2 text-xs font-semibold text-stone-800 bg-stone-100 rounded border border-stone-200">
                      {formatCurrency(item.quantity * item.unitPrice, quote.currency)}
                    </div>
                  )}
                </div>

                <div className="text-right pb-1">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                    Total Partida
                  </span>
                  <span className="text-sm font-bold text-stone-900">
                    {formatCurrency(
                      item.isPriceManual ? item.total : item.quantity * item.unitPrice,
                      quote.currency
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Descuentos, IVA 13% y Moneda */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-3 border-b border-stone-100">
          <Percent className="w-4 h-4 text-stone-600" />
          Descuentos & Opción de IVA (13%)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Discount Toggle */}
          <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-stone-800 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={quote.applyDiscount}
                  onChange={(e) =>
                    onChangeQuote({ ...quote, applyDiscount: e.target.checked })
                  }
                  className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                />
                Aplicar Descuento
              </label>
              {quote.applyDiscount && (
                <span className="text-xs font-bold text-amber-800">
                  {quote.discountPercentage}% OFF
                </span>
              )}
            </div>

            {quote.applyDiscount && (
              <div className="pt-2">
                <label className="block text-[11px] text-stone-600 mb-1">
                  Porcentaje de Descuento (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={quote.discountPercentage}
                  onChange={(e) =>
                    onChangeQuote({
                      ...quote,
                      discountPercentage: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 bg-white"
                  placeholder="20"
                />
              </div>
            )}
          </div>

          {/* IVA 13% Selection Field - Simple checkbox without visual note */}
          <div className="p-3.5 rounded-lg border bg-stone-50 border-stone-200 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-stone-900 flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={quote.includeIva}
                  onChange={(e) =>
                    onChangeQuote({ ...quote, includeIva: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500 cursor-pointer"
                />
                <span>Incluir IVA ({quote.ivaRate}%)</span>
              </label>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  quote.includeIva
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {quote.includeIva ? 'Sí' : 'No'}
              </span>
            </div>
            <span className="text-[11px] text-stone-500">
              Campo de selección: mostrar o no el cálculo del IVA en el total.
            </span>
          </div>
        </div>

        {/* Estilo de Fondo de la Cotización (Minimalista, Moderno, Profesional) */}
        <div className="pt-2 border-t border-stone-100">
          <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-2">
            Estilo de Fondo (según paleta del logo)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                id: 'minimalist',
                name: 'Minimalista',
                desc: 'Limpio y sobrio',
              },
              {
                id: 'modern',
                name: 'Moderno',
                desc: 'Gradiente y acentos',
              },
              {
                id: 'professional',
                name: 'Profesional',
                desc: 'Marco ejecutivo formal',
              },
            ].map((st) => {
              const active = (quote.brand.backgroundTheme || 'minimalist') === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() =>
                    onChangeQuote({
                      ...quote,
                      brand: {
                        ...quote.brand,
                        backgroundTheme: st.id as any,
                      },
                    })
                  }
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    active
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 hover:bg-white text-stone-700 border-stone-200'
                  }`}
                >
                  <div className="text-xs font-bold">{st.name}</div>
                  <div
                    className={`text-[10px] mt-0.5 leading-tight ${
                      active ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {st.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Currency Selector */}
        <div className="pt-2 flex items-center justify-between text-xs">
          <span className="text-stone-600 font-medium">Símbolo de Moneda:</span>
          <div className="flex gap-2">
            {[
              { label: '¢ Colones (CRC)', sym: '¢', code: 'CRC', dec: 0 },
              { label: '$ Dólares (USD)', sym: '$', code: 'USD', dec: 2 },
              { label: '€ Euros (EUR)', sym: '€', code: 'EUR', dec: 2 },
            ].map((cur) => (
              <button
                key={cur.code}
                type="button"
                onClick={() =>
                  onChangeQuote({
                    ...quote,
                    currency: {
                      ...quote.currency,
                      symbol: cur.sym,
                      code: cur.code,
                      decimals: cur.dec,
                    },
                  })
                }
                className={`px-2.5 py-1 rounded text-xs border ${
                  quote.currency.code === cur.code
                    ? 'bg-stone-900 text-white border-stone-900 font-bold'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {cur.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Notas aclaratorias y Condiciones específicas */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-stone-600" />
              Notas Aclaratorias & Condiciones Específicas
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Términos de pago, vigencia, condiciones de facturación y descuentos.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddNote}
            className="px-2.5 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg flex items-center gap-1 transition-colors border border-stone-200"
          >
            <Plus className="w-3.5 h-3.5" />
            Añadir Nota
          </button>
        </div>

        <div className="space-y-2">
          {quote.notes.map((note, idx) => (
            <div key={note.id} className="flex items-start gap-2">
              <span className="text-xs font-bold text-stone-400 mt-2 shrink-0">
                •
              </span>
              <input
                type="text"
                value={note.text}
                onChange={(e) => handleNoteChange(idx, e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-stone-50/40 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => handleRemoveNote(idx)}
                className="text-stone-400 hover:text-red-600 p-1.5 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Emisor & Acceso a Firma y Marca */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-stone-600" />
            Datos del Emisor & Accesos Rápidos
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onOpenBrandModal}
              className="px-2.5 py-1 text-xs font-semibold bg-amber-50 text-amber-900 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
            >
              Logo & Diseño
            </button>
            <button
              type="button"
              onClick={onOpenSignatureModal}
              className="px-2.5 py-1 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors"
            >
              Firma & Sello
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-stone-600 font-medium mb-1">
              Nombre Profesional / Empresa
            </label>
            <input
              type="text"
              value={quote.company.name}
              onChange={(e) => handleCompanyChange('name', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50/40 focus:bg-white text-xs font-semibold"
              placeholder="Dra. Laura M. Oliveros Valencia"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1">
              Especialidad / Título
            </label>
            <input
              type="text"
              value={quote.company.specialty}
              onChange={(e) => handleCompanyChange('specialty', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50/40 focus:bg-white text-xs"
              placeholder="Dermatología Clínica y Estética"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1">
              Cédula Jurídica / Física / ID
            </label>
            <input
              type="text"
              value={quote.company.taxId}
              onChange={(e) => handleCompanyChange('taxId', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50/40 focus:bg-white text-xs"
              placeholder="Cedula 801100379"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-stone-500" />
              Teléfono del Emisor
            </label>
            <input
              type="text"
              value={quote.company.phone || ''}
              onChange={(e) => handleCompanyChange('phone', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50/40 focus:bg-white text-xs font-medium"
              placeholder="+(506) 7261-4743"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-stone-500" />
              Correo Electrónico del Emisor
            </label>
            <input
              type="email"
              value={quote.company.email || ''}
              onChange={(e) => handleCompanyChange('email', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50/40 focus:bg-white text-xs"
              placeholder="info@vitapielcr.com"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-500" />
              Ubicación / Dirección Principal
            </label>
            <input
              type="text"
              value={quote.company.addressLine1 || ''}
              onChange={(e) => handleCompanyChange('addressLine1', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50/40 focus:bg-white text-xs"
              placeholder="Calle 12 Av 16 Heredia."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-stone-600 font-medium mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-stone-500" />
                Dirección Línea 2 / Detalles de Ubicación (Piso, Edificio, Señas)
              </span>
              <span className="text-[10px] text-stone-400 font-normal">
                Opcional
              </span>
            </label>
            <input
              type="text"
              value={quote.company.addressLine2 || ''}
              onChange={(e) => handleCompanyChange('addressLine2', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50/40 focus:bg-white text-xs"
              placeholder="Oficentro Valar, Segundo Piso"
            />
          </div>
        </div>
      </div>

      {/* 6. Firma, Sello Oficial & Ubicación */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
            <Stamp className="w-4 h-4 text-stone-600" />
            Firma, Sello & Ubicación
          </h3>
          <button
            type="button"
            onClick={() => onOpenSignatureModal('position')}
            className="px-2.5 py-1 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Move className="w-3 h-3" />
            Ajustar en Ventana
          </button>
        </div>

        {/* Layout selection */}
        <div>
          <label className="block text-stone-600 font-medium text-xs mb-1.5">
            Ubicación en el pie de página:
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'center', label: 'Centrado', icon: AlignCenter },
              { id: 'split', label: 'Estándar', icon: Columns },
              { id: 'free', label: 'Libre', icon: Move },
            ].map((mode) => {
              const Icon = mode.icon;
              const isSelected = (quote.signee.layoutMode || 'split') === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() =>
                    onChangeQuote({
                      ...quote,
                      signee: {
                        ...quote.signee,
                        layoutMode: mode.id as any,
                      },
                    })
                  }
                  className={`py-2 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isSelected
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sello selection */}
        <div>
          <label className="block text-stone-600 font-medium text-xs mb-1.5">
            Selección de Sello Oficial:
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                if (quote.signee.customStampImage) {
                  onChangeQuote({
                    ...quote,
                    signee: {
                      ...quote.signee,
                      stampType: 'custom',
                      stampImage: quote.signee.customStampImage,
                      useGeneratedStamp: false,
                      showStamp: true,
                    },
                  });
                } else {
                  onOpenSignatureModal('stamp');
                }
              }}
              className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-colors ${
                quote.signee.stampType === 'custom' || (!quote.signee.useGeneratedStamp && quote.signee.customStampImage)
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              {quote.signee.customStampImage ? 'Personalizado' : '+ Subir Sello'}
            </button>
            <button
              type="button"
              onClick={() =>
                onChangeQuote({
                  ...quote,
                  signee: {
                    ...quote.signee,
                    stampType: 'generated',
                    useGeneratedStamp: true,
                    showStamp: true,
                  },
                })
              }
              className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-colors ${
                quote.signee.stampType === 'generated' || quote.signee.useGeneratedStamp
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              Generado
            </button>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium">
            <input
              type="checkbox"
              checked={quote.signee.showSignature}
              onChange={(e) =>
                onChangeQuote({
                  ...quote,
                  signee: {
                    ...quote.signee,
                    showSignature: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 rounded border-stone-300 text-stone-900"
            />
            Mostrar Firma
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium">
            <input
              type="checkbox"
              checked={quote.signee.showStamp}
              onChange={(e) =>
                onChangeQuote({
                  ...quote,
                  signee: {
                    ...quote.signee,
                    showStamp: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 rounded border-stone-300 text-stone-900"
            />
            Mostrar Sello
          </label>
        </div>
      </div>
    </div>
  );
};
