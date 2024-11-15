import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PublicationListPerfil from '../Screens/PublicationListPerfil';
import styles from './Perfil.module.css';

const PerfilAutor = () => {
  const { idAutor } = useParams();// Captura el ID del autor desde la URL
  const [datosAutor, setDatosAutor] = useState({
    nombre: '',
    email: '',
    nombreUsuario: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
  });
  const [publicaciones, setPublicaciones] = useState([]);

  // Cargar datos del autor y sus publicaciones al montar el componente
  useEffect(() => {
    // Obtener los detalles del autor
    console.log('id autor:', idAutor);
    axios.get(`http://localhost:8080/publicaciones/usuario/detalles/${idAutor}`)
  .then(response => {
    setDatosAutor({
      nombre: response.data.nombre,
      email: response.data.email,
      nombreUsuario: response.data.nombreUsuario,
      fechaNacimiento: new Date(response.data.fechaNacimiento).toLocaleDateString('es-ES'),
      telefono: response.data.telefono,
      direccion: response.data.direccion,
    });
  })
  .catch(error => console.error('Error al obtener información del autor:', error));

    // Obtener publicaciones del autor
    axios.get(`http://localhost:8080/publicaciones/usuario/${idAutor}`)
      .then(response => setPublicaciones(response.data))
      .catch(error => console.error('Error al obtener publicaciones del autor:', error));
  }, [idAutor]);

  return (
    <div className={styles.perfilContainer}>
      <h1 className={styles.title}>
        Perfil del <span className={styles.usuario}>Autor</span>
      </h1>
      <p>Conoce más sobre el autor y sus publicaciones.</p>
      
      <div className={styles.informacionUsuario}>
        <p><strong>Nombre:</strong> {datosAutor.nombre}</p>
        <p><strong>Correo electrónico:</strong> {datosAutor.email}</p>
        <p><strong>Nombre de Usuario:</strong> {datosAutor.nombreUsuario}</p>
       
      </div>


      <div className={styles.userPublications}>
        <h2>Publicaciones del Autor</h2>
        {publicaciones.length > 0 ? (
          <PublicationListPerfil
            publications={publicaciones}
            isAuthorProfile={true} // Indica que estamos en el perfil del autor para ocultar botones de edición/eliminación
          />
        ) : (
          <p>Este autor aún no ha creado ninguna publicación.</p>
        )}
      </div>
    </div>
  );
};

export default PerfilAutor;