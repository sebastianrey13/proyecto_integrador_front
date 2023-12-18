import React from 'react';
import { useState, useEffect, useContext } from 'react';
import CardCategorias from '../componets/CardCategorias';
import CardProducto from '../componets/CardProducto';
import { ProductContext } from '../componets/utils/ProductoContext';
import axios from 'axios';
import Search from '../componets/Search';
import { faL } from '@fortawesome/free-solid-svg-icons';
import cargando1 from "../../public/imagenes/cargando1.gif"


function Home() {

    const { productos, categorias } = useContext(ProductContext);
    const [loading, setLoading] = useState(false);

    const [productosMezclados, setProductosMezclados] = useState([]);
    const productosPorPagina = 10;

    useEffect(() => {
        setLoading(true);
        const mezclarArray = (array) => {
            const arrayMezclado = [...array];
            for (let i = arrayMezclado.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arrayMezclado[i], arrayMezclado[j]] = [arrayMezclado[j], arrayMezclado[i]];
            }
            setProductosMezclados(arrayMezclado);
        };

        if (productos.length > 0) {
            mezclarArray(productos);
            setLoading(false);
        }
    }, [productos]);

    return (
        <div>
            <div className='home'>
                <div>
                </div>
                <div className='buscador'>
                    <h2>BUSQUEDA</h2>
                    <p>Ingrese un término de búsqueda para encontrar productos.</p>
                    <Search />
                </div>
                <div className='categorias'>
                    <h2 className='homeH2'>CATEGORIAS</h2>
                    <p className='homeP'>Explora la conveniencia y la eficiencia de nuestro servicio de alquiler de herramientas de construcción. ¡Pon en marcha tus proyectos con las herramientas adecuadas, adaptadas a tus necesidades en la construcción!</p>
                    <div className='homeCardCategorias'>
                        {categorias.map(props => (
                            <CardCategorias
                                key={props.id}
                                CardCategorias={props.id}
                                img={props.urlImage}
                                name={props.name}
                            />
                        ))}
                    </div>
                </div>
                <div className='categorias recomendados'>
                    <h2 className='homeH2'>RECOMENDADOS</h2>
                    <p className='homeP'>Descubre nuestra selección de herramientas altamente recomendadas</p>
                    {loading &&
                        <div className='cargandoProducto'>
                            <img className='gifCargandoProducto' src={cargando1} alt="" />
                        </div>}
                    <div className='homeCardCategorias homeCardProductos'>
                        {productosMezclados.slice(0, productosPorPagina).map(props => (
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
                </div>

            </div>
        </div>
    )
}

export default Home