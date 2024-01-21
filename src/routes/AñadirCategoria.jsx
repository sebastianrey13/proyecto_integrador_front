import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, Link, Navigate , useNavigate} from 'react-router-dom'
import axios from 'axios';
import { ProductContext } from '../componets/utils/ProductoContext';
import salir from "../../public/imagenes/salir.png"

function AñadirCategoria() {

    const { recargarProductos, verificarAcceso } = useContext(ProductContext);
    const form = useRef();
    const navigate = useNavigate();
    const [categoriaNombre, setCategoriaNombre] = useState('');
    const [categoriaDescripcion, setCategoriaDescripcion] = useState('');
    const [selectedFile, setselectedFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault()
        const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));

        const formData = new FormData();
        // formData.append('file', selectedFile);

        const dataCategoria = {
            name: categoriaNombre,
            description: categoriaDescripcion
        }

        const dataCategoriaJson = JSON.stringify(dataCategoria);

        const dataCategoriaBlob = new Blob([dataCategoriaJson], { type: "application/json" })

        formData.append('file', selectedFile[0]);

        formData.append('category', dataCategoriaBlob);

        const config = {
            headers: {
                'Authorization': `Bearer ${infoLocalStorage.jwt}`,
                'Content-Type': 'multipart/form-data'
            }
        };

        axios.post("http://localhost:8080/categories/create", formData, config)
            .then(response => {
                console.log("Categoria creada");
                console.log(response.data);
                form.current.reset();
                recargarProductos();
                alert(`Categoria ${response.data.name} creada`)
                navigate('/administrador')
                
            })
            .catch(error => {
                console.error(error);
                alert("Categoria no fue creada");
            });

        // Esto es para ver por consola el contenido de formData

        // const logFormData = (formData) => {
        //     for (const pair of formData.entries()) {
        //         console.log(`${pair[0]}, ${pair[1]}`);
        //     }
        // };
        // logFormData(formData);

        //-----------------------------------------------------

    }

    return (
        <div className='añadirProductos'>
            {verificarAcceso()}
            <h2>AGREGAR CATEGORIA</h2>
            <div className='formAñadirProducto'>
                <Link to='/administrador'><img className='formImgSalir' src={salir} alt="" /></Link>
                <form
                    ref={form}
                    onSubmit={handleSubmit}
                >
                    <div>
                        <img className='añadirProductosImg' src="" alt="" />
                        <input
                            className='estilosForm'
                            type="text"
                            placeholder='Ingrese el nombre'
                            onChange={(e) => setCategoriaNombre(e.target.value)}
                        />
                    </div>
                    <div>
                        <img className='añadirProductosImg' src="" alt="" />
                        <input
                            className='estilosForm'
                            type="file"
                            onChange={(e) => setselectedFile(e.target.files)}
                        />
                    </div>
                    <div>
                        <textarea
                            className='estilosForm'
                            type="text"
                            name=""
                            id=""
                            cols="22"
                            rows="5"
                            placeholder='Ingresa la descripcion de la categoria'
                            onChange={(e) => setCategoriaDescripcion(e.target.value)}
                        >
                        </textarea>
                    </div>
                    <div>
                        <button
                            className='boton'
                        >Agregar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AñadirCategoria