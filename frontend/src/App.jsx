function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-blue-500">
        <h1 className="text-3xl font-bold text-gray-800">
          📚 Librería Juan de Lanuza
        </h1>
        <p className="text-gray-600 mt-2">
          Si ves este texto con estilo, ¡Tailwind está funcionando!
        </p>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Probar botón
        </button>
      </div>
    </div>
  )
}

export default App