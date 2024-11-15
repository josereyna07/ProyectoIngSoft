import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecuperarContrasena.module.css';

const RecuperarContraseña = () => {
    const [step, setStep] = useState(1);
    const [identificador, setIdentificador] = useState('');
    const [preguntaSeguridad, setPreguntaSeguridad] = useState('');
    const [respuestaSeguridad, setRespuestaSeguridad] = useState('');
    const [nuevaContraseña, setNuevaContraseña] = useState('');
    const [confirmarContraseña, setConfirmarContraseña] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleIdentificadorSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/recuperar/verificarUsuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identificador })
            });

            
            if (response.ok) {
                const data = await response.json();
                setPreguntaSeguridad(data.preguntaSeguridad);
                setStep(2);
                setErrorMessage('');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Correo o nombre de usuario no registrado.");
            }
        } catch (error) {
            setErrorMessage("Error de red, intenta de nuevo.");
        }
    };

    const handleRespuestaSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/recuperar/validarRespuesta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identificador, respuestaSeguridad })
            });

            if (response.ok) {
                setStep(3);
                setErrorMessage('');
            } else {
                setErrorMessage("Respuesta incorrecta.");
            }
        } catch (error) {
            setErrorMessage("Error de red, intenta de nuevo.");
        }
    };

    const handleNuevaContraseñaSubmit = async (e) => {
        e.preventDefault();
        if (nuevaContraseña !== confirmarContraseña || nuevaContraseña.length < 8) {
            setErrorMessage("Las contraseñas no coinciden o son menores de 8 caracteres.");
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/auth/recuperar/actualizarContraseña', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identificador, nuevaContraseña })
            });

            if (response.ok) {
                setSuccessMessage("Contraseña actualizada correctamente.");
                navigate('/login');
            } else {
                setErrorMessage("No se pudo actualizar la contraseña.");
            }
        } catch (error) {
            setErrorMessage("Error de red, intenta de nuevo.");
        }
    };

    return (
        <div className="recuperarContainer">
            <div className="wrapper">
                <h2>Recuperar Contraseña</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                {step === 1 && (
                    <form onSubmit={handleIdentificadorSubmit}>
                        <div className="input-field">
                            <input
                                type="text"
                                required
                                value={identificador}
                                onChange={(e) => setIdentificador(e.target.value)}
                            />
                            <label>Correo o nombre de usuario</label>
                        </div>
                        <button type="submit">Siguiente</button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleRespuestaSubmit}>
                        <div className="input-field">
                            <input type="text" required value={preguntaSeguridad} readOnly />
                            <label>Pregunta de seguridad</label>
                        </div>
                        <div className="input-field">
                            <input
                                type="text"
                                required
                                value={respuestaSeguridad}
                                onChange={(e) => setRespuestaSeguridad(e.target.value)}
                            />
                            <label>Respuesta de seguridad</label>
                        </div>
                        <button type="submit">Siguiente</button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleNuevaContraseñaSubmit}>
                        <div className="input-field">
                            <input
                                type="password"
                                required
                                value={nuevaContraseña}
                                onChange={(e) => setNuevaContraseña(e.target.value)}
                            />
                            <label>Nueva contraseña</label>
                        </div>
                        <div className="input-field">
                            <input
                                type="password"
                                required
                                value={confirmarContraseña}
                                onChange={(e) => setConfirmarContraseña(e.target.value)}
                            />
                            <label>Confirmar nueva contraseña</label>
                        </div>
                        <button type="submit">Actualizar Contraseña</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RecuperarContraseña;
