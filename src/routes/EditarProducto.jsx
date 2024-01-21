import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, Link, Navigate, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { ProductContext } from '../componets/utils/ProductoContext';
import salir from "../../public/imagenes/salir.png"

function EditarProducto() {
  const params = useParams();
  const idProducto = parseInt(params.id);
  const { recargarProductos, verificarAcceso } = useContext(ProductContext);
  const form = useRef();

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

  const [producto, setProducto] = useState({
    name: '',
    description: '',
    specifications: '',
    costPerDay: 0,
    img: [],
    category: [],
    city: [],
  });

  const [productoNombre, setProductoNombre] = useState('');
  const [productoDescripcion, setProductoDescripcion] = useState('');
  const [productoEspecificacion, setProductoEspecificacion] = useState('');
  const [productoScore, setProductoScore] = useState(0);
  const [productoCosto, setProductoCosto] = useState(0);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);
  const [cuidadSeleccionada, setCuidadSeleccionada] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [totalReviews , setTotalReviews] = useState(null)
  const [totalScore , setTotalScore] = useState(null)


  const obtenerImagenes = (productId) => {
    return axios.get(`http://localhost:8080/images/product/${productId}`)
      .then((imgres) => imgres.data)
      .catch((error) => {
        console.error("Error al obtener datos de imágenes de la API: ", error);
        return [];
      });
  };

  useEffect(() => {
    axios.get(`http://localhost:8080/products/${idProducto}`)
      .then((res) => {
        const product = res.data;

        obtenerImagenes(product.id)
          .then((imagenes) => {
            setProducto({
              ...product,
              img: imagenes,
            });
            setValoresIniciales(product)
          })
          .catch((error) => {
            console.error("Error al obtener datos de la API: ", error);
          });
      })
      .catch((error) => {
        console.error("Error al obtener datos de la API: ", error);
      });
  }, [idProducto]);


  const handleSubmit = (e) => {
    e.preventDefault()

    const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));

    const editarProducto = {
      id: idProducto,
      name: productoNombre,
      description: productoDescripcion,
      specifications: productoEspecificacion,
      active: true,
      available: true,
      costPerDay: productoCosto,
      city : {
        id : parseInt(cuidadSeleccionada, 10)
      },
      category : {
        id : parseInt(categoriaSeleccionada, 10),
      },
      totalReviews : totalReviews,
      totalScore : totalScore,
    }

    console.log(editarProducto);

    axios.put("http://localhost:8080/products/update", editarProducto, {
      headers: {
        'Authorization': `Bearer ${infoLocalStorage.jwt}`
      }
    })
      .then(response => {
        console.log("Producto editado");
        alert("Producto editado");
        volver();
        // console.log(response.data);
        // handleUpload(response.data.id);
        // form.current.reset();
      })
      .catch(error => {
        console.error(error);
        alert("Producto no editado");
      });

  }

  const handleUpload = (id) => {
    const formData = new FormData();

    // Agregar cada archivo al formData con el nombre 'file'
    for (const file of selectedFiles) {
      formData.append('file', file); // Asegúrate de que el nombre sea 'file' ya que asi esta en el back
    }

    const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));

    axios.put(`http://localhost:8080/images/create/${id}`, formData, {
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

  const setValoresIniciales = (producto) => {
    setProductoNombre(producto.name);
    setProductoDescripcion(producto.description);
    setProductoEspecificacion(producto.specifications);
    setProductoCosto(producto.costPerDay);
    setCategoriaSeleccionada(producto.category.id);
    setCuidadSeleccionada(producto.city.id);
    setTotalScore(producto.totalScore);
    setTotalReviews(producto.totalReviews)
  }

  const navigate = useNavigate();

  const volver = () => {
    navigate('/administrador');
  }


  return (
    <div className='añadirProductos'>
      {verificarAcceso()}
      <h2>EDITAR PRODUCTO ID: {producto.id}</h2>
      <div className='formAñadirProducto'>
        <Link to='/administrador'><img className='formImgSalir' src={salir} alt="" /></Link>
        {/* <Link to='/administrador'><p className='boton botonSalirEditarProductos formImgSalir'>X</p></Link> */}
        <form
          // ref={form}
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
          {/* <div>
            <img className='añadirProductosImg' src="" alt="" />
            <input
              className='estilosForm'
              type="file" multiple
              onChange={(e) => setSelectedFiles(e.target.files)}
            />
          </div> */}
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
          <div className='formPrecio'>
            <img className='añadirProductosImg' src="" alt="" />
            <input
              className='estilosForm inputPrecio'
              type="number"
              placeholder='Ingrese el precio'
              value={productoCosto}
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
              value={productoDescripcion}
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
              value={productoEspecificacion}
              placeholder='ingresa la especificación del producto'
              onChange={(e) => setProductoEspecificacion(e.target.value)}
            >
            </textarea>
          </div>
          <div>
            <button
              className='boton'
            >Editar Producto</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditarProducto