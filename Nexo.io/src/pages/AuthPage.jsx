import { useState } from "react";
import useAuthStore from "../store/useAuthStore";

// Página de autenticación con formularios de login y registro
const AuthPage = () => {
  // Estado local para controlar si mostramos formulario de login o registro
  const [isLogin, setIsLogin] = useState(true);

  // Estados para los campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(""); // Para mostrar mensajes de error

  // Obtener funciones del store de autenticación
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevenir recarga de la página
    setError(""); // Limpiar errores anteriores

    if (isLogin) {
      // Lógica de login
      const success = login(email, password);
      if (!success) {
        setError(
          "Credenciales inválidas. El password debe tener al menos 6 caracteres.",
        );
      }
    } else {
      // Lógica de registro
      if (!name.trim()) {
        setError("El nombre es requerido");
        return;
      }
      register(email, password, name);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      {/* Contenedor del formulario con estilo dark */}
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
        {/* Título dinámico según modo (login o registro) */}
        <h2 className="text-3xl font-bold text-center mb-6 text-orange-500">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </h2>

        {/* Mensaje de error si existe */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de nombre (solo en modo registro) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition-all"
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div class="bg-orange-500/10 border border-orange-500/50 text-orange-500 text-[14px] py-1 px-2 rounded mb-4 text-center">
            Prueba Ingreso
            <br />
            Email: <strong>demo@example.com</strong>
            <br />
            Password: <strong>123456</strong>
          </div>
          {/* Campo de email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition-all"
              placeholder="tu@email.com"
              required
            />
          </div>

          {/* Campo de password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Botón de envío del formulario */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>

        {/* Enlace para cambiar entre login y registro */}
        <p className="text-center mt-6 text-gray-400">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin); // Cambiar modo
              setError(""); // Limpiar errores
            }}
            className="text-orange-500 hover:text-orange-400 font-semibold"
          >
            {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
