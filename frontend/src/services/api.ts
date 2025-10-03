const API_BASE_URL = "http://localhost:8000/api";

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado, intentar refresh
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Reintentar la petición con el nuevo token
          return response;
        } else {
          // Redirigir al login
          localStorage.clear();
          window.location.href = "/";
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return false;

      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.access);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Autenticación
  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return this.handleResponse(response);
  }

  async getUserInfo() {
    const response = await fetch(`${API_BASE_URL}/user-info/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Usuarios
  async getUsers(page = 1, pageSize = 10) {
    const response = await fetch(
      `${API_BASE_URL}/usuarios/?page=${page}&page_size=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  async createUser(userData: any) {
    const response = await fetch(`${API_BASE_URL}/usuarios/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async updateUser(id: string, userData: any) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}/`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async deleteUser(id: string) {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return response.ok;
  }

  // Roles
  async getRoles() {
    const response = await fetch(`${API_BASE_URL}/roles/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createRole(roleData: any) {
    const response = await fetch(`${API_BASE_URL}/roles/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(roleData),
    });
    return this.handleResponse(response);
  }

  async updateRole(id: string, roleData: any) {
    const response = await fetch(`${API_BASE_URL}/roles/${id}/`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(roleData),
    });
    return this.handleResponse(response);
  }

  async deleteRole(id: string) {
    const response = await fetch(`${API_BASE_URL}/roles/${id}/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return response.ok;
  }

  // Permisos
  async getPermissions() {
    const response = await fetch(`${API_BASE_URL}/permisos/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Bitácora
  async getBitacora(params?: {
    usuario?: string;
    tipo_accion?: string;
    nivel?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    accion?: string;
    ip?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    const url = `${API_BASE_URL}/bitacora/${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getBitacoraEstadisticas() {
    const response = await fetch(`${API_BASE_URL}/bitacora/estadisticas/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async registrarBitacora(accion: string) {
    const response = await fetch(`${API_BASE_URL}/registrar-bitacora/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ accion }),
    });
    return this.handleResponse(response);
  }

  // Logout
  async logout() {
    const response = await fetch(`${API_BASE_URL}/logout/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Permisos de usuario
  async getUserPermissions() {
    const response = await fetch(`${API_BASE_URL}/permisos-usuario/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Dashboard
  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats/`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getRecentActivity(limit = 10) {
    const response = await fetch(`${API_BASE_URL}/bitacora/?limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Toggle role status
  async toggleRoleStatus(roleId: number) {
    const response = await fetch(
      `${API_BASE_URL}/roles/${roleId}/toggle_status/`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  // Permisos
  async createPermission(permissionData: {
    nombre: string;
    descripcion: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/permisos/`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(permissionData),
    });
    return this.handleResponse(response);
  }

  async updatePermission(
    permissionId: number,
    permissionData: { nombre: string; descripcion: string }
  ) {
    const response = await fetch(`${API_BASE_URL}/permisos/${permissionId}/`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(permissionData),
    });
    return this.handleResponse(response);
  }

  async deletePermission(permissionId: number) {
    const response = await fetch(`${API_BASE_URL}/permisos/${permissionId}/`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

export default new ApiService();
