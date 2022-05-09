import { Link } from "react-router-dom"
import { useState } from 'react'
import Alerta from '../components/Alerta'
import clienteAxios from "../config/clienteAxios"
const OlvidePassword = () => {
    const [ email, setEmail] = useState('')
    const [ alerta, setAlerta ] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault()
        if( email === '' || email.length < 6){
            setAlerta({
                msj: 'El email es obligatorio',
                error: true
            })
            return;
        }
        try {
            const { data } = await clienteAxios.post(`/usuarios/olvide-password`, {email})
            setAlerta({
                msj: data.msj,
                error: false
            })
        } catch (error) {
            setAlerta({
                msj: error.response.data.msj,
                error: true
            })
        }
    }

    const { msj } = alerta

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
          Recupera tu acceso y no pierdas tus
          <span className="text-slate-700"> proyectos</span>
      </h1>
      {msj && <Alerta alerta={alerta}/>}
      <form onSubmit={handleSubmit} className="my-5 bg-white shadow rounded-lg p-10">
         
          <div className="my-5 ">
              <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
              <input 
                  id="email"
                  type="email"
                  placeholder="Email De Registro"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  value={email}
                  onChange={ (e) => setEmail(e.target.value)}
              />
          </div>
          
          <input 
              type="submit"
              value="Enviar Instrucciones"
              className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" 
          />
      </form>
      <nav className="lg:flex lg:justify-between">
          <Link
              to="/"
              className="block text-center  text-slate-500 uppercase text-sm"

          >¿Ya tienes una cuenta? Inicia Sesión</Link>
          <Link
              to="/registrar"
              className="block text-center  text-slate-500 uppercase text-sm"

          >¿No tienes una cuenta? Registrate</Link>
      </nav>
    </>
  )
}

export default OlvidePassword