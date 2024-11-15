import React from 'react'
import styles from "./Home.module.css";
import { Link } from "react-scroll";
import { useNavigate } from 'react-router-dom';

const Home = ({ isAuthenticated }) => {

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div name="Home" className={styles.home}>
      <div className={styles.titleContainer}>
        <p> Publica tus <br />
          <b>Documentos</b>
        </p>
        <p>
          Con la mejor <br />
          <b>Plataforma online</b>
        </p>
      </div>
      <div className={styles.ctaContainer}>
        <Link
          to="DocumentCatalog"
          smooth
          duration={500}
          className={styles.callToAction}
        >
          Catálogo de documentos
        </Link>
        <Link
          to="Contact"
          smooth
          duration={500}
          className={styles.callToAction}
        >
          Contáctanos
        </Link>
        
        {!isAuthenticated && (
          <button 
            onClick={handleLoginClick}
            className={styles.loginButton}
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </div>
  );
};

export default Home
