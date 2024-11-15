import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        identificador: '',
        contraseña: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.identificador || !formData.contraseña) {
            setError('Por favor, ingrese su nombre de usuario/correo y contraseña');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(data));
                    onLogin(data);
                    navigate('/perfil');
                } else {
                    setError(data.error || 'Credenciales incorrectas');
                }
            } else {
                setError('Error: el servidor no devolvió un JSON válido.');
                console.error('Respuesta del servidor:', await response.text());
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
            console.error('Error de conexión:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                {error && <div className={styles.error}>{error}</div>}
                <input
                    type="text"
                    name="identificador"
                    placeholder="Nombre de usuario o correo electrónico"
                    value={formData.identificador}
                    onChange={(e) => setFormData({ ...formData, identificador: e.target.value })}
                />
                <input
                    type="password"
                    name="contraseña"
                    placeholder="Contraseña"
                    value={formData.contraseña}
                    onChange={handleChange}
                />

                <div className="forget">
                    <p>Recordarme</p>
                    <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
                </div>

                <button type="submit">Ingresar</button>

                <div className="register">
                    <p>¿No tienes una cuenta? 
                        <Link to="/registro"> Registrarse </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
