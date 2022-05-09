import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'
import useAuth from '../hooks/useAuth'

const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ alerta, setAlerta ] = useState(false)
    const navigate = useNavigate()

    const { auth, setAuth, cargando } = useAuth()
    const handleSubmit = async (e) => {
        e.preventDefault()
        if( [email, password].includes('')){
            setAlerta({
                msj: 'Todos los campos son obligatorios',
                error: true
            })

            return
        }
        try {
            const { data } = await clienteAxios.post('/usuarios/login', {email, password})
            localStorage.setItem('token', data.token)
            setAlerta({})
            setAuth(data)
            navigate('/proyectos')
        } catch (error) {
            setAlerta({
                msj: error.response.data.msj,
                error: true
            })
        }
    }
    const { msj } = alerta;
  return (
    <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">
            Inicia sesión y administra tus 
            <span className="text-slate-700"> proyectos</span>
        </h1>
        {msj && <Alerta alerta={alerta} />}
        <form onSubmit={handleSubmit} className="my-5 bg-white shadow rounded-lg p-10">
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
            <input 
                type="submit"
                value="Iniciar Sesión"
                className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors" 
            />
        </form>
        <nav className="lg:flex lg:justify-between">
            <Link
                to="/registrar"
                className="block text-center  text-slate-500 uppercase text-sm"

            >¿No tienes una cuenta? Registrate</Link>
            <Link
                to="/olvide-password"
                className="block text-center text-slate-500 uppercase text-sm"

            >Olvide Mi Password</Link>
        </nav>
    </>
  )
}

export default Login