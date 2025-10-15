import { useState } from "react";
import { X, User, Phone, Weight, Ruler, Activity } from "lucide-react";
import styles from "./CreateClientModal.module.css";

interface ClientFormData {
  nombre: string;
  apellido: string;
  telefono: string;
  peso?: number;
  altura?: number;
  experiencia: "principiante" | "intermedio" | "avanzado" | "experto";
}

interface CreateClientModalProps {
  onClose: () => void;
  onSubmit: (data: ClientFormData) => Promise<void>;
}

export default function CreateClientModal({
  onClose,
  onSubmit,
}: CreateClientModalProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    nombre: "",
    apellido: "",
    telefono: "",
    peso: undefined,
    altura: undefined,
    experiencia: "principiante",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.telefono)) {
      newErrors.telefono = "Formato de teléfono inválido";
    }

    if (
      formData.peso !== undefined &&
      (formData.peso <= 0 || formData.peso > 500)
    ) {
      newErrors.peso = "El peso debe estar entre 1 y 500 kg";
    }

    if (
      formData.altura !== undefined &&
      (formData.altura <= 0 || formData.altura > 3.0)
    ) {
      newErrors.altura = "La altura debe estar entre 0.1 y 3.0 metros";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error) {
      console.error("Error creating client:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof ClientFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            <User size={24} />
            Nuevo Cliente
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="nombre">
                <User size={16} />
                Nombre *
              </label>
              <input
                id="nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                className={errors.nombre ? styles.inputError : ""}
                placeholder="Ingresa el nombre"
              />
              {errors.nombre && (
                <span className={styles.errorText}>{errors.nombre}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="apellido">
                <User size={16} />
                Apellido *
              </label>
              <input
                id="apellido"
                type="text"
                value={formData.apellido}
                onChange={(e) => handleInputChange("apellido", e.target.value)}
                className={errors.apellido ? styles.inputError : ""}
                placeholder="Ingresa el apellido"
              />
              {errors.apellido && (
                <span className={styles.errorText}>{errors.apellido}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="telefono">
              <Phone size={16} />
              Teléfono *
            </label>
            <input
              id="telefono"
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleInputChange("telefono", e.target.value)}
              className={errors.telefono ? styles.inputError : ""}
              placeholder="Ej: +591 70123456"
            />
            {errors.telefono && (
              <span className={styles.errorText}>{errors.telefono}</span>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="peso">
                <Weight size={16} />
                Peso (kg)
              </label>
              <input
                id="peso"
                type="number"
                step="0.1"
                min="1"
                max="500"
                value={formData.peso || ""}
                onChange={(e) =>
                  handleInputChange(
                    "peso",
                    e.target.value
                      ? parseFloat(e.target.value)
                      : (undefined as any)
                  )
                }
                className={errors.peso ? styles.inputError : ""}
                placeholder="Ej: 70.5"
              />
              {errors.peso && (
                <span className={styles.errorText}>{errors.peso}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="altura">
                <Ruler size={16} />
                Altura (m)
              </label>
              <input
                id="altura"
                type="number"
                step="0.01"
                min="0.1"
                max="3.0"
                value={formData.altura || ""}
                onChange={(e) =>
                  handleInputChange(
                    "altura",
                    e.target.value
                      ? parseFloat(e.target.value)
                      : (undefined as any)
                  )
                }
                className={errors.altura ? styles.inputError : ""}
                placeholder="Ej: 1.75"
              />
              {errors.altura && (
                <span className={styles.errorText}>{errors.altura}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="experiencia">
              <Activity size={16} />
              Nivel de Experiencia *
            </label>
            <select
              id="experiencia"
              value={formData.experiencia}
              onChange={(e) =>
                handleInputChange("experiencia", e.target.value as any)
              }
              className={styles.select}
            >
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
              <option value="experto">Experto</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
