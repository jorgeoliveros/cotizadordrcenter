import React, { useState } from 'react';
import { X, Upload, Palette, Type, Image as ImageIcon, Sparkles, RotateCcw } from 'lucide-react';
import { BrandSettings } from '../types';
import { DEFAULT_LOGO_SVG } from '../data/defaultData';

interface BrandCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandSettings;
  onUpdateBrand: (brand: BrandSettings) => void;
}

const COLOR_PRESETS = [
  {
    name: 'Vitapiel Dorado & Carbón',
    primary: '#1c1917',
    accent: '#92400e',
    headerText: '#0c0a09',
    paper: 'white' as const,
  },
  {
    name: 'Azul Zafiro Ejecutivo',
    primary: '#0f172a',
    accent: '#2563eb',
    headerText: '#0284c7',
    paper: 'white' as const,
  },
  {
    name: 'Verde Esmeralda Clínico',
    primary: '#064e3b',
    accent: '#059669',
    headerText: '#047857',
    paper: 'white' as const,
  },
  {
    name: 'Borgoña & Oro Rosa',
    primary: '#4c0519',
    accent: '#be123c',
    headerText: '#9f1239',
    paper: 'ivory' as const,
  },
  {
    name: 'Monocromo Minimalista',
    primary: '#18181b',
    accent: '#52525b',
    headerText: '#27272a',
    paper: 'white' as const,
  },
];

export const BrandCustomizerModal: React.FC<BrandCustomizerModalProps> = ({
  isOpen,
  onClose,
  brand,
  onUpdateBrand,
}) => {
  const [localBrand, setLocalBrand] = useState<BrandSettings>(brand);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const updated = {
          ...localBrand,
          logoUrl: result,
        };
        setLocalBrand(updated);
        onUpdateBrand(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    const updated = {
      ...localBrand,
      primaryColor: preset.primary,
      accentColor: preset.accent,
      headerTextColor: preset.headerText,
      paperBg: preset.paper,
    };
    setLocalBrand(updated);
    onUpdateBrand(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-700" />
            <h3 className="text-base font-bold text-stone-900">
              Personalización de Marca & Diseño
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Logo & High Resolution Scaling */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-stone-500" />
                Logotipo Corporativo (Alta Nitidez)
              </h4>
              <button
                type="button"
                onClick={() => {
                  const updated = { ...localBrand, logoUrl: DEFAULT_LOGO_SVG };
                  setLocalBrand(updated);
                  onUpdateBrand(updated);
                }}
                className="text-[11px] text-amber-800 hover:text-amber-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Restablecer logo Vitapiel
              </button>
            </div>

            {/* Logo Preview & Upload */}
            <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="w-40 h-24 bg-white border border-stone-200 rounded flex items-center justify-center p-2 overflow-hidden shrink-0">
                {localBrand.logoUrl ? (
                  <img
                    src={localBrand.logoUrl}
                    alt="Logo actual"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[11px] text-stone-400">Sin logo</span>
                )}
              </div>

              <div className="flex-1 space-y-2 w-full">
                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-medium cursor-pointer hover:bg-stone-800 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  Subir nuevo logo (PNG, JPG o SVG)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Para máxima nitidez en el PDF final, use imágenes de alta resolución o vectores SVG.
                </p>
              </div>
            </div>

            {/* Logo Size and Alignment Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex justify-between text-xs text-stone-600 mb-1">
                  <span>Tamaño del logo:</span>
                  <span className="font-semibold text-stone-900">
                    {localBrand.logoWidth} px
                  </span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="320"
                  step="10"
                  value={localBrand.logoWidth}
                  onChange={(e) => {
                    const updated = {
                      ...localBrand,
                      logoWidth: Number(e.target.value),
                    };
                    setLocalBrand(updated);
                    onUpdateBrand(updated);
                  }}
                  className="w-full accent-stone-900"
                />
                <span className="text-[10px] text-stone-400">
                  Ajuste libre para logos grandes sin perder proporción
                </span>
              </div>

              <div>
                <label className="block text-xs text-stone-600 mb-1">
                  Alineación en encabezado:
                </label>
                <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-lg text-xs">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => {
                        const updated = { ...localBrand, logoAlignment: align };
                        setLocalBrand(updated);
                        onUpdateBrand(updated);
                      }}
                      className={`py-1 rounded font-medium capitalize ${
                        localBrand.logoAlignment === align
                          ? 'bg-white shadow-xs text-stone-900 font-bold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {align === 'left' ? 'Izquierda' : align === 'center' ? 'Centro' : 'Derecha'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Typography Selection */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-stone-500" />
              Tipografía Personalizada
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-600 mb-1">
                  Fuente de Títulos y Encabezados:
                </label>
                <select
                  value={localBrand.fontHeading}
                  onChange={(e) => {
                    const updated = {
                      ...localBrand,
                      fontHeading: e.target.value as any,
                    };
                    setLocalBrand(updated);
                    onUpdateBrand(updated);
                  }}
                  className="w-full text-xs rounded border border-stone-300 p-2 bg-white font-medium"
                >
                  <option value="Cormorant Garamond">Cormorant Garamond (Editorial / Lujo)</option>
                  <option value="Cinzel">Cinzel (Clásico Romano / Joyería)</option>
                  <option value="Playfair Display">Playfair Display (Elegante Atemporal)</option>
                  <option value="Montserrat">Montserrat (Moderno Ejecutivo)</option>
                  <option value="Outfit">Outfit (Minimalista Vanguardista)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Tecnológico / Neutro)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-stone-600 mb-1">
                  Fuente del Cuerpo y Tablas:
                </label>
                <select
                  value={localBrand.fontBody}
                  onChange={(e) => {
                    const updated = {
                      ...localBrand,
                      fontBody: e.target.value as any,
                    };
                    setLocalBrand(updated);
                    onUpdateBrand(updated);
                  }}
                  className="w-full text-xs rounded border border-stone-300 p-2 bg-white font-medium"
                >
                  <option value="Montserrat">Montserrat (Altamente Legible)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Ultra Limpio)</option>
                  <option value="Outfit">Outfit (Geométrico Suave)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Color Palette Presets & Custom */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-stone-500" />
                Paleta de Colores de Marca
              </h4>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-2.5 rounded-lg border border-stone-200 hover:border-stone-400 bg-stone-50 hover:bg-white text-left transition-all flex items-center justify-between"
                >
                  <span className="text-xs font-medium text-stone-800">
                    {preset.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Pickers */}
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-stone-600 mb-1">
                  Color Primario
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localBrand.primaryColor}
                    onChange={(e) => {
                      const updated = {
                        ...localBrand,
                        primaryColor: e.target.value,
                      };
                      setLocalBrand(updated);
                      onUpdateBrand(updated);
                    }}
                    className="w-7 h-7 rounded border border-stone-300 cursor-pointer p-0"
                  />
                  <span className="text-[11px] font-mono text-stone-700 uppercase">
                    {localBrand.primaryColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">
                  Color Acento
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={localBrand.accentColor}
                    onChange={(e) => {
                      const updated = {
                        ...localBrand,
                        accentColor: e.target.value,
                      };
                      setLocalBrand(updated);
                      onUpdateBrand(updated);
                    }}
                    className="w-7 h-7 rounded border border-stone-300 cursor-pointer p-0"
                  />
                  <span className="text-[11px] font-mono text-stone-700 uppercase">
                    {localBrand.accentColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-stone-600 mb-1">
                  Tono del Papel
                </label>
                <select
                  value={localBrand.paperBg}
                  onChange={(e) => {
                    const updated = {
                      ...localBrand,
                      paperBg: e.target.value as any,
                    };
                    setLocalBrand(updated);
                    onUpdateBrand(updated);
                  }}
                  className="w-full text-xs rounded border border-stone-300 p-1.5 bg-white"
                >
                  <option value="white">Blanco Nítido</option>
                  <option value="ivory">Marfil Suave</option>
                  <option value="warm-stone">Piedra Cálida</option>
                  <option value="slate-tint">Pizarra Sutil</option>
                </select>
              </div>
            </div>

            {/* Background Theme: Minimalista, Moderno, Profesional */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Estilo de Fondo de la Hoja (acorde a los colores del logo):
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'minimalist',
                    title: 'Minimalista',
                    desc: 'Limpio, sobrio y con alto espacio en blanco.',
                  },
                  {
                    id: 'modern',
                    title: 'Moderno',
                    desc: 'Gradiente suave y acentos basados en la paleta del logo.',
                  },
                  {
                    id: 'professional',
                    title: 'Profesional',
                    desc: 'Encabezado corporativo en degradado y tabla ejecutiva.',
                  },
                ].map((st) => {
                  const isSelected = (localBrand.backgroundTheme || 'minimalist') === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...localBrand,
                          backgroundTheme: st.id as any,
                        };
                        setLocalBrand(updated);
                        onUpdateBrand(updated);
                      }}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-400 text-stone-800'
                      }`}
                    >
                      <div className="text-xs font-bold">{st.title}</div>
                      <div
                        className={`text-[10px] mt-1 leading-normal ${
                          isSelected ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        {st.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 px-6 py-3 bg-stone-50 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
