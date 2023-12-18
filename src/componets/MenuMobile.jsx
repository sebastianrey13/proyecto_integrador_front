import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import menu from "../../public/imagenes/menu.png"

function MenuMobile({ isLoggedIn }) {
    const menuRef = useRef(null);
    const opcionesIniciales = [
        {
            name: 'Home',
            link: 'home'
        },
        {
            name: 'Productos',
            link: 'producto'
        },
        {
            name: 'Contacto',
            link: 'contacto'
        }
    ]
    const [desplegado, setDesplegado] = useState(false);
    const [opciones, setOpciones] = useState(opcionesIniciales);


    useEffect(() => {
        const añadirOpciones = () => {
            const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));
            const administrador = { name: 'Administración', link: 'administrador' }
            const favoritos = { name: 'Favoritos', link: 'favoritos' }
            const historial = { name: 'Historial', link: 'historial' }

            if (infoLocalStorage && infoLocalStorage.role !== 'ADMIN') {
                setOpciones(prevOpciones => [...prevOpciones, favoritos , historial]);
            } else if (infoLocalStorage && infoLocalStorage.role === 'ADMIN') {
                setOpciones(prevOpciones => [...prevOpciones, favoritos, historial, administrador]);
            }
        }

        if (isLoggedIn) {
            añadirOpciones();
        } else if (!isLoggedIn) {
            setOpciones(opcionesIniciales);
        }

    }, [isLoggedIn]);


    const handleToggle = () => {
        setDesplegado(!desplegado);
    };

    const cerrarMenu = () => {
        setDesplegado(false);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            cerrarMenu();
        }
    };

    useEffect(() => {
        // Agregar un event listener al montar el componente
        document.addEventListener('click', handleClickOutside);

        // Limpiar el event listener al desmontar el componente
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="menuDesplegable" ref={menuRef}>
            <img onClick={handleToggle} className='menuImg' src={menu} alt="logo" />
            {desplegado && (
                <ul className='menuDesplegableUl'>
                    {opciones.map((opcion, index) => (
                        <Link to={`/${opcion.link}`} key={index + 1}>
                            <li onClick={cerrarMenu} className='menuDesplegableLi' >{opcion.name}</li>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MenuMobile;