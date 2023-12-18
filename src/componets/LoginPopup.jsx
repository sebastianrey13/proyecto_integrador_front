import React, { useState } from 'react';
import CardError from './CardError';
import axios from 'axios';
import salir from "../../public/imagenes/salir.png"
import iconoUsuario from "../../public/imagenes/iconousuario.svg"
import iconoContrasena from "../../public/imagenes/iconocontrasena.svg"

function LoginPopup(props) {

    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState("")



    const obtenerIdUsuario = async (correoUsuario) => {
        try {
            const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));
            const token = infoLocalStorage.jwt;

            const response = await axios.get(`https://one023c04-grupo5-back.onrender.com/user/by-email/${correoUsuario}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const usuario = response.data;
            setUserId(usuario.id);
            console.log("El id del usuario es: ", usuario.id);
            localStorage.setItem('userId', String(usuario.id));

        } catch (error) {
            console.error("Error al obtener datos del usuario por correo electrónico: ", error);
        }
    };

    const closeLoginPopup = () => {
        setError("");
        setLoginUsername('');
        setLoginPassword('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const iniciarSesion = {
            username: loginUsername,
            password: loginPassword,
        }

        axios.post("https://one023c04-grupo5-back.onrender.com/api/auth/login", iniciarSesion)
            .then((res) => {
                setError("");
                localStorage.setItem("jwtToken", JSON.stringify(res.data));
                console.log("sesion iniciada")
                closeLoginPopup();
                props.redireccionPaginaReserva();
                const correoUsuario = loginUsername;
                obtenerIdUsuario(correoUsuario);
            })
            .catch((error) => {
                setError("Usuario no registrado o contraseña incorrecta");
                console.error("Error al obtener datos de la API: ", error);
            });
    };

    return (
        <div className="popup-bg">
            <div className="popup">
                <button className="close-button" onClick={props.cerrarPopup}>
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
                <p className="registerLink">¿No tienes una cuenta? <span
                    className='registerLinkHere'
                    onClick={props.abrirSinupPopup}
                >Regístrate aquí</span>
                </p>
            </div>
        </div>
    );
}

export default LoginPopup;
