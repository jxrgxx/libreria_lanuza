import { useState } from 'react'
import axios from 'axios'
import  { useNavigate } from 'react-router-dom'

function Login({ onLoginSuccess }) {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:3001/login', {
        correo: correo,
        contrasenya: password
      })
      
      if (res.data.success) {
        onLoginSuccess(res.data.user)
        navigate('/dashboard')
      }
    } catch (err) {
      setError('Correo o contraseña incorrectos')
    }
  }

  return (
    <div className="min-h-screen bg-indigo-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-indigo-500">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900">Biblioteca Lanuza</h1>
          <p className="text-gray-500 mt-2 italic text-sm">Colegio Juan de Lanuza</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <input 
              type="email" 
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="biblioteca@lanuza.es"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input type="password" className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="••••••••••••••"
            value = {password} onChange ={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm font-bold animate-bounce">{error}</p>}
          <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition transform hover:scale-105 active:scale-95 shadow-lg">
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login