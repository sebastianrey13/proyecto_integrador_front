import React, { useState, useRef, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductContext } from '../componets/utils/ProductoContext';
import axios from 'axios';
import ShareModal from '../componets/ShareModal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../Calendar.css'
import LoginPopup from '../componets/LoginPopup';
import SignupPopup from '../componets/SignupPopup';
import salir from "../../public/imagenes/salir.png"

function Detalles() {
    const navigate = useNavigate();
    const params = useParams();
    const idProducto = parseInt(params.id);

    const [producto, setProducto] = useState({
        img: [],
        category: [],
    });

    const [fechasReservadas, setFechasReservadas] = useState([]);
    const [error, setError] = useState(null);
    const [fechaActual] = useState(new Date());
    const [fechaInicioSeleccionada, setFechaInicioSeleccionada] = useState(null);
    const [fechaFinSeleccionada, setFechaFinSeleccionada] = useState(null);

    const obtenerFechasReservadas = () => {
        axios.get(`https://one023c04-grupo5-back.onrender.com/reservations/by-product/${idProducto}`)
            .then((res) => {
                const reservas = res.data;

                const fechasOcupadas = reservas.map((reserva) => ({
                    start: ajustarDiferenciaHoraria(new Date(reserva.check_in_date)),
                    end: ajustarDiferenciaHoraria(new Date(reserva.checkout_date)),
                })).filter((reserva) => reserva.end >= fechaActual);

                setFechasReservadas(fechasOcupadas);
                setError(null);
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    setFechasReservadas([]);
                } else {
                    console.error("Error al obtener fechas reservadas: ", error);
                    setError("Error al obtener fechas reservadas. Intente nuevamente más tarde.");
                }
            });
    };

    const ajustarDiferenciaHoraria = (fecha) => {
        const fechaAjustada = new Date(fecha);
        fechaAjustada.setHours(fechaAjustada.getHours() + 5);
        return fechaAjustada;
    };

    const obtenerImagenes = (productId) => {
        return axios.get(`https://one023c04-grupo5-back.onrender.com/images/product/${productId}`)
            .then((imgres) => imgres.data)
            .catch((error) => {
                console.error("Error al obtener datos de imágenes de la API: ", error);
                return [];
            });
    };

    useEffect(() => {
        axios.get(`https://one023c04-grupo5-back.onrender.com/products/${idProducto}`)
            .then((res) => {
                const product = res.data;

                obtenerFechasReservadas();

                obtenerImagenes(product.id)
                    .then((imagenes) => {
                        setProducto({
                            ...product,
                            img: imagenes,
                        });
                    })
                    .catch((error) => {
                        console.error("Error al obtener datos de la API: ", error);
                    });
            })
            .catch((error) => {
                console.error("Error al obtener datos de la API: ", error);
            });
    }, [idProducto]);

    const deshabilitarFechas = ({ activeStartDate, date, view }) => {
        // Deshabilitar fechas pasadas
        if (date < fechaActual) {
            return true;
        }

        // Deshabilitar fechas ocupadas
        const adjustedDate = new Date(date);
        adjustedDate.setHours(0, 0, 0, 0);
        const isFechaOcupada = fechasReservadas.some(
            (fecha) =>
                adjustedDate.getTime() >= new Date(fecha.start).getTime() &&
                adjustedDate.getTime() <= new Date(fecha.end).getTime()
        );

        return isFechaOcupada;
    };

    const handleFechaSeleccionada = (date) => {
        if (!fechaInicioSeleccionada || (fechaInicioSeleccionada && fechaFinSeleccionada)) {
            setFechaInicioSeleccionada(date);
            setFechaFinSeleccionada(null);
        } else {
            if (!fechaFinSeleccionada && date > fechaInicioSeleccionada) {
                const rangoPropuesto = getDiasEntreFechas(fechaInicioSeleccionada, date);
                const todasFechasDisponibles = rangoPropuesto.every(fecha =>
                    !fechasReservadas.some(
                        ocupada =>
                            fecha.getTime() >= new Date(ocupada.start).getTime() &&
                            fecha.getTime() <= new Date(ocupada.end).getTime()
                    )
                );

                if (todasFechasDisponibles) {
                    setFechaFinSeleccionada(date);
                } else {
                    alert("Las fechas seleccionadas incluyen fechas ocupadas. Por favor, inténtelo de nuevo con otro rango.");
                    setFechaInicioSeleccionada(null);
                    setFechaFinSeleccionada(null);
                }
            } else {
                // Reiniciar la selección si se hace clic en una fecha antes de la fecha de inicio o en la fecha de inicio nuevamente
                setFechaInicioSeleccionada(date);
                setFechaFinSeleccionada(null);
            }
        }
    };

    const getDiasEntreFechas = (fechaInicio, fechaFin) => {
        const dias = [];
        const diaActual = new Date(fechaInicio);

        while (diaActual <= fechaFin) {
            dias.push(new Date(diaActual));
            diaActual.setDate(diaActual.getDate() + 1);
        }

        return dias;
    };

    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    // console.table(producto);
    // console.log(producto);

    const [currentImage, setCurrentImage] = useState(0);
    const thumbnailContainerRef = useRef(null);


    const nextImage = () => {
        setCurrentImage((prevImage) =>
            prevImage === producto.img.length - 1 ? 0 : prevImage + 1
        );
    };

    const prevImage = () => {
        setCurrentImage((prevImage) =>
            prevImage === 0 ? producto.img.length - 1 : prevImage - 1
        );
    };

    const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);
    const [isSignupPopupOpen, setSignupPopupOpen] = useState(false);

    const cerrarPopup = () => {
        setLoginPopupOpen(false)
        setSignupPopupOpen(false)
    }

    const abrirSinupPopup = () => {
        setLoginPopupOpen(false)
        setSignupPopupOpen(true)
    }

    const abrirLoginPopup = () => {
        setLoginPopupOpen(true)
        setSignupPopupOpen(false)
    }


    const redireccionPaginaReserva = () => {
        navigate(`/producto/${idProducto}/reserva?fechaInicio=${fechaInicioSeleccionada.toISOString().split('T')[0]}&fechaFin=${fechaFinSeleccionada.toISOString().split('T')[0]}`);
    }

    const handleReservaClick = () => {
        const infoLocalStorage = JSON.parse(localStorage.getItem('jwtToken'));

        if (infoLocalStorage && fechaInicioSeleccionada && fechaFinSeleccionada) {
            navigate(`/producto/${idProducto}/reserva?fechaInicio=${fechaInicioSeleccionada.toISOString().split('T')[0]}&fechaFin=${fechaFinSeleccionada.toISOString().split('T')[0]}`);
        } else if (fechaInicioSeleccionada === null || fechaFinSeleccionada === null) {
            alert("Escoja una fecha de inicio y fin de la reserva")
        }
        else {
            alert("Debes iniciar sesion para poder realizar un reserva")
            setLoginPopupOpen(true)
        }
    };


    return (
        <div className="cardContainer">
            {isLoginPopupOpen && (
                <LoginPopup
                    cerrarPopup={cerrarPopup}
                    redireccionPaginaReserva={redireccionPaginaReserva}
                    abrirSinupPopup={abrirSinupPopup}
                />
            )}
            {isSignupPopupOpen && (
                <SignupPopup
                    cerrarPopup={cerrarPopup}
                    abrirLoginPopup={abrirLoginPopup}
                />
            )}
            <div className="detailsContainer">
                <Link to="/producto">
                    <img
                        className="imgVolverDetalleProductos"
                        src={salir}
                        alt=""
                    />
                </Link>
                <div className="detallesNombre">
                    <h2>{producto && producto.name}</h2>
                </div>

                <div className='contenidoDetalleProducto'>
                    <div className='sliderContainer'>
                        <div className="imgContainer">
                            <div
                                className="slider"
                                style={{
                                    transform: `translateX(-${currentImage * 100}%)`,
                                }}
                            >
                                {producto.img.map((imagen, index) => (
                                    <div key={index + 1000}>
                                        <img
                                            className="imgenesDetalleProducto"
                                            // key={index + 100}
                                            src={imagen.url}
                                            alt={`Imagen ${index + 1}`}
                                        /></div>
                                ))}
                            </div>
                            <button className='boton botonDesplazarImg botonDesplazarImgAntes' onClick={prevImage}>{'<'}</button>
                            <button className='boton botonDesplazarImg botonDesplazarImgDespues' onClick={nextImage}>{'>'}</button>
                        </div>
                        <div
                            ref={thumbnailContainerRef}
                            className="thumbnailContainer"
                        >
                            {producto.img.map((imagen, index) => (
                                <img
                                    className={`thumbnail ${index === currentImage ? 'activeImg' : ''}`}
                                    key={index}
                                    src={imagen.url}
                                    alt={`Thumbnail ${(index + 1) * 99}`}
                                    onClick={() => setCurrentImage(index)}
                                />
                            ))}
                        </div>

                    </div>


                    <div className='detailCalendarContainer'>

                        <div className="priceDetailContainer">
                            <p className='priceDetailContainerDescripcion'>{producto && producto.description}</p>
                            <p>{producto && producto.specifications}</p>
                            <p><b>Categoria:</b> {producto && producto.category.name}</p>
                            <p><b>Precio:</b> ${producto && producto.costPerDay}/día</p>

                        </div>

                        <div className='calendarContainer'>
                            <p className='calendarContainerTitulo'><b>Disponibilidad del producto:</b></p>
                            <Calendar
                                tileContent={({ date }) => {
                                    const adjustedDate = new Date(date);
                                    adjustedDate.setHours(0, 0, 0, 0);

                                    const isFechaOcupada = fechasReservadas.some(
                                        (fecha) =>
                                            adjustedDate.getTime() >= new Date(fecha.start).getTime() &&
                                            adjustedDate.getTime() <= new Date(fecha.end).getTime()
                                    );

                                    return (
                                        <div className={`customTile ${isFechaOcupada ? 'fechaOcupada' : ''}`}>
                                        </div>
                                    );
                                }}
                                minDate={fechaActual}
                                selectRange
                                tileDisabled={deshabilitarFechas}
                                value={[fechaInicioSeleccionada, fechaFinSeleccionada]}
                                onChange={() => { }}
                                onClickDay={(value) => handleFechaSeleccionada(value)}
                            />
                            {error && <div className="errorMessage">{error}</div>}
                        </div>

                    </div>
                </div>

                <div className='botonesSlider botonesAlquilarComprarContainer'>
                    <button className='boton botonAlquilarProducto' onClick={openModal}>COMPARTIR</button>
                    {showModal && <ShareModal producto={producto} onClose={closeModal} />}
                    <button className='boton botonAlquilarProducto' onClick={handleReservaClick}>ALQUILAR</button>
                </div>
            </div>
        </div>
    );
}

export default Detalles;
