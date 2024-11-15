package com.example.epica3.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.epica3.Model.CategoriasModel;
import com.example.epica3.Model.Subcategoria;
import com.example.epica3.Repository.CategoriasRepository;

@Service
public class CategoriasServiceImp implements ICategoriasService {

    @Autowired
    private CategoriasRepository categoriasRepository;

    @Override
    public String crearCategoria(CategoriasModel categoria) {
        categoriasRepository.save(categoria);
        return "Categoría creada exitosamente";
    }

    @Override
    public String editarCategoria(ObjectId id, Map<String, Object> cambios) {
        Optional<CategoriasModel> categoriaExistente = categoriasRepository.findById(id);
        if (categoriaExistente.isPresent()) {
            CategoriasModel categoria = categoriaExistente.get();
            cambios.forEach((campo, valor) -> {
                switch (campo) {
                    case "nombre":
                        categoria.setNombre((String) valor);
                        break;
                    case "subCategorias":
                        categoria.setSubCategorias((List<Subcategoria>) valor);
                        break;
                }
            });
            categoriasRepository.save(categoria);
            return "Categoría actualizada exitosamente";
        }
        return "Categoría no encontrada";
    }

    @Override
    public String eliminarCategoria(ObjectId id) {
        if (categoriasRepository.existsById(id)) {
            categoriasRepository.deleteById(id);
            return "Categoría eliminada exitosamente";
        }
        return "Categoría no encontrada";
    }

  
}

