import { useState } from 'react'
import { Link } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'

const Registrar = () => {
  const [ nombre, setNombre ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ repetirPassword, setRepetirPassword ] = useState('')
  const [ alerta, setAlerta ] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    if([ nombre, email, password, repetirPassword ].includes("")){
      setAlerta({
        msj: 'Todos los campos son obligatorios',
        error:true
      })
      return
    }
    if( password !== repetirPassword ){
      setAlerta({
        msj: 'Los Passwords no son iguales',
        error:true
      })
    }
    if( password.length < 6 ){
      setAlerta({
        msj: 'El password es muy corto, agrega minimo 6 caracteres',
        error:true
      })
    }

    setAlerta({})

    try {
      const { data } = await clienteAxios.post(`/usuarios`, {nombre, email, password})
      setAlerta({
        msj: data.msj,
        error: false
      })

      setNombre('')
      setEmail('')
      setPassword('')
      setRepetirPassword('')

    } catch (error) {
      setAlerta({
        msj:error.response.data.msj,
        error: true
      })
    }
  }

  const { msj } = alerta;

  return (
    <>
      
      <h1 className="text-sky-600 font-black text-6xl capitalize">
          Crea tu Cuenta y Administra tus 
          <span className="text-slate-700"> proyectos</span>
      </h1>
      {msj && <Alerta alerta={alerta} />}
      <form onSubmit={handleSubmit} className="my-5 bg-white shadow rounded-lg p-10">
          <div className="my-5 ">
              <label htmlFor="nombre" className="uppercase text-gray-600 block text-xl font-bold">Nombre</label>
              <input 
                  id="nombre"
                  type="text"
                  placeholder="Tu Nombre"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  value={nombre}
                  onChange={ e => setNombre(e.target.value)}
              />
          </div>
          <div className="my-5 ">
              <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
              <input 
                  id="email"
                  type="email"
                  placeholder="Email De Registro"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  value={email}
                  onChange={ e => setEmail(e.target.value)}
              />
          </div>
          <div className="my-5 ">
              <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Password</label>
              <input 
                  id="password"
                  type="password"
                  placeholder="Password De Registro"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  value={password}
                  onChange={ e => setPassword(e.target.value)}
              />
          </div>
          <div className="my-5 ">
              <label htmlFor="password2" className="uppercase text-gray-600 block text-xl font-bold">Repetir Password</label>
              <input 
                  id="password2"
                  type="password"
                  placeholder="Repetir tu password"
                  className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                  value={repetirPassword}
                  onChange={ e => setRepetirPassword(e.target.value)}
              />
          </div>
          <input 
              type="submit"
              value="Crear Cuenta"
              className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" 
          />
      </form>
      <nav className="lg:flex lg:justify-between">
          <Link
              to="/"
              className="block text-center  text-slate-500 uppercase text-sm"

          >¿Ya tienes una cuenta? Inicia Sesión</Link>
          <Link
              to="/olvide-password"
              className="block text-center text-slate-500 uppercase text-sm"

          >Olvide Mi Password</Link>
      </nav>
    </>
  )
}

export default Registrar