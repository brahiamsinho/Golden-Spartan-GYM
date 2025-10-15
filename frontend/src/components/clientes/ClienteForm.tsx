import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  UserIcon, 
  PhoneIcon, 
  ScaleIcon, 
  ArrowsUpDownIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline';
import { clienteService, type Cliente } from '../../services/gymServices';

interface ClienteFormProps {
  cliente?: Cliente | null;
  isEditing: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, isEditing, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Cliente>>({
    nombre: '',
    apellido: '',
    telefono: '',
    peso: undefined,
    altura: undefined,
    experiencia: 'principiante'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || '',
        apellido: cliente.apellido || '',
        telefono: cliente.telefono || '',
        peso: cliente.peso || undefined,
        altura: cliente.altura || undefined,
        experiencia: cliente.experiencia || 'principiante'
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        telefono: '',
        peso: undefined,
        altura: undefined,
        experiencia: 'principiante'
      });
    }
    setErrors({});
  }, [cliente]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.apellido?.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    }

    if (!formData.telefono?.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    } else if (!/^\+?[0-9\s\-()]+$/.test(formData.telefono)) {
      newErrors.telefono = 'Formato de teléfono inválido';
    }

    if (formData.peso && (formData.peso <= 0 || formData.peso > 500)) {
      newErrors.peso = 'El peso debe estar entre 1 y 500 kg';
    }

    if (formData.altura && (formData.altura <= 0 || formData.altura > 3.0)) {
      newErrors.altura = 'La altura debe estar entre 0.1 y 3.0 metros';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const dataToSend = {
        ...formData,
        peso: formData.peso || null,
        altura: formData.altura || null
      };

      if (cliente?.id) {
        await clienteService.update(cliente.id, dataToSend);
      } else {
        await clienteService.create(dataToSend as Cliente);
      }
      
      onSuccess();
      onCancel();
    } catch (error: any) {
      console.error('Error saving cliente:', error);
      if (error.response?.data) {
        const serverErrors: Record<string, string> = {};
        Object.keys(error.response.data).forEach(key => {
          if (Array.isArray(error.response.data[key])) {
            serverErrors[key] = error.response.data[key][0];
          } else {
            serverErrors[key] = error.response.data[key];
          }
        });
        setErrors(serverErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Cliente, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel}></div>
        
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre || ''}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingrese el nombre"
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  Apellido *
                </label>
                <input
                  type="text"
                  value={formData.apellido || ''}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.apellido ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ingrese el apellido"
                />
                {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <PhoneIcon className="h-4 w-4 inline mr-1" />
                  Teléfono *
                </label>
                <input
                  type="text"
                  value={formData.telefono || ''}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+591 70123456"
                />
                {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
              </div>

              {/* Experiencia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AcademicCapIcon className="h-4 w-4 inline mr-1" />
                  Experiencia
                </label>
                <select
                  value={formData.experiencia || 'principiante'}
                  onChange={(e) => handleInputChange('experiencia', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                  <option value="experto">Experto</option>
                </select>
              </div>

              {/* Peso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ScaleIcon className="h-4 w-4 inline mr-1" />
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="500"
                  value={formData.peso || ''}
                  onChange={(e) => handleInputChange('peso', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.peso ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="70.5"
                />
                {errors.peso && <p className="text-red-500 text-sm mt-1">{errors.peso}</p>}
              </div>

              {/* Altura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ArrowsUpDownIcon className="h-4 w-4 inline mr-1" />
                  Altura (m)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="3.0"
                  value={formData.altura || ''}
                  onChange={(e) => handleInputChange('altura', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.altura ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1.75"
                />
                {errors.altura && <p className="text-red-500 text-sm mt-1">{errors.altura}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : (cliente ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClienteForm;