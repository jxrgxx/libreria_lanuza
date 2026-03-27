function LibroCard({ libro, user }) {
  const statusStyles = {
    Disponible: "bg-green-100 text-green-700 border-green-200",
    Prestado: "bg-orange-100 text-orange-700 border-orange-200",
    Extraviado: "bg-red-100 text-red-700 border-red-200",
    "No Disponible": "bg-gray-100 text-gray-700 border-gray-200"
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* 1. ÁREA DE IMAGEN (PORTADA) */}
      <div className="relative h-64 bg-slate-100 overflow-hidden">
        <img 
          src={libro.portada ? `/portadas/${libro.portada}` : '/portadas/default.png'} 
          alt={libro.titulo} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Badge de estado sobre la imagen */}
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-lanuza font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-sm ${statusStyles[libro.estado] || statusStyles["No Disponible"]}`}>
            {libro.estado?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 2. CUERPO DE LA TARJETA */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Título del libro */}
        <h3 className="font-lanuza font-bold text-lg text-slate-800 leading-tight mb-4 min-h-[3rem] line-clamp-2">
          {libro.titulo}
        </h3>

        {/* METADATOS (Autor, Género, Páginas) */}
        <div className="text-sm space-y-2 font-lanuza flex-1">
          <p className="text-slate-500">
            <span className="font-bold text-black mr-1">Autor:</span> 
            {libro.autor}
          </p>
          <p className="text-slate-500">
            <span className="font-bold text-black mr-1">Género:</span> 
            {libro.genero}
          </p>
          <p className="text-slate-500">
            <span className="font-bold text-black mr-1">Páginas:</span> 
            {libro.paginas}
          </p>
        </div>

        {/* 3. BOTONES DE ACCIÓN */}
        <div className="mt-6 flex gap-2">
          {/* Botón Prestar: Solo visible para bibliotecarios */}
          {user && (
            <button className="flex-1 text-xs font-bold py-3 bg-[#7F252E] text-white rounded-xl hover:bg-[#631d24] transition-all transform active:scale-95 shadow-md shadow-red-900/10 uppercase tracking-wider">
              Prestar
            </button>
          )}
          
          {/* Botón Detalles: Visible para todos */}
          <button className="flex-1 text-xs font-bold py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all transform active:scale-95 uppercase tracking-wider">
            Detalles
          </button>
        </div>

      </div>
    </div>
  );
}

export default LibroCard;