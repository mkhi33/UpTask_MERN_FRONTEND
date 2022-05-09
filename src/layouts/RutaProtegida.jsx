
import { Navigate, Outlet, useParams } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
const RutaProtegida = () => {

    const { auth, cargando } = useAuth();

    if( cargando ) {
      return 'cargando...'
    }

  return (

    <>
        {auth._id ? (
          <div className="bg-gray-100">
            <Header />
            <div className="md:flex md:min-h-screen">
              <Sidebar />
              <main className="p-10 flex-1">
                <Outlet />
              </main>
            </div>
          </div>
        ): <Navigate to='/' /> }
    </>
  )
}

export default RutaProtegida