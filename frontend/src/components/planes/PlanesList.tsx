import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  CalendarDaysIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { planMembresiaService, type PlanMembresia } from '../../services/gymServices';
import PlanForm from './PlanForm';

const PlanesList: React.FC = () => {
  const [planes, setPlanes] = useState<PlanMembresia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanMembresia | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'activos'>('todos');

  useEffect(() => {
    loadPlanes();
  }, [filter]);

  const loadPlanes = async () => {
    try {
      setLoading(true);
      const response = filter === 'activos' 
        ? await planMembresiaService.getActivos()
        : await planMembresiaService.getAll();
      setPlanes(response.data);
    } catch (error) {
      console.error('Error loading planes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPlan(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (plan: PlanMembresia) => {
    setSelectedPlan(plan);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (plan: PlanMembresia) => {
    if (window.confirm(`¿Está seguro de eliminar el plan "${plan.nombre}"?`)) {
      try {
        await planMembresiaService.delete(plan.id!);
        loadPlanes();
      } catch (error) {
        console.error('Error deleting plan:', error);
        alert('Error al eliminar el plan');
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(price);
  };

  const getDurationText = (duration: number) => {
    if (duration < 30) return `${duration} días`;
    if (duration < 365) return `${Math.round(duration / 30)} meses`;
    return `${Math.round(duration / 365)} año(s)`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planes de Membresía</h1>
          <p className="text-gray-600">Gestiona los planes disponibles para los clientes</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'todos' | 'activos')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos los planes</option>
            <option value="activos">Solo activos</option>
          </select>
          
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Plan
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      {planes.length === 0 ? (
        <div className="text-center py-12">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay planes disponibles</h3>
          <p className="text-gray-500 mb-4">Comienza creando tu primer plan de membresía</p>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear Primer Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planes.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Plan Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{plan.nombre}</h3>
                    <p className="text-blue-100 text-sm">{getDurationText(plan.duracion)}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {plan.activo ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-300" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-300" />
                    )}
                  </div>
                </div>
              </div>

              {/* Plan Content */}
              <div className="p-4">
                {/* Price */}
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-900">{formatPrice(plan.precio_base)}</div>
                  <div className="text-sm text-gray-500">por {getDurationText(plan.duracion)}</div>
                </div>

                {/* Description */}
                {plan.descripcion && (
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm line-clamp-3">{plan.descripcion}</p>
                  </div>
                )}

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <CalendarDaysIcon className="h-4 w-4 mr-1" />
                      Duración
                    </span>
                    <span className="font-medium">{plan.duracion} días</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-1" />
                      Membresías activas
                    </span>
                    <span className="font-medium">{plan.membresias_count || 0}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estado</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      plan.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {plan.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Editar
                  </button>
                  
                  <button
                    onClick={() => handleDelete(plan)}
                    className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Footer with creation date */}
              <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500">
                Creado: {plan.fecha_creacion ? new Date(plan.fecha_creacion).toLocaleDateString('es-ES') : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <PlanForm
        plan={selectedPlan}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedPlan(null);
          setIsEditing(false);
        }}
        onSuccess={() => {
          loadPlanes();
        }}
      />
    </div>
  );
};

export default PlanesList;