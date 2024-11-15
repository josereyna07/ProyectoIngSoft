import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './GestionCategorias.module.css';

const GestionCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaAEditar, setCategoriaAEditar] = useState(null);
  const [subCategoriasEditadas, setSubCategoriasEditadas] = useState([]);
  const [categoriaSubcategorias, setCategoriaSubcategorias] = useState(null);
  const [nuevaCategoriaNombre, setNuevaCategoriaNombre] = useState('');
  const [nuevaSubcategoriaNombre, setNuevaSubcategoriaNombre] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/categorias')
      .then(response => {
        console.log("Categorías obtenidas:", response.data); // Verifica la respuesta
        setCategorias(response.data);
      })
      .catch(error => console.error('Error al obtener categorías:', error));
  }, []);
  
  // Crear una nueva categoría
  const handleCreateCategory = () => {
    const nuevaCategoria = prompt("Ingresa el nombre de la nueva categoría:");
    if (nuevaCategoria) {
      axios.post('http://localhost:8080/categorias/crear', { nombre: nuevaCategoria })
        .then(response => {
          alert(response.data); // Mostrar mensaje de éxito
          fetchCategories();
        })
        .catch(error => console.error('Error al crear categoría:', error));
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/categorias');
      console.log("Categorías obtenidas:", response.data); // Verifica la respuesta
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Editar una categoría existente
  const handleEditCategory = (categoria) => {
    console.log("Categoría seleccionada para editar:", categoria);
    setCategoriaAEditar(categoria);
    setNuevaCategoriaNombre(categoria.nombre);
    setSubCategoriasEditadas(categoria.subCategorias || []);
    console.log("ID de categoriaAEditar después de seleccionar:", categoria.id);
  };

  // manejar el cambio de nombre en las subcategorías
  const handleSubcategoryNameChange = (index, nuevoNombre) => {
    const subCategoriasActualizadas = [...subCategoriasEditadas];
    subCategoriasActualizadas[index].nombreSubcategoria = nuevoNombre;
    setSubCategoriasEditadas(subCategoriasActualizadas);
  };

  // Guardar cambios de edición de categoría y susubcategorías
  const handleSaveEditCategory = () => {
    console.log("categoriaAEditar antes de guardar:", categoriaAEditar);

    if (!categoriaAEditar?.id) {
        console.error("No se encontró el ID de la categoría a editar.");
        return;
    }

    const cambios = {
        nombre: nuevaCategoriaNombre,
        subCategorias: subCategoriasEditadas
    };

    console.log("Datos enviados:", cambios);

    axios.patch(`http://localhost:8080/categorias/editar/${categoriaAEditar.id}`, cambios)
        .then(() => {
            fetchCategories();
            setCategoriaAEditar(null);
            setNuevaCategoriaNombre('');
            setSubCategoriasEditadas([]);
            alert("Categoría actualizada exitosamente");
        })
        .catch(error => console.error('Error al editar categoría:', error));
  };

  // Función para manejar la administración de subcategorías
  const handleManageSubcategories = (categoria) => {
    setCategoriaSubcategorias(categoria);
    setSubCategoriasEditadas(categoria.subCategorias || []);
  };

  // Eliminar una subcategoría específica
  const handleDeleteSubcategory = (index) => {
    const subcategoriaId = subCategoriasEditadas[index]._categoriaId;
    axios.delete(`http://localhost:8080/categorias/${categoriaSubcategorias.id}/subcategoria/${subcategoriaId}`)
      .then(() => {
        const nuevasSubcategorias = subCategoriasEditadas.filter((_, i) => i !== index);
        setSubCategoriasEditadas(nuevasSubcategorias);
        alert("Subcategoría eliminada exitosamente");
      })
      .catch(error => console.error('Error al eliminar subcategoría:', error));
  };

  // Agregar una nueva subcategoría
  const handleAddSubcategory = () => {
    if (nuevaSubcategoriaNombre.trim() === '') return;

    const nuevaSubcategoria = { nombreSubcategoria: nuevaSubcategoriaNombre };
    axios.post(`http://localhost:8080/categorias/${categoriaSubcategorias.id}/subcategoria`, nuevaSubcategoria)
      .then(() => {
        setSubCategoriasEditadas([...subCategoriasEditadas, nuevaSubcategoria]);
        setNuevaSubcategoriaNombre('');
        alert("Subcategoría agregada exitosamente");
      })
      .catch(error => console.error('Error al agregar subcategoría:', error));
  };

  // Eliminar una categoría
  const handleDeleteCategory = (categoria) => {
    const categoriaId = categoria.id;
  
    if (!categoriaId) {
      console.error("ID de la categoría no encontrado.");
      return;
    }
  
    axios.delete(`http://localhost:8080/categorias/eliminar/${categoriaId}`)
      .then(() => {
        fetchCategories();
        alert("Categoría eliminada exitosamente");
      })
      .catch(error => console.error('Error al eliminar categoría:', error));
  };
  
  

  return (
    <div className={styles.categoriaSection}>
      <h2>Gestión de Categorías</h2>
      <ul className={styles.categoriaList}>
        {categorias.map((categoria, index) => (
          <li key={index} className={styles.categoriaItem}>
            <span>{categoria.nombre}</span>
            <button onClick={() => handleEditCategory(categoria)} className={styles.categoriaButton}>Editar</button>
            <button onClick={() => handleManageSubcategories(categoria)} className={styles.categoriaButton}>Administrar subcategorías</button>
            <button onClick={() => handleDeleteCategory(categoria)} className={styles.categoriaButton}>Eliminar</button>
          </li>
        ))}
      </ul>
      <button onClick={handleCreateCategory} className={styles.categoriaButtonAdd}>Crear Categoría</button>

      {categoriaAEditar && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Editar Categoría</h2>
            <input 
              type="text" 
              value={nuevaCategoriaNombre} 
              onChange={(e) => setNuevaCategoriaNombre(e.target.value)} 
            />
            <h3>Subcategorías</h3>
            {subCategoriasEditadas.map((subcategoria, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={subcategoria.nombreSubcategoria}
                  onChange={(e) => handleSubcategoryNameChange(index, e.target.value)}
                  placeholder="Nombre de la subcategoría"
                />
              </div>
            ))}
            <button onClick={handleSaveEditCategory}>Guardar</button>
            <button onClick={() => setCategoriaAEditar(null)}>Cancelar</button>
          </div>
        </div>
      )}
      {categoriaSubcategorias && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Administrar Subcategorías</h2>
            {subCategoriasEditadas.map((subcategoria, index) => (
              <div key={index} className={styles.subcategoriaItem}>
                <span>{subcategoria.nombreSubcategoria}</span>
                <button onClick={() => handleDeleteSubcategory(index)} className={styles.categoriaButton}>Eliminar</button>
              </div>
            ))}
            <input 
              type="text" 
              value={nuevaSubcategoriaNombre} 
              onChange={(e) => setNuevaSubcategoriaNombre(e.target.value)} 
              placeholder="Nueva subcategoría"
              className={styles.inputField}
            />
            <button onClick={handleAddSubcategory} className={styles.categoriaButton}>Agregar Subcategoría</button>
            <button onClick={() => setCategoriaSubcategorias(null)} className={styles.categoriaButton}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCategorias;
