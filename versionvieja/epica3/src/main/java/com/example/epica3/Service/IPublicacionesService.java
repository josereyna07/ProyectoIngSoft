package com.example.epica3.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.web.multipart.MultipartFile;

import com.example.epica3.Model.ArchivoPublicacion;
import com.example.epica3.Model.PublicacionesModel;

public interface IPublicacionesService {

   // UrlDTO recuperarUrlById(String id);
    String guardarPublicacion(PublicacionesModel publicacion);
    Optional<ArchivoPublicacion> getFileByArchivoId(ObjectId _archivoId);
    PublicacionesModel storeArchivoEnPublicacion(PublicacionesModel publicacion, MultipartFile file) throws IOException;
    List<PublicacionesModel> obtenerTodasLasPublicaciones();
    List<PublicacionesModel> filterPublications(String titulo, String nombre, String nombreCategoria);
    void eliminarPublicacionesPorUsuario(ObjectId userId);
}