import React from 'react'

function CardMessageConfirm({ message, onConfirm, onCancel }) {

  return (
    <div className="cardMessageConfirm">
    <div className="cardMessageConfirm-content">
      <p>{message}</p>
      <button onClick={onConfirm}>Confirmar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  </div>
  )
}

export default CardMessageConfirm