import React, { useRef, useState, useEffect } from 'react';
import {
  X,
  PenTool,
  Upload,
  Stamp,
  Check,
  Trash2,
  Move,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Columns,
  RotateCw,
  ZoomIn,
  RefreshCw,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { SigneeInfo, StampType, SignatureLayoutMode, StampPositionMode } from '../types';
import { DEFAULT_SIGNATURE_SVG } from '../data/defaultData';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  signee: SigneeInfo;
  onUpdateSignee: (signee: SigneeInfo) => void;
  initialTab?: 'draw' | 'upload-sig' | 'stamp' | 'position';
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  signee,
  onUpdateSignee,
  initialTab = 'stamp',
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'upload-sig' | 'stamp' | 'position'>(initialTab);
  const [localSignee, setLocalSignee] = useState<SigneeInfo>(signee);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const isCustom = signee.stampType === 'custom' || (!signee.useGeneratedStamp && !!signee.customStampImage);
    setLocalSignee({
      ...signee,
      stampType: isCustom ? 'custom' : 'generated',
      useGeneratedStamp: !isCustom,
      layoutMode: signee.layoutMode || 'split',
      stampPosition: signee.stampPosition || 'beside-right',
      signatureOffsetX: signee.signatureOffsetX ?? 0,
      signatureOffsetY: signee.signatureOffsetY ?? 0,
      stampOffsetX: signee.stampOffsetX ?? 0,
      stampOffsetY: signee.stampOffsetY ?? 0,
      stampRotation: signee.stampRotation ?? 2,
      stampScale: signee.stampScale ?? 1,
    });
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [signee, isOpen, initialTab]);

  // Setup canvas
  useEffect(() => {
    if (isOpen && activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const saveDrawnSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureDataUrl = canvas.toDataURL('image/png');
    const updated: SigneeInfo = {
      ...localSignee,
      signatureImage: signatureDataUrl,
      showSignature: true,
    };
    setLocalSignee(updated);
    onUpdateSignee(updated);
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const updated: SigneeInfo = {
          ...localSignee,
          signatureImage: result,
          showSignature: true,
        };
        setLocalSignee(updated);
        onUpdateSignee(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  // Stamp selection handlers
  const handleSelectCustomStamp = () => {
    if (!localSignee.customStampImage) return;
    const updated: SigneeInfo = {
      ...localSignee,
      stampType: 'custom',
      stampImage: localSignee.customStampImage,
      showStamp: true,
      useGeneratedStamp: false,
    };
    setLocalSignee(updated);
    onUpdateSignee(updated);
  };

  const handleSelectGeneratedStamp = () => {
    const updated: SigneeInfo = {
      ...localSignee,
      stampType: 'generated',
      useGeneratedStamp: true,
      showStamp: true,
    };
    setLocalSignee(updated);
    onUpdateSignee(updated);
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const updated: SigneeInfo = {
          ...localSignee,
          customStampImage: result,
          stampImage: result,
          stampType: 'custom',
          showStamp: true,
          useGeneratedStamp: false,
        };
        setLocalSignee(updated);
        onUpdateSignee(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCustomStamp = () => {
    const updated: SigneeInfo = {
      ...localSignee,
      customStampImage: undefined,
      stampImage: undefined,
      stampType: 'generated',
      useGeneratedStamp: true,
    };
    setLocalSignee(updated);
    onUpdateSignee(updated);
  };

  // Layout handlers
  const handleSetLayoutMode = (mode: SignatureLayoutMode) => {
    const updated: SigneeInfo = {
      ...localSignee,
      layoutMode: mode,
    };
    setLocalSignee(updated);
    onUpdateSignee(updated);
  };

  const handleResetPositions = () => {
    const updated: SigneeInfo = {
      ...localSignee,
      signatureOffsetX: 0,
      signatureOffsetY: 0,
      stampOffsetX: 0,
      stampOffsetY: 0,
      stampRotation: 2,
      stampScale: 1,
    };
    setLocalSignee(updated);
    onUpdateSignee(updated);
  };

  const handleSaveAndClose = () => {
    onUpdateSignee(localSignee);
    onClose();
  };

  const currentStampType: 'custom' | 'generated' =
    localSignee.stampType === 'custom' || (!localSignee.useGeneratedStamp && !!localSignee.customStampImage)
      ? 'custom'
      : 'generated';

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-stone-900 text-white rounded-lg">
              <Stamp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-tight">
                Firma, Sello & Ubicación
              </h3>
              <p className="text-[11px] text-stone-500">
                Personaliza la firma, escoge tu sello y ajusta su posición libremente.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 px-4 sm:px-6 pt-2 bg-stone-50/50 gap-2 sm:gap-4 text-xs font-semibold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('stamp')}
            className={`pb-2.5 px-1 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'stamp'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Stamp className="w-3.5 h-3.5" />
            Sello Profesional
          </button>
          <button
            onClick={() => setActiveTab('position')}
            className={`pb-2.5 px-1 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'position'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            Ubicación & Alineación
          </button>
          <button
            onClick={() => setActiveTab('draw')}
            className={`pb-2.5 px-1 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'draw'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            Dibujar Firma
          </button>
          <button
            onClick={() => setActiveTab('upload-sig')}
            className={`pb-2.5 px-1 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'upload-sig'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Subir Firma
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* ========================================================================= */}
          {/* TAB 1: SELLO PROFESIONAL                                                  */}
          {/* ========================================================================= */}
          {activeTab === 'stamp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <label className="text-xs font-bold text-stone-900 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSignee.showStamp}
                    onChange={(e) => {
                      const updated = { ...localSignee, showStamp: e.target.checked };
                      setLocalSignee(updated);
                      onUpdateSignee(updated);
                    }}
                    className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500 cursor-pointer"
                  />
                  Mostrar sello oficial en el documento
                </label>
                <span className="text-[11px] text-stone-500">
                  {localSignee.showStamp ? 'Visible en cotización' : 'Oculto'}
                </span>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Selector de Sello:</strong> Puedes elegir entre subir tu propio sello personalizado (imagen) o generar un sello digital editable con tus datos profesionales.
                </p>
              </div>

              {/* Selector de opciones de sello */}
              <div className="space-y-3">
                {/* 1. MI IMAGEN DE SELLO PERSONALIZADO */}
                <div
                  className={`p-3.5 rounded-xl border-2 transition-all ${
                    currentStampType === 'custom'
                      ? 'border-stone-900 bg-stone-50/60 shadow-xs'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      onClick={() => {
                        if (localSignee.customStampImage) {
                          handleSelectCustomStamp();
                        }
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        currentStampType === 'custom'
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-300'
                      }`}>
                        {currentStampType === 'custom' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-xs font-bold text-stone-900">
                        Mi Sello Personalizado (Imagen propia)
                      </span>
                    </div>

                    {currentStampType === 'custom' ? (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Activo
                      </span>
                    ) : localSignee.customStampImage ? (
                      <button
                        type="button"
                        onClick={handleSelectCustomStamp}
                        className="text-[11px] font-semibold text-stone-700 hover:text-stone-900 underline"
                      >
                        Activar este sello
                      </button>
                    ) : null}
                  </div>

                  <p className="text-[11px] text-stone-600 mb-2.5">
                    Sube una foto o escaneo de tu sello físico (formato PNG con fondo transparente o JPG claro).
                  </p>

                  {localSignee.customStampImage ? (
                    <div className="space-y-2.5">
                      <div className="bg-white border border-stone-200 rounded-lg p-2 flex items-center justify-center h-20 max-w-xs mx-auto relative group">
                        <img
                          src={localSignee.customStampImage}
                          alt="Sello personalizado"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="text-[11px] font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md cursor-pointer transition-colors border border-stone-200 flex items-center gap-1">
                          <Upload className="w-3 h-3 text-stone-600" />
                          Cambiar imagen...
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleStampUpload}
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={handleRemoveCustomStamp}
                          className="text-[11px] text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Eliminar mi imagen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-stone-300 hover:border-stone-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-stone-50/50 hover:bg-stone-100/50 transition-colors">
                      <Upload className="w-6 h-6 text-stone-400 mb-1" />
                      <span className="text-xs font-semibold text-stone-800">
                        Hacer clic para subir imagen de tu sello
                      </span>
                      <span className="text-[10px] text-stone-500 mt-0.5">
                        PNG, JPG o SVG (fondo transparente recomendado)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleStampUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* 2. SELLO DIGITAL GENERADO CON DATOS */}
                <div
                  className={`p-3.5 rounded-xl border-2 transition-all ${
                    currentStampType === 'generated'
                      ? 'border-stone-900 bg-stone-50/60 shadow-xs'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      onClick={handleSelectGeneratedStamp}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        currentStampType === 'generated'
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-300'
                      }`}>
                        {currentStampType === 'generated' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-xs font-bold text-stone-900">
                        Sello Digital con Datos Editables (Vector)
                      </span>
                    </div>

                    {currentStampType === 'generated' ? (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Activo
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSelectGeneratedStamp}
                        className="text-[11px] font-semibold text-stone-700 hover:text-stone-900 underline"
                      >
                        Activar este sello
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-stone-600 mb-2.5">
                    Genera una estampa rectangular médica dinámica con los datos que ingreses abajo.
                  </p>

                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-600 mb-0.5">
                        Nombre en el Sello
                      </label>
                      <input
                        type="text"
                        value={localSignee.stampDetails.title}
                        onChange={(e) => {
                          const updated = {
                            ...localSignee,
                            stampDetails: { ...localSignee.stampDetails, title: e.target.value },
                          };
                          setLocalSignee(updated);
                          onUpdateSignee(updated);
                        }}
                        className="w-full px-2.5 py-1 text-xs rounded border border-stone-300 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-stone-600 mb-0.5">
                          Especialidad
                        </label>
                        <input
                          type="text"
                          value={localSignee.stampDetails.subtitle}
                          onChange={(e) => {
                            const updated = {
                              ...localSignee,
                              stampDetails: { ...localSignee.stampDetails, subtitle: e.target.value },
                            };
                            setLocalSignee(updated);
                            onUpdateSignee(updated);
                          }}
                          className="w-full px-2.5 py-1 text-xs rounded border border-stone-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold uppercase text-stone-600 mb-0.5">
                          Código / Carné
                        </label>
                        <input
                          type="text"
                          value={localSignee.stampDetails.code}
                          onChange={(e) => {
                            const updated = {
                              ...localSignee,
                              stampDetails: { ...localSignee.stampDetails, code: e.target.value },
                            };
                            setLocalSignee(updated);
                            onUpdateSignee(updated);
                          }}
                          className="w-full px-2.5 py-1 text-xs rounded border border-stone-300 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-600 mb-0.5">
                        Texto Adicional
                      </label>
                      <input
                        type="text"
                        value={localSignee.stampDetails.extraText}
                        onChange={(e) => {
                          const updated = {
                            ...localSignee,
                            stampDetails: { ...localSignee.stampDetails, extraText: e.target.value },
                          };
                          setLocalSignee(updated);
                          onUpdateSignee(updated);
                        }}
                        className="w-full px-2.5 py-1 text-xs rounded border border-stone-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase text-stone-600 mb-1">
                        Color de Tinta
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: 'Azul', val: '#1e3a8a' },
                          { label: 'Grafito', val: '#475569' },
                          { label: 'Verde', val: '#047857' },
                          { label: 'Borgoña', val: '#881337' },
                        ].map((c) => (
                          <button
                            key={c.val}
                            type="button"
                            onClick={() => {
                              const updated = {
                                ...localSignee,
                                stampDetails: { ...localSignee.stampDetails, color: c.val },
                              };
                              setLocalSignee(updated);
                              onUpdateSignee(updated);
                            }}
                            className={`px-2 py-0.5 text-xs rounded border flex items-center gap-1.5 ${
                              localSignee.stampDetails.color === c.val
                                ? 'border-stone-900 font-bold bg-stone-100'
                                : 'border-stone-200'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.val }} />
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: UBICACIÓN & ALINEACIÓN (CENTRADO, DISTRIBUIDO, LIBRE)               */}
          {/* ========================================================================= */}
          {activeTab === 'position' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-1">
                  Alineación y Ubicación en el Documento
                </h4>
                <p className="text-xs text-stone-600">
                  Escoge cómo deseas que se distribuyan la firma y el sello al pie de la cotización:
                </p>
              </div>

              {/* Botones de Alineación Principal */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'center' as SignatureLayoutMode,
                    label: 'Centrado',
                    desc: 'Firma y sello centrados',
                    icon: AlignCenter,
                  },
                  {
                    id: 'split' as SignatureLayoutMode,
                    label: 'Estándar',
                    desc: 'Firma izq, Sello der',
                    icon: Columns,
                  },
                  {
                    id: 'left' as SignatureLayoutMode,
                    label: 'A la Izquierda',
                    desc: 'Todo a la izquierda',
                    icon: AlignLeft,
                  },
                  {
                    id: 'right' as SignatureLayoutMode,
                    label: 'A la Derecha',
                    desc: 'Todo a la derecha',
                    icon: AlignRight,
                  },
                  {
                    id: 'free' as SignatureLayoutMode,
                    label: 'Ubicación Libre',
                    desc: 'Sin límites de posición',
                    icon: Move,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = (localSignee.layoutMode || 'split') === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSetLayoutMode(item.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                      <span className={`text-[10px] block ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Posición Relativa del Sello */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Posición del Sello respecto a la Firma:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'beside-right' as StampPositionMode, label: 'Al lado derecho' },
                    { id: 'beside-left' as StampPositionMode, label: 'Al lado izquierdo' },
                    { id: 'overlap' as StampPositionMode, label: 'Superpuesto (Sobre la firma)' },
                  ].map((pos) => {
                    const isSelected = (localSignee.stampPosition || 'beside-right') === pos.id;
                    return (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => {
                          const updated = { ...localSignee, stampPosition: pos.id };
                          setLocalSignee(updated);
                          onUpdateSignee(updated);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 font-bold'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {pos.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ajustes de Desplazamiento Libre y Fino */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Move className="w-3.5 h-3.5 text-stone-600" />
                    Controles de Posición Libre (Offsets en px)
                  </span>
                  <button
                    type="button"
                    onClick={handleResetPositions}
                    className="text-[11px] text-stone-600 hover:text-stone-900 flex items-center gap-1 underline font-medium"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Restablecer posiciones
                  </button>
                </div>

                {/* Offset Firma */}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-stone-200">
                  <div>
                    <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                      <span>Firma Horiz. (X)</span>
                      <span className="font-semibold">{localSignee.signatureOffsetX ?? 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="-160"
                      max="160"
                      step="2"
                      value={localSignee.signatureOffsetX ?? 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        const updated = { ...localSignee, signatureOffsetX: val };
                        setLocalSignee(updated);
                        onUpdateSignee(updated);
                      }}
                      className="w-full accent-stone-900 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                      <span>Firma Vert. (Y)</span>
                      <span className="font-semibold">{localSignee.signatureOffsetY ?? 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="-60"
                      max="60"
                      step="2"
                      value={localSignee.signatureOffsetY ?? 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        const updated = { ...localSignee, signatureOffsetY: val };
                        setLocalSignee(updated);
                        onUpdateSignee(updated);
                      }}
                      className="w-full accent-stone-900 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Offset Sello */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                  <div>
                    <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                      <span>Sello Horiz. (X)</span>
                      <span className="font-semibold">{localSignee.stampOffsetX ?? 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      step="2"
                      value={localSignee.stampOffsetX ?? 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        const updated = { ...localSignee, stampOffsetX: val };
                        setLocalSignee(updated);
                        onUpdateSignee(updated);
                      }}
                      className="w-full accent-stone-900 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                      <span>Sello Vert. (Y)</span>
                      <span className="font-semibold">{localSignee.stampOffsetY ?? 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="2"
                      value={localSignee.stampOffsetY ?? 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        const updated = { ...localSignee, stampOffsetY: val };
                        setLocalSignee(updated);
                        onUpdateSignee(updated);
                      }}
                      className="w-full accent-stone-900 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Rotación y Escala Sello */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                  <div>
                    <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                      <span className="flex items-center gap-1">
                        <RotateCw className="w-3 h-3" />
                        Inclinación Sello
                      </span>
                      <span className="font-semibold">{localSignee.stampRotation ?? 2}°</span>
                    </div>
                    <input
                      type="range"
                      min="-15"
                      max="15"
                      step="1"
                      value={localSignee.stampRotation ?? 2}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        const updated = { ...localSignee, stampRotation: val };
                        setLocalSignee(updated);
                        onUpdateSignee(updated);
                      }}
                      className="w-full accent-stone-900 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                      <span className="flex items-center gap-1">
                        <ZoomIn className="w-3 h-3" />
                        Tamaño Sello
                      </span>
                      <span className="font-semibold">{Math.round((localSignee.stampScale ?? 1) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="1.4"
                      step="0.05"
                      value={localSignee.stampScale ?? 1}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        const updated = { ...localSignee, stampScale: val };
                        setLocalSignee(updated);
                        onUpdateSignee(updated);
                      }}
                      className="w-full accent-stone-900 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: DIBUJAR FIRMA                                                      */}
          {/* ========================================================================= */}
          {activeTab === 'draw' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  Firme con el mouse o con el dedo sobre el lienzo para estampar su rúbrica digital:
                </p>
                <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSignee.showSignature}
                    onChange={(e) => {
                      const updated = { ...localSignee, showSignature: e.target.checked };
                      setLocalSignee(updated);
                      onUpdateSignee(updated);
                    }}
                    className="w-3.5 h-3.5 rounded border-stone-300 text-stone-900"
                  />
                  Mostrar firma
                </label>
              </div>

              <div className="border border-stone-300 rounded-xl p-3 bg-stone-50/70 relative">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={150}
                  className="w-full h-36 bg-white rounded-lg border border-stone-200 cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <div className="flex justify-between items-center mt-2.5 px-1">
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Borrar lienzo
                  </button>
                  <button
                    type="button"
                    onClick={saveDrawnSignature}
                    disabled={!hasDrawn}
                    className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 disabled:opacity-40 transition-opacity flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Aplicar Firma Dibujada
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: SUBIR IMAGEN DE FIRMA                                              */}
          {/* ========================================================================= */}
          {activeTab === 'upload-sig' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  Suba una imagen nítida de su firma manuscrita:
                </p>
                <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSignee.showSignature}
                    onChange={(e) => {
                      const updated = { ...localSignee, showSignature: e.target.checked };
                      setLocalSignee(updated);
                      onUpdateSignee(updated);
                    }}
                    className="w-3.5 h-3.5 rounded border-stone-300 text-stone-900"
                  />
                  Mostrar firma
                </label>
              </div>

              <label className="border-2 border-dashed border-stone-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-stone-500 bg-stone-50 transition-colors">
                <Upload className="w-8 h-8 text-stone-400 mb-2" />
                <span className="text-xs font-semibold text-stone-800">
                  Haga clic para seleccionar archivo de firma
                </span>
                <span className="text-[11px] text-stone-500 mt-1">
                  PNG, JPG o SVG (fondo transparente recomendado)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="hidden"
                />
              </label>

              {localSignee.signatureImage && (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg">
                  <span className="text-[11px] text-stone-500 block mb-1">
                    Firma activa actualmente:
                  </span>
                  <div className="h-16 flex items-center justify-center bg-white rounded border border-stone-200 p-2">
                    <img
                      src={localSignee.signatureImage}
                      alt="Firma actual"
                      className="max-h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DATOS DEL FIRMANTE (Común al pie del modal) */}
          <div className="pt-3 border-t border-stone-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Datos del Firmante al pie de página:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] text-stone-500 font-medium">Nombre</label>
                <input
                  type="text"
                  value={localSignee.name}
                  onChange={(e) => {
                    const updated = { ...localSignee, name: e.target.value };
                    setLocalSignee(updated);
                    onUpdateSignee(updated);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 text-xs font-medium"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-500 font-medium">Cargo / Rol</label>
                <input
                  type="text"
                  value={localSignee.role}
                  onChange={(e) => {
                    const updated = { ...localSignee, role: e.target.value };
                    setLocalSignee(updated);
                    onUpdateSignee(updated);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-500 font-medium">Clínica / Empresa</label>
                <input
                  type="text"
                  value={localSignee.company}
                  onChange={(e) => {
                    const updated = { ...localSignee, company: e.target.value };
                    setLocalSignee(updated);
                    onUpdateSignee(updated);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-500 font-medium">WhatsApp / Teléfono</label>
                <input
                  type="text"
                  value={localSignee.whatsapp}
                  onChange={(e) => {
                    const updated = { ...localSignee, whatsapp: e.target.value };
                    setLocalSignee(updated);
                    onUpdateSignee(updated);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 px-6 py-3 bg-stone-50 border-t border-stone-200 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="px-5 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
