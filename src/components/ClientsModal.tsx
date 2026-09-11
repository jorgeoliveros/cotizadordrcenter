import React, { useState } from 'react';
import { X, Search, UserPlus, Users, Phone, Mail, FileText, Check, Tag, Heart, Plus, Edit2, Trash2 } from 'lucide-react';
import { Client, Quote } from '../types';

interface ClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onSaveClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  currentQuoteClient?: {
    name: string;
    email: string;
    phone?: string;
    taxId?: string;
  };
  currentQuote?: Quote;
}

export const ClientsModal: React.FC<ClientsModalProps> = ({
  isOpen,
  onClose,
  clients,
  onSelectClient,
  onSaveClient,
  onDeleteClient,
  currentQuoteClient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  if (!isOpen) return null;

  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.taxId && c.taxId.toLowerCase().includes(q)) ||
      (c.preferences && c.preferences.toLowerCase().includes(q))
    );
  });

  const activeClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  const handleStartNew = () => {
    setEditingClient({
      id: `cli-${Date.now()}`,
      name: currentQuoteClient?.name || '',
      email: currentQuoteClient?.email || '',
      phone: currentQuoteClient?.phone || '',
      taxId: currentQuoteClient?.taxId || '',
      address: '',
      preferences: '',
      tags: ['Frecuente'],
      createdAt: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsEditing(true);
  };

  const handleStartEdit = (client: Client) => {
    setEditingClient({ ...client });
    setIsEditing(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient && editingClient.name.trim()) {
      onSaveClient(editingClient);
      setSelectedClientId(editingClient.id);
      setIsEditing(false);
      setEditingClient(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-stone-800" />
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Registro de Clientes Frecuentes
              </h3>
              <p className="text-xs text-stone-500">
                Seguimiento de pedidos históricos, preferencias y datos de contacto
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

        {/* Content Body: Two columns layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Client List & Search */}
          <div className="w-full md:w-80 border-r border-stone-200 flex flex-col bg-stone-50/50">
            {/* Search & New Button */}
            <div className="p-3 border-b border-stone-200 space-y-2 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o tel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-stone-50 focus:bg-white transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleStartNew}
                className="w-full py-1.5 px-3 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Nuevo Cliente Frecuente
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
              {filteredClients.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-400">
                  No se encontraron clientes registrados.
                </div>
              ) : (
                filteredClients.map((client) => {
                  const isSelected = (selectedClientId || clients[0]?.id) === client.id;
                  return (
                    <div
                      key={client.id}
                      onClick={() => {
                        setSelectedClientId(client.id);
                        setIsEditing(false);
                      }}
                      className={`p-3 cursor-pointer text-left transition-colors ${
                        isSelected
                          ? 'bg-white border-l-4 border-stone-900 shadow-xs'
                          : 'hover:bg-stone-100/60'
                      }`}
                    >
                      <div className="font-semibold text-xs text-stone-900 truncate">
                        {client.name}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                        {client.email}
                      </div>
                      {client.phone && (
                        <div className="text-[11px] text-stone-500 truncate flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                          {client.phone}
                        </div>
                      )}
                      {client.preferences && (
                        <div className="mt-1.5 text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50 truncate flex items-center gap-1">
                          <Heart className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                          {client.preferences}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Client Details or Edit Form */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            {isEditing && editingClient ? (
              /* Edit / Create Form */
              <form onSubmit={handleSaveForm} className="space-y-4 max-w-lg">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h4 className="text-sm font-bold text-stone-900">
                    {editingClient.id.startsWith('cli-') && !clients.some((c) => c.id === editingClient.id)
                      ? 'Registrar Nuevo Cliente'
                      : 'Editar Datos del Cliente'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-stone-500 hover:text-stone-800"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingClient.name}
                      onChange={(e) =>
                        setEditingClient({ ...editingClient, name: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded border border-stone-300"
                      placeholder="Ej. Ericka Sanchez Segura"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        value={editingClient.email}
                        onChange={(e) =>
                          setEditingClient({ ...editingClient, email: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded border border-stone-300"
                        placeholder="cliente@ejemplo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={editingClient.phone || ''}
                        onChange={(e) =>
                          setEditingClient({ ...editingClient, phone: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded border border-stone-300"
                        placeholder="+(506) 8888-8888"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">
                        Cédula / Identificación Fiscal
                      </label>
                      <input
                        type="text"
                        value={editingClient.taxId || ''}
                        onChange={(e) =>
                          setEditingClient({ ...editingClient, taxId: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded border border-stone-300"
                        placeholder="1-0000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={editingClient.address || ''}
                        onChange={(e) =>
                          setEditingClient({ ...editingClient, address: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded border border-stone-300"
                        placeholder="Ciudad, Provincia"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1 flex items-center gap-1 text-amber-900">
                      <Heart className="w-3.5 h-3.5 text-amber-600" />
                      Preferencias Personales del Cliente
                    </label>
                    <textarea
                      rows={2}
                      value={editingClient.preferences || ''}
                      onChange={(e) =>
                        setEditingClient({ ...editingClient, preferences: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded border border-stone-300 bg-amber-50/30"
                      placeholder="Ej. Prefiere citas por la tarde, sensible a anestésicos tópicos, solicita factura electrónica..."
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">
                      Historial de Tratamientos / Notas
                    </label>
                    <textarea
                      rows={2}
                      value={editingClient.notes || ''}
                      onChange={(e) =>
                        setEditingClient({ ...editingClient, notes: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded border border-stone-300"
                      placeholder="Historial previo o comentarios relevantes..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-1.5 text-xs text-stone-700 hover:bg-stone-100 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded hover:bg-stone-800"
                  >
                    Guardar Cliente
                  </button>
                </div>
              </form>
            ) : activeClient ? (
              /* Client Profile View */
              <div className="space-y-6">
                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-stone-200">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">
                      {activeClient.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Cliente desde {activeClient.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(activeClient)}
                      className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded border border-stone-200 text-xs flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    {clients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`¿Eliminar a ${activeClient.name} del registro?`)) {
                            onDeleteClient(activeClient.id);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded border border-red-200 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectClient(activeClient);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 bg-stone-900 text-white rounded text-xs font-bold hover:bg-stone-800 flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      Cargar en Cotización
                    </button>
                  </div>
                </div>

                {/* Contact Information Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                    <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">
                      Correo Electrónico
                    </span>
                    <span className="text-stone-800 font-medium block break-all">
                      {activeClient.email}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                    <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">
                      Teléfono / WhatsApp
                    </span>
                    <span className="text-stone-800 font-medium block">
                      {activeClient.phone || 'No registrado'}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                    <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">
                      Cédula / Tax ID
                    </span>
                    <span className="text-stone-800 font-medium block">
                      {activeClient.taxId || 'No registrada'}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                    <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider block">
                      Dirección
                    </span>
                    <span className="text-stone-800 font-medium block">
                      {activeClient.address || 'No registrada'}
                    </span>
                  </div>
                </div>

                {/* Personal Preferences Callout */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <Heart className="w-3.5 h-3.5 text-amber-600" />
                    Preferencias Personales del Cliente
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed">
                    {activeClient.preferences || 'Sin preferencias registradas aún. Haga clic en Editar para agregar notas de atención.'}
                  </p>
                </div>

                {/* Historical Orders and Quotes Tracking */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-stone-500" />
                    Historial de Cotizaciones & Pedidos
                  </h4>

                  <div className="border border-stone-200 rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                        <tr>
                          <th className="py-2 px-3 font-semibold">Fecha</th>
                          <th className="py-2 px-3 font-semibold">Tratamiento / Concepto</th>
                          <th className="py-2 px-3 font-semibold text-right">Monto</th>
                          <th className="py-2 px-3 font-semibold text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        <tr>
                          <td className="py-2.5 px-3 text-stone-600">18 Feb, 2026</td>
                          <td className="py-2.5 px-3 font-medium text-stone-900">
                            PRP (con microagujas e infiltración) 6 sesiones
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold text-stone-800">
                            ¢480.000
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Aprobada
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 text-stone-600">10 Nov, 2025</td>
                          <td className="py-2.5 px-3 font-medium text-stone-900">
                            Valoración Dermatológica & Limpieza Profunda
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold text-stone-800">
                            ¢65.000
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                              Completada
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {activeClient.notes && (
                    <p className="text-[11px] text-stone-500 italic">
                      Nota adicional: {activeClient.notes}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-stone-400">
                Seleccione un cliente de la lista o registre uno nuevo.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
