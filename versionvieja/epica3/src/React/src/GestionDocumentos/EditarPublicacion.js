import React, { useState, useEffect } from 'react';
import styles from "./EditarPublicacion.module.css";
import DocumentoService from '../Service/DocumentoService';

const EditarPublicacion = ({ publicacionId, onClose, onSuccessfulUpdate }) => {
  const [publicacion, setPublicacion] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (publicacionId) {
      setIsLoading(true);
      DocumentoService.getPublicacion(publicacionId)
        .then((publicacionData) => {
          setPublicacion(publicacionData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error al obtener la publicación:', error);
          setError('No se encontró la publicación con el ID proporcionado.');
          setIsLoading(false);
        });
    }
  }, [publicacionId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log("Datos a enviar:", publicacion); // Verifica los datos de la publicación
    console.log("ID de publicación:", publicacionId); // Verifica el ID

    try {
      await DocumentoService.actualizarPublicacion(publicacionId, publicacion);
      console.log('Publicación actualizada correctamente');
      onSuccessfulUpdate(); // Notifica al perfil que la publicación se actualizó
      onClose(); // Cierra el modal de edición
    } catch (error) {
      console.error('Error al actualizar la publicación:', error);
      setError('Ocurrió un error al actualizar la publicación. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.editarPublicacion}>
      <div className={styles.titleContainer}>
        <p>Editar <br /><b>Publicación</b></p>
      </div>

      {publicacion && (
        <div className={`${styles.modalOverlay}`}>
          <div className={styles.modalContent}>
            <button onClick={onClose} className={styles.closeModalButton}>X</button>
            
            <div className={styles.titleInsideContainer}>
              <p>Editar <br /><b>Publicación</b></p>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="titulo">Título:</label>
              <input
                type="text"
                id="titulo"
                value={publicacion.titulo}
                onChange={(e) => setPublicacion({ ...publicacion, titulo: e.target.value })}
                required
              />

              <label htmlFor="descripcion">Descripción:</label>
              <textarea
                id="descripcion"
                value={publicacion.descripcion || ''}
                onChange={(e) => {
                  setPublicacion({ ...publicacion, descripcion: e.target.value });
                  e.target.style.height = "auto"; // Resetear altura
                  e.target.style.height = `${e.target.scrollHeight}px`; // Ajustar altura según el contenido
                }}
                style={{ overflow: "hidden", resize: "none" }} // Evitar barra de desplazamiento y redimensionamiento
                required
              />

              <label htmlFor="visibilidad">Visibilidad:</label>
              <select
                id="visibilidad"
                value={publicacion.visibilidad || 'PUBLICO'}
                onChange={(e) => setPublicacion({ ...publicacion, visibilidad: e.target.value })}
                required
              >
                <option value="publico">Público</option>
                <option value="privado">Privado</option>
              </select>

              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Actualizando...' : 'Actualizar Publicación'}
              </button>
            </form>

            {error && (
              <p style={{ color: 'red' }}>{error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarPublicacion;
