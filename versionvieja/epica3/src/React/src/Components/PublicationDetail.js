import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './PublicationDetail.module.css';
import { faStar as filledStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PublicationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [publication, setPublication] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [user, setUser] = useState(null);
    const [editCommentId, setEditCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [averageRating, setAverageRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [hasRated, setHasRated] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        if (loggedUser) {
            setUser(loggedUser);
        }

        const fetchData = async () => {
            try {
                const pubResponse = await axios.get(`http://localhost:8080/publicaciones/detalles/${id}`);
                setPublication(pubResponse.data);

                if (pubResponse.data.valoraciones && pubResponse.data.valoraciones.length > 0) {
                    calculateAverageRating(pubResponse.data.valoraciones);
                }

                const commentsResponse = await axios.get(`http://localhost:8080/publicaciones/${id}/comentarios`);
                setComments(commentsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        if (!user) {
            setModalMessage("Debes iniciar sesión para descargar el archivo.");
            setIsModalOpen(true);
            navigate('/login');
            return;
        }

        const commentData = {
            usuarioId: user.nombreUsuario,
            contenido: newComment,
        };

        try {
            const response = await axios.post(`http://localhost:8080/publicaciones/${id}/comentarios`, commentData);

            if (response.status === 200) {
                setComments([...comments, { ...commentData, fechaCreacion: new Date().toISOString(), id: new Date().getTime() }]);
                setNewComment("");
            } else {
                console.error("Error posting comment");
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleEditComment = (commentId, content) => {
        setEditCommentId(commentId);
        setEditContent(content);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();

        if (!user) {
            alert("Debes iniciar sesión para editar comentarios.");
            navigate('/login');
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8080/publicaciones/${id}/comentarios`,
                null,
                { params: { usuarioId: user.nombreUsuario, nuevoContenido: editContent } }
            );

            if (response.status === 200) {
                setComments(comments.map(comment =>
                    comment.id === editCommentId ? { ...comment, contenido: editContent } : comment
                ));
                setEditCommentId(null);
                setEditContent("");
            } else {
                console.error("Error editing comment");
            }
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/publicaciones/${id}/comentarios/${commentId}`);

            if (response.status === 200) {
                setComments(comments.filter(comment => comment.id !== commentId));
            } else {
                console.error("Error deleting comment");
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const calculateAverageRating = (valoraciones) => {
        const total = valoraciones.reduce((acc, val) => acc + val.puntuacion, 0);
        setAverageRating((total / valoraciones.length).toFixed(1));
    };

    const handleRating = async (rating) => {
        if (!user) {
            setModalMessage("Debes estar registrado para poder valorar.");
            setIsModalOpen(true);
            navigate('/login');
            return;
        }
    
        if (hasRated) {
            alert("Ya has valorado este documento.");
            return;
        }
    
        try {
            await axios.post(`http://localhost:8080/publicaciones/${id}/calificar`, {
                puntuacion: rating,
                usuarioId: user.id
            });
            setUserRating(rating);
            setHasRated(true);
            setSuccessMessage("¡Gracias por valorar!");
    
            const valoracionesLength = publication.valoraciones ? publication.valoraciones.length : 0;
            setAverageRating(((averageRating * valoracionesLength + rating) / (valoracionesLength + 1)).toFixed(1));
            
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
    
        } catch (error) {
            console.error('Error al valorar la publicación:', error);
            alert("Ocurrió un error al guardar tu valoración. Por favor, intenta de nuevo.");
        }
    };

    const handleEditRating = async (newRating) => {
        if (!newRating) {
            alert("Selecciona una cantidad válida de estrellas.");
            return;
        }
    
        try {
            await axios.put(`http://localhost:8080/publicaciones/${id}/calificar`, {
                puntuacion: newRating,
                usuarioId: user.id
            });
            
            setUserRating(newRating);
            setAverageRating(
                ((averageRating * publication.valoraciones.length - userRating + newRating) / publication.valoraciones.length).toFixed(1)
            );
            setSuccessMessage("¡Valoración actualizada con éxito!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            console.error("Error al actualizar la valoración:", error);
            alert("Ocurrió un error al intentar actualizar la valoración.");
        }
    };

    
    
    
    

    const handleDownload = async () => {
        if (!user) {
            setModalMessage("Debes iniciar sesión para descargar el archivo.");
            setIsModalOpen(true);
            return;
        }

        const archivoId = publication?.archivoId;
        if (!archivoId) {
            console.error("Error: archivoId no definido.");
            setModalMessage("No se pudo encontrar el archivo para descargar.");
            setIsModalOpen(true);
            return;
        }
    
        try {

        //     // Contar la descarga en el backend antes de proceder a la descarga del archivo
        // await axios.post(`http://localhost:8080/publicaciones/${id}/descargar`, {
        //     usuarioId: user._id
        // });

            const response = await axios.get(`http://localhost:8080/publicaciones/files/${archivoId}`, {
                headers: { "user-authenticated": "true" },
                responseType: 'blob'
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${publication.titulo}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error al descargar el archivo:", error);
        }
    };

    const closeModal = () => setIsModalOpen(false);

    if (!publication) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.publicationDetail}>
            <h1>{publication.titulo}</h1>
            <p><strong>Descripción:</strong> {publication.descripcion}</p>
            <p><strong>Categoría(s):</strong> {publication.categorias.map(categoria => categoria.nombreCategoria).join(', ')}</p>
            <p><strong>Fecha de publicación:</strong> {new Date(publication.fechaPublicacion).toLocaleDateString()}</p>
            <p><strong>Visibilidad:</strong> {publication.visibilidad}</p>
            <p><strong>Visualizaciones:</strong> {publication.visualizaciones.length}</p>
            <p><strong>Autores:</strong> 
  {publication.autores.map((autor) => {
    if (autor.rol === 'autor_principal') {
      // Solo se muestra el enlace para el autor principal
      return (
        <Link 
          key={autor._autorId} 
          to={`/perfilAutor/${autor._autorId}`} 
          className={styles.autorLink}
        >
          {autor.nombre}
        </Link>
      );
    } else {
      // Si el autor es secundario, no mostramos el enlace
      return autor.nombre; // Muestra solo el nombre del autor secundario sin enlace
    }
  }).reduce((prev, curr) => [prev, ', ', curr])}
</p>
<div className={styles.ratingSection}>
    <h3>Valoración promedio: {averageRating} estrellas</h3>
    {user ? (
        <div className={styles.stars}>
            {[...Array(5)].map((_, index) => (
                <FontAwesomeIcon
                    key={index}
                    icon={index < userRating ? filledStar : emptyStar}
                    onClick={() => handleRating(index + 1)}
                    className={styles.starIcon}
                    style={{ color: index < averageRating ? "gold" : "grey", cursor: hasRated ? "default" : "pointer" }}
                />
            ))}
        </div>
    ) : (
        <p>Debes estar registrado para valorar.</p>
    )}
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            </div>

            <h2>Vista completa del PDF:</h2>
            {publication.archivoBase64 ? (
    <>
        <iframe
    src={`data:application/pdf;base64,${publication.archivoBase64}`}
    title="Vista del PDF"
    width="100%"
    height="500px"
/>
        <button onClick={handleDownload}>Descargar PDF</button>
    </>
) : (
    <p>No se encontró el archivo PDF para esta publicación.</p>
)}
{isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <p>{modalMessage}</p>
                        <button className={styles.modalButton} onClick={closeModal}>Cerrar</button>
                    </div>
                </div>
            )}

            <h2>Comentarios</h2>
            <div className={styles.commentsSection}>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className={styles.comment}>
                            <p><strong>Usuario:</strong> {comment.usuarioId}</p>
                            <p>{comment.contenido}</p>
                            <p><em>Fecha:</em> {new Date(comment.fechaCreacion).toLocaleDateString()}</p>
                            {user && user.nombreUsuario === comment.usuarioId && (
                                <div>
                                    <button onClick={() => handleEditComment(comment.id, comment.contenido)}>Editar</button>
                                    <button onClick={() => handleDeleteComment(comment.id)}>Eliminar</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No hay comentarios aún.</p>
                )}
            </div>

            {user ? (
                editCommentId ? (
                    <form onSubmit={handleEditSubmit} className={styles.commentForm}>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            maxLength="230"
                            required
                        />
                        <button type="submit">Guardar cambios</button>
                    </form>
                ) : (
                    <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                        <textarea
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="Escribe tu comentario aquí..."
                            maxLength="230"
                            required
                        />
                        <button type="submit">Enviar comentario</button>
                    </form>
                )
            ) : (
                <p>Inicia sesión para comentar.</p>
            )}
        </div>
    );
};

export default PublicationDetail;
