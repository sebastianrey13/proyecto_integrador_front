import React, { createContext, useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

// Crear el contexto
export const ProductContext = createContext();

// Crear el proveedor del contexto
export const ProductContextProvider = ({ children }) => {

    const [reloadProducts, setReloadProducts] = useState(false);
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);


    const obtenerImagenes = (productId) => {
        return axios.get(`https://one023c04-grupo5-back.onrender.com/images/product/${productId}`)
            .then((imgres) => imgres.data)
            .catch((error) => {
                console.error("Error al obtener datos de imágenes de la API: ", error);
                return [];
                //En caso de error, la función devuelve un array vacío ([]). Esto se hace para que, en caso de error, la función siempre devuelva algo y no cause problemas cuando se use más adelante.
            });
    };

useEffect(() => {
    axios
    .get("https://one023c04-grupo5-back.onrender.com/products")
    .then((res) => {
        const promesasImagenes = res.data.map((producto) => {
        return obtenerImagenes(producto.id)
            .then((imagenes) => ({
            ...producto,
            img: imagenes,
            }));
        });

                Promise.all(promesasImagenes)
                    .then((productosConImagenes) => {
                        setProductos(productosConImagenes);
                    })
                    .catch((error) => {
                        console.error("Error al obtener datos de la API: ", error);
                    });
            })
            .catch((error) => {
                console.error("Error al obtener datos de la API: ", error);
            });
    }, [reloadProducts]);

    useEffect(() => {
        axios.get('https://one023c04-grupo5-back.onrender.com/categories')
            .then((res) => {
                setCategorias(res.data)
            }).catch((error) => {
                console.error("Error al obtener datos de la API: ", error);
            });
    }, [reloadProducts])


    const recargarProductos = () => {
        setReloadProducts((prev) => !prev);
    };

    const verificarAcceso = () => {
        const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));
        if (!infoLocalStorage || infoLocalStorage.role !== 'ADMIN') {
            return <Navigate to="/home" />;
        }
    }
    
    return (
        <ProductContext.Provider value={{ productos, categorias, recargarProductos, verificarAcceso }}>
            {children}
        </ProductContext.Provider>
    );
};