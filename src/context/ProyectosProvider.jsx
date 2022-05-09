import { useState, useEffect, createContext } from 'react';
import clienteAxios from '../config/clienteAxios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
import useAuth from '../hooks/useAuth'

let socket;

const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {

    const [ proyectos, setProyectos ] = useState([])
    const [ alerta, setAlerta ] = useState({})
    const [ proyecto, setProyecto ] = useState({})
    const [ cargando, setCargando ] = useState(false)
    const [ modalFormularioTarea, setModalFormularioTarea ] = useState(false)
    const [ tarea, setTarea ] = useState({})
    const [ modalEliminarTarea, setModalEliminarTarea ] = useState(false)
    const [ colaborador, setColaborador ] = useState({})
    const [ modalEliminarColaborador, setModalEliminarColaborador ] = useState(false)
    const [ buscador, setBuscador ] = useState(false)
    const navigate = useNavigate();

    const { auth } = useAuth()


    useEffect( () => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}` 
                    }
                }
                const { data } = await clienteAxios('/proyectos', config)
                setProyectos(data)
            } catch (error) {
                
            }
        }
        obtenerProyectos()
    }, [ auth ])

    useEffect( () => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])


    const handleModalEditarTarea =  tarea => {
        setTarea(tarea)
        setModalFormularioTarea(true)
    }
    const handleModalEliminarTarea =  tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const obtenerProyecto = async id => {

        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            }
            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)
        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msj:error.response.data.msj,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        }
        setCargando(false)

    }

    const mostrarAlerta = (alerta) => {
        setAlerta(alerta)
        setTimeout(() => {
            setAlerta({})
        }, 5000);
    }

    const submitProyecto = async (proyecto) => {
        if(proyecto.id){
            await editarProyecto(proyecto)
        }else {
            await nuevoProyecto(proyecto)
        }
        

    }
    
    const editarProyecto = async  proyecto  => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            }
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

            const proyectosActualizados = proyectos.map( proyectoState => proyectoState._id === data._id ? data: proyectoState)
            setProyectos(proyectosActualizados)
            setAlerta({
                msj: 'Proyecto Actualizado Correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            
        }
        
    }
    const nuevoProyecto = async  proyecto  => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            }

            const { data } = await clienteAxios.post('/proyectos', proyecto, config)
            setAlerta({
                msj: 'Proyecto creado correctamente',
                error: false
            })
            setProyectos([...proyectos, data])
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            console.log(error)
        }

    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            }
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)
            const proyectosActualizados = proyectos.filter( proyectoState => proyectoState._id !== id )
            setProyectos(proyectosActualizados)
            setAlerta({
                msj: data.msj,
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }
    const submitTarea = async (tarea) => {

        if( tarea.id ){
            await editarTarea(tarea)
        }else {
            await crearTarea(tarea)
        }

    }

    const crearTarea = async (tarea) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            }
            const { data } = await clienteAxios.post('/tareas', tarea, config)
            setAlerta({})
            setModalFormularioTarea(false)
            // Socket io
            socket.emit('onNuevaTarea', data)

        } catch (error) {
            console.log(error)
        }
    }

    const editarTarea = async (tarea) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)


            setAlerta({})
            setModalFormularioTarea(false)

            // SOCKET
            socket.emit('onActualizarTarea', data)

        } catch (error) {
            console.log(error)
        }

    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            setAlerta({
                msj: data.msj,
                error: false
            })
            
            // SOCKET IO
            socket.emit('onEliminarTarea', tarea)
            setModalEliminarTarea(false)
            setTimeout(() => {
                setAlerta({})
            }, 3000);

            setTarea({})

            
        } catch (error) {
            console.log(error)   
        }
    }

    const submitColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            }
            const { data } = await clienteAxios.post('/proyectos/colaboradores',{email}, config)
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            setAlerta({
                msj: error.response.data.msj,
                error: true
            })
        }
        setCargando(false)
    }

    const agregarColaborador = async (email) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            }
        
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`,email, config)
            setAlerta({
                msj: data.msj,
                error: false
            })
            setColaborador({})

        } catch (error) {
            setAlerta({
                msj: error.response.data.msj,
                error: true
            })
        }
        setTimeout(() => {
            setAlerta({})
        }, 3000);
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setColaborador(colaborador)
        setModalEliminarColaborador(!modalEliminarColaborador)
    }

    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            }
        
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`,{id: colaborador._id}, config)
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter( colaboradorState => colaboradorState._id !== colaborador._id)
            setProyecto(proyectoActualizado)
            setAlerta({
                msj:data.msj,
                error: false
            })
            setColaborador({})
            setModalEliminarColaborador(false)
            // Actualizar el state
        } catch (error) {
            setAlerta({
                msj: error.response.data.msj,
                error: true
            })
        }

        setTimeout(() => {
            setAlerta({})
        }, 3000);
    }

    const completarTarea = async (id) => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                }
            }
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, { }, config)

            setTarea({})
            setAlerta({})
            // SOCKET
            socket.emit('onCambiarEstado', data)
        } catch (error) {
            console.log(error.response)
        }
    }
    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    // socket io
    const submitTareasProyecto = (tarea) => {
        // Agregar la tarea al state
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado)
    }
    const submitEliminarTareaProyecto = (tarea) => {
        // Agregar la tarea al state
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter( tareaState => tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado)
    }
    const submitActualizarTareaProyecto = (tarea) => {
        // Agregar la tarea al state
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }
    const submitCambiarNuevoEstadoTarea = (tarea) => {
        // Agregar la tarea al state
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})

    }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                submitEliminarTareaProyecto,
                submitActualizarTareaProyecto,
                submitCambiarNuevoEstadoTarea,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext