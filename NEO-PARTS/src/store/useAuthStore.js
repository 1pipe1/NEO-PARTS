import { create } from "zustand";
import { persist } from "zustand/middleware";

// Store de Zustand para manejar la autenticación de usuarios
// Usa persist para guardar la sesión en localStorage
const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial: usuario es null (no autenticado)
      user: null,
      isAuthenticated: false,

      // Función para registrar un nuevo usuario
      // Recibe email, password y nombre
      register: (email, password, name) => {
        // Simulación: en un caso real, esto sería una llamada a una API
        const newUser = {
          id: Date.now(), // Generar ID único basado en timestamp
          email,
          name,
        };

        // Guardar el usuario en el estado y marcar como autenticado
        set({ user: newUser, isAuthenticated: true });

        return newUser; // Retornar el usuario creado
      },

      // Función para iniciar sesión
      // Recibe email y password
      login: (email, password) => {
        // Simulación: validar credenciales (en producción, esto sería una API)
        // Para demo, aceptamos cualquier email con password mínimo 6 caracteres
        if (email && password && password.length >= 6) {
          const user = {
            id: Date.now(),
            email,
            name: email.split("@")[0], // Usar la parte del email como nombre
          };

          // Guardar usuario y marcar como autenticado
          set({ user, isAuthenticated: true });

          return true; // Login exitoso
        }

        return false; // Login fallido
      },

      // Función para cerrar sesión
      // Limpia el estado del usuario y marca como no autenticado
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      // Configuración de persistencia en localStorage
      name: "auth-storage", // Nombre de la clave en localStorage
      storage: {
        // Función para obtener datos del localStorage
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        // Función para guardar datos en localStorage
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        // Función para eliminar datos del localStorage
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    },
  ),
);

export default useAuthStore;
