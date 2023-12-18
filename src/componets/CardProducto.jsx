import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Modal from './Modal';

function CardProducto(props) {
  const [favorito, setFavorito] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const obtenerFavorito = async () => {

      const userIdString = localStorage.getItem('userId');
      const userId = userIdString ? parseInt(userIdString, 10) : null;
      const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));

      if (userId && infoLocalStorage) {
        const headers = {
          'Authorization': `Bearer ${infoLocalStorage.jwt}`,
        };

        try {
          const response = await axios.get(`https://one023c04-grupo5-back.onrender.com/favorites/by-user-and-product/${userId}/${props.id}`, {
            headers,
          });

          // Verificar si la respuesta tiene un estado 404 (Not Found)
          if (response.status === 404) {
            setFavorito(false);  // No se encontró el recurso
          } else {
            setFavorito(response.data);  // Resto de los casos
          }
        } catch (error) {
          // Capturar la excepción
          if (error.response) {
            // Si la excepción es de un error de servidor, establecer el estado de favorito a false
            setFavorito(false);
          } else {
            // Si la excepción es de otro tipo, mostrarla en consola
            console.error('Error al obtener el estado de favorito:', error);
          }
        }
      }
    };

    obtenerFavorito();
  }, [props.id, props.reloadProductos]);

  const toggleFavorito = async () => {
    const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));
    const userIdString = localStorage.getItem('userId');
    const userId = userIdString ? parseInt(userIdString, 10) : null;

    if (infoLocalStorage && (infoLocalStorage.role === 'ADMIN' || infoLocalStorage.role === 'USER')) {
      try {
        if (favorito) {
          // Si el producto ya está marcado como favorito, enviar una solicitud DELETE para quitarlo
          await axios.delete(`https://one023c04-grupo5-back.onrender.com/favorites/by-user-and-product/${userId}/${props.id}`, {
            headers: {
              'Authorization': `Bearer ${infoLocalStorage.jwt}`,
            },
          });

          setFavorito(false);
        } else {
          // Si el producto no está marcado como favorito, enviar una solicitud POST para agregarlo
          await axios.post('https://one023c04-grupo5-back.onrender.com/favorites/create', {
            product: {
              id: props.id,
            },
            user: {
              id: userId,
            },
          }, {
            headers: {
              'Authorization': `Bearer ${infoLocalStorage.jwt}`,
            },
          });

          setFavorito(true);
        }
      } catch (error) {
        console.error('Error al actualizar estado de favorito:', error);
      }
    } else {
      // Mostrar el modal de autenticación en lugar de cambiar el estado de favorito
      setMostrarModal(true);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  return (
    <div className='CardProducto'>
      <div className='CardFavoritoIcon' onClick={toggleFavorito}>
        <FontAwesomeIcon
          icon={faStar}
          color={favorito ? 'gold' : 'white'}
          size="lg" />
      </div>
      {/* Imagen del producto */}
      <div className='CardCProductoImg'>
        <img src={`${props.img}`} alt={props.name} />
      </div>
      {/* Información del producto */}
      <div className='CardProductoInfo'>
        <h5>{props.name}</h5>
        <p>{props.precio} <span>COP / Día</span></p>
        {props.mostrarBotonAlquilar && <Link to={`/producto/${props.id}`}><button className='boton'>ALQUILAR</button></Link>}
        {props.mostrarBotonEliminar && <button className='boton'>Eliminar</button>}

        {mostrarModal && (
          <Modal onClose={cerrarModal}>
            <p>Debes iniciar sesión para marcar como favorito.</p>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default CardProducto;
