import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"
const NuevaPassword = () => {
  const params = useParams();
  const [ password, setPassword ] = useState('')
  const { token } = params;
  const [ tokenValido, setTokenValido ] = useState(false)
  const [ alerta, setAlerta ] = useState({})
  const [ passwordModificado, setPasswordModificado ] = useState(false)

  useEffect( () => {
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`)
        setTokenValido(true)
      } catch (error) {
        console.log(error.response)
        setAlerta({
          msj: error.response.data.msj,
          error: true
        })
      }
    }
    comprobarToken()
  }, [])
  const { msj } = alerta

  const handleSubmit = async (e) => {
    e.preventDefault()
    if( password.length < 6) {
      setAlerta({
        msj: 'El password debe ser minimo de 6 caracteres.',
        error: true
      })
      return
    }

    try {
      const url = `/usuarios/olvide-password/${token}`
      const { data } =  await clienteAxios.post(url, { password })
      setAlerta({
        msj: data.msj,
        error: false
      })
      setPasswordModificado(true)
    } catch (error) {

      setAlerta({
        msj: error.response.data.msj,
        error: true
      })
    }

  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
          Restablece tu password y no pierdas acceso a tus
          <span className="text-slate-700"> proyectos</span>
      </h1>
      {msj && <Alerta alerta={alerta} />}
      {
        token && (
          <form onSubmit={handleSubmit} className="my-5 bg-white shadow rounded-lg p-10">

              <div className="my-5 ">
                  <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Nuevo Password</label>
                  <input 
                      id="password"
                      type="password"
                      placeholder="Escribe Tu Nuevo Password"
                      className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                      value={password}
                      onChange={ e => setPassword(e.target.value)}
                  />
              </div>

              <input 
                  type="submit"
                  value="Guardar Nuevo Password"
                  className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" 
              />
          </form>

        )
      }

    { passwordModificado && (
          <Link
            to="/"
            className="block text-center  text-slate-500 uppercase text-sm"
      
          >Inicia Sesión</Link>
        )}
    </>
  )
}

export default NuevaPassword