package com.example.epica3.Repository;

import com.example.epica3.Model.PublicacionesModel;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;
public interface PublicacionesRepository extends MongoRepository<PublicacionesModel, ObjectId> {

    @Query("{ 'titulo': { $regex: ?0, $options: 'i' } }")
    List<PublicacionesModel> findByTituloLike(String titulo);

    List<PublicacionesModel> findByFechaPublicacion(Date fechaPublicacion);   

    List<PublicacionesModel> findByAutores_Nombre(String nombre);
    List<PublicacionesModel> findByAutores__autorId(ObjectId _autorId);  
    
    
    List<PublicacionesModel> findAll(); // Esto debe funcionar sin problemas
    
    

    @Query(value = "{'categorias.nombreCategoria': ?0}")
    List<PublicacionesModel> findByCategoriasNombreCategoria(String nombreCategoria);


    
}