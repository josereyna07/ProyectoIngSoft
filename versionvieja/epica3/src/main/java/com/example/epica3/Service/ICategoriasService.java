package com.example.epica3.Service;

import java.util.Map;

import org.bson.types.ObjectId;

import com.example.epica3.Model.CategoriasModel;

public interface ICategoriasService {
    String crearCategoria(CategoriasModel categoria);
    String editarCategoria(ObjectId id, Map<String, Object> cambios);
    String eliminarCategoria(ObjectId id);
}

