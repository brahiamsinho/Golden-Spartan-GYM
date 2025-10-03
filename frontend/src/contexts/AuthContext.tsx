import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  roles?: { id: number; nombre: string }[];
  permisos?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = user !== null;

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    console.log("Iniciando proceso de login...");

    try {
      console.log("Haciendo petición a /api/token/...");
      // Llamada real a la API de Django para obtener el token
      const tokenResponse = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log(
        "Respuesta del token:",
        tokenResponse.status,
        tokenResponse.statusText
      );

      if (!tokenResponse.ok) {
        console.error("Error en respuesta del token:", tokenResponse.status);
        return false;
      }

      const tokenData = await tokenResponse.json();
      console.log("Token obtenido exitosamente");

      // Guardar tokens en localStorage
      localStorage.setItem("accessToken", tokenData.access);
      localStorage.setItem("refreshToken", tokenData.refresh);

      console.log("Haciendo petición a /api/user-info/...");
      // Obtener información del usuario
      const userResponse = await fetch("http://localhost:8000/api/user-info/", {
        headers: {
          Authorization: `Bearer ${tokenData.access}`,
        },
      });

      console.log(
        "Respuesta del user-info:",
        userResponse.status,
        userResponse.statusText
      );

      if (!userResponse.ok) {
        console.error("Error en respuesta del user-info:", userResponse.status);
        return false;
      }

      const userData = await userResponse.json();
      console.log("Login exitoso - Usuario autenticado");
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("Login exitoso");
      return true;
    } catch (error) {
      console.error("Error en login:", error);
      console.error("Tipo de error:", typeof error);
      console.error(
        "Mensaje de error:",
        error instanceof Error ? error.message : String(error)
      );

      // NO usar fallback - mostrar el error real
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Opcional: Registrar salida en el backend
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetch("http://localhost:8000/api/registrar-bitacora/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ accion: "Cierre de sesión" }),
      }).catch((error) => console.error("Error al registrar salida:", error));
    }

    // Limpiar datos de sesión
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // Verificar si hay usuario almacenado al cargar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
}
