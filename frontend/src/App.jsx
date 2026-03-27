import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_lanuza');

    if(savedUser && savedUser !== 'undefined') {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    } 

    return null;
  });

  const handleLogin = (data) => {
    setUser(data.user);
    localStorage.setItem('user_lanuza', JSON.stringify(data.user));
    localStorage.setItem('token_lanuza', data.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_lanuza');
    localStorage.removeItem('token_lanuza');
  };

  // --- ESCUDO DE INACTIVIDAD (10 MINUTOS) ---
  useEffect(() => {
    if (!user) return;

    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      
      timer = setTimeout(() => {
        handleLogout();
        alert("Sesión cerrada por seguridad tras 10 minutos de inactividad.");
      }, 10 * 60 * 1000);
    };

    const eventos = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    eventos.forEach(e => window.addEventListener(e, resetTimer));

    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      eventos.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* LA RAÍZ AHORA ES EL DASHBOARD */}
        <Route 
          path="/" 
          element={<Dashboard user={user} onLogout={handleLogout} />} 
        />

        {/* EL LOGIN ES UNA RUTA APARTE */}
        <Route 
          path="/login" 
          element={!user ? <Login onLoginSuccess={handleLogin} /> : <Navigate to="/" />} 
        />

        {/* REDIRECCIÓN: Cualquier cosa rara manda a la raíz */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;