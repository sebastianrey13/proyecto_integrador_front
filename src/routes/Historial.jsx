// Historial.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cargando1 from "../../public/imagenes/cargando1.gif"

function Historial() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));
    const userID = infoLocalStorage.id;
    setLoading(true);

    // Obtener las reservas anteriores del usuario
    axios.get(`http://localhost:8080/reservations/by-user/${userID}`, {
      headers: {
        'Authorization': `Bearer ${infoLocalStorage.jwt}`,
      },
    })
      .then(response => {
        setReservas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al obtener las reservas del usuario: ", error);
      });
  }, []);

  return (
    <div className="historial-container">
      <h2>Historial de Reservas</h2>
      {reservas.length === 0 ? (
        <p>No hay reservas anteriores.</p>
      ) : (
        <ul className="reservas-list">
          {reservas.map(reserva => (
            <li key={reserva.id} className="reserva-item">
              <p><strong>Fecha de reserva:</strong> {reserva.check_in_date}</p>
              <p><strong>Fecha de uso:</strong> {reserva.checkout_date}</p>
              <p><strong>Producto reservado:</strong> {reserva.product.name}</p>
            </li>
          ))}
        </ul>
      )}
      {loading &&
        <div className='cargandoProducto'>
          <img className='gifCargandoProducto' src={cargando1} alt="" />
        </div>}
    </div>
  );
}

export default Historial;
