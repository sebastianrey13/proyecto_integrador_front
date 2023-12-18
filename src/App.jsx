import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './componets/Header';
import { Outlet } from 'react-router-dom';
import Footer from './componets/Footer';
import { ProductContextProvider } from './componets/utils/ProductoContext';

function App() {
  const [reloadProductos, setReloadProductos] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <ProductContextProvider>
      <div className='app'>
      <Header setReloadProductos={setReloadProductos} />
      <Outlet reloadProductos={reloadProductos} setReloadProductos={setReloadProductos} />
      <Footer />
      </div>
    </ProductContextProvider>
  );
}

export default App;
