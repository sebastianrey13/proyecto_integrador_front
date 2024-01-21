import React, { useState, useEffect, useRef } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios'
import CardError from './CardError';
import MenuMobile from './MenuMobile';
import logoImg from "../../public/imagenes/logo.png"
import salir from "../../public/imagenes/salir.png"
import iconoUsuario from "../../public/imagenes/iconousuario.svg"
import iconoContrasena from "../../public/imagenes/iconocontrasena.svg"
import telefonoIco from "../../public/imagenes/telefono_ico.png"
import ubicacionIco from "../../public/imagenes/ubicacion_ico.png"
import iconoCorreo from "../../public/imagenes/iconocorreo.svg"
import fondo from "../../public/imagenes/fondo.png"

function Header() {

  const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);
  const [isSignupPopupOpen, setSignupPopupOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("")
  const [ciudades, setCiudades] = useState([])
  const [rol, setRole] = useState('')
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [jwt, setJwt] = useState('');
  const [userId, setUserId] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apellidoUsuario, setApellidoUsuario] = useState('');
  const location = useLocation();

  useEffect(() => {
    verificarEstadoSesion();
  }, [location.pathname]);


  const verificarEstadoSesion = () => {
    const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));

    if (infoLocalStorage) {
      const role = infoLocalStorage.role;
      setRole(role);
      if (role === 'ADMIN') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setJwt(infoLocalStorage.jwt);
      setIsLoggedIn(true);
      setNombreUsuario((infoLocalStorage.name).charAt(0).toUpperCase());
      setApellidoUsuario((infoLocalStorage.lastname).charAt(0).toUpperCase());
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  };


  //------------------Logica Ver Pagina Admin / Historial / Favoritos ------------ 

  const tipoUsuario = () => {
    const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));
    setJwt(infoLocalStorage.jwt);
    const role = infoLocalStorage.role;
    setRole(role);
    if (role === 'ADMIN') {
      setIsAdmin(true);
      setIsUser(true);
    }
    if (role === 'USER') {
      setIsUser(true);
    }
  }

  //--------------------------------------------------------
  const openLoginPopup = () => {
    setLoginPopupOpen(true);
    setSignupPopupOpen(false);
  };

  const closeLoginPopup = () => {
    setLoginPopupOpen(false);
    setError("");
    setLoginUsername('');
    setLoginPassword('');
  };

  const openSignupPopup = () => {
    setLoginPopupOpen(false);
    setSignupPopupOpen(true);
    axios.get("http://localhost:8080/cities")
      .then(res => {
        setCiudades(res.data);
      })
      .catch(error => {
        setError("Usuario no registrado o contraseña incorrecta")
        console.error("Error al obtener datos de la API: ", error);
      });
  };

  const closeSignupPopup = () => {
    setSignupPopupOpen(false);
  };

  //------------------ Cerrar Sesion -----------------------------


  const cerrarSesion = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsUser(false);
    setCerrarSesionMenu(false);
    setJwt('');
    localStorage.clear();
  }

  //-------------------- Iniciar sesion ----------------------------

  const handleLogin = (e) => {
    e.preventDefault();
    const iniciarSesion = {
      username: loginUsername,
      password: loginPassword,
    }

    axios.post("http://localhost:8080/api/auth/login", iniciarSesion)
      .then((res) => {
        setError("");
        localStorage.setItem("jwtToken", JSON.stringify(res.data));
        tipoUsuario();
        // tipoUsuario2();
        closeLoginPopup();
        setIsLoggedIn(true);
        setNombreUsuario((res.data.name).charAt(0).toUpperCase());
        setApellidoUsuario((res.data.lastname).charAt(0).toUpperCase());

        //Realizar la solicitud para obtener el ID del usuario
        const correoUsuario = loginUsername;
        obtenerIdUsuario(correoUsuario);

      })
      .catch((error) => {
        setError("Usuario no registrado o contraseña incorrecta");
        console.error("Error al obtener datos de la API: ", error);
      });
  };

  const obtenerIdUsuario = async (correoUsuario) => {
    try {
      const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));
      const token = infoLocalStorage.jwt;

      const response = await axios.get(`http://localhost:8080/user/by-email/${correoUsuario}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const usuario = response.data;
      setUserId(usuario.id);
      // console.log("El id del usuario es: ", usuario.id);
      localStorage.setItem('userId', String(usuario.id));

    } catch (error) {
      console.error("Error al obtener datos del usuario por correo electrónico: ", error);
    }
  };


  //------------------- Registrar Usuario -----------------------

  const [signupUser, setSignupUser] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupPhoneNumber, setSignupPhoneNumber] = useState('');
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState({
    id: 0,
    name: 'Selecciona tu ciudad',
  });
  const [rolSeleccionado, setRolSelecionado] = useState({
    id: 0,
    name: 'Selecciona tu rol',
  });

  const crearUsuario = () => {
    setSignupPopupOpen(true);
    setIsLoggedIn(false);
  }

  const handleCiudadChange = (event) => {
    const selectedCityId = parseInt(event.target.value, 10); // Convertir a entero usando parseInt
    const selectedCity = ciudades.find((ciudad) => ciudad.id === selectedCityId);
    setCiudadSeleccionada({
      id: selectedCityId,
      name: selectedCity ? selectedCity.name : 'Selecciona tu ciudad',
    });
  };

  const handleRolChange = (event) => {
    const selectedRolId = parseInt(event.target.value, 10); // Convertir a entero usando parseInt
    // Actualizar el estado con el id y nombre del rol seleccionado
    setRolSelecionado({
      id: selectedRolId,
      name: selectedRolId === 1 ? 'ADMIN' : 'USER', // Comparar con número en lugar de cadena
    });
  };


  const handleSignup = (e) => {
    e.preventDefault();
    const registrarUsuario = {
      name: signupName,
      lastName: signupLastName,
      email: signupEmail,
      phoneNumber: signupPhoneNumber,
      password: signupPassword,
      enabled: 1,
      city: ciudadSeleccionada,
      role: rolSeleccionado,
    }

    axios.post("http://localhost:8080/user/create", registrarUsuario)
      .then(response => {
        alert("Usuario creado");
        console.log(response.data);
        setSignupPopupOpen(false);
      })
      .catch(error => {
        console.error(error);
        alert("Usuario no fue creado");
      });

  };

  //-----------------------Menu mobile-------------------------

  const [cerrarSesionMenu, setCerrarSesionMenu] = useState(false)

  const menuCerrarSeionToggle = () => {
    setCerrarSesionMenu(!cerrarSesionMenu);
  }


  return (

    <div>
      <div className='header'>
        <div className='logoPageDiv'>
          <MenuMobile isLoggedIn={isLoggedIn} />
          <Link to='/home'><img className='logoPageImg' src={logoImg} alt="logo" /></Link>
        </div>
        <div>
          <nav className=''>
            <div className='menuNav'>
              <ul className='ulNav'>
                <li>
                  <Link to='/home'>HOME</Link>
                </li>
                <li>
                  <Link to='/producto'>PRODUCTOS</Link>
                </li>
                <li>
                  <Link to='/contacto'>CONTACTO</Link>
                </li>
                {isAdmin && (<li>
                  <Link to='/administrador'>ADMINISTRACIÓN</Link>
                </li>)
                }
                {
                  isLoggedIn && (
                    <li>
                      <Link to='/favoritos'>FAVORITOS</Link>
                    </li>
                  )
                }
                {
                  isLoggedIn && (
                    <li>
                      <Link to='/historial'>HISTORIAL</Link>
                    </li>
                  )
                }
              </ul>
            </div>
          </nav>
        </div>
        {!isLoggedIn && (
          <div className='header_iniciarSesion'>
            <button className='boton' onClick={openLoginPopup}>
              Iniciar Sesión
            </button>
            <button className='boton' onClick={openSignupPopup}>
              Crear Cuenta
            </button>
          </div>
        )}
        {isLoggedIn && (
          <div className='header_sesionIniciada'>
            <p
              className='inicialesUser'
              onClick={menuCerrarSeionToggle}
            >
              <span>{nombreUsuario}</span><span>{apellidoUsuario}</span>
            </p>
            {cerrarSesionMenu && (
              <Link to='/home'>
                <button className='boton' onClick={cerrarSesion}>
                  Cerrar Sesión
                </button>
              </Link>
            )}
          </div>
        )}
      </div>

      {isLoginPopupOpen && (
        <div className="popup-bg">
          <div className="popup">
            <button className="close-button" onClick={closeLoginPopup}>
              <img className="close-button-img" src={salir} alt="Cerrar" />
            </button>
            <h2 className="popup-title">Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
              <div className="input-container">
                <img src={iconoUsuario} className="custom-icon" />
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Tu usuario"
                />
              </div>

              <div className="input-container">
                <img src={iconoContrasena} className="custom-icon" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Contraseña"
                />
              </div>
              <CardError
                info={error}
              />
              <button className="boton botoningreso" type="submit">Iniciar Sesión</button>
            </form>
            <p className="registerLink">¿No tienes una cuenta? <span className='registerLinkHere' onClick={crearUsuario}>Regístrate aquí</span></p>
          </div>
        </div>
      )}

      {isSignupPopupOpen && (
        <div className="popup-bg">
          <div className="popup popupSinup">
            <button className="close-button" onClick={closeSignupPopup}>
              <img className="close-button-img" src={salir} alt="Cerrar" />
            </button>
            <h2 className="popup-title">Crear Cuenta</h2>
            <form onSubmit={handleSignup}>

              <div className="input-container">
                <img src={iconoUsuario} className="custom-icon" />
                <input
                  type="text"
                  value={signupUser}
                  onChange={(e) => setSignupUser(e.target.value)}
                  placeholder="Tu usuario"
                />
              </div>

              <div className="input-container">
                <img src={iconoCorreo} className="custom-icon" />
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="correo@example.com"
                />
              </div>

              <div className="input-container">
                <img src={iconoContrasena} className="custom-icon" />
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Contraseña"
                />
              </div>
              <div className="input-container">
                <img src={iconoContrasena} className="custom-icon" />
                <input
                  type="password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  placeholder="Confirmar contraseña"
                />
              </div>

              {/* ------------------------------------------------------------ */}

              <div className="input-container">
                <img src={iconoUsuario} className="custom-icon" />
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Nombre"
                />
              </div>

              <div className="input-container">
                <img src={iconoUsuario} className="custom-icon" />
                <input
                  type="text"
                  value={signupLastName}
                  onChange={(e) => setSignupLastName(e.target.value)}
                  placeholder="Apellido"
                />
              </div>

              <div className="input-container">
                <img src={telefonoIco} className="custom-icon" />
                <input
                  type="number"
                  value={signupPhoneNumber}
                  onChange={(e) => setSignupPhoneNumber(e.target.value)}
                  placeholder="Telefono "
                />
              </div>

              <div className="input-container">
                <img src={ubicacionIco} className="custom-icon" />
                <select
                  className='estilosForm'
                  name='ciudad'
                  id='ciudad'
                  value={ciudadSeleccionada.id}
                  onChange={handleCiudadChange}
                >
                  <option value={''}>Selecciona tu cuidad</option>
                  {ciudades.map(ciudad => (
                    <option key={ciudad.id} value={ciudad.id}>
                      {ciudad.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-container">
                <img src={ubicacionIco} className="custom-icon" />
                <select
                  className='estilosForm'
                  name='role'
                  id='role'
                  value={rolSeleccionado.id}
                  onChange={handleRolChange}
                >
                  <option value={''}>Escoja un Rol</option>
                  <option value='1'>ADMIN</option>
                  <option value='2'>USER</option>

                </select>
              </div>


              <button className="boton botoningreso" type="submit">Crear Cuenta</button>
            </form>
          </div>
        </div>
      )}
      <div className='imgFondo'>
        <img src={fondo} alt="img_fondo" />
        <h1>ALQUILER DE HERRAMIENTAS</h1>
        <p>Construyendo Futuro Juntos</p>
      </div>
    </div>
  );
}

export default Header;
