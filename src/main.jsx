import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Home from './routes/Home.jsx'
import './index.css'

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Contacto from './routes/Contacto.jsx'
import Administrador from './routes/Administrador.jsx'
import AñadirProducto from './routes/AñadirProducto.jsx'
import EditarProducto from './routes/EditarProducto.jsx'
import AñadirCategoria from './routes/AñadirCategoria.jsx'
import Producto from './routes/Producto.jsx'
import Detalles from './routes/Detalles.jsx'
import Politicas from './routes/Politicas'
import Historial from './routes/Historial.jsx'
import Favoritos from './routes/Favoritos.jsx';
import EditarCategoria from './routes/EditarCategoria.jsx'
import ProductosPorCategoria from './routes/ProductosPorCategoria.jsx'
import ReservaProducto from './routes/ReservaProducto.jsx'
// import Login from './routes/Login.jsx'
// import Registro from './routes/Registro.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}>
            <Route path='/' element={<Navigate to={"/home"} />} />
            <Route path='/home' element={<Home />} />
            <Route path='/contacto' element={<Contacto />} />
            <Route path='/producto' element={<Producto />} />
            <Route path='/producto/:id' element={<Detalles />} />
            <Route path='/producto/:productId/reserva' element={<ReservaProducto />} />
            <Route path='/administrador/añadir_producto' element={<AñadirProducto />} />
            <Route path='/administrador/editar_producto/:id' element={<EditarProducto />} />
            <Route path='/producto/by-category/:categoria' element={<ProductosPorCategoria />} />
            <Route path='/administrador/añadir_categoria' element={<AñadirCategoria/>} />
            <Route path='/administrador/editar_categoria/:id' element={<EditarCategoria />} />
            <Route path='/administrador' element={<Administrador />} />
            <Route path='/historial' element={<Historial />} />
            <Route path='/favoritos' element={<Favoritos />} />
            <Route path='/politicas' element={<Politicas />} />
          </Route>
        </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
