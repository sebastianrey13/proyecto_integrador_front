import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CardCategorias(props) {
    
    return (
        <div className='CardCategorias'>
            <div className='CardCategoriasImg'>
                <img src={props.img} alt="" />
            </div>
            <div>
                <Link className='CardCategoriasLink' to={`/producto/by-category/${props.name}`}>
                    <div className='CardCategoriasP boton'>
                        <p>{props.name}</p>
                    </div>
                </Link>
            </div>

        </div>
    )
}

export default CardCategorias

