import React, { useState, useEffect } from 'react';
import styles from "./CrearPublicacion.module.css";
import DocumentoService from '../Service/DocumentoService';
import axios from 'axios';

const CrearPublicacion = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [publicacion, setPublicacion] = useState({
        titulo: '',
        descripcion: '',
        autores: [],
        visibilidad: '',
        categorias: [{ nombreCategoria: '' }],
    });

    useEffect(() => {
        axios.get('http://localhost:8080/categorias/todas')
            .then(response => setCategories(response.data))
            .catch(err => console.error("Error al cargar categorías:", err));
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (loggedUser && loggedUser._id) {
            setPublicacion((prev) => ({
                ...prev,
                autores: [
                    { _autorId: loggedUser._id, nombre: loggedUser.nombre, rol: 'autor_principal' },
                ],
            }));
        }
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
        setError(null);
        setShowConfirmation(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null);
        setShowConfirmation(false);
    };

    const handleDescriptionChange = (event) => {
        const { value } = event.target;
        setPublicacion({ ...publicacion, descripcion: value });
        event.target.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPublicacion({ ...publicacion, [name]: value });
    };

    const handleSecondaryAuthorChange = (event, index) => {
        const newAutores = [...publicacion.autores];
        newAutores[index].nombre = event.target.value;
        setPublicacion({ ...publicacion, autores: newAutores });
    };

    const addSecondaryAuthor = () => {
        setPublicacion((prev) => ({
            ...prev,
            autores: [...prev.autores, { nombre: '', rol: 'autor_secundario' }],
        }));
    };

    const removeSecondaryAuthor = (index) => {
        setPublicacion((prev) => ({
            ...prev,
            autores: prev.autores.filter((_, i) => i !== index + 1),
        }));
    };

    const handleCategoriasChange = (event, index) => {
        const newCategorias = [...publicacion.categorias];
        newCategorias[index].nombreCategoria = event.target.value;
        setPublicacion({ ...publicacion, categorias: newCategorias });
    };

    const addCategory = () => {
        setPublicacion((prev) => ({
            ...prev,
            categorias: [...prev.categorias, { nombreCategoria: '' }],
        }));
    };

    const removeCategory = (index) => {
        if (index > 0) {
            setPublicacion((prev) => ({
                ...prev,
                categorias: prev.categorias.filter((_, i) => i !== index),
            }));
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("publicacion", JSON.stringify(publicacion));

            await DocumentoService.crearPublicacion(formData);
            setShowConfirmation(true);
            setError(null);

            const loggedUser = JSON.parse(localStorage.getItem('user'));
            setPublicacion({
                titulo: '',
                descripcion: '',
                autores: [
                    { _autorId: loggedUser._id, nombre: loggedUser.nombre, rol: 'autor_principal' },
                ],
                visibilidad: '',
                categorias: [{ nombreCategoria: '' }],
            });
            setFile(null);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data);
            } else {
                setError('Hubo un error al crear el documento. Por favor, inténtalo de nuevo.');
            }
        }
    };

    return (
        <div name="CrearDocumento" className={styles.crearDocumento}>
            <div className={styles.titleContainer}>
                <p>Crea una nueva <br />
                    <b>Publicación</b>
                </p>
            </div>
            <button onClick={openModal} className={styles.openModalButton}>Crear nueva publicación</button>

            {isModalOpen && (
                <div className={`${styles.modalOverlay} ${isModalOpen ? styles.open : ''}`}>
                    <div className={styles.modalContent}>
                        <button onClick={closeModal} className={styles.closeModalButton}>X</button>

                        {showConfirmation ? (
                            <div className={styles.confirmationMessage}>
                                <p>¡La publicación se ha creado exitosamente!</p>
                                <button onClick={closeModal} className={styles.confirmButton}>Cerrar</button>
                            </div>
                        ) : error ? (
                            <div className={styles.errorMessageBox}>
                                <p>{error}</p>
                                <button onClick={() => setError(null)} className={styles.closeErrorButton}>Reintentar</button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.titleInsideContainer}>
                                    <p>Crea una nueva <br />
                                        <b>Publicación</b>
                                    </p>
                                </div>

                                <form className={styles.form} onSubmit={handleSubmit}>
                                    <label htmlFor="titulo">Título de la Publicación:</label>
                                    <input id="titulo" name="titulo" value={publicacion.titulo} onChange={handleInputChange} required className={styles.input} />

                                    <label htmlFor="descripcion">Descripción de la Publicación:</label>
                                    <textarea id="descripcion" name="descripcion" value={publicacion.descripcion} onChange={handleDescriptionChange} required className={styles.textarea} />

                                    <label>Autor(es) Secundarios:</label>
                                    {publicacion.autores.slice(1).map((autor, index) => (
                                        <div key={index} className={styles.authorContainer}>
                                            <input
                                                type="text"
                                                placeholder="Nombre del Autor Secundario"
                                                value={autor.nombre}
                                                onChange={(event) => handleSecondaryAuthorChange(event, index + 1)}
                                                required
                                                className={styles.input}
                                            />
                                            <button type="button" onClick={() => removeSecondaryAuthor(index)}>
                                                Eliminar
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addSecondaryAuthor}>
                                        Agregar autor secundario
                                    </button>

                                    <label>Categorías:</label>
                                    {publicacion.categorias.map((categoria, index) => (
                                        <div key={index} className={styles.categoryContainer}>
                                            <select
                                                value={categoria.nombreCategoria}
                                                onChange={(event) => handleCategoriasChange(event, index)}
                                                required
                                                className={styles.select}
                                            >
                                                <option value="">Selecciona una categoría</option>
                                                {categories.map((cat, idx) => (
                                                    <option key={idx} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            {index > 0 && (
                                                <button type="button" onClick={() => removeCategory(index)}>
                                                    Eliminar
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={addCategory}>
                                        Agregar categoría
                                    </button>

                                    <label>Visibilidad:</label>
                                    <select id="visibilidad" name="visibilidad" value={publicacion.visibilidad} onChange={handleInputChange} required className={styles.select}>
                                        <option value="">Seleccione una opción</option>
                                        <option value="publico">Público</option>
                                        <option value="privado">Privado</option>
                                    </select>

                                    <div className={styles.fileInputContainer}>
                                        <label htmlFor="file" className={styles.fileLabel}>Archivo de la Publicación (pdf):</label>
                                        <input type="file" id="file" className={styles.fileInput} onChange={handleFileChange} required />
                                    </div>

                                    <button type="submit" className={styles.submitButton}>Crear Publicación</button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrearPublicacion;
