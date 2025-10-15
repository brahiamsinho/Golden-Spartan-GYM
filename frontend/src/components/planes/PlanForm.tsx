import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  CalendarDaysIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { planMembresiaService, type PlanMembresia } from '../../services/gymServices';

interface PlanFormProps {
  plan?: PlanMembresia | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PlanForm: React.FC<PlanFormProps> = ({ plan, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Partial<PlanMembresia>>({
    nombre: '',
    duracion: 30,
    precio_base: 0,
    descripcion: '',
    activo: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (plan) {
      setFormData({
        nombre: plan.nombre || '',
        duracion: plan.duracion || 30,
        precio_base: plan.precio_base || 0,
        descripcion: plan.descripcion || '',
        activo: plan.activo !== undefined ? plan.activo : true
      });
    } else {
      setFormData({
        nombre: '',
        duracion: 30,
        precio_base: 0,
        descripcion: '',
        activo: true
      });
    }
    setErrors({});
  }, [plan, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.duracion || formData.duracion <= 0) {
      newErrors.duracion = 'La duración debe ser mayor a 0';
    }

    if (!formData.precio_base || formData.precio_base <= 0) {
      newErrors.precio_base = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);

      if (plan?.id) {
        await planMembresiaService.update(plan.id, formData);
      } else {
        await planMembresiaService.create(formData as PlanMembresia);
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving plan:', error);
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

  const handleInputChange = (field: keyof PlanMembresia, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getDurationText = (duration: number) => {
    if (duration < 30) return `${duration} días`;
    if (duration < 365) return `${Math.round(duration / 30)} meses`;
    return `${Math.round(duration / 365)} año(s)`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {plan ? 'Editar Plan de Membresía' : 'Nuevo Plan de Membresía'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DocumentTextIcon className="h-4 w-4 inline mr-1" />
                  Nombre del Plan *
                </label>
                <input
                  type="text"
                  value={formData.nombre || ''}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Plan Básico, Plan Premium, etc."
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>

              {/* Duración */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                  Duración (días) *
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    min="1"
                    value={formData.duracion || ''}
                    onChange={(e) => handleInputChange('duracion', parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.duracion ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="30"
                  />
                  {formData.duracion && formData.duracion > 0 && (
                    <p className="text-sm text-gray-600">
                      Equivale a: {getDurationText(formData.duracion)}
                    </p>
                  )}
                </div>
                {errors.duracion && <p className="text-red-500 text-sm mt-1">{errors.duracion}</p>}
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                  Precio Base (Bs.) *
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio_base || ''}
                    onChange={(e) => handleInputChange('precio_base', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.precio_base ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="150.00"
                  />
                  {formData.precio_base && formData.precio_base > 0 && (
                    <p className="text-sm text-gray-600">
                      Precio formateado: {formatPrice(formData.precio_base)}
                    </p>
                  )}
                </div>
                {errors.precio_base && <p className="text-red-500 text-sm mt-1">{errors.precio_base}</p>}
              </div>

              {/* Estado */}
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.activo || false}
                    onChange={(e) => handleInputChange('activo', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Plan activo</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Los planes inactivos no se mostrarán a los clientes
                </p>
              </div>

              {/* Descripción */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <InformationCircleIcon className="h-4 w-4 inline mr-1" />
                  Descripción
                </label>
                <textarea
                  rows={4}
                  value={formData.descripcion || ''}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe los beneficios y características del plan..."
                />
              </div>
            </div>

            {/* Preview Card */}
            {(formData.nombre || formData.precio_base || formData.duracion) && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Vista Previa</h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {formData.nombre || 'Nombre del Plan'}
                    </h4>
                    <div className="text-2xl font-bold text-blue-600 mt-2">
                      {formData.precio_base ? formatPrice(formData.precio_base) : 'Bs. 0.00'}
                    </div>
                    <div className="text-sm text-gray-600">
                      por {formData.duracion ? getDurationText(formData.duracion) : '30 días'}
                    </div>
                    {formData.descripcion && (
                      <p className="text-sm text-gray-600 mt-2">{formData.descripcion}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : (plan ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlanForm;