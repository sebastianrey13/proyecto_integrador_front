import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import CardMessageConfirm from '../componets/CardMessageConfirm';
import { ProductContext } from '../componets/utils/ProductoContext';
import salir from "../../public/imagenes/salir.png"
import adminNoDisponible from "../../public/imagenes/admin_no_disponible.png"
import cargando1 from "../../public/imagenes/cargando1.gif"

function Administrador() {

    const { recargarProductos, verificarAcceso } = useContext(ProductContext);
    const [isMobile, setIsMobile] = useState(false);
    const [productos, setProductos] = useState([]);
    const [verTablaProductos, setVerTablaProductos] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [verTablaCategorias, setVerTablaCategorias] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    //------------------------ Listar Producto--------------------------

    const listarProductos = () => {
        setProductos([]);
        setVerTablaProductos(true)
        setVerTablaCategorias(false)
        setLoading(true)
        axios.get("https://one023c04-grupo5-back.onrender.com/products")
            .then((res) => {
                setProductos(res.data)
                setLoading(false)
                recargarProductos();
            })
            .catch((error) => {
                console.error("Error al obtener datos de la API: ", error);
            });
    }

    //------------------- Eliminar Producto -------------------------

    const eliminarProducto = (id) => {
        const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));
        axios.delete(`https://one023c04-grupo5-back.onrender.com/products/delete/${id}`, {
            headers: {
                'Authorization': `Bearer ${infoLocalStorage.jwt}`
            }
        }
        ).then((res) => {
            listarProductos();
        })
            .catch((error) => {
                if (error.response) {
                    console.error("Error en la respuesta del servidor: ", error.response.data);
                } else {
                    console.error("Error al realizar la solicitud: ", error.message);
                }
            });
    }

    const confirmEliminarProducto = (id, name) => {
        const resultado = confirm(`Deseas eliminar el producto "${name}"`)
        if (resultado) {
            eliminarProducto(id)
            alert(`Producto "${name}" eliminado`);
        }
        else {
            console.log("producto no eliminado")
        }
    }

    //--------------------- Listar Categoria ----------------------------


    const listarCategorias = () => {
        setCategorias([]);
        setVerTablaProductos(false)
        setVerTablaCategorias(true)
        setLoading(true)
        axios.get("https://one023c04-grupo5-back.onrender.com/categories")
            .then((res) => {
                setCategorias(res.data)
                setLoading(false)
                recargarProductos();
            })
            .catch((error) => {
                console.error("Error al obtener datos de la API: ", error);
            });
    }

    //------------------- Eliminar Categoria -------------------------

    const eliminarCategoria = (id) => {
        const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));
        axios.delete(`https://one023c04-grupo5-back.onrender.com/categories/delete/${id}`, {
            headers: {
                'Authorization': `Bearer ${infoLocalStorage.jwt}`
            }
        }
        ).then((res) => {
            listarCategorias();
        })
            .catch((error) => {
                if (error.response) {
                    console.error("Error en la respuesta del servidor: ", error.response.data);
                } else {
                    console.error("Error al realizar la solicitud: ", error.message);
                }
            });
    }

    const confirmEliminarCategoria = (id, name) => {
        const resultado = confirm(`Deseas eliminar la categoria "${name}"`)
        if (resultado) {
            eliminarCategoria(id)
            alert(`Categoria "${name}" eliminada`);
        }
        else {
            console.log("Categoria no eliminada")
        }
    }


    // ------------------------------------------------------------------

    return (
        <div>
            {verificarAcceso()}
            <h2 className='h2Administracion'>ADMINISTRACIÓN</h2>
            {isMobile ? (
                <div className='alert-message'>
                    <Link to='/home'><img className='formImgSalir salirAdmin' src={salir} alt="" /></Link>
                    <img className='imgNoDisponibleAdmin' src={adminNoDisponible} alt="" />
                    <h3>El panel de administración no está disponible desde dispositivos móviles.</h3>
                </div>
            ) : (
                //opciones panel administracion
                <div>
                    <div className='opcionesAdmin'>
                        <div className='panelProductos'>
                            <h3>Productos</h3>
                            <Link to='/administrador/añadir_producto'>
                                <button className='boton'>Agregar</button>
                            </Link>
                            <button className='boton' onClick={listarProductos}>
                                Listar
                            </button>
                        </div>
                        <div className='panelProductos'>
                            <h3>Categorias</h3>
                            <Link to='/administrador/añadir_categoria'>
                                <button className='boton'>Agregar</button>
                            </Link>
                            <button className='boton' onClick={listarCategorias}>
                                Listar
                            </button>
                        </div>
                    </div>
                    {verTablaProductos && (
                        <div>
                            <table className='productList'>
                                <thead>
                                    <tr>
                                        <th
                                            colSpan="4"
                                            className='tituloTabla'
                                        >
                                            Productos
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='columnaId'>ID</th>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                        <th className='columnaAccionProduco'>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map((producto) => (
                                        <tr key={producto.id}>
                                            <td>{producto.id}</td>
                                            <td>{producto.name}</td>
                                            <td>${producto.costPerDay.toLocaleString('es-CO')} cop/dia</td>
                                            <td className='tdBoton'>
                                                <div>
                                                    <Link to={`/administrador/editar_producto/${producto.id}`}><button className='boton botonEditarEliminarProducto'>Editar</button></Link>
                                                    <button
                                                        className='boton botonEditarEliminarProducto'
                                                        onClick={() => confirmEliminarProducto(producto.id, producto.name)}
                                                    >Eliminar</button>
                                                </div>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {loading &&
                                <div className='cargandoProducto'>
                                    <img className='gifCargandoProducto' src={cargando1} alt="" />
                                </div>}
                        </div>
                    )}

                    {verTablaCategorias && (
                        <div>
                            <table className='productList'>
                                <thead>
                                    <tr>
                                        <th
                                            colSpan="3"
                                            className='tituloTabla'
                                        >
                                            Categorias
                                        </th>
                                    </tr>
                                    <tr>
                                        <th
                                        className='columnaId'>ID</th>
                                        <th className=''>Nombre</th>
                                        <th className='columnaAccionCategoria'>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorias.map((categoria) => (
                                        <tr key={categoria.id}>
                                            <td>{categoria.id}</td>
                                            <td>{categoria.name}</td>
                                            <td className='tdBoton'>
                                                <div>
                                                    <Link to={`/administrador/editar_categoria/${categoria.id}`}><button className='boton botonEditarEliminarProducto'>Editar</button></Link>
                                                    <button
                                                        className='boton botonEditarEliminarProducto'
                                                        onClick={() => confirmEliminarCategoria(categoria.id, categoria.name)}
                                                    >Eliminar</button>
                                                </div>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {loading &&
                                <div className='cargandoProducto'>
                                    <img className='gifCargandoProducto' src={cargando1} alt="" />
                                </div>}
                        </div>
                    )}
                </div>
            )};
        </div>
    );
}

export default Administrador;