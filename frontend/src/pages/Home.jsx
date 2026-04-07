import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LibroCard from '../components/LibroCard';
import { Search, X } from 'lucide-react';

function Home({ user, onLogout }) {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  const cargarLibros = async (textoBusqueda = busqueda) => {
    setLoading(true);
    const token = localStorage.getItem('token_lanuza');
    try {
      const res = await axios.get(
        `http://localhost:3001/libros?q=${textoBusqueda}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setLibros(res.data);
    } catch (error) {
      console.error('Error cargando libros', error);
      if (
        user &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cargarLibros();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  const handleLimpiarBusqueda = () => {
    setBusqueda('');
    cargarLibros('');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar Superior */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 md:px-10 flex justify-between items-center">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <h1 className="text-xl font-medium text-[#7F252E] uppercase tracking-tighter font-lanuza leading-none">
                Lanuza Libros
              </h1>
              <p className="text-[10px] text-slate-400 font-lanuza uppercase tracking-widest">
                Biblioteca Escolar
              </p>
            </div>
          </div>

          {/* Sección de Usuario / Acceso */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-5">
                <div className="text-right hidden sm:block border-r pr-5 border-slate-200">
                  <p className="text-sm font-bold text-slate-900">
                    {user.correo_usuario}
                  </p>
                  <p className="text-xs font-bold text-[#7F252E] uppercase">
                    {user.rol_usuario}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="bg-red-50 text-red-600 px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors border border-red-100 font-lanuza"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-[#7F252E] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#631d24] transition-all shadow-lg shadow-red-900/10 active:scale-95 font-lanuza"
              >
                Acceso Personal
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="w-full px-4 md:px-10 py-8">
        {/* CABECERA: Título a la izquierda, Buscador a la derecha */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          {/* Títulos */}
          <div className="flex-shrink-0">
            <h2 className="text-4xl font-medium font-lanuza text-[#7F252E] tracking-tight">
              {user ? 'Panel de Gestión' : 'Catálogo de Libros'}
            </h2>
            <p className="text-slate-500 text-lg font-lanuza mt-1">
              {user
                ? 'Administra préstamos, devoluciones y stock.'
                : 'Explora nuestra colección y selecciona tu próxima lectura.'}
            </p>
          </div>

          {/* BARRA DE BÚSQUEDA A LA DERECHA */}
          <div className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por título, autor o género..."
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-1 focus:ring-[#7F252E] focus:border-[#7F252E] transition-all font-lanuza text-slate-700"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button
                onClick={handleLimpiarBusqueda}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Botón de añadir (solo si es user) */}
          {user && (
            <button className="bg-[#7F252E] text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg hover:bg-[#631d24] transition transform hover:-translate-y-1 active:scale-95 font-lanuza flex-shrink-0">
              + Nuevo Libro
            </button>
          )}
        </div>

        {/* LISTADO DE LIBROS */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-80 gap-4">
            <LoaderComponent />
            <p className="text-slate-400 font-bold animate-pulse font-lanuza">
              Cargando biblioteca...
            </p>
          </div>
        ) : (
          <>
            {/* Mensaje si no hay resultados real (solo si la búsqueda no es vacía) */}
            {libros.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <p className="text-slate-400 text-xl font-lanuza">
                  No se han encontrado resultados para "
                  <span className="text-slate-600 font-bold">{busqueda}</span>"
                </p>
                <button
                  onClick={() => setBusqueda('')}
                  className="mt-4 text-[#7F252E] font-bold underline font-lanuza"
                >
                  Ver todos los libros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-6">
                {libros.map((libro) => (
                  <LibroCard key={libro.id_libro} libro={libro} user={user} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function LoaderComponent() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-[#7F252E] rounded-full animate-spin"></div>
      <span className="absolute text-xl">📖</span>
    </div>
  );
}

export default Home;
