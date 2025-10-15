import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  User,
  Phone,
  Calendar,
  Activity,
  Weight,
  Ruler,
  X,
  AlertTriangle,
} from "lucide-react";
import CreateClientModal from "../components/modals/CreateClientModal";
import EditClientModal from "../components/modals/EditClientModal";
import apiService from "../services/api";
import styles from "./ClientesPage.module.css";

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  telefono: string;
  peso?: number;
  altura?: number;
  experiencia: "principiante" | "intermedio" | "avanzado" | "experto";
  experiencia_display: string;
  fecha_registro: string;
  activo: boolean;
}

interface ClientFormData {
  nombre: string;
  apellido: string;
  telefono: string;
  peso?: number;
  altura?: number;
  experiencia: "principiante" | "intermedio" | "avanzado" | "experto";
}

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [filterExperiencia, setFilterExperiencia] = useState<string>("all");
  const [filterActivo, setFilterActivo] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cargar clientes
  const loadClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getClientes();
      setClientes(data);
      setFilteredClientes(data);
    } catch (err: any) {
      console.error("Error loading clientes:", err);
      setError("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  // Filtrar clientes
  useEffect(() => {
    let filtered = clientes.filter((cliente) =>
      `${cliente.nombre} ${cliente.apellido} ${cliente.telefono}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    if (filterExperiencia !== "all") {
      filtered = filtered.filter(
        (cliente) => cliente.experiencia === filterExperiencia
      );
    }

    if (filterActivo !== "all") {
      filtered = filtered.filter((cliente) =>
        filterActivo === "active" ? cliente.activo : !cliente.activo
      );
    }

    setFilteredClientes(filtered);
    setCurrentPage(1);
  }, [searchTerm, clientes, filterExperiencia, filterActivo]);

  // Paginación
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClientes = filteredClientes.slice(startIndex, endIndex);

  // Crear cliente
  const handleCreateCliente = async (clienteData: ClientFormData) => {
    try {
      setError(null);
      await apiService.createCliente(clienteData);
      await loadClientes();
      setShowCreateModal(false);
    } catch (err: any) {
      console.error("Error creating cliente:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Error al crear cliente");
      }
    }
  };

  // Editar cliente
  const handleEditCliente = async (clienteData: ClientFormData) => {
    if (!selectedCliente) return;

    try {
      setError(null);
      await apiService.updateCliente(
        selectedCliente.id.toString(),
        clienteData
      );
      await loadClientes();
      setShowEditModal(false);
      setSelectedCliente(null);
    } catch (err: any) {
      console.error("Error updating cliente:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Error al actualizar cliente");
      }
    }
  };

  // Eliminar cliente
  const handleDeleteCliente = async (clienteId: number) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar este cliente?")
    ) {
      return;
    }

    try {
      setError(null);
      await apiService.deleteCliente(clienteId.toString());
      await loadClientes();
    } catch (err: any) {
      console.error("Error deleting cliente:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Error al eliminar cliente");
      }
    }
  };

  // Abrir modal de edición
  const openEditModal = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowEditModal(true);
  };

  // Obtener color por experiencia
  const getExperienciaColor = (experiencia: string) => {
    switch (experiencia) {
      case "principiante":
        return "#10b981"; // Verde
      case "intermedio":
        return "#f59e0b"; // Amarillo
      case "avanzado":
        return "#f97316"; // Naranja
      case "experto":
        return "#ef4444"; // Rojo
      default:
        return "#6b7280"; // Gris
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  if (loading) {
    return (
      <div className={styles.clientes}>
        <div className={styles.loading}>Cargando clientes...</div>
      </div>
    );
  }

  return (
    <div className={styles.clientes}>
      <div className={styles.header}>
        <div>
          <h1>Gestión de Clientes</h1>
          <p>Administra los clientes del gimnasio</p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <AlertTriangle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <Filter size={16} />
          <select
            value={filterExperiencia}
            onChange={(e) => setFilterExperiencia(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todas las experiencias</option>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
            <option value="experto">Experto</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <select
            value={filterActivo}
            onChange={(e) => setFilterActivo(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      <div className={styles.clientesGrid}>
        {currentClientes.length === 0 ? (
          <div className={styles.emptyState}>
            <User size={48} />
            <h3>No hay clientes</h3>
            <p>
              {searchTerm ||
              filterExperiencia !== "all" ||
              filterActivo !== "all"
                ? "No se encontraron clientes con los filtros aplicados"
                : "Comienza agregando tu primer cliente"}
            </p>
          </div>
        ) : (
          currentClientes.map((cliente) => (
            <div key={cliente.id} className={styles.clienteCard}>
              <div className={styles.clienteHeader}>
                <div className={styles.clienteInfo}>
                  <h3>{cliente.nombre_completo}</h3>
                  <div className={styles.clienteMeta}>
                    <span className={styles.clienteId}>ID: {cliente.id}</span>
                    <span
                      className={styles.experienciaBadge}
                      style={{
                        backgroundColor: getExperienciaColor(
                          cliente.experiencia
                        ),
                      }}
                    >
                      {cliente.experiencia_display}
                    </span>
                  </div>
                </div>
                <div className={styles.clienteActions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => openEditModal(cliente)}
                    title="Editar cliente"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleDeleteCliente(cliente.id)}
                    title="Eliminar cliente"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.clienteDetails}>
                <div className={styles.detailRow}>
                  <Phone size={16} />
                  <span>{cliente.telefono}</span>
                </div>

                {cliente.peso && (
                  <div className={styles.detailRow}>
                    <Weight size={16} />
                    <span>{cliente.peso} kg</span>
                  </div>
                )}

                {cliente.altura && (
                  <div className={styles.detailRow}>
                    <Ruler size={16} />
                    <span>{cliente.altura} m</span>
                  </div>
                )}

                <div className={styles.detailRow}>
                  <Calendar size={16} />
                  <span>Registro: {formatDate(cliente.fecha_registro)}</span>
                </div>

                <div className={styles.detailRow}>
                  <Activity size={16} />
                  <span
                    className={
                      cliente.activo
                        ? styles.statusActive
                        : styles.statusInactive
                    }
                  >
                    {cliente.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Anterior
          </button>

          <div className={styles.paginationInfo}>
            Página {currentPage} de {totalPages} ({filteredClientes.length}{" "}
            clientes)
          </div>

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Siguiente
          </button>
        </div>
      )}

      {showCreateModal && (
        <CreateClientModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateCliente}
        />
      )}

      {showEditModal && selectedCliente && (
        <EditClientModal
          cliente={selectedCliente}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCliente(null);
          }}
          onSubmit={handleEditCliente}
        />
      )}
    </div>
  );
}
