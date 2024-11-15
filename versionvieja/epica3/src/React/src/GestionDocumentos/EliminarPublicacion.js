import React, { useState } from 'react';
import styles from "./EliminarPublicacion.module.css";
import DocumentoService from '../Service/DocumentoService';

const EliminarPublicacion = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publicacionId, setPublicacionId] = useState('');
  const [publicacion, setPublicacion] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPublicacionId('');
    setPublicacion(null);
    setError(null);
    setConfirmDelete(false);
  };

  const handleInputChange = (event) => {
    setPublicacionId(event.target.value);
  };

  const validarPublicacion = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const publicacionData = await DocumentoService.getPublicacion(publicacionId);
      setPublicacion(publicacionData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al validar la publicación:', error);
      setError('No se encontró la publicación con el ID proporcionado.');
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await DocumentoService.eliminarPublicacion(publicacionId);
      console.log('Publicación eliminada correctamente');
      closeModal();
    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
      setError('Ocurrió un error al eliminar la publicación. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.eliminarPublicacion}>
      <div className={styles.titleContainer}>
        <p>Eliminar <br /><b>Publicación</b></p>
      </div>
      <button onClick={openModal} className={styles.openModalButton}>Eliminar publicación</button>

      {isModalOpen && (
        <div className={`${styles.modalOverlay} ${isModalOpen ? styles.open : ''}`}>
          <div className={styles.modalContent}>
            <button onClick={closeModal} className={styles.closeModalButton}>X</button>
            
            <div className={styles.titleInsideContainer}>
              <p>Eliminar <br /><b>Publicación</b></p>
            </div>

            {!publicacion ? (
              <form onSubmit={validarPublicacion}>
                <label htmlFor="publicacionId">ID de la Publicación:</label>
                <input
                  type="text"
                  id="publicacionId"
                  value={publicacionId}
                  onChange={handleInputChange}
                  required
                />
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Validando...' : 'Validar Publicación'}
                </button>
              </form>
            ) : !confirmDelete ? (
              <div>
                <p>¿Estás seguro de que deseas eliminar esta publicación?</p>
                <h3>{publicacion.nombre}</h3>
                <button onClick={() => setConfirmDelete(true)} className={styles.deleteButton}>
                  Sí, eliminar
                </button>
                 <button onClick={closeModal} className={styles.cancelButton}>
                  Cancelar
                </button>
              </div>
            ) : (
              <button onClick={handleDelete} disabled={isLoading}>
                {isLoading ? 'Eliminando...' : 'Eliminar Publicación'}
              </button>
            )}

            {error && (
              <p style={{ color: 'red' }}>{error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EliminarPublicacion;