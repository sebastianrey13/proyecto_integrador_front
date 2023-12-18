import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CardProducto from '../componets/CardProducto';
import cargando1 from "../../public/imagenes/cargando1.gif"

function Favoritos() {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(false);

  
    const obtenerImagenes = async (productId) => {
      try {
        const imgres = await axios.get(`https://one023c04-grupo5-back.onrender.com/images/product/${productId}`);
        return imgres.data;
      } catch (error) {
        console.error("Error al obtener datos de imágenes de la API: ", error);
        return [];
      }
    };
  
    useEffect(() => {
      const obtenerFavoritos = async () => {
        setLoading(true);
        const userIdString = localStorage.getItem('userId');
        const userId = userIdString ? parseInt(userIdString, 10) : null;
        const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));
  
        if (userId && infoLocalStorage) {
          const headers = {
            'Authorization': `Bearer ${infoLocalStorage.jwt}`,
          };
  
          try {
            const response = await axios.get(`https://one023c04-grupo5-back.onrender.com/favorites/by-user/${userId}`, {
              headers,
            });
  
            const favoritosIds = response.data.map((favorito) => favorito.product.id);
            const productosFavoritos = await Promise.all(
              favoritosIds.map(async (productoId) => {
                const productoResponse = await axios.get(`https://one023c04-grupo5-back.onrender.com/products/${productoId}`);
                const imagenes = await obtenerImagenes(productoId);
                return {
                  ...productoResponse.data,
                  img: imagenes,
                };
              })
            );
  
            setFavoritos(productosFavoritos);
            setLoading(false);
          } catch (error) {
            console.error("Error al obtener los productos favoritos del usuario:", error);
          }
        }
      };
  
      obtenerFavoritos();
    }, []);
  
    return (
      <div className="favoritos-container">
        <h2 className='homeH2'>Tus Productos Favoritos</h2>
        {favoritos.length === 0 ? (
          <p>No tienes productos marcados como favoritos.</p>
        ) : (
            <div className='homeCardCategorias homeCardProductos'>
            {favoritos.map((producto) => (
              <CardProducto
                key={producto.id}
                id={producto.id}
                img={producto.img.length > 0 ? producto.img[0].url : "../imagenes/no_encontrado.png"}
                name={producto.name}
                precio={producto.costPerDay.toLocaleString('es-CO')}
                mostrarBotonAlquilar={true}
                mostrarBotonEliminar={false}
              />
            ))}
          </div>
        )}
        {loading &&
        <div className='cargandoProducto'>
          <img className='gifCargandoProducto' src={cargando1} alt="" />
        </div>}
      </div>
    );
  }
  
  export default Favoritos;