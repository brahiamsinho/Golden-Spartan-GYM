import apiService from './api';

// Tipos TypeScript
export interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  nombre_completo?: string;
  telefono: string;
  peso?: number;
  altura?: number;
  experiencia: 'principiante' | 'intermedio' | 'avanzado' | 'experto';
  experiencia_display?: string;
  fecha_registro?: string;
  activo?: boolean;
  membresias_activas?: any[];
  total_inscripciones?: number;
}

export interface PlanMembresia {
  id?: number;
  nombre: string;
  duracion: number;
  precio_base: number;
  descripcion?: string;
  activo?: boolean;
  fecha_creacion?: string;
  membresias_count?: number;
}

export interface Promocion {
  id?: number;
  nombre: string;
  meses: number;
  descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'activa' | 'inactiva' | 'vencida';
  estado_display?: string;
  is_active_now?: boolean;
}

export interface InscripcionMembresia {
  id?: number;
  cliente: number;
  cliente_nombre?: string;
  monto: number;
  metodo_de_pago: 'efectivo' | 'tarjeta_credito' | 'tarjeta_debito' | 'transferencia' | 'paypal';
  metodo_de_pago_display?: string;
  fecha_inscripcion?: string;
}

export interface Membresia {
  id?: number;
  inscripcion: number;
  cliente_nombre?: string;
  plan: number;
  plan_nombre?: string;
  usuario_registro: number;
  usuario_registro_nombre?: string;
  estado: 'activa' | 'vencida' | 'suspendida' | 'cancelada';
  estado_display?: string;
  fecha_inicio: string;
  fecha_fin: string;
  is_active_now?: boolean;
  days_remaining?: number;
  promociones?: any[];
}

class ClienteService {
  private baseUrl = '/api/clientes';

  async getAll() {
    return apiService.get<Cliente[]>(this.baseUrl + '/');
  }

  async getById(id: number) {
    return apiService.get<Cliente>(`${this.baseUrl}/${id}/`);
  }

  async getActivos() {
    return apiService.get<Cliente[]>(`${this.baseUrl}/activos/`);
  }

  async create(data: Omit<Cliente, 'id'>) {
    return apiService.post<Cliente>(this.baseUrl + '/', data);
  }

  async update(id: number, data: Partial<Cliente>) {
    return apiService.put<Cliente>(`${this.baseUrl}/${id}/`, data);
  }

  async delete(id: number) {
    return apiService.delete(`${this.baseUrl}/${id}/`);
  }
}

class PlanMembresiaService {
  private baseUrl = '/api/planes-membresia';

  async getAll() {
    return apiService.get<PlanMembresia[]>(this.baseUrl + '/');
  }

  async getById(id: number) {
    return apiService.get<PlanMembresia>(`${this.baseUrl}/${id}/`);
  }

  async getActivos() {
    return apiService.get<PlanMembresia[]>(`${this.baseUrl}/activos/`);
  }

  async create(data: Omit<PlanMembresia, 'id'>) {
    return apiService.post<PlanMembresia>(this.baseUrl + '/', data);
  }

  async update(id: number, data: Partial<PlanMembresia>) {
    return apiService.put<PlanMembresia>(`${this.baseUrl}/${id}/`, data);
  }

  async delete(id: number) {
    return apiService.delete(`${this.baseUrl}/${id}/`);
  }
}

class PromocionService {
  private baseUrl = '/api/promociones';

  async getAll() {
    return apiService.get<Promocion[]>(this.baseUrl + '/');
  }

  async getById(id: number) {
    return apiService.get<Promocion>(`${this.baseUrl}/${id}/`);
  }

  async getActivas() {
    return apiService.get<Promocion[]>(`${this.baseUrl}/activas/`);
  }

  async create(data: Omit<Promocion, 'id'>) {
    return apiService.post<Promocion>(this.baseUrl + '/', data);
  }

  async update(id: number, data: Partial<Promocion>) {
    return apiService.put<Promocion>(`${this.baseUrl}/${id}/`, data);
  }

  async delete(id: number) {
    return apiService.delete(`${this.baseUrl}/${id}/`);
  }
}

class InscripcionService {
  private baseUrl = '/api/inscripciones-membresia';

  async getAll() {
    return apiService.get<InscripcionMembresia[]>(this.baseUrl + '/');
  }

  async getById(id: number) {
    return apiService.get<InscripcionMembresia>(`${this.baseUrl}/${id}/`);
  }

  async create(data: Omit<InscripcionMembresia, 'id'>) {
    return apiService.post<InscripcionMembresia>(this.baseUrl + '/', data);
  }

  async update(id: number, data: Partial<InscripcionMembresia>) {
    return apiService.put<InscripcionMembresia>(`${this.baseUrl}/${id}/`, data);
  }

  async delete(id: number) {
    return apiService.delete(`${this.baseUrl}/${id}/`);
  }
}

class MembresiaService {
  private baseUrl = '/api/membresias';

  async getAll() {
    return apiService.get<Membresia[]>(this.baseUrl + '/');
  }

  async getById(id: number) {
    return apiService.get<Membresia>(`${this.baseUrl}/${id}/`);
  }

  async getActivas() {
    return apiService.get<Membresia[]>(`${this.baseUrl}/activas/`);
  }

  async getPorVencer(dias: number = 30) {
    return apiService.get<Membresia[]>(`${this.baseUrl}/por_vencer/?dias=${dias}`);
  }

  async create(data: Omit<Membresia, 'id'>) {
    return apiService.post<Membresia>(this.baseUrl + '/', data);
  }

  async update(id: number, data: Partial<Membresia>) {
    return apiService.put<Membresia>(`${this.baseUrl}/${id}/`, data);
  }

  async delete(id: number) {
    return apiService.delete(`${this.baseUrl}/${id}/`);
  }

  async aplicarPromocion(id: number, promocion_id: number) {
    return apiService.post(`${this.baseUrl}/${id}/aplicar_promocion/`, { promocion_id });
  }
}

// Exportar instancias de los servicios
export const clienteService = new ClienteService();
export const planMembresiaService = new PlanMembresiaService();
export const promocionService = new PromocionService();
export const inscripcionService = new InscripcionService();
export const membresiaService = new MembresiaService();