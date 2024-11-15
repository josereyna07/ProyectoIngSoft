import Home from "./Screens/Home";
import HowWeWork from "./Screens/HowWeWork";
import Benefits from "./Screens/Benefits";
import Contact from "./Screens/Contact";
import NavBar from "./Components/NavBar";
import Perfil from "./Components/Perfil";
import DocumentCatalog from "./Screens/DocumentCatalog";
import Login from "./Components/Login";
import Registro from "./Components/Registro";
import RecuperarContrasena from './Components/RecuperarContrasena';
import PublicationDetail from './Components/PublicationDetail';
import PerfilAutor from './Components/PerfilAutor';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import styles from './App.module.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };
  
  return (
    <Router>
      <div className="App">
        <NavBar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={
            <>
              <Home isAuthenticated={isAuthenticated} />
              <DocumentCatalog />
              <HowWeWork />
              <Benefits />
              <Contact />
            </>
          } />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/perfil" /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/recuperar" element={<RecuperarContrasena />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/perfil" element={
            isAuthenticated ? <Perfil onLogout={handleLogout} /> : <Navigate to="/login" />
          } />
          {/* Ruta de detalles de la publicación */}
          <Route path="/publicaciones/:id" element={<PublicationDetail />} />
          {/* Nueva ruta para el perfil del autor */}
          <Route path="/perfilAutor/:idAutor" element={<PerfilAutor />} />
          <Route path="/perfilAutor/:usuarioid" element={<PerfilAutor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;