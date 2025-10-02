import { useState } from "react"
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, Phone, CreditCard, Calendar } from "lucide-react"
import styles from "./MembersPage.module.css"

interface Cliente {
  id: number
  nombre: string
  apellido: string
  telefono: string
  peso: number
  altura: number
  experiencia: string
  fechaRegistro: string
  ultimaVisita: string
  membresia?: {
    plan: string
    estado: "activa" | "vencida" | "suspendida"
    fechaInicio: string
    fechaFin: string
  }
}

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const clientes: Cliente[] = [
    {
      id: 1,
      nombre: "Juan Carlos",
      apellido: "Pérez García",
      telefono: "+1234567890",
      peso: 75.5,
      altura: 1.75,
      experiencia: "Intermedio",
      fechaRegistro: "2024-01-15",
      ultimaVisita: "2024-10-01",
      membresia: {
        plan: "Premium",
        estado: "activa",
        fechaInicio: "2024-01-15",
        fechaFin: "2024-07-15"
      }
    },
    {
      id: 2,
      nombre: "María Elena",
      apellido: "García López",
      telefono: "+1234567891",
      peso: 62.0,
      altura: 1.65,
      experiencia: "Principiante",
      fechaRegistro: "2024-02-20",
      ultimaVisita: "2024-09-30",
      membresia: {
        plan: "Básico",
        estado: "activa",
        fechaInicio: "2024-02-20",
        fechaFin: "2024-08-20"
      }
    },
    {
      id: 3,
      nombre: "Carlos Alberto",
      apellido: "López Martín",
      telefono: "+1234567892",
      peso: 82.3,
      altura: 1.80,
      experiencia: "Avanzado",
      fechaRegistro: "2023-11-10",
      ultimaVisita: "2024-09-25",
      membresia: {
        plan: "Premium",
        estado: "suspendida",
        fechaInicio: "2023-11-10",
        fechaFin: "2024-05-10"
      }
    },
    {
      id: 4,
      nombre: "Ana Sofía",
      apellido: "Martín Rodríguez",
      telefono: "+1234567893",
      peso: 58.7,
      altura: 1.62,
      experiencia: "Principiante",
      fechaRegistro: "2024-03-05",
      ultimaVisita: "2024-10-02",
      membresia: {
        plan: "Estudiante",
        estado: "activa",
        fechaInicio: "2024-03-05",
        fechaFin: "2024-09-05"
      }
    },
    {
      id: 5,
      nombre: "Luis Fernando",
      apellido: "Torres Silva",
      telefono: "+1234567894",
      peso: 70.0,
      altura: 1.73,
      experiencia: "Intermedio",
      fechaRegistro: "2023-08-12",
      ultimaVisita: "2024-08-15",
      membresia: {
        plan: "Básico",
        estado: "vencida",
        fechaInicio: "2023-08-12",
        fechaFin: "2024-02-12"
      }
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "activa": return "#10b981"
      case "vencida": return "#6b7280"
      case "suspendida": return "#ef4444"
      default: return "#6b7280"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "activa": return "Activa"
      case "vencida": return "Vencida"
      case "suspendida": return "Suspendida"
      default: return status
    }
  }

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case "Principiante": return "#3b82f6"
      case "Intermedio": return "#f59e0b"
      case "Avanzado": return "#ef4444"
      default: return "#6b7280"
    }
  }

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = 
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.includes(searchTerm)
    
    const matchesFilter = filterStatus === "all" || 
      (cliente.membresia && cliente.membresia.estado === filterStatus)
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className={styles.members}>
      <div className={styles.header}>
        <div>
          <h1>Clientes del Gimnasio</h1>
          <p>Gestiona los clientes y sus membresías</p>
        </div>
        <button className={styles.addButton}>
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar clientes por nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">Todas las membresías</option>
          <option value="activa">Membresías Activas</option>
          <option value="vencida">Membresías Vencidas</option>
          <option value="suspendida">Membresías Suspendidas</option>
        </select>

        <button className={styles.filterButton}>
          <Filter size={20} />
          Más filtros
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Datos Físicos</th>
              <th>Experiencia</th>
              <th>Membresía</th>
              <th>Estado</th>
              <th>Última Visita</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>
                  <div className={styles.clienteInfo}>
                    <div className={styles.avatar}>
                      {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
                    </div>
                    <div>
                      <div className={styles.clienteName}>
                        {cliente.nombre} {cliente.apellido}
                      </div>
                      <div className={styles.clienteId}>
                        ID: {cliente.id.toString().padStart(4, '0')}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.contact}>
                    <div className={styles.contactItem}>
                      <Phone size={14} />
                      {cliente.telefono}
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.physicalData}>
                    <div>Peso: {cliente.peso} kg</div>
                    <div>Altura: {cliente.altura} m</div>
                  </div>
                </td>
                <td>
                  <span 
                    className={styles.experience}
                    style={{ backgroundColor: getExperienceColor(cliente.experiencia) }}
                  >
                    {cliente.experiencia}
                  </span>
                </td>
                <td>
                  {cliente.membresia ? (
                    <div className={styles.membershipInfo}>
                      <div className={styles.planName}>
                        <CreditCard size={14} />
                        {cliente.membresia.plan}
                      </div>
                      <div className={styles.membershipDates}>
                        <Calendar size={12} />
                        {new Date(cliente.membresia.fechaInicio).toLocaleDateString()} - 
                        {new Date(cliente.membresia.fechaFin).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <span className={styles.noMembership}>Sin membresía</span>
                  )}
                </td>
                <td>
                  {cliente.membresia && (
                    <span 
                      className={styles.status}
                      style={{ backgroundColor: getStatusColor(cliente.membresia.estado) }}
                    >
                      {getStatusText(cliente.membresia.estado)}
                    </span>
                  )}
                </td>
                <td>{new Date(cliente.ultimaVisita).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionButton} title="Editar cliente">
                      <Edit size={16} />
                    </button>
                    <button className={styles.actionButton} title="Eliminar cliente">
                      <Trash2 size={16} />
                    </button>
                    <button className={styles.actionButton} title="Más opciones">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span>Mostrando {filteredClientes.length} de {clientes.length} clientes</span>
        <div className={styles.paginationButtons}>
          <button>Anterior</button>
          <button className={styles.active}>1</button>
          <button>2</button>
          <button>3</button>
          <button>Siguiente</button>
        </div>
      </div>
    </div>
  )
}