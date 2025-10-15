import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  PhoneIcon, 
  UserPlusIcon, 
  PencilIcon, 
  TrashIcon,
  HeartIcon,
  ScaleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { clienteService, type Cliente } from '../../services/gymServices';
import ClienteForm from './ClienteForm';
import ClienteDetail from './ClienteDetail';
import styles from './ClientesList.module.css';

const ClientesList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'activos'>('todos');

  useEffect(() => {
    loadClientes();
  }, [filter]);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const response = filter === 'activos' 
        ? await clienteService.getActivos()
        : await clienteService.getAll();
      setClientes(response.data);
    } catch (error) {
      console.error('Error loading clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCliente(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleView = async (cliente: Cliente) => {
    try {
      const response = await clienteService.getById(cliente.id!);
      setSelectedCliente(response.data);
      setShowDetail(true);
    } catch (error) {
      console.error('Error loading cliente detail:', error);
    }
  };

  const handleDelete = async (cliente: Cliente) => {
    if (window.confirm(`¿Estás seguro de que quieres desactivar a ${cliente.nombre_completo}?`)) {
      try {
        await clienteService.delete(cliente.id!);
        loadClientes();
      } catch (error) {
        console.error('Error deleting cliente:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedCliente(null);
    loadClientes();
  };

  const getExperienceBadge = (experiencia: string) => {
    const experienceClasses = {
      principiante: styles.experiencePrincipiante,
      intermedio: styles.experienceIntermedio, 
      avanzado: styles.experienceAvanzado,
      experto: styles.experienceExperto
    };
    return experienceClasses[experiencia as keyof typeof experienceClasses] || styles.experiencePrincipiante;
  };

  if (showForm) {
    return (
      <ClienteForm
        cliente={selectedCliente}
        isEditing={isEditing}
        onSuccess={handleFormSuccess}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (showDetail && selectedCliente) {
    return (
      <ClienteDetail
        cliente={selectedCliente}
        onBack={() => setShowDetail(false)}
        onEdit={() => {
          setShowDetail(false);
          handleEdit(selectedCliente);
        }}
      />
    );
  }

  return (
    <div className={`${styles.clientesContainer} ${styles.fadeIn}`}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Gestión de Clientes</h1>
          <p>Administra la información de los clientes del gimnasio</p>
        </div>
        <button
          onClick={handleCreate}
          className={styles.newButton}
        >
          <UserPlusIcon className="h-5 w-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Filtros */}
      <div className={styles.filtersSection}>
        <h3 className={styles.filtersTitle}>Filtrar Clientes</h3>
        <div className={styles.filterButtons}>
          <button
            onClick={() => setFilter('todos')}
            className={`${styles.filterButton} ${filter === 'todos' ? styles.active : ''}`}
          >
            Todos ({clientes.length})
          </button>
          <button
            onClick={() => setFilter('activos')}
            className={`${styles.filterButton} ${filter === 'activos' ? styles.active : ''}`}
          >
            Solo Activos
          </button>
        </div>
      </div>

      {/* Lista de clientes */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : (
        <div className={styles.clientesTable}>
          {clientes.length === 0 ? (
            <div className={styles.emptyState}>
              <UserIcon className={styles.emptyStateIcon} />
              <h3 className={styles.emptyStateTitle}>No hay clientes</h3>
              <p className={styles.emptyStateText}>Comienza agregando el primer cliente</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.tableHeaderCell}>
                      Cliente
                    </th>
                    <th className={styles.tableHeaderCell}>
                      Contacto
                    </th>
                    <th className={styles.tableHeaderCell}>
                      Físico
                    </th>
                    <th className={styles.tableHeaderCell}>
                      Experiencia
                    </th>
                    <th className={styles.tableHeaderCell}>
                      Estado
                    </th>
                    <th className={styles.tableHeaderCell}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className={styles.tableBody}>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        <div className={styles.clientInfo}>
                          <div className={styles.clientAvatar}>
                            <UserIcon className={styles.clientAvatarIcon} />
                          </div>
                          <div className={styles.clientDetails}>
                            <div className={styles.clientName}>
                              {cliente.nombre_completo}
                            </div>
                            <div className={styles.clientId}>
                              ID: {cliente.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.contactInfo}>
                          <PhoneIcon className={styles.contactIcon} />
                          {cliente.telefono}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.physicalInfo}>
                          {cliente.peso && (
                            <div className={styles.physicalItem}>
                              <ScaleIcon className={styles.physicalIcon} />
                              {cliente.peso} kg
                            </div>
                          )}
                          {cliente.altura && (
                            <div className={styles.physicalItem}>
                              <HeartIcon className={styles.physicalIcon} />
                              {cliente.altura} m
                            </div>
                          )}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <span className={`${styles.experienceBadge} ${getExperienceBadge(cliente.experiencia)}`}>
                          <AcademicCapIcon className={styles.experienceIcon} />
                          {cliente.experiencia_display || cliente.experiencia}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        <span className={`${styles.statusBadge} ${
                          cliente.activo 
                            ? styles.statusActive
                            : styles.statusInactive
                        }`}>
                          {cliente.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.actionsContainer}>
                          <button
                            onClick={() => handleView(cliente)}
                            className={`${styles.actionButton} ${styles.viewButton}`}
                            title="Ver detalles"
                          >
                            <UserIcon className={styles.actionIcon} />
                          </button>
                          <button
                            onClick={() => handleEdit(cliente)}
                            className={`${styles.actionButton} ${styles.editButton}`}
                            title="Editar"
                          >
                            <PencilIcon className={styles.actionIcon} />
                          </button>
                          <button
                            onClick={() => handleDelete(cliente)}
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            title="Desactivar"
                          >
                            <TrashIcon className={styles.actionIcon} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientesList;