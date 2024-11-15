import axios from 'axios';

const API_URL = 'http://localhost:8080'; // otra vez url de la api

const DocumentoService = {
  getPublicaciones: async () => {
    try {
      const response = await axios.get(`${API_URL}/publicaciones/listar`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      throw error;
    }
  },

  getPublicacion: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/publicaciones/obtener/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener publicación:', error);
      throw error;
    }
  },

  crearPublicacion: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/publicaciones/guardarPublicacion`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Documento creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear documento:', error);
      throw error;
    }
  },

  actualizarPublicacion: async (id, publicacion) => {
    try {
      const response = await axios.put(`${API_URL}/publicaciones/editar/${id}`, publicacion);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar publicación:', error);
      throw error;
    }
  },

  eliminarPublicacion: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/publicaciones/eliminar/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
      throw error;
    }
  },

  buscarPorTitulo: async (titulo) => {
    try {
      const response = await axios.get(`${API_URL}/publicaciones/buscarPortitulo`, { params: { titulo } });
      return response.data;
    } catch (error) {
      console.error('Error al buscar por título:', error);
      throw error;
    }
  },

  buscarPorFecha: async (fecha) => {
    try {
      const response = await axios.get(`${API_URL}/publicaciones/buscarPorFecha`, { params: { fechaPublicacion: fecha } });
      return response.data;
    } catch (error) {
      console.error('Error al buscar por fecha:', error);
      throw error;
    }
  },

  buscarPorAutor: async (autor) => {
    try {
      const response = await axios.get(`${API_URL}/publicaciones/buscarPorAutor`, { params: { nombreAutor: autor } });
      return response.data;
    } catch (error) {
      console.error('Error al buscar por autor:', error);
      throw error;
    }
  },

  buscarPorCategoria: async (categoria) => {
    try {
      const response = await axios.get(`${API_URL}/publicaciones/buscarporcategoria`, { params: { nombreCategoria: categoria } });
      return response.data;
    } catch (error) {
      console.error('Error al buscar por categoría:', error);
      throw error;
    }
  },

  descargarDocumento: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/publicaciones/${id}/download`, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      console.error('Error al descargar documento:', error);
      throw error;
    }
  }

};

export default DocumentoService;