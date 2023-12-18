import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import salir from "../../public/imagenes/salir.png"

const ShareModal = ({ producto, onClose }) => {
    const shareOnFacebook = () => {
        const description = encodeURIComponent(`Echa un vistazo a este increíble producto: ${producto.description}`);
        const imageUrl = encodeURIComponent(producto.img[0].url);
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${description}&picture=${imageUrl}`;
        window.open(shareUrl, '_blank');
      };
      
      const shareOnTwitter = () => {
        const description = encodeURIComponent(`Echa un vistazo a este increíble producto: ${producto.description}`);
        const imageUrl = encodeURIComponent(producto.img[0].url);
        const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${description}&media=${imageUrl}`;
        window.open(shareUrl, '_blank');
      };
      
      
      
      const shareOnEmail = () => {
        const subject = encodeURIComponent('Echa un vistazo a este producto');
        const body = encodeURIComponent(`Te recomiendo este producto: ${window.location.href}\n\n${producto.description}`);
        const shareUrl = `mailto:?subject=${subject}&body=${body}`;
        window.location.href = shareUrl;
      };

  return (
    <div className="modal-overlay">
        <div className="modal">
            <img
            className="close-button"
            src={salir}
            alt="Cerrar"
            onClick={onClose}
            />
        <img className="modalimg" src={producto.img[0].url} alt={producto.name} />
        <p>{producto.description}</p>
        <a href={window.location.href} target="_blank" rel="noopener noreferrer">Enlace al producto</a>
        <div className="social-buttons">
          <button onClick={shareOnFacebook}><FontAwesomeIcon icon={faFacebook} /></button>
          <button onClick={shareOnTwitter}><FontAwesomeIcon icon={faTwitter} /></button>
          <button onClick={shareOnEmail}><FontAwesomeIcon icon={faEnvelope} /></button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
