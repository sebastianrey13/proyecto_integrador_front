// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useLocation, Link } from 'react-router-dom';

// function Login() {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => {
//         setError('');
//     }, [location.pathname]);

//     const handleLogin = async (e) => {
//         e.preventDefault();

//         try {
//         const response = await axios.post("http://localhost:8080/api/auth/login", {
//             username,
//             password,
//         });

//         localStorage.setItem('jwtToken', JSON.stringify(response.data));

//         const redirectUrl = new URLSearchParams(location.search).get('redirect');
//         if (redirectUrl) {
//             navigate(redirectUrl);
//         }
//         } catch (error) {
//         setError("Usuario no registrado o contraseña incorrecta");
//         console.error("Error al iniciar sesión: ", error);
//         }
//     };

//     return (
//         <div className="loginContainer">
//         <h2 className="loginTitle">Iniciar Sesión</h2>
//         <form className="loginForm" onSubmit={handleLogin}>
//             <label className="loginLabel">Usuario</label>
//             <input
//             className="loginInput"
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             />

//             <label className="loginLabel">Contraseña</label>
//             <input
//             className="loginInput"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             />

//             <p className="error-message">{error}</p>

//             <button className="loginButton" type="submit">INICIAR SESIÓN</button>
//         </form>

//         <p className="registerLink">¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>.</p>
//         </div>
//     );
// }

// export default Login;
