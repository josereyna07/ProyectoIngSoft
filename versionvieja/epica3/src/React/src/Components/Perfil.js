import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrearDocumento from '../GestionDocumentos/CrearPublicacion';
import GestionCategorias from './GestionCategorias';
import styles from './Perfil.module.css';
import EditarPublicacion from '../GestionDocumentos/EditarPublicacion';
import PublicationListPerfil from '../Screens/PublicationListPerfil';
import { useNavigate } from 'react-router-dom';

const Perfil = ({ onLogout }) => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    _id: '',
    nombre: '',
    email: '',
    nombreUsuario: '',
    preguntaSeguridad: '',
    respuestaSeguridad: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    historialContraseñas: [],
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [publicaciones, setPublicaciones] = useState([]);
  const [modalActualizar, setModalActualizar] = useState(false);
  const [modalPreguntaSeguridad, setModalPreguntaSeguridad] = useState(false);
  const [nuevosDatos, setNuevosDatos] = useState({});
  const [mensajeModal, setMensajeModal] = useState('');
  const [tituloModal, setTituloModal] = useState('Operación Exitosa');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [publicacionIdToEdit, setPublicationIdToEdit] = useState(null);
  const [publicacionIdToDelete, setPublicacionIdToDelete] = useState(null);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorPreguntaSeguridad, setErrorPreguntaSeguridad] = useState('');
  const [modalCambioContrasena, setModalCambioContrasena] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (usuario) {
      let formattedFechaNacimiento = '';
      if (usuario.fechaNacimiento) {
        formattedFechaNacimiento = new Date(usuario.fechaNacimiento).toISOString().split('T')[0];
      }
      setDatos({
        _id: usuario._id,
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        nombreUsuario: usuario.nombreUsuario || '',
        preguntaSeguridad: usuario.preguntaSeguridad || '',
        respuestaSeguridad: usuario.respuestaSeguridad || '',
        fechaNacimiento: formattedFechaNacimiento,
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || '',
        rol: usuario.rol || '',
      });

      axios.get(`http://localhost:8080/publicaciones/usuario/${usuario._id}`)
        .then(response => setPublicaciones(response.data))
        .catch(error => console.error('Error al obtener publicaciones:', error));
    }
  }, []);

  const actualizarDatos = () => {
    const datosActualizados = { ...nuevosDatos };

    // Convertir fecha de nacimiento al formato yyyy-MM-dd
    if (datosActualizados.fechaNacimiento) {
      const fecha = new Date(datosActualizados.fechaNacimiento);
      datosActualizados.fechaNacimiento = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
    }

    axios.put(`http://localhost:8080/api/auth/${datos._id}`, datosActualizados)
      .then(response => {
        const datosActualizados = response.data;

        // Formatear fecha después de la actualización para que se vea correctamente en la interfaz
        if (datosActualizados.fechaNacimiento) {
          datosActualizados.fechaNacimiento = new Date(datosActualizados.fechaNacimiento)
            .toISOString()
            .split('T')[0];
        }

        setDatos(datosActualizados);
        setModalActualizar(false);
        setTituloModal('Operación Exitosa');
        setMensajeModal('Datos actualizados con éxito.');
        setIsModalOpen(true);
        setNuevosDatos({});
      })
      .catch(error => {
        setTituloModal('Error en la Actualización');
        setMensajeModal(error.response?.data || 'Ocurrió un error al intentar actualizar los datos.');
        setIsModalOpen(true);
      });
  };

  const eliminarCuenta = () => {
    setIsDeleteConfirmOpen(false);  // Cierra el modal de confirmación
    
    axios.delete(`http://localhost:8080/api/auth/${datos._id}`)
      .then(response => {
        if (response.status === 200) {
          setTituloModal('Operación Exitosa');
          setMensajeModal('Tu usuario y todas tus publicaciones han sido eliminados con éxito.');
          setIsModalOpen(true);
  
          // Espera 3 segundos para mostrar el mensaje antes de redirigir
          setTimeout(() => {
            onLogout();  // Cierra sesión
            navigate('/login');  // Redirige al login
          }, 3000);
        }
      })
      .catch(error => {
        console.error('Error al eliminar cuenta:', error);
        setTituloModal('Error');
        setMensajeModal('Hubo un problema al intentar eliminar la cuenta.');
        setIsModalOpen(true);
      });
  };
  
  
  const confirmarEliminacion = () => {
    setIsDeleteConfirmOpen(true);  // Abre el modal de confirmación
  };

  const cambiarPreguntaSeguridad = () => {
    setModalPreguntaSeguridad(true);
    setErrorPreguntaSeguridad(''); // Limpiar errores previos al abrir el modal
  };

  const confirmarCambioPreguntaSeguridad = (e) => {
    e.preventDefault();

    // Verifica si ambos campos están completos
    if (!nuevosDatos.preguntaSeguridad || !nuevosDatos.respuestaSeguridad) {
      setErrorPreguntaSeguridad("Debes llenar ambos campos para continuar.");
      return;
    }

    const payload = {
      confirmPassword,
      preguntaSeguridad: nuevosDatos.preguntaSeguridad,
      respuestaSeguridad: nuevosDatos.respuestaSeguridad,
    };

    axios.put(`http://localhost:8080/api/auth/${datos._id}/cambiarPreguntaSeguridad`, payload)
      .then((response) => {
        setDatos(prevDatos => ({
          ...prevDatos,
          preguntaSeguridad: nuevosDatos.preguntaSeguridad,
          respuestaSeguridad: nuevosDatos.respuestaSeguridad,
        }));
        setModalPreguntaSeguridad(false); // Cerrar modal después de éxito
        setTituloModal("Operación Exitosa");
        setMensajeModal(response.data);
        setIsModalOpen(true);

        // Limpiar campos y errores después de la operación exitosa
        setNuevosDatos({});
        setConfirmPassword('');
        setErrorPreguntaSeguridad('');
      })
      .catch(error => {
        const errorMessage = error.response?.data || "Hubo un error al cambiar la contraseña.";
        setErrorPassword(errorMessage);
    });
    
  };

  const cerrarModalPreguntaSeguridad = () => {
    setModalPreguntaSeguridad(false);
    setNuevosDatos({});
    setConfirmPassword('');
    setErrorPreguntaSeguridad('');
  };

  const cambiarContrasena = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
        setErrorPassword("La nueva contraseña debe tener al menos 8 caracteres.");
        return;
    }

    if (newPassword !== confirmNewPassword) {
        setErrorPassword("Las contraseñas no coinciden.");
        return;
    }

    axios.put(`http://localhost:8080/api/auth/${datos._id}/cambiarContrasena`, {
      currentPassword,
      newPassword
  })
  .then(response => {
      setTituloModal("Operación Exitosa");
      setMensajeModal(response.data); // Mensaje de éxito
      setIsModalOpen(true);
      setModalCambioContrasena(false);
      // Resetear campos y errores
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setErrorPassword('');
  })
  .catch(error => {
      // Asegúrate de que `errorPassword` reciba el mensaje adecuado desde el backend
      const errorMessage = error.response?.data || "Hubo un error al cambiar la contraseña.";
      setErrorPassword(errorMessage);
  });
  
};



  const handleEdit = (id) => {
    setPublicationIdToEdit(id);
  };

  const handleDeleteRequest = (id) => {
    setPublicacionIdToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    axios.delete(`http://localhost:8080/publicaciones/eliminar/${publicacionIdToDelete}`)
      .then(() => {
        setPublicaciones(publicaciones.filter(pub => pub._id !== publicacionIdToDelete));
        setTituloModal('Operación Exitosa');
        setMensajeModal('Publicación eliminada con éxito.');
        setIsModalOpen(true);
      })
      .catch(error => console.error('Error al eliminar la publicación:', error))
      .finally(() => setIsDeleteConfirmOpen(false));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  return (
    <div className={styles.perfilContainer}>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{tituloModal}</h2>
            <p>{mensajeModal}</p>
            <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
          </div>
        </div>
      )}

      <button className={styles.logoutButton} onClick={handleLogout}>
        Cerrar Sesión
      </button>
      <h1 className={styles.title}>
        Perfil del <span className={styles.usuario}>Usuario</span>
      </h1>
      <p>Aquí puedes gestionar tu perfil y crear nuevos documentos.</p>
      <div className={styles.informacionUsuario}>
        <p><strong>Nombre:</strong> {datos.nombre}</p>
        <p><strong>Correo electrónico:</strong> {datos.email}</p>
        <p><strong>Nombre de Usuario:</strong> {datos.nombreUsuario}</p>
        <p><strong>Fecha de Nacimiento:</strong> {datos.fechaNacimiento}</p>
        <p><strong>Teléfono:</strong> {datos.telefono}</p>
        <p><strong>Dirección:</strong> {datos.direccion}</p>
      </div>
      <div className={styles.accionesPerfil}>
        <button className={styles.actualizarDatosButton} onClick={() => setModalActualizar(true)}>
          Actualizar datos
        </button>
        <button className={styles.eliminarCuentaButton} onClick={confirmarEliminacion}>
          Eliminar cuenta
        </button>
        <button className={styles.cambiarPreguntaSeguridadButton} onClick={() => setModalPreguntaSeguridad(true)}>
          Cambiar pregunta de seguridad
        </button>
        <button className={styles.cambiarContrasenaButton} onClick={() => setModalCambioContrasena(true)}>
          Cambiar contraseña
       </button>
      </div>
      

      {datos.rol === 'ADMIN' && (
        <div className={styles.gestionCategoriasSection}>
          <GestionCategorias />
        </div>
      )}

<div className={styles.userPublications}>
        <h2>Tus Publicaciones</h2>
        {publicaciones.length > 0 ? (
          <PublicationListPerfil
            publications={publicaciones}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        ) : (
          <p>No has creado ninguna publicación aún.</p>
        )}
      </div>

      {modalActualizar && (
        <div className={styles.modalActualizar}>
          <h2>Actualizar datos</h2>
          <form>
            <label>
              <p>Nombre:</p>
              <input type="text" value={nuevosDatos.nombre || ''} onChange={(e) => setNuevosDatos({ ...nuevosDatos, nombre: e.target.value })} />
            </label>
            <label>
              <p>Correo:</p>
              <input type="email" value={nuevosDatos.email || ''} onChange={(e) => setNuevosDatos({ ...nuevosDatos, email: e.target.value })} />
            </label>
            <label>
              <p>Nombre de usuario:</p>
              <input type="text" value={nuevosDatos.nombreUsuario || ''} onChange={(e) => setNuevosDatos({ ...nuevosDatos, nombreUsuario: e.target.value })} />
            </label>
            <label>
              <p>Fecha de nacimiento:</p>
              <input type="date" value={nuevosDatos.fechaNacimiento || ''} onChange={(e) => setNuevosDatos({ ...nuevosDatos, fechaNacimiento: e.target.value })} />
            </label>
            <label>
              <p>Teléfono:</p>
              <input type="tel" value={nuevosDatos.telefono || ''} onChange={(e) => setNuevosDatos({ ...nuevosDatos, telefono: e.target.value })} />
            </label>
            <label>
              <p>Dirección:</p>
              <input type="text" value={nuevosDatos.direccion || ''} onChange={(e) => setNuevosDatos({ ...nuevosDatos, direccion: e.target.value })} />
            </label>
            <button type="button" onClick={actualizarDatos}>Actualizar</button>
            <button type="button" onClick={() => setModalActualizar(false)}>Cancelar</button>
          </form>
        </div>
      )}

{modalPreguntaSeguridad && (
        <div className={styles.modalPreguntaSeguridad}>
          <h2>Cambiar Pregunta de Seguridad</h2>
          <form onSubmit={confirmarCambioPreguntaSeguridad}>
            <label>
              Contraseña actual:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <label>
              Nueva Pregunta de Seguridad:
              <input
                type="text"
                value={nuevosDatos.preguntaSeguridad || ''}
                onChange={(e) => setNuevosDatos({ ...nuevosDatos, preguntaSeguridad: e.target.value })}
                required
              />
            </label>
            <label>
              Nueva Respuesta de Seguridad:
              <input
                type="text"
                value={nuevosDatos.respuestaSeguridad || ''}
                onChange={(e) => setNuevosDatos({ ...nuevosDatos, respuestaSeguridad: e.target.value })}
                required
              />
            </label>
            {errorPreguntaSeguridad && <p className={styles.error}>{errorPreguntaSeguridad}</p>}
            <button type="submit">Cambiar</button>
            <button type="button" onClick={cerrarModalPreguntaSeguridad}>Cancelar</button>
          </form>
        </div>
      )}



{isDeleteConfirmOpen && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <h2>Confirmar Eliminación de Cuenta</h2>
      <p>¿Estás seguro de que deseas eliminar tu cuenta y todas tus publicaciones? Esta acción no se puede deshacer.</p>
      <button onClick={eliminarCuenta}>Confirmar</button>
      <button onClick={() => setIsDeleteConfirmOpen(false)}>Cancelar</button>
    </div>
  </div>
)}

{modalCambioContrasena && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <h2>Cambiar Contraseña</h2>
      <form onSubmit={cambiarContrasena}>
        <label>
          Contraseña actual:
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Nueva Contraseña:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirmar Nueva Contraseña:
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </label>
        {errorPassword && <p className={styles.error}>{errorPassword}</p>}
        <button type="submit">Cambiar</button>
        <button type="button" onClick={() => setModalCambioContrasena(false)}>Cancelar</button>
      </form>
    </div>
  </div>
)}

      <CrearDocumento />
      {publicacionIdToEdit && (
        <EditarPublicacion
          publicacionId={publicacionIdToEdit}
          onClose={() => setPublicationIdToEdit(null)}
          onSuccessfulUpdate={() => {
            setTituloModal("Operación Exitosa");
            setMensajeModal("Tu publicación se ha actualizado correctamente, ya puedes visualizar los cambios.");
            setIsModalOpen(true);
            const usuario = JSON.parse(localStorage.getItem('user')); 
            axios.get(`http://localhost:8080/publicaciones/usuario/${usuario._id}`)
              .then(response => setPublicaciones(response.data))
              .catch(error => console.error("Error al obtener publicaciones:", error));
          }}
        />
      )}
    </div>
  );
};

export default Perfil;
