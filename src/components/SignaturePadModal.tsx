import React, { useRef, useState, useEffect } from 'react';
import { X, PenTool, Upload, Stamp, Check, Trash2 } from 'lucide-react';
import { SigneeInfo } from '../types';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  signee: SigneeInfo;
  onUpdateSignee: (signee: SigneeInfo) => void;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  signee,
  onUpdateSignee,
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'upload-sig' | 'stamp'>('draw');
  const [localSignee, setLocalSignee] = useState<SigneeInfo>(signee);
  
  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    setLocalSignee(signee);
  }, [signee, isOpen]);

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
    const updated = {
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
        const updated = {
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

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const updated = {
          ...localSignee,
          stampImage: result,
          showStamp: true,
          useGeneratedStamp: false,
        };
        setLocalSignee(updated);
        onUpdateSignee(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAndClose = () => {
    onUpdateSignee(localSignee);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Stamp className="w-5 h-5 text-stone-700" />
            <h3 className="text-base font-bold text-stone-900">
              Firma y Sello Digital Profesional
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 px-6 pt-3 bg-white gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('draw')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
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
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'upload-sig'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Subir Imagen de Firma
          </button>
          <button
            onClick={() => setActiveTab('stamp')}
            className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'stamp'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Stamp className="w-3.5 h-3.5" />
            Sello Profesional
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Tab 1: Draw Signature */}
          {activeTab === 'draw' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Firme con el mouse o con el dedo sobre el lienzo para estampar su rúbrica digital:
              </p>
              <div className="border border-stone-300 rounded-lg p-2 bg-stone-50/70 relative">
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={150}
                  className="w-full h-36 bg-white rounded border border-stone-200 cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <div className="flex justify-between items-center mt-2 px-1">
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Borrar lienzo
                  </button>
                  <button
                    type="button"
                    onClick={saveDrawnSignature}
                    disabled={!hasDrawn}
                    className="px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 disabled:opacity-40 transition-opacity flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Aplicar Firma Dibujada
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Upload Signature */}
          {activeTab === 'upload-sig' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Suba una imagen nítida de su firma manuscrita (formato PNG transparente o JPG fondo claro):
              </p>
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

          {/* Tab 3: Official Stamp */}
          {activeTab === 'stamp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-800 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localSignee.showStamp}
                    onChange={(e) =>
                      setLocalSignee({
                        ...localSignee,
                        showStamp: e.target.checked,
                      })
                    }
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                  />
                  Mostrar sello oficial en el documento
                </label>
              </div>

              {/* Stamp customization fields */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Configurar Sello Digital Profesional
                </h4>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Nombre del Profesional / Empresa
                  </label>
                  <input
                    type="text"
                    value={localSignee.stampDetails.title}
                    onChange={(e) =>
                      setLocalSignee({
                        ...localSignee,
                        stampDetails: {
                          ...localSignee.stampDetails,
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Especialidad / Subtítulo
                    </label>
                    <input
                      type="text"
                      value={localSignee.stampDetails.subtitle}
                      onChange={(e) =>
                        setLocalSignee({
                          ...localSignee,
                          stampDetails: {
                            ...localSignee.stampDetails,
                            subtitle: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Código / Registro Médico o Profesional
                    </label>
                    <input
                      type="text"
                      value={localSignee.stampDetails.code}
                      onChange={(e) =>
                        setLocalSignee({
                          ...localSignee,
                          stampDetails: {
                            ...localSignee.stampDetails,
                            code: e.target.value,
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Texto adicional (ej. Atención Adultos y Niños)
                  </label>
                  <input
                    type="text"
                    value={localSignee.stampDetails.extraText}
                    onChange={(e) =>
                      setLocalSignee({
                        ...localSignee,
                        stampDetails: {
                          ...localSignee.stampDetails,
                          extraText: e.target.value,
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Tinta del sello
                  </label>
                  <div className="flex gap-2 items-center">
                    {[
                      { label: 'Azul Clínico', val: '#1e3a8a' },
                      { label: 'Gris Grafito', val: '#475569' },
                      { label: 'Verde Esmeralda', val: '#047857' },
                      { label: 'Borgoña', val: '#881337' },
                    ].map((col) => (
                      <button
                        key={col.val}
                        type="button"
                        onClick={() =>
                          setLocalSignee({
                            ...localSignee,
                            stampDetails: {
                              ...localSignee.stampDetails,
                              color: col.val,
                            },
                          })
                        }
                        className={`px-2.5 py-1 text-[11px] rounded border flex items-center gap-1.5 ${
                          localSignee.stampDetails.color === col.val
                            ? 'border-stone-900 bg-white font-bold'
                            : 'border-stone-200 bg-stone-100'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: col.val }}
                        />
                        {col.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Or upload custom stamp image */}
                <div className="pt-2 border-t border-stone-200">
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    O subir imagen de sello real personalizado:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleStampUpload}
                    className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-stone-200 file:text-stone-700 hover:file:bg-stone-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Signee Metadata Form */}
          <div className="pt-2 border-t border-stone-200 space-y-2">
            <h4 className="text-xs font-semibold text-stone-700">
              Datos del Firmante al pie de página:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[11px] text-stone-500">Nombre</label>
                <input
                  type="text"
                  value={localSignee.name}
                  onChange={(e) =>
                    setLocalSignee({ ...localSignee, name: e.target.value })
                  }
                  className="w-full px-2 py-1 rounded border border-stone-300 bg-stone-50 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-500">Cargo / Rol</label>
                <input
                  type="text"
                  value={localSignee.role}
                  onChange={(e) =>
                    setLocalSignee({ ...localSignee, role: e.target.value })
                  }
                  className="w-full px-2 py-1 rounded border border-stone-300 bg-stone-50 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-500">Clínica / Empresa</label>
                <input
                  type="text"
                  value={localSignee.company}
                  onChange={(e) =>
                    setLocalSignee({ ...localSignee, company: e.target.value })
                  }
                  className="w-full px-2 py-1 rounded border border-stone-300 bg-stone-50 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-500">WhatsApp / Teléfono</label>
                <input
                  type="text"
                  value={localSignee.whatsapp}
                  onChange={(e) =>
                    setLocalSignee({ ...localSignee, whatsapp: e.target.value })
                  }
                  className="w-full px-2 py-1 rounded border border-stone-300 bg-stone-50 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 px-6 py-3 bg-stone-50 border-t border-stone-200">
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
            className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
