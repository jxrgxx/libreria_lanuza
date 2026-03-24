import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [libros, setLibros] = useState([])

  const obtenerLibros = async () => {
    try {
      const respuesta = await axios.get('http://localhost:3001/libros')
      setLibros(respuesta.data)
    } catch (error) {
      console.error("Error al traer libros:", error)
    }
  }

  useEffect(() => {
    obtenerLibros()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Encabezado */}
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-900">📚 Biblioteca Juan de Lanuza</h1>
          <p className="text-gray-500 text-lg">Panel de Gestión de Inventario</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md">
          + Añadir Libro
        </button>
      </header>

      {/* Grid de Libros */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libros.map((libro) => (
          <div key={libro.id_libro} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800 leading-tight">{libro.titulo_libro}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  libro.estado_libro === 'Disponible' ? 'bg-green-100 text-green-700' : 
                  libro.estado_libro === 'Prestado' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                }`}>
                  {libro.estado_libro}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-semibold">Autor:</span> {libro.autor_libro}</p>
                <p><span className="font-semibold">Editorial:</span> {libro.editorial_libro}</p>
                <p><span className="font-semibold">Género:</span> {libro.genero_libro}</p>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                  Ver Ficha
                </button>
                <button className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-100 transition">
                  Prestar
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

export default App