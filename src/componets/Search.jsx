import React, { useState, useEffect } from 'react';
import Autosuggest from 'react-autosuggest';
import { useDebounce } from 'use-debounce';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [productSelected, setProductSelected] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [productoID , setProductoID] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (debouncedSearchTerm) {
            searchFunction(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]);

    const searchFunction = async (term) => {
        try {
            const response = await axios.get(`https://one023c04-grupo5-back.onrender.com/products/by-input/${term}`);
            setSuggestions(response.data);
            setProductoID(response.data[0]);
            console.log(productoID[0]);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleChange = (event, { newValue }) => {
        setSearchTerm(newValue);
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        searchFunction(value);
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const getSuggestionValue = (suggestion) => suggestion.name;

    const renderSuggestion = (suggestion) => (
        <div className={`sugerencia ${suggestion === productSelected ? 'selected' : ''}`} onClick={() => handleClick(suggestion)}>
            {suggestion.name}
        </div>
    );

    const seleccionarProducto = (product) => {
        setProductSelected(product);
        setSearchTerm(product.name);
        setShowSuggestions(false);
    };

    const handleClick = (suggestion) => {
        setProductSelected(suggestion);
        setSearchTerm(suggestion.name);
        setShowSuggestions(false);
    };

    const eventEnter = (e) => {
        if (e.key === 'Enter') {
            const inputValue = e.target.value && e.target.value.trim();
            if (inputValue) {
                const split = inputValue.split('-');
                const producto = {
                    producto: split[0].trim(),
                };
                seleccionarProducto(producto);
            }
        }
    };

    const validateDateRange = () => {
        const currentDate = new Date();
        const isValidStartDate = selectedStartDate && selectedStartDate >= currentDate;
        const isValidEndDate = selectedEndDate && selectedEndDate >= selectedStartDate;

        return isValidStartDate && isValidEndDate;
    };

    const handleStartDateChange = (date) => {
        setSelectedStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setSelectedEndDate(date);
    };

    const realizarBusqueda = () => {
        const ruta = productoID.id;
        navigate(`/producto/${ruta}`)
        // if (validateDateRange()) {
        //     console.log('Búsqueda realizada con éxito');
        // } else {
        //     console.error('Error en el rango de fechas');
        // }
    };

    const inputProps = {
        placeholder: '¿Qué estás buscando?',
        value: searchTerm,
        onChange: handleChange,
        onFocus: () => setShowSuggestions(true),
    };

    return (
        <div className="search-block">
            {/* <h2>BUSQUEDA</h2>
            <p>Ingrese un término de búsqueda para encontrar productos.</p> */}
            <div className="search-fields">
                <div className="date-picker-container">
                    <label className='rangoFechas'>Rango de Fechas:</label>
                    <div className='date-picker-container-date'>
                    <div className="date-picker">
                        <label>Inicio:</label>
                        <DatePicker
                            className='inputFechaBuscador'
                            showIcon
                            selected={selectedStartDate}
                            onChange={(date) => handleStartDateChange(date)}
                            selectsStart
                            startDate={selectedStartDate}
                            endDate={selectedEndDate}
                            dateFormat="dd/MM/yyyy"
                            isClearable
                            minDate={new Date()}
                        />
                    </div>
                    <div className="date-picker">
                        <label>Fin:</label>
                        <DatePicker
                            showIcon
                            className='inputFechaBuscador'
                            selected={selectedEndDate}
                            onChange={(date) => handleEndDateChange(date)}
                            selectsEnd
                            startDate={selectedStartDate}
                            endDate={selectedEndDate}
                            minDate={selectedStartDate}
                            dateFormat="dd/MM/yyyy"
                            isClearable
                        />
                    </div>
                    </div>
                </div>
                <Autosuggest
                    suggestions={showSuggestions ? suggestions : []}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    shouldRenderSuggestions={() => true}
                    highlightFirstSuggestion={true}
                    renderInputComponent={(inputProps) => (
                        <input {...inputProps} className="form-control" id="autosuggest-container" />
                    )}
                    renderSuggestionsContainer={({ containerProps, children, query }) => (
                        <div
                            {...containerProps}
                            className={`suggestions-container ${showSuggestions ? 'visible' : 'hidden'}`}
                        >
                            {children}
                        </div>
                    )}
                    onSuggestionSelected={(event, { suggestion }) => handleClick(suggestion)}
                />
            </div>
            <button className="search-button boton" onClick={realizarBusqueda}>
                Buscar
            </button>
        </div>
    );
};

export default Search;
