import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DocumentCatalog.module.css';
import PublicationList from './PublicationList';

const API_URL = 'http://localhost:8080/publicaciones/listarFront';
const API_URL_FILTER = 'http://localhost:8080/publicaciones/filter';

const DocumentCatalog = () => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);

    // filtros acá:
    const [filterTitle, setFilterTitle] = useState('');
    const [filterAuthor, setFilterAuthor] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [categories, setCategories] = useState([]); // revisar esto: (Assumes you fetch categories list)

    const fetchPublications = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL);
            setPublications(response.data);
        } catch (err) {
            console.error('Error en la solicitud:', err);
            setError(`Error en la carga de publicaciones: ${err.response ? err.response.statusText : err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredPublications = async (filters) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL_FILTER, { params: filters });
            setPublications(Array.isArray(response.data) ? response.data : [] );

        } catch (err) {
            console.error('Error en la solicitud:', err);
            setError(`Error en la carga de publicaciones: ${err.response ? err.response.statusText : err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublications();
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/categorias/todas')
            .then(response => setCategories(response.data))
            .catch(err => console.error("Error al cargar categorías:", err));
    }, []);    

    // Función para actualizar publicaciones después de editar o eliminar
    const refreshPublications = () => {
        fetchPublications();
    };

    const handleApplyFilter = () => {
        const filters = {};
        if (filterTitle) filters.titulo = filterTitle;
        if (filterAuthor) filters.nombre = filterAuthor;
        if (filterCategory) filters.nombreCategoria = filterCategory;

        fetchFilteredPublications(filters);
        setSelectedFilters([...selectedFilters, { type: filterTitle ? 'Título' : filterAuthor ? 'Autor' : 'Categoría', value: filterTitle || filterAuthor || filterCategory }]);
        setFilterTitle('');
        setFilterAuthor('');
        setFilterCategory('');
    };

    const handleRemoveFilter = (filterToRemove) => {
        const newFilters = selectedFilters.filter(filter => filter !== filterToRemove);
        setSelectedFilters(newFilters);

        const filters = newFilters.reduce((acc, filter) => {
            if (filter.type === 'Título') acc.titulo = filter.value;
            if (filter.type === 'Autor') acc.nombre = filter.value;
            if (filter.type === 'Categoría') acc.nombreCategoria = filter.value;
            return acc;
        }, {});

        if (Object.keys(filters).length > 0) {
            fetchFilteredPublications(filters);
        } else {
            fetchPublications(); 
        }
    };

    const filteredPublications = Array.isArray(publications)
    ? publications.filter(pub => pub.titulo.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

    return (
        <div className={styles.catalogContainer}>
            <h2 className={styles.catalogTitle}>
                Catálogo de <br />
                <b>Publicaciones</b>
            </h2>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Escribe el título de una publicación..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                    className={styles.addFilterButton} 
                    onClick={() => setShowFilters(!showFilters)}        
                >
                    {showFilters ? 'Ocultar Filtros' : 'Agregar Filtro'}
                </button>

            </div>
            {showFilters && (
                <div className={styles.filterContainer}> 

                    <div>
                        <label>Filtrar por Título:</label>
                        <input
                            type="text"
                            value={filterTitle}
                            onChange={(e) => setFilterTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Filtrar por Autor:</label>
                        <input
                            type="text"
                            value={filterAuthor}
                            onChange={(e) => setFilterAuthor(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Filtrar por Categoría:</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <button className={styles.botonAplicarFiltro} onClick={handleApplyFilter}>Aplicar Filtro</button>
                </div>
            )}
            <div className={styles.selectedFilters}>
                {selectedFilters.map((filter, index) => (
                    <div key={index} className={styles.filterTag}>
                        {filter.type}: {filter.value}
                        <button onClick={() => handleRemoveFilter(filter)}>X</button>
                    </div>
                ))}
            </div>
            <div className={styles.largeBox}>
                {loading && <div>Cargando...</div>}
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {!loading && !error && filteredPublications.length === 0 && (
                    <div>No hay publicaciones disponibles.</div>
                )}
                {!loading && !error && filteredPublications.length > 0 && (
                    <PublicationList publications={filteredPublications} refreshPublications={refreshPublications} />
                )}
            </div>
        </div>
    );
};

export default DocumentCatalog;
