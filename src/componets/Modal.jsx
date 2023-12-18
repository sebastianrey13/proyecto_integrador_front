import React from 'react';
import salir from "../../public/imagenes/salir.png"

const Modal = ({ onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <img
          className="close-button"
          src={salir}
          alt="Cerrar"
          onClick={onClose}
        />
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
