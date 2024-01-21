import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, Link, Navigate , useNavigate} from 'react-router-dom'
import axios from 'axios';
import { ProductContext } from '../componets/utils/ProductoContext';
import salir from "../../public/imagenes/salir.png"

function AñadirProducto() {
  
  const {recargarProductos , verificarAcceso} = useContext(ProductContext);
  const form = useRef();
  const navigate = useNavigate();

  
  const [categorias, setCategorias] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/categories")
      .then((res) => {
        setCategorias(res.data)
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API: ", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/cities")
      .then((res) => {
        setCiudades(res.data)
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API: ", error);
      });
  }, []);

  const [productoNombre, setProductoNombre] = useState('');
  const [productoDescripcion, setProductoDescripcion] = useState('');
  const [productoEspecificacion, setProductoEspecificacion] = useState('');
  const [productoScore, setProductoScore] = useState(0);
  const [productoCosto, setProductoCosto] = useState(0);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
  const [cuidadSeleccionada, setCuidadSeleccionada] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault()

    const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));

    const añadirProducto = {
      name: productoNombre,
      description: productoDescripcion,
      specifications: productoEspecificacion,
      active: true,
      available: true,
      // average_score: productoScore,
      average_score: 5.0,
      costPerDay: productoCosto,
      category_id: parseInt(categoriaSeleccionada, 10),
      city_id: parseInt(cuidadSeleccionada, 10),
      cancellation_polices : "Agregue las fechas de su reservación para obtener los detalles de cancelación de este producto."
    }

    console.log(añadirProducto);

    axios.post("http://localhost:8080/products/create", añadirProducto, {
      headers: {
        'Authorization': `Bearer ${infoLocalStorage.jwt}`
      }
    })
      .then(response => {
        console.log("Producto creado");
        console.log(response.data);
        handleUpload(response.data.id);
        form.current.reset();
        navigate('/administrador')
      })
      .catch(error => {
        console.error(error);
        alert("Producto no fue creado");
      });

  }

  const handleUpload = (id) => {
    const formData = new FormData();

    // Agregar cada archivo al formData con el nombre 'file'
    for (const file of selectedFiles) {
      formData.append('file', file); // El nombre es 'file' ya que asi esta en el back
    }

    const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));

    axios.post(`http://localhost:8080/images/create/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${infoLocalStorage.jwt}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log("Imágenes adjuntadas");
        console.log(response.data);
        recargarProductos(); // se llama la funcion en este endpoint por que ya estan las imagenes añadidas al producto
      })
      .catch(error => {
        console.error(error);
        alert("Imágenes no adjuntadas");
      });
  }

  return (
    <div className='añadirProductos'>
      {verificarAcceso()}
      <h2>AGREGAR PRODUCTO</h2>
      <div className='formAñadirProducto'>
        <Link to='/administrador'><img className='formImgSalir' src={salir} alt="" /></Link>
        <form
          ref={form}
          onSubmit={handleSubmit}
        >
          <div>
            <select
              className='estilosForm'
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            >
              <option value={''}>Seleccione una categoria</option>
              {categorias.map(categoria => (
                <option
                  key={categoria.id}
                  value={categoria.id}
                >
                  {categoria.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              className='estilosForm'
              value={cuidadSeleccionada}
              onChange={(e) => setCuidadSeleccionada(e.target.value)}
            >
              <option value={''}>Selecciona una cuidad</option>
              {ciudades.map(ciudad => (
                <option key={ciudad.id} value={ciudad.id}>
                  {ciudad.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <img className='añadirProductosImg' src="" alt="" />
            <input
              className='estilosForm'
              type="file" multiple
              onChange={(e) => setSelectedFiles(e.target.files)}
            />
          </div>
          <div>
            <img className='añadirProductosImg' src="" alt="" />
            <input
              className='estilosForm'
              type="text"
              placeholder='Ingrese el nombre'
              onChange={(e) => setProductoNombre(e.target.value)}
            />
          </div>
          <div className='formPrecio'>
            <img className='añadirProductosImg' src="" alt="" />
            <input
              className='estilosForm inputPrecio'
              type="number"
              placeholder='Ingrese el precio'
              onChange={(e) => setProductoCosto(e.target.value)}
            />
            <p>COP/día</p>
          </div>
          <div>
            <textarea
              className='estilosForm'
              name=""
              id=""
              cols="22"
              rows="5"
              placeholder='Ingresa la descripcion del producto'
              onChange={(e) => setProductoDescripcion(e.target.value)}
            >
            </textarea>
          </div>
          <div>
            <textarea
              className='estilosForm'
              name=""
              id=""
              cols="22"
              rows="5"
              placeholder='ingresa la especificación del producto'
              onChange={(e) => setProductoEspecificacion(e.target.value)}
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

export default AñadirProducto