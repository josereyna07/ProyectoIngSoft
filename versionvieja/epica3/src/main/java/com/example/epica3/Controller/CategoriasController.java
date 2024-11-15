package com.example.epica3.Controller;

import com.example.epica3.Model.CategoriasModel;
import com.example.epica3.Model.Subcategoria;
import com.example.epica3.Repository.CategoriasRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;


import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/categorias")
public class CategoriasController {

    @Autowired
    private CategoriasRepository categoriasRepository;

    // Para obtener todas las categorías disponibles
    @GetMapping("/todas")
    public ResponseEntity<List<String>> obtenerTodasLasCategorias() {
        // consulta y mapea solamente los nombres de las ctg
        List<String> nombresCategorias = categoriasRepository.findAll()
                .stream()
                .map(CategoriasModel::getNombre)
                .distinct() // controla los duplicados
                .collect(Collectors.toList());

        if (nombresCategorias.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204
        }
        return new ResponseEntity<>(nombresCategorias, HttpStatus.OK); // 200
    }

    // Obtener todas las categorías con todos sus detalles
    @GetMapping
    public ResponseEntity<List<CategoriasModel>> obtenerCategoriasConDetalles() {
    List<CategoriasModel> categorias = categoriasRepository.findAll();
    if (categorias.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204
    }
    return new ResponseEntity<>(categorias, HttpStatus.OK); // 200
    }


    // Crear nueva categoría
    @PostMapping("/crear")
public ResponseEntity<String> crearCategoria(@RequestBody CategoriasModel nuevaCategoria) {
    // Genera un nuevo ObjectId para la categoría
    ObjectId categoriaId = new ObjectId();
    nuevaCategoria.setId(categoriaId);
    
    // Asigna el _categoriaId y verifica que cada subcategoría tenga su nombre
    if (nuevaCategoria.getSubCategorias() != null) {
        nuevaCategoria.getSubCategorias().forEach(subcategoria -> {
            subcategoria.set_categoriaId(categoriaId);
            if (subcategoria.getNombreSubcategoria() == null || subcategoria.getNombreSubcategoria().isEmpty()) {
                throw new RuntimeException("Cada subcategoría debe tener un nombre");
            }
        });
    }

    categoriasRepository.save(nuevaCategoria);
    return new ResponseEntity<>("Categoría creada exitosamente", HttpStatus.CREATED);
}


    // Editar Categorías y subcategorías
    @PatchMapping("/editar/{categoriaId}")
    public ResponseEntity<String> editarCategoria(
            @PathVariable ObjectId categoriaId,
            @RequestBody Map<String, Object> cambios) {
    
        // Buscar la categoría por su ID
        Optional<CategoriasModel> categoriaExistente = categoriasRepository.findById(categoriaId);
        if (categoriaExistente.isPresent()) {
            CategoriasModel categoria = categoriaExistente.get();
    
            // Modificar los campos de la categoría principal
            cambios.forEach((campo, valor) -> {
                switch (campo) {
                    case "nombre":
                        categoria.setNombre((String) valor);
                        break;
                        case "subCategorias":
                        if (valor instanceof List<?>) {
                            List<?> listaGenerica = (List<?>) valor;
                            List<Map<String, Object>> subcategorias = listaGenerica.stream()
                                    .filter(item -> item instanceof Map)
                                    .map(item -> (Map<String, Object>) item)
                                    .collect(Collectors.toList());
                            actualizarSubcategorias(categoria, subcategorias);
                        }
                        break;
                    
                    // Agregar más campos de la categoría principal si los tienes
                }
            });
    
            // Guardar la categoría actualizada en la base de datos
            categoriasRepository.save(categoria);
            return new ResponseEntity<>("Categoría actualizada exitosamente", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Categoría no encontrada", HttpStatus.NOT_FOUND);
        }
    }
    
    // Método auxiliar para actualizar las subcategorías dentro de una categoría
    private void actualizarSubcategorias(CategoriasModel categoria, List<Map<String, Object>> subcategorias) {
        List<Subcategoria> listaSubcategorias = categoria.getSubCategorias();
    
        for (Map<String, Object> subcategoriaData : subcategorias) {
            ObjectId subcategoriaId = new ObjectId((String) subcategoriaData.get("_categoriaId"));
            String nombreSubcategoria = (String) subcategoriaData.get("nombreSubcategoria");
    
            // Buscar la subcategoría específica en la lista de subcategorías
            Subcategoria subcategoriaExistente = listaSubcategorias.stream()
                    .filter(sub -> sub.get_categoriaId().equals(subcategoriaId))
                    .findFirst()
                    .orElse(null);
    
            if (subcategoriaExistente != null) {
                // Actualizar los campos de la subcategoría existente
                if (nombreSubcategoria != null) {
                    subcategoriaExistente.setNombreSubcategoria(nombreSubcategoria);
                }
            } else {
                // Si no existe, agregar una nueva subcategoría
                Subcategoria nuevaSubcategoria = new Subcategoria();
                nuevaSubcategoria.set_categoriaId(subcategoriaId);
                nuevaSubcategoria.setNombreSubcategoria(nombreSubcategoria);
                listaSubcategorias.add(nuevaSubcategoria);
            }
        }
    
        // Actualizar la lista de subcategorías en la categoría
        categoria.setSubCategorias(listaSubcategorias);
    }
    

    // Eliminar categoría
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarCategoria(@PathVariable ObjectId id) {
        if (categoriasRepository.existsById(id)) {
            categoriasRepository.deleteById(id);
            return new ResponseEntity<>("Categoría eliminada exitosamente", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Categoría no encontrada", HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar una subcategoría de una categoría específica
    @DeleteMapping("/{categoriaId}/subcategoria/{subcategoriaId}")
    public ResponseEntity<String> eliminarSubcategoria(
        @PathVariable ObjectId categoriaId, 
        @PathVariable ObjectId subcategoriaId) {
    
    Optional<CategoriasModel> categoria = categoriasRepository.findById(categoriaId);
    if (categoria.isPresent()) {
        CategoriasModel categoriaModel = categoria.get();
        List<Subcategoria> subcategorias = categoriaModel.getSubCategorias();
        boolean removed = subcategorias.removeIf(sub -> sub.get_categoriaId().equals(subcategoriaId));

        if (removed) {
            categoriasRepository.save(categoriaModel);
            return new ResponseEntity<>("Subcategoría eliminada exitosamente", HttpStatus.OK);
        }
    }
    return new ResponseEntity<>("Subcategoría no encontrada", HttpStatus.NOT_FOUND);
    }

    // Agregar una subcategoría a una categoría específica
    @PostMapping("/{categoriaId}/subcategoria")
    public ResponseEntity<String> agregarSubcategoria(
        @PathVariable ObjectId categoriaId, 
        @RequestBody Subcategoria nuevaSubcategoria) {

    Optional<CategoriasModel> categoria = categoriasRepository.findById(categoriaId);
    if (categoria.isPresent()) {
        CategoriasModel categoriaModel = categoria.get();
        nuevaSubcategoria.set_categoriaId(new ObjectId());
        categoriaModel.getSubCategorias().add(nuevaSubcategoria);
        categoriasRepository.save(categoriaModel);
        return new ResponseEntity<>("Subcategoría agregada exitosamente", HttpStatus.CREATED);
    }
    return new ResponseEntity<>("Categoría no encontrada", HttpStatus.NOT_FOUND);
    }



    public CategoriasRepository getCategoriasRepository() {
        return categoriasRepository;
    }

    public void setCategoriasRepository(CategoriasRepository categoriasRepository) {
        this.categoriasRepository = categoriasRepository;
    }

}
