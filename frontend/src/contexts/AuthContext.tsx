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
  is_superuser?: boolean;
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

    try {
copy env.example .env      const tokenResponse = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!tokenResponse.ok) {
        return false;
      }

      const tokenData = await tokenResponse.json();

      // Guardar tokens en localStorage
      localStorage.setItem("accessToken", tokenData.access);
      localStorage.setItem("refreshToken", tokenData.refresh);

      // Obtener información del usuario
      const userResponse = await fetch("http://localhost:8000/api/user-info/", {
        headers: {
          Authorization: `Bearer ${tokenData.access}`,
        },
      });

      if (!userResponse.ok) {
        return false;
      }

      const userData = await userResponse.json();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

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

  const logout = async () => {
    // Registrar salida en el backend usando el nuevo endpoint
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        await fetch("http://localhost:8000/api/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        console.error("Error al registrar salida:", error);
      }
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
