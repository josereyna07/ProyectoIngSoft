package com.example.epica3.Repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.epica3.Model.CategoriasModel;

public interface CategoriasRepository extends MongoRepository <CategoriasModel, ObjectId>{
    CategoriasModel findByNombre(String nombre);

    List<CategoriasModel> findAll(); 
}
