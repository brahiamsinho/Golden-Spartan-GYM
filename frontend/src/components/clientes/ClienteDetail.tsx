import React from 'react';
import { 
  XMarkIcon, 
  UserIcon, 
  PhoneIcon, 
  ScaleIcon, 
  ArrowsUpDownIcon,
  AcademicCapIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { type Cliente } from '../../services/gymServices';

interface ClienteDetailProps {
  cliente: Cliente | null;
  isOpen: boolean;
  onClose: () => void;
}

const ClienteDetail: React.FC<ClienteDetailProps> = ({ cliente, isOpen, onClose }) => {
  if (!isOpen || !cliente) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExperienciaColor = (experiencia: string) => {
    switch (experiencia) {
      case 'principiante': return 'bg-green-100 text-green-800';
      case 'intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'avanzado': return 'bg-orange-100 text-orange-800';
      case 'experto': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoMembresiaColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'activa': return 'bg-green-100 text-green-800';
      case 'vencida': return 'bg-red-100 text-red-800';
      case 'suspendida': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div>
              <h2 className="text-2xl font-bold">{cliente.nombre_completo}</h2>
              <p className="text-blue-100">Información del Cliente</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Información Personal */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <UserIcon className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Nombre Completo</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{cliente.nombre_completo}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <PhoneIcon className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Teléfono</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{cliente.telefono}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AcademicCapIcon className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Experiencia</span>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExperienciaColor(cliente.experiencia)}`}>
                    {cliente.experiencia_display || cliente.experiencia}
                  </span>
                </div>

                {cliente.peso && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <ScaleIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Peso</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{cliente.peso} kg</p>
                  </div>
                )}

                {cliente.altura && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <ArrowsUpDownIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Altura</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{cliente.altura} m</p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Fecha de Registro</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{formatDate(cliente.fecha_registro)}</p>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2 text-blue-600" />
                Estadísticas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Inscripciones</p>
                      <p className="text-2xl font-bold text-blue-900">{cliente.total_inscripciones || 0}</p>
                    </div>
                    <CreditCardIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Membresías Activas</p>
                      <p className="text-2xl font-bold text-green-900">{cliente.membresias_activas?.length || 0}</p>
                    </div>
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className={`border p-4 rounded-lg ${cliente.activo ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${cliente.activo ? 'text-green-600' : 'text-red-600'}`}>Estado</p>
                      <p className={`text-2xl font-bold ${cliente.activo ? 'text-green-900' : 'text-red-900'}`}>
                        {cliente.activo ? 'Activo' : 'Inactivo'}
                      </p>
                    </div>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${cliente.activo ? 'bg-green-600' : 'bg-red-600'}`}>
                      <div className="h-3 w-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Membresías Activas */}
            {cliente.membresias_activas && cliente.membresias_activas.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
                  Membresías Activas
                </h3>
                <div className="space-y-3">
                  {cliente.membresias_activas.map((membresia, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{membresia.plan}</h4>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {formatDate(membresia.fecha_inicio)} - {formatDate(membresia.fecha_fin)}
                            </span>
                            <span className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {membresia.days_remaining} días restantes
                            </span>
                          </div>
                        </div>
                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                          Activa
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IMC Calculado */}
            {cliente.peso && cliente.altura && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ScaleIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Información Física
                </h3>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Peso</p>
                      <p className="text-xl font-bold text-blue-900">{cliente.peso} kg</p>
                    </div>
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Altura</p>
                      <p className="text-xl font-bold text-blue-900">{cliente.altura} m</p>
                    </div>
                    <div>
                      <p className="text-blue-600 text-sm font-medium">IMC</p>
                      <p className="text-xl font-bold text-blue-900">
                        {(cliente.peso / (cliente.altura * cliente.altura)).toFixed(1)}
                      </p>
                      <p className="text-xs text-blue-600">
                        {(() => {
                          const imc = cliente.peso / (cliente.altura * cliente.altura);
                          if (imc < 18.5) return 'Bajo peso';
                          if (imc < 25) return 'Normal';
                          if (imc < 30) return 'Sobrepeso';
                          return 'Obesidad';
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-6 border-t">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteDetail;