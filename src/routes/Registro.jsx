// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';

// function Registro() {
//   const [signupUser, setSignupUser] = useState('');
//   const [signupEmail, setSignupEmail] = useState('');
//   const [signupPassword, setSignupPassword] = useState('');
//   const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
//   const [signupName, setSignupName] = useState('');
//   const [signupLastName, setSignupLastName] = useState('');
//   const [signupPhoneNumber, setSignupPhoneNumber] = useState('');
//   const [ciudades, setCiudades] = useState([]);
//   const [ciudadSeleccionada, setCiudadSeleccionada] = useState({
//     id: 0,
//     name: 'Selecciona tu ciudad',
//   });

//   const [rolSeleccionado, setRolSeleccionado] = useState({
//     id: 2,
//     name: 'USER',
//   });

//   const [error, setError] = useState('');

//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get("https://one023c04-grupo5-back.onrender.com/cities")
//       .then(res => {
//         setCiudades(res.data);
//       })
//       .catch(error => {
//         setError("Error al obtener datos de la API: " + error.message);
//         console.error("Error al obtener datos de la API: ", error);
//       });
//   }, []);

//   const handleCiudadChange = (event) => {
//     const selectedCityId = parseInt(event.target.value, 10);
//     const selectedCity = ciudades.find((ciudad) => ciudad.id === selectedCityId);
//     setCiudadSeleccionada({
//       id: selectedCityId,
//       name: selectedCity ? selectedCity.name : 'Selecciona tu ciudad',
//     });
//   };


//   const handleSignup = (e) => {
//     e.preventDefault();
//     console.log('Entró en handleSignup');

//     if (!signupEmail || !signupPassword || !signupConfirmPassword ||
//       !signupName || !signupLastName || !signupPhoneNumber || ciudadSeleccionada.id === 0) {
//       setError('Todos los campos son obligatorios');
//       return;
//     }

//     if (signupPassword !== signupConfirmPassword) {
//       setError('Las contraseñas no coinciden');
//       return;
//     }

//     const registrarUsuario = {
//       name: signupName,
//       lastName: signupLastName,
//       email: signupEmail,
//       phoneNumber: signupPhoneNumber,
//       password: signupPassword,
//       enabled: 1,
//       city: ciudadSeleccionada,
//       role: rolSeleccionado,
//     };

//     axios.post("https://one023c04-grupo5-back.onrender.com/user/create", registrarUsuario)
//       .then(response => {
//         setError('');
//         alert("Usuario creado");
//         console.log(response.data);
//         navigate('/login');
//       })
//       .catch(error => {
//         setError("Error al registrar usuario: " + error.message);
//         console.error("Error al registrar usuario: ", error);
//       });
//   };

//   return (
//     <div className="registroContainer">
//       <h2>Registrarse</h2>
//       <form onSubmit={handleSignup}>

//       <div className="input-container">
//           <img src="../../public/imagenes/iconousuario.svg" className="custom-icon" />
//           <input
//             type="text"
//             value={signupName}
//             onChange={(e) => setSignupName(e.target.value)}
//             placeholder="Nombre"
//           />
//         </div>

//         <div className="input-container">
//           <img src="../../public/imagenes/iconousuario.svg" className="custom-icon" />
//           <input
//             type="text"
//             value={signupLastName}
//             onChange={(e) => setSignupLastName(e.target.value)}
//             placeholder="Apellido"
//           />
//         </div>

//         <div className="input-container">
//           <img src="../../public/imagenes/iconocorreo.svg" className="custom-icon" />
//           <input
//             type="email"
//             value={signupEmail}
//             onChange={(e) => setSignupEmail(e.target.value)}
//             placeholder="correo@example.com"
//           />
//         </div>

//         <div className="input-container">
//           <img src="../../public/imagenes/telefono_ico.png" className="custom-icon" />
//           <input
//             type="number"
//             value={signupPhoneNumber}
//             onChange={(e) => setSignupPhoneNumber(e.target.value)}
//             placeholder="Telefono "
//           />
//         </div>

//         <div className="input-container">
//           <img src="../../public/imagenes/ubicacion_ico.png" className="custom-icon" />
//           <select
//             className='estilosForm'
//             name='ciudad'
//             id='ciudad'
//             value={ciudadSeleccionada.id}
//             onChange={handleCiudadChange}
//           >
//             <option value={''}>Selecciona tu cuidad</option>
//             {ciudades.map(ciudad => (
//               <option key={ciudad.id} value={ciudad.id}>
//                 {ciudad.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="input-container">
//           <img src="../../public/imagenes/iconocontrasena.svg" className="custom-icon" />
//           <input
//             type="password"
//             value={signupPassword}
//             onChange={(e) => setSignupPassword(e.target.value)}
//             placeholder="Contraseña"
//           />
//         </div>
//         <div className="input-container">
//           <img src="../../public/imagenes/iconocontrasena.svg" className="custom-icon" />
//           <input
//             type="password"
//             value={signupConfirmPassword}
//             onChange={(e) => setSignupConfirmPassword(e.target.value)}
//             placeholder="Confirmar contraseña"
//           />
//         </div>

//         {/* ------------------------------------------------------------ */}


//         <button className="boton botoningreso" type="submit">Crear Cuenta</button>
//       </form>
//     </div>
//   );
// }

// export default Registro;
