package com.example.epica3.Service;

import com.example.epica3.Model.ArchivoPublicacion;
import com.example.epica3.Model.CategoriaReferencia;
import com.example.epica3.Model.CategoriasModel;
import com.example.epica3.Model.Comentarios;
import com.example.epica3.Model.PublicacionesModel;
import com.example.epica3.Model.VisualizacionesPublicacion;
import com.example.epica3.Repository.CategoriasRepository;
import com.example.epica3.Repository.PublicacionesRepository;


import com.example.epica3.Exception.RecursoNoEncontradoException;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.util.StringUtils;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PublicacionesServiceImp implements IPublicacionesService {

    @Autowired
    private CategoriasRepository categoriasRepository;
    @Autowired
    private PublicacionesRepository publicacionesRepository;

    @Override
    public List<PublicacionesModel> obtenerTodasLasPublicaciones() {
        return publicacionesRepository.findAll();
    }

    // Obtener una publicación por ID
    public PublicacionesModel obtenerPublicacionPorId(String id) {
        Optional<PublicacionesModel> publicacion = publicacionesRepository.findById(new ObjectId(id));
        return publicacion.orElseThrow(() -> new RecursoNoEncontradoException("Publicación no encontrada"));
    }

    // Crear una nueva publicación
    public void crearPublicacion(PublicacionesModel publicacion) {
        publicacionesRepository.save(publicacion);
    }

    // Eliminar una publicación por ID
    public void eliminarPublicacion(String id) {
        Optional<PublicacionesModel> publicacion = publicacionesRepository.findById(new ObjectId(id));
        if (publicacion.isPresent()) {
            publicacionesRepository.deleteById(new ObjectId(id));
        } else {
            throw new RecursoNoEncontradoException("Publicación no encontrada");
        }
    }

    // Buscar documentos por título
    public List<PublicacionesModel> obtenerPublicacionesPorTitulo(String titulo) {
        return publicacionesRepository.findByTituloLike(titulo);
    }

    // Buscar documentos por fecha de publicación
    public List<PublicacionesModel> buscarPorFechaPublicacion(Date fechaPublicacion) {
        return publicacionesRepository.findByFechaPublicacion(fechaPublicacion);
    }

    // Buscar documentos por autor
    public List<PublicacionesModel> obtenerPublicacionesPorNombreAutor(String nombreAutor) {
        return publicacionesRepository.findByAutores_Nombre(nombreAutor);
    }

    // Buscar documento por categoría 
    public List<PublicacionesModel> buscarPorNombreCategoria(String nombreCategoria) {
        return publicacionesRepository.findByCategoriasNombreCategoria(nombreCategoria);
    }

    // Editar información de publicaciones
 public PublicacionesModel editarPublicacion(String id, PublicacionesModel publicacionModificada) {
        // Buscar la publicación por ID
        Optional<PublicacionesModel> publicacionOptional = publicacionesRepository.findById(new ObjectId(id));

        if (!publicacionOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Publicación no encontrada");
        }

        PublicacionesModel publicacionExistente = publicacionOptional.get();

        // Actualizar solo los campos que se han pasado (que no sean nulos)
        if (publicacionModificada.getTitulo() != null) {
            publicacionExistente.setTitulo(publicacionModificada.getTitulo());
        }
        if (publicacionModificada.getDescripcion() != null) {
            publicacionExistente.setDescripcion(publicacionModificada.getDescripcion());
        }
        if (publicacionModificada.getAutores() != null && !publicacionModificada.getAutores().isEmpty()) {
            publicacionExistente.setAutores(publicacionModificada.getAutores());
        }
        if (publicacionModificada.getVisibilidad() != null) {
            publicacionExistente.setVisibilidad(publicacionModificada.getVisibilidad());
        }
        
        if (publicacionModificada.getCategorias() != null && !publicacionModificada.getCategorias().isEmpty()) {
            publicacionExistente.setCategorias(publicacionModificada.getCategorias());
        }
       
       
       

        // Guardar la publicación actualizada
        return publicacionesRepository.save(publicacionExistente);
    }
    

    @Override
    public String guardarPublicacion(PublicacionesModel publicacion) {

        for (CategoriaReferencia categoria : publicacion.getCategorias()) {
            ObjectId categoriaId = categoria.get_categoriaId();
            CategoriasModel categoriaP = categoriasRepository.findById(categoriaId).orElse(null);
            if (categoriaP == null) {
               return "Error: una o varias categorías que se intentan agregar no existen en la Base de Datos";
            }
            else {
               
               categoria.set_categoriaId(categoriaId);
            }
          }
          publicacionesRepository.save(publicacion);
          return "la publicacion: "+ publicacion.getTitulo()+ ", fue creada con éxito";
    }

    @Override
    public Optional<ArchivoPublicacion> getFileByArchivoId (ObjectId _archivoId) {
        // Buscar entre todas las publicaciones
        List<PublicacionesModel> publicaciones = publicacionesRepository.findAll();

        for (PublicacionesModel publicacion : publicaciones) {
            ArchivoPublicacion archivoPublicacion = publicacion.getArchivo();  // Suponiendo que 'archivo' es el campo en PublicacionesModel

            // Verificar si el archivo tiene el archivoId correcto
            if (archivoPublicacion != null && archivoPublicacion.get_archivoId().equals(_archivoId)) {
                return Optional.of(archivoPublicacion); // Retornar el archivo si coincide el archivoId
            }
        }
        return Optional.empty();
    }


 public PublicacionesModel storeArchivoEnPublicacion(PublicacionesModel publicacion, MultipartFile file) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        ObjectId archivoId = new ObjectId();
        
        // Crear el archivo y asignar datos binarios
        ArchivoPublicacion archivo = ArchivoPublicacion.builder()
            ._archivoId(archivoId)
            .name(fileName)
            .type(file.getContentType())
            .data(file.getBytes())
            .build();

        // Asignar archivo a la publicación
        publicacion.setArchivo(archivo);
        publicacion.setFechaPublicacion(new Date());

      // Validar categorías
      for (CategoriaReferencia categoriaRef : publicacion.getCategorias()) {
        CategoriaReferencia categoria = obtenerCategoriaExistente(categoriaRef.getNombreCategoria());
        if (categoria == null) {
            throw new IllegalArgumentException("La categoría '" + categoriaRef.getNombreCategoria() + "' no existe.");
        }
        categoriaRef.set_categoriaId(categoria.get_categoriaId());
    }

    return publicacionesRepository.save(publicacion);
}

    private CategoriaReferencia obtenerCategoriaExistente(String nombreCategoria) {
        // Buscar categoría por nombre
        CategoriasModel categoriaExistente = categoriasRepository.findByNombre(nombreCategoria);
        if (categoriaExistente != null) {
            return new CategoriaReferencia(categoriaExistente.getId(), categoriaExistente.getNombre());
        }
        return null; // Retorna null si la categoría no existe
    }

@Override
public List<PublicacionesModel> filterPublications(String titulo, String nombre, String nombreCategoria) {
    List<PublicacionesModel> result = new ArrayList<>(publicacionesRepository.findAll());

    if (titulo != null && !titulo.isEmpty()) {
        result = result.stream()
                .filter(pub -> pub.getTitulo().toLowerCase().contains(titulo.toLowerCase()))
                .collect(Collectors.toList());
    }

    if (nombre != null && !nombre.isEmpty()) {
        result = result.stream()
                .filter(pub -> pub.getAutores().stream()
                        .anyMatch(autor -> autor.getNombre().toLowerCase().contains(nombre.toLowerCase())))
                .collect(Collectors.toList());
    }

    if (nombreCategoria != null && !nombreCategoria.isEmpty()) {
        result = result.stream()
                .filter(pub -> pub.getCategorias().stream()
                        .anyMatch(cat -> cat.getNombreCategoria().equalsIgnoreCase(nombreCategoria)))
                .collect(Collectors.toList());
    }

    return result;
}


public PublicacionesModel agregarComentario(String publicacionId, Comentarios comentario) {//Crear comentario
    PublicacionesModel publicacion = obtenerPublicacionPorId(publicacionId);
    if (publicacion != null) {
        publicacion.getComentarios().add(comentario);
        return publicacionesRepository.save(publicacion);
    } else {
        throw new RecursoNoEncontradoException("Publicación no encontrada");
    }
}
public PublicacionesModel editarComentario(String publicacionId, String usuarioId, String nuevoContenido) { //Editar Comentario
    PublicacionesModel publicacion = obtenerPublicacionPorId(publicacionId);
    if (publicacion != null) {
        publicacion.getComentarios().forEach(comentario -> {
            if (comentario.getUsuarioId().equals(usuarioId)) {
                comentario.setContenido(nuevoContenido);
                comentario.setFechaEdicion(new Date());
            }
        });
        return publicacionesRepository.save(publicacion);
    } else {
        throw new RecursoNoEncontradoException("Publicación no encontrada");
    }
}
public PublicacionesModel eliminarComentario(String publicacionId, String comentarioId) {
    PublicacionesModel publicacion = publicacionesRepository.findById(new ObjectId(publicacionId))
            .orElseThrow(() -> new RecursoNoEncontradoException("Publicación no encontrada"));

    // Eliminar solo el comentario que tiene el id igual al `comentarioId`
    publicacion.getComentarios().removeIf(comentario -> comentario.getId().equals(comentarioId));

    return publicacionesRepository.save(publicacion);
}

public List<PublicacionesModel> obtenerPublicacionesPorUsuario(ObjectId _autorId) {
    return publicacionesRepository.findByAutores__autorId(_autorId); // Llama al método del repositorio
}

@Override
public void eliminarPublicacionesPorUsuario(ObjectId userId) {
    List<PublicacionesModel> publicaciones = publicacionesRepository.findByAutores__autorId(userId);
    for (PublicacionesModel publicacion : publicaciones) {
        publicacionesRepository.deleteById(publicacion.get_id());
    }
}

public void contarVisualizacion(String publicacionId, String usuarioId) {
        Optional<PublicacionesModel> publicacionOpt = publicacionesRepository.findById(new ObjectId(publicacionId));
        if (publicacionOpt.isPresent()) {
            PublicacionesModel publicacion = publicacionOpt.get();

            // Verifica si el usuario ya ha visualizado esta publicación
            boolean yaVisualizado = publicacion.getVisualizaciones().stream()
                    .anyMatch(v -> v.getIdAsString().equals(usuarioId));

            if (!yaVisualizado) {
                // Añade una nueva visualización si el usuario no la había visualizado antes
                VisualizacionesPublicacion visualizacion = new VisualizacionesPublicacion(new Date(), new ObjectId(usuarioId));
                publicacion.getVisualizaciones().add(visualizacion);
                publicacionesRepository.save(publicacion);
            }
        }
    }

}


