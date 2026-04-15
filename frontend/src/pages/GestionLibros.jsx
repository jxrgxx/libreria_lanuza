import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  BookPlus,
  AlertCircle,
  Trash2,
  Edit,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
} from 'lucide-react';

function GestionLibros({ user }) {
  const headerScrollRef = useRef(null);
  const bodyScrollRef = useRef(null);
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [editando, setEditando] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: 'id_libro',
    direction: 'ASC',
  });

  const [searchField, setSearchField] = useState('titulo');
  const [searchValue, setSearchValue] = useState('');

  const [nuevo, setNuevo] = useState({
    titulo: '',
    autor: '',
    editorial: '',
    anyo_publicacion: '',
    genero: '',
    paginas: '',
    isbn: '',
    portada_img: '',
  });

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [modoCaptura, setModoCaptura] = useState('archivo');

  const cargarLibros = async () => {
    try {
      const params = {
        sort: sortConfig.key,
        order: sortConfig.direction,
        page: 1,
        limit: 1000,
      };

      if (searchValue.trim() !== '') {
        switch (searchField) {
          case 'id':
            params.id_libro = searchValue;
            break;
          case 'titulo':
            params.titulo = searchValue;
            break;
          case 'autor':
            params.autor = searchValue;
            break;
          case 'editorial':
            params.editorial = searchValue;
            break;
          case 'genero':
            params.genero = searchValue;
            break;
          case 'isbn':
            params.isbn = searchValue;
            break;
          case 'estado':
            params.estado = searchValue;
            break;
          case 'portada_img':
            params.portada_img = searchValue;
            break;
          case 'anyo_exacto':
            params.anyo_exacto = searchValue;
            break;
          case 'todo':
            params.q = searchValue;
            break;
          default:
            params.q = searchValue;
        }
      }

      const res = await axios.get('/api/libros', { params: params });
      setLibros(res.data);
    } catch (error) {
      console.error('Error cargando libros:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => cargarLibros(), 300);
    return () => clearTimeout(timeoutId);
  }, [searchValue, searchField, sortConfig]);

  const handleSort = (colKey) => {
    setSortConfig({
      key: colKey,
      direction:
        sortConfig.key === colKey && sortConfig.direction === 'ASC'
          ? 'DESC'
          : 'ASC',
    });
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('titulo', nuevo.titulo);
    formData.append('autor', nuevo.autor);
    formData.append('editorial', nuevo.editorial);
    formData.append('anyo_publicacion', nuevo.anyo_publicacion);
    formData.append('genero', nuevo.genero);
    formData.append('paginas', nuevo.paginas);
    formData.append('isbn', nuevo.isbn);
    formData.append('nombreArchivoCustom', nuevo.portada_img);

    if (archivoSeleccionado) {
      formData.append('imagen', archivoSeleccionado);
    }

    try {
      const res = await axios.post('/api/libros-con-foto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token_lanuza')}`,
        },
      });

      if (res.data.success) {
        setMensaje({
          tipo: 'success',
          texto: 'Libro y foto guardados correctamente',
        });
        setNuevo({
          titulo: '',
          autor: '',
          editorial: '',
          anyo_publicacion: '',
          genero: '',
          paginas: '',
          isbn: '',
          portada_img: '',
        });
        setArchivoSeleccionado(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        cargarLibros();
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'Error al subir libro o imagen' });
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este libro permanentemente?')) return;
    await axios.delete(`/api/libros/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token_lanuza')}`,
      },
    });
    cargarLibros();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/libros/${editando.id_libro}`, editando, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_lanuza')}`,
        },
      });
      setEditando(null);
      cargarLibros();
    } catch (err) {
      alert('Error al actualizar');
    }
  };

  useEffect(() => {
    const headerDiv = headerScrollRef.current;
    const bodyDiv = bodyScrollRef.current;

    if (!headerDiv || !bodyDiv) return;

    const syncScroll = (source, target) => {
      target.scrollLeft = source.scrollLeft;
    };

    const handleHeaderScroll = () => syncScroll(headerDiv, bodyDiv);
    const handleBodyScroll = () => syncScroll(bodyDiv, headerDiv);

    headerDiv.addEventListener('scroll', handleHeaderScroll);
    bodyDiv.addEventListener('scroll', handleBodyScroll);

    return () => {
      headerDiv.removeEventListener('scroll', handleHeaderScroll);
      bodyDiv.removeEventListener('scroll', handleBodyScroll);
    };
  }, []);

  return (
    <div className="w-full px-4 md:px-10 py-6 font-lanuza animate-in fade-in duration-500">
      {/* 1. CABECERA: ALTA Y BUSCADOR */}
      <div className="flex flex-col gap-6 mb-8">
        {/* PANEL DE INSERCIÓN */}
        <div className="w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <div>
              <BookPlus size={24} className="text-[#7F252E]" />
            </div>
            <h2 className="text-lg font-black text-[#7F252E] uppercase tracking-tighter">
              Nuevo Libro
            </h2>
          </div>

          <form onSubmit={handleCrear} className="space-y-4">
            {/* FILA 1: Información Principal */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Titulo"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#7F252E] focus:bg-white transition-all text-sm"
                  value={nuevo.titulo}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, titulo: e.target.value })
                  }
                  required
                />
              </div>
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="Autor"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#7F252E] focus:bg-white transition-all text-sm"
                  value={nuevo.autor}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, autor: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="Género"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#7F252E] focus:bg-white transition-all text-sm"
                  value={nuevo.genero}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, genero: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-1">
                <input
                  type="text"
                  placeholder="Editorial"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#7F252E] focus:bg-white transition-all text-sm"
                  value={nuevo.editorial}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, editorial: e.target.value })
                  }
                />
              </div>
            </div>

            {/* FILA 2: Datos técnicos, Foto y Botón */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-1">
                <input
                  type="number"
                  placeholder="Año"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#7F252E]"
                  value={nuevo.anyo_publicacion}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, anyo_publicacion: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-1">
                <input
                  type="number"
                  placeholder="Nº pags"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#7F252E]"
                  value={nuevo.paginas}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, paginas: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="ISBN 13"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#7F252E]"
                  value={nuevo.isbn}
                  onChange={(e) => setNuevo({ ...nuevo, isbn: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Nombre foto"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#7F252E]"
                  value={nuevo.portada_img}
                  onChange={(e) =>
                    setNuevo({
                      ...nuevo,
                      portada_img: e.target.value.toLowerCase(),
                    })
                  }
                />
              </div>

              {/* Subida de Archivo */}
              <div className="md:col-span-3 bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-2 flex flex-col gap-1">
                <div className="flex justify-between items-center px-2">
                  <label className="py-1.5 px-3 rounded-xl border-0 bg-[#7F252E] text-white text-[10px] cursor-pointer">
                    {modoCaptura === 'camara' ? 'Foto' : 'Archivo'}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture={
                        modoCaptura === 'camara' ? 'environment' : undefined
                      }
                      className="hidden"
                      onChange={(e) =>
                        setArchivoSeleccionado(e.target.files[0])
                      }
                    />
                  </label>

                  <span className="text-[10px] truncate">
                    {archivoSeleccionado ? archivoSeleccionado.name : '---'}
                  </span>

                  <select
                    className="text-[9px] font-bold bg-white border rounded px-1 py-0.5 outline-none"
                    value={modoCaptura}
                    onChange={(e) => {
                      setModoCaptura(e.target.value);
                      setArchivoSeleccionado(null);
                    }}
                  >
                    <option value="archivo">Archivo</option>
                    <option value="camara">Cámara</option>
                  </select>
                </div>
              </div>

              {/* Botón de Registro */}
              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7F252E] text-white py-3.5 rounded-2xl font-black hover:bg-[#631d24] transition-all text-sm"
                >
                  {loading ? 'GUARDANDO...' : 'REGISTRAR LIBRO'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* BUSCADOR */}
        <div className="w-full bg-white p-6 rounded-3xl shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-3 min-w-max">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Search size={20} className="text-[#7F252E]" />
            </div>
            <div>
              <h2 className="text-slate-800 text-[10px] font-black uppercase tracking-[0.2em]">
                Filtros de
              </h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase">
                Búsqueda rápida
              </p>
            </div>
          </div>

          <div className="flex flex-1 gap-3 w-full">
            <select
              className="bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded-2xl font-bold text-xs outline-none focus:border-[#7F252E] transition-all cursor-pointer"
              value={searchField}
              onChange={(e) => {
                setSearchField(e.target.value);
                setSearchValue('');
              }}
            >
              <option value="titulo">Título</option>
              <option value="autor">Autor</option>
              <option value="id">ID Libro</option>
              <option value="editorial">Editorial</option>
              <option value="genero">Género</option>
              <option value="anyo_exacto">Año Publicación</option>
              <option value="isbn">ISBN</option>
              <option value="portada_img">Nombre archivo foto</option>
              <option value="estado">Estado</option>
            </select>

            {searchField === 'estado' ? (
              <div className="flex-1 flex flex-wrap gap-4 items-center bg-slate-50 border border-slate-200 px-6 py-2 rounded-2xl shadow-inner">
                {['disponible', 'prestado', 'no disponible', 'extraviado'].map(
                  (opcion) => (
                    <label
                      key={opcion}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-[#7F252E] checked:border-[#7F252E] transition-all cursor-pointer"
                          checked={searchValue === opcion}
                          onChange={() =>
                            setSearchValue(searchValue === opcion ? '' : opcion)
                          }
                        />
                        <svg
                          className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity ml-0.5 pointer-events-none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-xs font-bold uppercase text-slate-600 group-hover:text-[#7F252E] transition-colors">
                        {opcion}
                      </span>
                    </label>
                  )
                )}
              </div>
            ) : (
              <input
                type="text"
                placeholder={`Buscar por ${searchField}...`}
                className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#7F252E] text-slate-700 placeholder:text-slate-400 text-sm transition-all shadow-inner"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-lg font-black uppercase tracking-tight">
            Inventario Libros
          </h2>
        </div>

        {/* CONTENEDOR CON SCROLL VERTICAL Y HORIZONTAL */}
        <div className="overflow-auto max-h-[600px]">
          <table
            className="w-max min-w-full text-left"
            style={{ tableLayout: 'fixed' }}
          >
            {/* CABECERA */}
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr className="text-[10px] uppercase tracking-widest border-b border-slate-200">
                {[
                  { label: 'ID', key: 'id_libro', minWidth: '50px' },
                  { label: 'Título', key: 'titulo', minWidth: '200px' },
                  { label: 'Autor', key: 'autor', minWidth: '150px' },
                  { label: 'Género', key: 'genero', minWidth: '100px' },
                  { label: 'Editorial', key: 'editorial', minWidth: '120px' },
                  { label: 'Año', key: 'anyo_publicacion', minWidth: '80px' },
                  { label: 'Págs', key: 'paginas', minWidth: '70px' },
                  { label: 'ISBN', key: 'isbn', minWidth: '130px' },
                  { label: 'Estado', key: 'estado', minWidth: '100px' },
                  { label: 'Portada', key: 'portada_img', minWidth: '200px' },
                ].map((col) => {
                  const activa = sortConfig.key === col.key;
                  return (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      style={{ width: col.width }}
                      className="p-2 cursor-pointer hover:bg-slate-200 transition-colors group select-none text-slate-500 border"
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`transition-colors ${activa ? 'text-[#7F252E] font-black' : ''}`}
                        >
                          {col.label}
                        </span>
                        <span className="flex items-center">
                          {activa ? (
                            sortConfig.direction === 'ASC' ? (
                              <ArrowUp size={14} className="text-[#7F252E]" />
                            ) : (
                              <ArrowDown size={14} className="text-[#7F252E]" />
                            )
                          ) : (
                            <ArrowUpDown
                              size={14}
                              className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          )}
                        </span>
                      </div>
                    </th>
                  );
                })}
                <th
                  style={{ minWidth: '80px' }}
                  className="p-4 border border-slate-200 text-slate-500"
                >
                  Acciones
                </th>
              </tr>
            </thead>

            {/* CUERPO */}
            <tbody className="overflow-y-auto max-h-[600px] bg-white scrollbar-thin">
              {libros.map((l) => (
                <tr
                  key={l.id_libro}
                  className="hover:bg-slate-50 transition-colors text-xs"
                >
                  <td
                    style={{ minWidth: '50px' }}
                    className="p-2 text-slate-500 border border-slate-200"
                  >
                    #{l.id_libro}
                  </td>
                  <td
                    style={{ minWidth: '200px' }}
                    className="p-2 text-slate-500 border border-slate-200 truncate"
                  >
                    {l.titulo}
                  </td>
                  <td
                    style={{ minWidth: '150px' }}
                    className="p-2 text-slate-500 border border-slate-200 truncate"
                  >
                    {l.autor}
                  </td>
                  <td
                    style={{ minWidth: '100px' }}
                    className="p-2 text-slate-500 border border-slate-200"
                  >
                    {l.genero}
                  </td>
                  <td
                    style={{ minWidth: '120px' }}
                    className="p-2 text-slate-500 border border-slate-200 truncate"
                  >
                    {l.editorial}
                  </td>
                  <td
                    style={{ minWidth: '80px' }}
                    className="p-2 text-slate-500 border border-slate-200"
                  >
                    {l.anyo_publicacion}
                  </td>
                  <td
                    style={{ minWidth: '70px' }}
                    className="p-2 text-slate-500 border border-slate-200"
                  >
                    {l.paginas}
                  </td>
                  <td
                    style={{ minWidth: '130px' }}
                    className="p-2 text-slate-500 border border-slate-200"
                  >
                    {l.isbn}
                  </td>
                  <td
                    style={{ minWidth: '100px' }}
                    className="p-2 text-slate-500 border border-slate-200"
                  >
                    <span
                      className={`px-2 py-1 rounded-md text-[9px] font-black ${
                        l.estado === 'Disponible'
                          ? 'bg-green-100 text-green-600'
                          : l.estado === 'Prestado'
                            ? 'bg-orange-100 text-orange-600'
                            : l.estado === 'Extraviado'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {l.estado?.toUpperCase()}
                    </span>
                  </td>
                  <td
                    style={{ minWidth: '200px' }}
                    className="p-2 text-slate-500 border border-slate-200 truncate"
                  >
                    {l.portada_img}
                  </td>
                  <td
                    className="p-4 border border-slate-200"
                    style={{ minWidth: '80px' }}
                  >
                    <div>
                      <button
                        onClick={() => setEditando(l)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleEliminar(l.id_libro)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE EDICIÓN TOTAL */}
      {editando && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 bg-[#7F252E] text-white flex justify-between items-center">
              <h3 className="font-black uppercase tracking-widest">
                Editar Libro #{editando.id_libro}
              </h3>
              <button
                onClick={() => setEditando(null)}
                className="hover:rotate-90 transition-transform"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* TÍTULO */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                  Título
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-slate-50 border rounded-xl font-bold outline-none focus:border-[#7F252E]"
                  value={editando.titulo}
                  onChange={(e) =>
                    setEditando({ ...editando, titulo: e.target.value })
                  }
                  required
                />
              </div>

              {/* AUTOR Y EDITORIAL */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                  Autor
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-slate-50 border rounded-xl font-bold outline-none focus:border-[#7F252E]"
                  value={editando.autor}
                  onChange={(e) =>
                    setEditando({ ...editando, autor: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                  Editorial
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-slate-50 border rounded-xl font-bold outline-none focus:border-[#7F252E]"
                  value={editando.editorial}
                  onChange={(e) =>
                    setEditando({ ...editando, editorial: e.target.value })
                  }
                />
              </div>

              {/* GÉNERO Y AÑO */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                  Género
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-slate-50 border rounded-xl font-bold outline-none focus:border-[#7F252E]"
                  value={editando.genero}
                  onChange={(e) =>
                    setEditando({ ...editando, genero: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                  Año Publicación
                </label>
                <input
                  type="number"
                  className="w-full p-3 bg-slate-50 border rounded-xl font-bold outline-none focus:border-[#7F252E]"
                  value={editando.anyo_publicacion}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      anyo_publicacion: e.target.value,
                    })
                  }
                />
              </div>

              {/* PÁGINAS E ISBN */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                  Páginas
                </label>
                <input
                  type="number"
                  className="w-full p-3 bg-slate-50 border rounded-xl font-bold outline-none focus:border-[#7F252E]"
                  value={editando.paginas}
                  onChange={(e) =>
                    setEditando({ ...editando, paginas: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                  ISBN
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-slate-50 border rounded-xl font-bold outline-none focus:border-[#7F252E] font-mono"
                  value={editando.isbn}
                  onChange={(e) =>
                    setEditando({ ...editando, isbn: e.target.value })
                  }
                />
              </div>

              {/* NOMBRE ARCHIVO PORTADA */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block text-blue-500">
                  Nombre de imagen
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-xl font-bold outline-none"
                  value={editando.portada_img}
                  onChange={(e) =>
                    setEditando({
                      ...editando,
                      portada_img: e.target.value.toLowerCase(),
                    })
                  }
                />
              </div>

              {/* ESTADO */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">
                  Estado del Ejemplar
                </label>
                <select
                  className="w-full p-3 bg-slate-50 border rounded-xl font-black text-[#7F252E] outline-none"
                  value={editando.estado}
                  onChange={(e) =>
                    setEditando({ ...editando, estado: e.target.value })
                  }
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Prestado">Prestado</option>
                  <option value="Extraviado">Extraviado</option>
                  <option value="No Disponible">No Disponible</option>
                </select>
              </div>

              {/* BOTONES */}
              <div className="md:col-span-2 flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-900/20"
                >
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={() => setEditando(null)}
                  className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-bold uppercase text-xs hover:bg-red-100 transition-all border border-red-100"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionLibros;
