package com.example.epica3.Controller;

import com.example.epica3.DTO.AutorDetallesDTO;
import com.example.epica3.DTO.PublicacionDTO;
import com.example.epica3.DTO.PublicacionPreviewDTO;
import com.example.epica3.Exception.RecursoNoEncontradoException;
import com.example.epica3.Model.ArchivoPublicacion;
import com.example.epica3.Model.Comentarios;
import com.example.epica3.Model.PublicacionesModel;
import com.example.epica3.Model.UsuariosModel;
import com.example.epica3.Model.ValoracionesPublicacion;
import com.example.epica3.Service.IUsuariosService;
import com.example.epica3.Service.PublicacionesServiceImp;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;


import java.io.IOException;
import java.util.Base64;
import java.util.Date;
import java.util.List;

import java.util.stream.Collectors;
import java.util.Optional;

@RestController
@RequestMapping("/publicaciones")
public class PublicacionesController {

    @Autowired
    private IUsuariosService usuariosService;

    @GetMapping("/usuario/detalles/{_id}")
    public ResponseEntity<AutorDetallesDTO> obtenerDetallesAutor(@PathVariable ObjectId _id) {
        try {
            // Convierte el usuarioId a ObjectId
            //ObjectId objectId = new ObjectId(_id); 
            Optional<UsuariosModel> autor = usuariosService.obtenerDetallesAutor(_id);
            if (autor.isPresent()) {
                UsuariosModel usuario = autor.get();
                AutorDetallesDTO autorDetallesDTO = new AutorDetallesDTO(
                    usuario.getNombre(),
                    usuario.getEmail(),
                    usuario.getNombreUsuario(),
                    usuario.getFechaNacimiento(),
                    usuario.getTelefono(),
                    usuario.getDireccion()
                );
                return ResponseEntity.ok(autorDetallesDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    @Autowired
    private PublicacionesServiceImp publicacionesService;
    // Endpoint para obtener detalles de una publicación con el PDF en Base64
    @GetMapping("/detalles/{id}")
    public ResponseEntity<PublicacionDTO> obtenerDetallesPublicacion(@PathVariable String id) {
        PublicacionesModel publicacion = publicacionesService.obtenerPublicacionPorId(id);
        
        if (publicacion != null) {
            ArchivoPublicacion archivo = publicacion.getArchivo();
            String archivoBase64 = archivo != null && archivo.getData() != null
                ? Base64.getEncoder().encodeToString(archivo.getData())
                : null;
            
            String archivoId = archivo != null ? archivo.getArchivoIdAsString() : null; // Asegúrate de que archivoId esté definido
    
            PublicacionDTO publicacionDTO = new PublicacionDTO(
                publicacion.getTitulo(),
                publicacion.getCategorias(),
                publicacion.getDescripcion(),
                publicacion.getFechaPublicacion(),
                publicacion.getVisibilidad(),
                publicacion.getVisualizaciones(),
                publicacion.getAutores(),
                archivoBase64, // PDF en formato Base64
                archivoId // Pasa archivoId al DTO
            );
    
            return ResponseEntity.ok(publicacionDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    // Listar todas las publicaciones
    @GetMapping(value = "/listarFront", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> listarPublicaciones(@RequestHeader(value = "user-authenticated", required = false) String userAuthenticated) {
        // Obtener todas las publicaciones
        List<PublicacionesModel> publicaciones = publicacionesService.obtenerTodasLasPublicaciones();
    
        // Filtrar las publicaciones: si el usuario no está autenticado, excluir las publicaciones privadas
        List<PublicacionPreviewDTO> publicacionesPreview = publicaciones.stream()
            .filter(publicacion -> "publico".equals(publicacion.getVisibilidad()) || (userAuthenticated != null && userAuthenticated.equals("true")))
            .map(publicacion -> new PublicacionPreviewDTO(
                publicacion.getIdAsString(),
                publicacion.getTitulo(),
                publicacion.getDescripcion(),
                publicacion.getCategorias(),
                publicacion.getAutores(),
                publicacion.getFechaPublicacion(),
                PublicacionPreviewDTO.Visibilidad.valueOf(publicacion.getVisibilidad()),
                "/archivo/" + publicacion.getArchivo().getArchivoIdAsString(), // URL del archivo PDF
                "http://localhost:8080/default-logo.jpg"  // Asignamos la imagen por defecto directamente
            ))
            .collect(Collectors.toList());
    
        // Convertir a JSON y devolver la respuesta
        try {
            ObjectMapper mapper = new ObjectMapper();
            String jsonResult = mapper.writeValueAsString(publicacionesPreview);
            return ResponseEntity.ok(jsonResult);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar JSON");
        }
    }
    
    

    

    // Obtener una publicación por ID
    @GetMapping("/obtener/{id}")
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> obtenerPublicacionPorId(@PathVariable String id) {
        try {
            PublicacionesModel publicacion = publicacionesService.obtenerPublicacionPorId(id);
            return new ResponseEntity<>(publicacion, HttpStatus.OK);
        } catch (RecursoNoEncontradoException e) {
            return new ResponseEntity<>("Error: Publicación no encontrada para el ID proporcionado: " + id,
                    HttpStatus.NOT_FOUND);
        }

    }

    // Eliminar una publicación por ID
    @DeleteMapping("/eliminar/{id}")
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> eliminarPublicacion(@PathVariable String id) {
        try {
            publicacionesService.eliminarPublicacion(id);
            return new ResponseEntity<>("Publicación eliminada exitosamente", HttpStatus.OK);
        } catch (RecursoNoEncontradoException e) {
            return new ResponseEntity<>("Error: Publicación no encontrada para el ID proporcionado: " + id,
                    HttpStatus.NOT_FOUND);
        }
    }

    // Buscar documentos por título
   // Buscar documentos por título
@GetMapping("/buscarPortitulo")
//@PreAuthorize("hasRole('USER')")
public ResponseEntity<?> buscarPorTitulo(@RequestParam String titulo) {
    List<PublicacionesModel> publicaciones = publicacionesService.obtenerPublicacionesPorTitulo(titulo);
    if (publicaciones.isEmpty()) {
        return new ResponseEntity<>("No se encontraron documentos con el título especificado.", HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(publicaciones, HttpStatus.OK);
}

// Buscar documentos por fecha de publicación
@GetMapping("/buscarPorFecha")
//@PreAuthorize("hasRole('USER')")
public ResponseEntity<?> buscarPorFecha(@RequestParam Date fechaPublicacion) {
    List<PublicacionesModel> publicaciones = publicacionesService.buscarPorFechaPublicacion(fechaPublicacion);
    if (publicaciones.isEmpty()) {
        return new ResponseEntity<>("No se encontraron documentos para la fecha de publicación especificada.", HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(publicaciones, HttpStatus.OK);
}

// Buscar documentos por autor
@GetMapping("/buscarPorAutor")
//@PreAuthorize("hasRole('USER')")
public ResponseEntity<?> obtenerPublicacionesPorAutor(@RequestParam String nombreAutor) {
    List<PublicacionesModel> publicaciones = publicacionesService.obtenerPublicacionesPorNombreAutor(nombreAutor);
    if (publicaciones.isEmpty()) {
        return new ResponseEntity<>("No se encontraron documentos para el autor especificado.", HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(publicaciones, HttpStatus.OK);
}

// Buscar documentos por categoría
@GetMapping("/buscarporcategoria")
//@PreAuthorize("hasRole('USER')")
public ResponseEntity<?> buscarPorCategoria(@RequestParam String nombreCategoria) {
    List<PublicacionesModel> publicaciones = publicacionesService.buscarPorNombreCategoria(nombreCategoria);
    if (publicaciones.isEmpty()) {
        return new ResponseEntity<>("No se encontraron documentos para la categoría especificada.", HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(publicaciones, HttpStatus.OK);
}


    // Actualizar publicación
    @PutMapping("/editar/{id}")
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<PublicacionesModel> actualizarPublicacion(
            @PathVariable String id, @RequestBody PublicacionesModel publicacionActualizada) {
        try {
            // Llamada al servicio para editar la publicación
            PublicacionesModel publicacion = publicacionesService.editarPublicacion(id, publicacionActualizada);
            return ResponseEntity.ok(publicacion); // Devuelve la publicación actualizada
        } catch (RecursoNoEncontradoException e) {
            // Manejo de excepción si no se encuentra la publicación
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    
    //@PreAuthorize("hasRole('USER')")
    @PostMapping ("/insertar")
   public ResponseEntity <String> crearPublicacion (@RequestBody PublicacionesModel publicacion){
    return new ResponseEntity<>(publicacionesService.guardarPublicacion(publicacion), HttpStatus.CREATED);
   }

   @GetMapping("/files/{_archivoId}")
public ResponseEntity<?> getFile(@PathVariable ObjectId _archivoId, @RequestHeader(value = "user-authenticated", required = false) String userAuthenticated) {
    // Verificar si el usuario está autenticado
    if (userAuthenticated == null || !userAuthenticated.equals("true")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Debe iniciar sesión para descargar el archivo.");
    }

    // Buscar el archivo en la base de datos
    Optional<ArchivoPublicacion> fileEntityOpt = publicacionesService.getFileByArchivoId(_archivoId);
    if (fileEntityOpt.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Archivo no encontrado.");
    }

    ArchivoPublicacion fileEntity = fileEntityOpt.get();
    
    // Configurar los headers para la descarga del archivo
    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileEntity.getName() + "\"")
            .body(fileEntity.getData());
}


    // @GetMapping("/download/{id}")
    // public ResponseEntity<byte[]> downloadDocument(@PathVariable String id){
    //     PublicacionesModel publication = publicacionesService.obtenerPublicacionPorId(id);

    //     // Descargar el documento desde el Url
    //     String fileUrl = publication.getTitulo();
    //     RestTemplate restTemplate = new RestTemplate();
    //     byte[] fileBytes = restTemplate.getForObject(fileUrl, byte[].class);

    //     HttpHeaders headers = new HttpHeaders();
    //     headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + publication.getDescripcion()+".pdf");
        
    //     return new ResponseEntity<>(fileBytes, headers , HttpStatus.OK);
    // }

    @PostMapping("/guardarPublicacion")
public ResponseEntity<?> crearPublicacionConArchivo(
        @RequestParam("file") MultipartFile file,
        @RequestParam("publicacion") String publicacionJson) {

    try {
        // Convertir el JSON de la publicación a un objeto Java
        ObjectMapper objectMapper = new ObjectMapper();
        PublicacionesModel publicacion = objectMapper.readValue(publicacionJson, PublicacionesModel.class);

        // Llamar al servicio para almacenar el archivo y la publicación
        PublicacionesModel publicacionGuardada = publicacionesService.storeArchivoEnPublicacion(publicacion, file);
        return ResponseEntity.ok(publicacionGuardada);

    } 
    catch (IllegalArgumentException e) {
        // Retornar mensaje de error si la categoría no existe
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }catch (IOException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

// Método GET para filtrar publicaciones
    @GetMapping("/filter")
    public ResponseEntity<List<PublicacionesModel>> filterPublications(
        @RequestParam(value = "titulo", required = false) String titulo,
        @RequestParam(value = "nombre", required = false) String nombre,
        @RequestParam(value = "nombreCategoria", required = false) String nombreCategoria) {

    List<PublicacionesModel> filteredPublications = publicacionesService.filterPublications(titulo, nombre, nombreCategoria);

    if (filteredPublications.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    return new ResponseEntity<>(filteredPublications, HttpStatus.OK);
    }


// Endpoint para agregar comentario
    @PostMapping("/{id}/comentarios")
    public ResponseEntity<PublicacionesModel> agregarComentario(
            @PathVariable String id,
            @RequestBody Comentarios comentario) {
        PublicacionesModel publicacionActualizada = publicacionesService.agregarComentario(id, comentario);
        return ResponseEntity.ok(publicacionActualizada);
    }

    // Endpoint para editar comentario
    @PutMapping("/{id}/comentarios")
    public ResponseEntity<PublicacionesModel> editarComentario(
            @PathVariable String id,
            @RequestParam String usuarioId,
            @RequestParam String nuevoContenido) {
        return ResponseEntity.ok(publicacionesService.editarComentario(id, usuarioId, nuevoContenido));
    }

    // Endpoint para eliminar comentario
    @DeleteMapping("/{id}/comentarios/{comentarioId}")
    public ResponseEntity<PublicacionesModel> eliminarComentario(
            @PathVariable String id,
            @PathVariable String comentarioId) {
        return ResponseEntity.ok(publicacionesService.eliminarComentario(id, comentarioId));
    }

    // Obtener todos los comentarios de una publicación
    @GetMapping("/{id}/comentarios")
    public ResponseEntity<List<Comentarios>> obtenerComentarios(@PathVariable String id) {
        try {
            PublicacionesModel publicacion = publicacionesService.obtenerPublicacionPorId(id);
            List<Comentarios> comentarios = publicacion.getComentarios();
            return ResponseEntity.ok(comentarios);
        } catch (RecursoNoEncontradoException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //calificar o valorar publicacion (es lo misme)
    @PostMapping("/{id}/calificar")
    public ResponseEntity<PublicacionesModel> calificarPublicacion(
        @PathVariable String id,
        @RequestBody ValoracionesPublicacion nuevaValoracion) {
    try {
        PublicacionesModel publicacion = publicacionesService.obtenerPublicacionPorId(id);

        //verifica si el usuario ya ha valorado esta publicación
        boolean haValorado = publicacion.getValoraciones().stream()
            .anyMatch(valoracion -> valoracion.getIdAsString().equals(nuevaValoracion.getIdAsString()));

        if (haValorado) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        publicacion.getValoraciones().add(nuevaValoracion);
        publicacionesService.guardarPublicacion(publicacion);

        return ResponseEntity.ok(publicacion);
    } catch (RecursoNoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    }

    @GetMapping("/usuario/{_autorId}")
    public List<PublicacionesModel> obtenerPublicacionesPorUsuario(@PathVariable("_autorId") String _autorId) {
        ObjectId objectId = new ObjectId(_autorId); // Convertir String a ObjectId
        return publicacionesService.obtenerPublicacionesPorUsuario(objectId);
    }

    @PutMapping("/{id}/calificar")
public ResponseEntity<PublicacionesModel> editarValoracion(
        @PathVariable String id,
        @RequestBody ValoracionesPublicacion valoracionActualizada) {
    try {
        PublicacionesModel publicacion = publicacionesService.obtenerPublicacionPorId(id);
        
        // Verificar si el usuario ya ha valorado esta publicación
        Optional<ValoracionesPublicacion> valoracionExistente = publicacion.getValoraciones().stream()
                .filter(valoracion -> valoracion.getIdAsString().equals(valoracionActualizada.getIdAsString()))
                .findFirst();

        if (valoracionExistente.isPresent()) {
            // Actualizar la valoración existente
            valoracionExistente.get().setPuntuacion(valoracionActualizada.getPuntuacion());
            publicacionesService.guardarPublicacion(publicacion);
            return ResponseEntity.ok(publicacion);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    } catch (RecursoNoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}

@DeleteMapping("/{id}/valoraciones/{usuarioId}")
public ResponseEntity<?> eliminarValoracion(
        @PathVariable String id,
        @PathVariable String usuarioId) {
    try {
        PublicacionesModel publicacion = publicacionesService.obtenerPublicacionPorId(id);

        // Remover la valoración del usuario
        boolean removed = publicacion.getValoraciones().removeIf(
            valoracion -> valoracion.getIdAsString().equals(usuarioId)
        );

        if (removed) {
            publicacionesService.guardarPublicacion(publicacion);
            return ResponseEntity.ok("Valoración eliminada exitosamente.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Valoración no encontrada.");
        }
    } catch (RecursoNoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}

// Endpoint para contar una visualización de un documento
@PostMapping("/{id}/visualizar")
public ResponseEntity<String> contarVisualizacion(
        @PathVariable("id") String publicacionId,
        @RequestBody VisualizacionRequest request) {
    try {
        publicacionesService.contarVisualizacion(publicacionId, request.getUsuarioId());
        return ResponseEntity.status(HttpStatus.OK).body("Visualización registrada exitosamente.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registrar la visualización.");
    }
}
}

// Clase para representar la solicitud de visualización
class VisualizacionRequest {
private String usuarioId;

public String getUsuarioId() {
    return usuarioId;
}

public void setUsuarioId(String usuarioId) {
    this.usuarioId = usuarioId;
}

 // Endpoint para contar una descarga de un documento
 @PostMapping("/{id}/descargar")
 public ResponseEntity<String> contarDescarga(
         @PathVariable("id") String publicacionId,
         @RequestBody DescargaRequest request) {
     try {
         publicacionesService.contarDescarga(publicacionId, request.getUsuarioId());
         return ResponseEntity.status(HttpStatus.OK).body("Descarga registrada exitosamente.");
     } catch (Exception e) {
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registrar la descarga.");
     }
 }
}

// Clase para representar la solicitud de descarga
class DescargaRequest {
 private String usuarioId;

 public String getUsuarioId() {
     return usuarioId;
 }

 public void setUsuarioId(String usuarioId) {
     this.usuarioId = usuarioId;
 }
}