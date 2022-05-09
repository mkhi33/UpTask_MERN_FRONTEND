export const formatearFecha = fecha => {
    const nuevaFecha = new Date(fecha.split('T')[0].split('-'))

    return nuevaFecha.toLocaleDateString('es-ES', {
        weekday:"long",
        year: 'numeric',
        month:"long",
        day:"numeric"
    })
}