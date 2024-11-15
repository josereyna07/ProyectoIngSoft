import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PublicationList.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';

const PublicationList = ({ publications }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const [showPrivateAlert, setShowPrivateAlert] = useState(false);
  const handlePublicationClick = async (publication) => {
    if (publication.visibilidad === 'privado') {
        if (user && publication.autores.some((autor) => autor._autorId === user._id)) {
            await contarVisualizacion(publication._id);
            navigate(`/publicaciones/${publication._id}`);
        } else {
            setShowPrivateAlert(true);
        }
    } else if (publication.visibilidad === 'publico') {
        if (user) {
            await contarVisualizacion(publication._id);
        }
        navigate(`/publicaciones/${publication._id}`);
    }
};

// Llamada a la API para contar la visualización
const contarVisualizacion = async (publicacionId) => {
    try {
        await axios.post(`http://localhost:8080/publicaciones/${publicacionId}/visualizar`, {
            usuarioId: user._id
        });
    } catch (error) {
        console.error('Error al contar visualización:', error);
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
          {user && publication.autores.some((autor) => autor._autorId === user._id) && (
            <div className={styles.actionButtons}>
              <button onClick={(e) => { e.stopPropagation(); navigate('/perfil'); }}>Administrar en Perfil</button>
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

export default PublicationList;