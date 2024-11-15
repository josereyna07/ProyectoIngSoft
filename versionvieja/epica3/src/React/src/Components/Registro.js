import React, { useState } from 'react';
import styles from './Registro.module.css';

const Registro = () => {
    const [datosFormulario, setDatosFormulario] = useState({
        nombre: '',
        email: '',
        nombreUsuario: '',
        preguntaSeguridad: '',
        respuestaSeguridad: '',
        fechaNacimiento: '',
        telefono: '',
        direccion: '',
        contraseña: '',
    });

    const [mensajeError, setMensajeError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setDatosFormulario((prevDatos) => ({
            ...prevDatos,
            [name]: value,
        }));
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();

        // Validación de fecha de nacimiento
        const fechaNacimiento = new Date(datosFormulario.fechaNacimiento);
        const hoy = new Date();
        const edadMinima = 15;
        const diferenciaAnios = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mesDiferencia = hoy.getMonth() - fechaNacimiento.getMonth();
        const diaDiferencia = hoy.getDate() - fechaNacimiento.getDate();

        if (
            diferenciaAnios < edadMinima ||
            (diferenciaAnios === edadMinima && (mesDiferencia < 0 || (mesDiferencia === 0 && diaDiferencia < 0)))
        ) {
            setMensajeError('La fecha mínima de nacimiento debe ser de al menos 15 años.');
            return;
        }

        const { nombre, nombreUsuario, email, fechaNacimiento: nacimiento, contraseña, preguntaSeguridad, respuestaSeguridad, telefono, direccion } = datosFormulario;
        
        if (!nombre || !nombreUsuario || !email || !nacimiento || !contraseña || !preguntaSeguridad || !respuestaSeguridad || !telefono || !direccion) {
            setMensajeError('Todos los campos son obligatorios.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosFormulario),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMensajeExito(data.message || "Usuario registrado exitosamente.");
                setMensajeError('');
            } else {
                setMensajeError(data.error || "Ocurrió un error durante el registro.");
                setMensajeExito('');
            }
        } catch (error) {
            console.error('Error de red:', error);
            setMensajeError('Error de red, por favor intenta de nuevo.');
            setMensajeExito('');
        }
    };

    return (
        <div className={styles.registroContainer}>
            <div className={styles.wrapper}>
                <form onSubmit={manejarEnvio}>
                    <h2>Registro de Usuario</h2>
                    {mensajeError && <div className="error-message">{mensajeError}</div>}
                    {mensajeExito && <div className="success-message">{mensajeExito}</div>}
                    
                    <div className="input-field">
                        <input
                            type="text"
                            name="nombre"
                            value={datosFormulario.nombre}
                            onChange={manejarCambio}
                            required
                        />
                        <label>Nombre</label>
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            name="nombreUsuario"
                            value={datosFormulario.nombreUsuario}
                            onChange={manejarCambio}
                            required
                        />
                        <label>Nombre de Usuario</label>
                    </div>
                    <div className="input-field">
                        <input
                            type="email"
                            name="email"
                            value={datosFormulario.email}
                            onChange={manejarCambio}
                            required
                        />
                        <label>Correo Electrónico</label>
                    </div>
                    <div className="input-field">
                        <input
                            type="date"
                            name="fechaNacimiento"
                            value={datosFormulario.fechaNacimiento}
                            onChange={manejarCambio}
                            required
                        />
                        <label>Fecha de Nacimiento</label>
                    </div>
                    <div className="input-field">
                        <input
                            type="password"
                            name="contraseña"
                            value={datosFormulario.contraseña}
                            onChange={manejarCambio}
                            required
                            minLength={8}
                        />
                        <label>Contraseña</label>
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            name="preguntaSeguridad"
                            value={datosFormulario.preguntaSeguridad}
                            onChange={manejarCambio}
                            required
                        />
                        <label>Pregunta de Seguridad</label>
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            name="respuestaSeguridad"
                            value={datosFormulario.respuestaSeguridad}
                            onChange={manejarCambio}
                            required
                        />
                        <label>Respuesta de Seguridad</label>
                    </div>
                    <div className="input-field">
                        <input
                            type="tel"
                            name="telefono"
                            value={datosFormulario.telefono}
                            onChange={manejarCambio}
                            required
                        />
                        <label>Número de Teléfono</label>
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            name="direccion"
                            value={datosFormulario.direccion}
                            onChange={manejarCambio}
                            required
                        />
                        <label>Dirección</label>
                    </div>
                    <button type="submit">Registrar</button>
                </form>
            </div>
        </div>
    );
};

export default Registro;
