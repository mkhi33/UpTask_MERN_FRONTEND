import { useEffect } from 'react'
import PreviewProyecto from '../components/PreviewProyecto'
import useProyectos from '../hooks/useProyectos'
import Alerta from '../components/Alerta'

const Proyectos = () => {
  const { proyectos, mostrarAlerta, alerta } = useProyectos()
  const { msj } = alerta
  return (
    <>
      <h1 className="text-4xl font-bold mb-3">Proyectos</h1>
      {msj && <Alerta alerta={alerta} />}
      <div className='bg-white shadow rounded-lg'>
        {proyectos.length ? (
          proyectos.map( proyecto => (
            <PreviewProyecto key={proyecto._id} proyecto={proyecto} />
          ))
        ) : <p className='mt-5 text-center text-gray-600 uppercase p-5'>No hay proyectos aún</p>}
      </div>
    </>
  )
}

export default Proyectos