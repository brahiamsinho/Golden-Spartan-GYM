const API_BASE_URL = "http://localhost:8000/api";

export const checkApiStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "test", password: "test" }),
    });
    
    // Si obtenemos cualquier respuesta (incluso 401), significa que la API está funcionando
    return response.status !== 0;
  } catch (error) {
    console.error("Error checking API status:", error);
    return false;
  }
};
