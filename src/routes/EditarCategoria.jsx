import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ProductContext } from '../componets/utils/ProductoContext';
import salir from "../../public/imagenes/salir.png"

function EditarCategoria() {
    const params = useParams();
    const idCategoria = parseInt(params.id);
    const { recargarProductos, verificarAcceso } = useContext(ProductContext);

    const [categoria, setCategoria] = useState({
        name: '',
        description: ''
    });

    const [productoNombre, setProductoNombre] = useState('');
    const [productoDescripcion, setProductoDescripcion] = useState('');
    const [urlImage, setUrlImage] = useState('')
    const [selectedFiles, setSelectedFiles] = useState([]);


    useEffect(() => {
        axios.get(`http://localhost:8080/categories/${idCategoria}`)
            .then((res) => {
                setValoresIniciales(res.data);
                setUrlImage(res.data.urlImage)
            })
            .catch((error) => {
                console.error("Error al obtener datos de la API: ", error);
            });
    }, [idCategoria]);


    const handleSubmit = (e) => {
        e.preventDefault()

        const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));

        const editarCategoria = {
            id: idCategoria,
            name: productoNombre,
            description: productoDescripcion,
        }

        const dataCategoriaJson = JSON.stringify(editarCategoria);

        const dataCategoriaBlob = new Blob([dataCategoriaJson], { type: "application/json" })

        const formData = new FormData();

        if (selectedFiles.length > 0) {
            formData.append('file', selectedFiles[0]);
        } else {
            // Agrega un Blob vacío si no hay archivo seleccionado
            formData.append('file', new Blob([]));
        }

        formData.append('category', dataCategoriaBlob);

        const config = {
            headers: {
                'Authorization': `Bearer ${infoLocalStorage.jwt}`,
                'Content-Type': 'multipart/form-data'
            }
        };

        axios.put("http://localhost:8080/categories/update", formData, config)
            .then(response => {
                console.log("Categoria editada");
                alert("Categoria editada");
                recargarProductos();
                volver();
            })
            .catch(error => {
                console.error(error);
                alert("Categoria no editada");
            });
    }

    const setValoresIniciales = (categoria) => {
        setProductoNombre(categoria.name);
        setProductoDescripcion(categoria.description);
    }

    const navigate = useNavigate();

    const volver = () => {
        navigate('/administrador');
    }


    return (
        <div className='añadirProductos'>
            {verificarAcceso()}
            <h2>EDITAR CATEGORIA ID: {categoria.id}</h2>
            <div className='formAñadirProducto'>
            <Link to='/administrador'><img className='formImgSalir' src={salir} alt="" /></Link>
                <form
                    onSubmit={handleSubmit}
                >
                    <div>
                        <img className='añadirProductosImg' src="" alt="" />
                        <input
                            className='estilosForm'
                            type="text"
                            placeholder='Ingrese el nombre'
                            value={productoNombre}
                            onChange={(e) => setProductoNombre(e.target.value)}
                        />
                    </div>
                    <div>
                        <img className='añadirProductosImg' src="" alt="" />
                        <input
                            className='estilosForm'
                            type="file"
                            onChange={(e) => setSelectedFiles(e.target.files)}
                        />
                    </div>
                    <div>
                        <textarea
                            className='estilosForm'
                            name=""
                            id=""
                            cols="22"
                            rows="5"
                            value={productoDescripcion}
                            placeholder='Ingresa la descripcion del producto'
                            onChange={(e) => setProductoDescripcion(e.target.value)}
                        >
                        </textarea>
                    </div>
                    <div>
                        <button
                            className='boton'
                        >Editar Categoria</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditarCategoria