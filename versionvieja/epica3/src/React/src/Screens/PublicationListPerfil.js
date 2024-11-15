import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PublicationList.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const PublicationListPerfil = ({ publications, onEdit, onDelete, isAuthorProfile }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [showPrivateAlert, setShowPrivateAlert] = useState(false);

  const handlePublicationClick = (publication) => {
    if (publication.visibilidad === 'privado') {
      if (user && publication.autores.some((autor) => autor._autorId === user._id)) {
        navigate(`/publicaciones/${publication._id}`);
      } else {
        setShowPrivateAlert(true);
      }
    } else if (publication.visibilidad === 'publico') {
      navigate(`/publicaciones/${publication._id}`);
    }
  };

  const closePrivateAlert = () => {
    setShowPrivateAlert(false);
  };

  return (
    <div className={styles.publicationList}>
      {publications.map((publication) => (
        <div
          key={publication._id}
          className={styles.publicationCard}
          onClick={() => handlePublicationClick(publication)}
        >
          <div className={styles.publicationThumbnail}>
            <img
              src={publication.imagenUrl || "http://localhost:8080/default-logo.jpg" }
              alt={publication.titulo}
              className={styles.thumbnailImage}
            />
          </div>
          <div className={styles.publicationDetails}>
            <h3>{publication.titulo}</h3>
            <p>{publication.descripcion}</p>
            <p><strong>Autor(es):</strong> {publication.autores.map(autor => autor.nombre).join(', ')}</p>
            <p><strong>Fecha:</strong> {new Date(publication.fechaPublicacion).toLocaleDateString()}</p>
            <p><strong>Categoría(s):</strong> {publication.categorias.map(categoria => categoria.nombreCategoria).join(', ')}</p>
            <div className={styles.visibilityIcon}>
              {publication.visibilidad === 'privado' ? (
                <i className="fas fa-lock" title="Privado"></i>
              ) : (
                <i className="fas fa-globe" title="Público"></i>
              )}
            </div>
          </div>

          {!isAuthorProfile && ( // Condición para mostrar los botones solo si no es perfil de autor
            <div className={styles.actionButtons}>
              <button onClick={(e) => { e.stopPropagation(); onEdit(publication._id); }}>Editar</button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(publication._id); }}>Eliminar</button>
            </div>
          )}
        </div>
      ))}

      {showPrivateAlert && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Acceso restringido</h2>
            <p>Este documento es privado y no puedes acceder a él.</p>
            <button onClick={closePrivateAlert}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationListPerfil;