import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import CardError from './CardError';
import salir from "../../public/imagenes/salir.png"
import iconoUsuario from "../../public/imagenes/iconousuario.svg"
import iconoCorreo from "../../public/imagenes/iconocorreo.svg"
import iconoContrasena from "../../public/imagenes/iconocontrasena.svg"
import telefonoIco from "../../public/imagenes/telefono_ico.png"
import ubicacionIco from "../../public/imagenes/ubicacion_ico.png"

function SignupPopup(props) {

    const [error, setError] = useState("")
    const [ciudades, setCiudades] = useState([])
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


    useEffect(() => {
        axios.get("http://localhost:8080/cities")
            .then(res => {
                setCiudades(res.data);
            })
            .catch(error => {
                setError("Error al obtener datos de la API: " + error.message);
                console.error("Error al obtener datos de la API: ", error);
            });
    }, []);

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
        console.log('Entró en handleSignup');

        if (!signupEmail || !signupPassword || !signupConfirmPassword ||
            !signupName || !signupLastName || !signupPhoneNumber || ciudadSeleccionada.id === 0) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (signupPassword !== signupConfirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        const registrarUsuario = {
            name: signupName,
            lastName: signupLastName,
            email: signupEmail,
            phoneNumber: signupPhoneNumber,
            password: signupPassword,
            enabled: 1,
            city: ciudadSeleccionada,
            role: rolSeleccionado,
        };

        axios.post("http://localhost:8080/user/create", registrarUsuario)
            .then(response => {
                setError('');
                console.log("Usuario creado");
                console.log(response.data);
                props.abrirLoginPopup();
            })
            .catch(error => {
                setError("Error al registrar usuario: " + error.message);
                console.error("Error al registrar usuario: ", error);
            });
    };
    return (
        <div className="popup-bg">
            <div className="popup popupSinup">
                <button className="close-button" onClick={props.cerrarPopup}>
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
                <CardError
                    info={error}
                />
            </div>
        </div>
    );
}

export default SignupPopup;
