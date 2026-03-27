import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LibroCard from '../components/LibroCard';

function Home({ user, onLogout }) {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarLibros = async () => {
      const token = localStorage.getItem('token_lanuza');
      
      try {
        const res = await axios.get('http://localhost:3001/libros', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        setLibros(res.data);
      } catch (error) {
        console.error("Error cargando libros", error);
        if (user && (error.response?.status === 401 || error.response?.status === 403)) {
          onLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    cargarLibros();
  }, [user, onLogout]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar Superior */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <h1 className="text-xl font-medium text-[#7F252E] uppercase tracking-tighter font-lanuza leading-none">
                Lanuza Libros
              </h1>
              <p className="text-[10px] text-slate-400 font-lanuza uppercase tracking-widest">Biblioteca Escolar</p>
            </div>
          </div>
          
          {/* Sección de Usuario / Acceso */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-5">
                <div className="text-right hidden sm:block border-r pr-5 border-slate-200">
                  <p className="text-sm font-bold text-slate-900">{user.correo}</p>
                  <p className="text-xs font-bold text-[#7F252E] uppercase">{user.rol}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="bg-red-50 text-red-600 px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors border border-red-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="bg-[#7F252E] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#631d24] transition-all shadow-lg shadow-red-900/10 active:scale-95"
              >
                Acceso Personal
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto p-8">
        
        {/* Encabezado dinámico */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-medium font-lanuza text-[#7F252E] tracking-tight ">
              {user ? "Panel de Gestión" : "Catálogo de Libros"}
            </h2>
            <p className="text-slate-500 text-lg">
              {user 
                ? "Administra préstamos, devoluciones y stock." 
                : "Explora nuestra colección y selecciona tu próxima lectura."}
            </p>
          </div>

          {/* Botón de acción solo para Admin/Bibliotecario */}
          {user && (
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition transform hover:-translate-y-1 active:scale-95">
              + Añadir Nuevo Libro
            </button>
          )}
        </div>
  
        {/* Listado de Libros */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-80 gap-4">
            <LoaderComponent />
            <p className="text-slate-400 font-bold animate-pulse">Cargando biblioteca...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {libros.map(libro => (
              <LibroCard key={libro.id_libro} libro={libro} user={user} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Subcomponente para el Spinner (para no ensuciar el código principal)
function LoaderComponent() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-[#7F252E] rounded-full animate-spin"></div>
      <span className="absolute text-xl">📖</span>
    </div>
  );
}

export default Home;