import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductContext } from '../componets/utils/ProductoContext';
import CardCategorias from '../componets/CardCategorias';
import CardProducto from '../componets/CardProducto';
import ReactPaginate from 'react-paginate';
import axios from 'axios';


function ProductosPorCategoria() {

    const params = useParams();
    const nombreCategoria = params.categoria;
    const { categorias } = useContext(ProductContext);
    const [productos, setProductos] = useState([]);

    const obtenerImagenes = (productId) => {
        return axios.get(`http://localhost:8080/images/product/${productId}`)
            .then((imgres) => imgres.data)
            .catch((error) => {
                console.error("Error al obtener datos de imágenes de la API: ", error);
                return [];
            });
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/products/by-category/${nombreCategoria}`)
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
    }, [nombreCategoria])

    const [currentPage, setCurrentPage] = useState(0);
    const [productosPorPagina, setProductosPorPagina] = useState(10);

    const totalProductos = productos.length;
    const totalPages = Math.ceil(totalProductos / productosPorPagina);
    const offset = currentPage * productosPorPagina;
    const currentProducts = productos.slice(offset, offset + productosPorPagina);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div>
            <div className='categorias'>
                <h2 className='homeH2'>Filtar Productos Por Categoria</h2>
                <div className='homeCardCategorias'>
                    {categorias.map(props => (
                        <CardCategorias
                            key={props.id}
                            img={props.urlImage}
                            name={props.name}
                        />
                    ))}
                </div>
            </div>
            <h2 className='homeH2'>Productos de categoria: {nombreCategoria}</h2>
            <div className='categorias recomendados'>
                <div className='homeCardCategorias homeCardProductos'>
                    {currentProducts.map(props => (
                        <CardProducto
                            key={props.id}
                            id={props.id}
                            carpeta={props.carpeta}
                            img={props.img.length > 0 ? props.img[0].url : "../../public/imagenes/no_encontrado.png"}
                            name={props.name}
                            precio={props.costPerDay.toLocaleString('es-CO')}
                            mostrarBotonAlquilar={true}
                            mostrarBotonEliminar={false}
                        />
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="pagination">
                        <ReactPaginate
                            previousLabel={'<'}
                            nextLabel={'>'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductosPorCategoria