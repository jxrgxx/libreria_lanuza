import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  // Inicializamos el usuario intentando leerlo de localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_lanuza');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Función para guardar el usuario al loguearse
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user_lanuza', JSON.stringify(userData));
  };

  // Función para borrar el usuario al salir
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_lanuza');
  };

  return (
    <Router>
      <Routes>
        {/* RUTA DE LOGIN */}
        <Route 
          path="/login" 
          element={!user ? <Login onLoginSuccess={handleLogin} /> : <Navigate to="/dashboard" />} 
        />

        {/* RUTA DE DASHBOARD (Protegida) */}
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />

        {/* REDIRECCIÓN POR DEFECTO: Si pones cualquier otra cosa, te manda al login o dashboard según si estás logueado */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;