package com.example.epica3.Controller;

import com.example.epica3.DTO.LoginRequest;
import com.example.epica3.DTO.LoginResponse;
import com.example.epica3.Model.UsuariosModel;
import com.example.epica3.Service.IUsuariosService;
import com.example.epica3.Service.PublicacionesServiceImp;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private IUsuariosService usuariosService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = usuariosService.verificarCredenciales(loginRequest);

        if (loginResponse.isAutenticado()) {
            return ResponseEntity.ok(loginResponse);
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", loginResponse.getMensaje());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UsuariosModel newUser) {
        try {
            usuariosService.registerUser(newUser);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Usuario registrado exitosamente.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al registrar el usuario.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/recuperar/verificarUsuario")
    public ResponseEntity<?> verificarUsuario(@RequestBody Map<String, String> request) {
        String identificador = request.get("identificador");
        Optional<UsuariosModel> usuario = usuariosService.findByEmailOrNombreUsuario(identificador);
    
        if (usuario.isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("preguntaSeguridad", usuario.get().getPreguntaSeguridad());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Correo o nombre de usuario no registrado."));
        }
    }

    @PostMapping("/recuperar/validarRespuesta")
public ResponseEntity<?> validarRespuesta(@RequestBody Map<String, String> payload) {
    String identificador = payload.get("identificador");
    String respuestaSeguridad = payload.get("respuestaSeguridad");

    // Busca el usuario usando el identificador
    Optional<UsuariosModel> usuarioOpt = usuariosService.findByEmailOrNombreUsuario(identificador);
    if (usuarioOpt.isPresent()) {
        UsuariosModel usuario = usuarioOpt.get();
        
        // Verifica la respuesta de seguridad
        if (usuario.getRespuestaSeguridad().equals(respuestaSeguridad)) {
            return ResponseEntity.ok().body("Respuesta correcta");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Respuesta incorrecta");
        }
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
    }
}
@PutMapping("/{id}")
public ResponseEntity<?> actualizarDatos(@PathVariable String id, @RequestBody Map<String, Object> nuevosDatos) {
    try {
        Optional<UsuariosModel> usuarioOpt = usuariosService.findById(id);

        if (usuarioOpt.isPresent()) {
            UsuariosModel usuario = usuarioOpt.get();

            // Validación y actualización de nombre de usuario
            if (nuevosDatos.containsKey("nombreUsuario")) {
                String nuevoNombreUsuario = (String) nuevosDatos.get("nombreUsuario");
                if (usuariosService.existsByNombreUsuario(nuevoNombreUsuario) && !nuevoNombreUsuario.equals(usuario.getNombreUsuario())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El nombre de usuario ya está en uso.");
                }
                usuario.setNombreUsuario(nuevoNombreUsuario);
            }

            // Validación y actualización de email
            if (nuevosDatos.containsKey("email")) {
                String nuevoEmail = (String) nuevosDatos.get("email");
                if (usuariosService.existsByEmail(nuevoEmail) && !nuevoEmail.equals(usuario.getEmail())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El correo electrónico ya está en uso.");
                }
                usuario.setEmail(nuevoEmail);
            }

            // Validación y actualización de fecha de nacimiento (mayor a 15 años)
            if (nuevosDatos.containsKey("fechaNacimiento")) {
                try {
                    String fechaNacimientoStr = (String) nuevosDatos.get("fechaNacimiento");
                    LocalDate fechaNacimientoLocal = LocalDate.parse(fechaNacimientoStr);
                    int edad = Period.between(fechaNacimientoLocal, LocalDate.now()).getYears();
                    if (edad < 15) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El usuario debe tener al menos 15 años.");
                    }
                    usuario.setFechaNacimiento(Date.from(fechaNacimientoLocal.atStartOfDay(ZoneId.systemDefault()).toInstant()));
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Formato de fecha de nacimiento incorrecto.");
                }
            }

            // Actualización de otros campos
            if (nuevosDatos.containsKey("nombre")) {
                usuario.setNombre((String) nuevosDatos.get("nombre"));
            }
            if (nuevosDatos.containsKey("preguntaSeguridad")) {
                usuario.setPreguntaSeguridad((String) nuevosDatos.get("preguntaSeguridad"));
            }
            if (nuevosDatos.containsKey("respuestaSeguridad")) {
                usuario.setRespuestaSeguridad((String) nuevosDatos.get("respuestaSeguridad"));
            }
            if (nuevosDatos.containsKey("telefono")) {
                usuario.setTelefono(Integer.parseInt(nuevosDatos.get("telefono").toString()));
            }
            if (nuevosDatos.containsKey("direccion")) {
                usuario.setDireccion((String) nuevosDatos.get("direccion"));
            }

            usuariosService.save(usuario); // Llama al método que no devuelve nada
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor: " + e.getMessage());
    }
}
@PutMapping("/{id}/cambiarPreguntaSeguridad")
public ResponseEntity<?> cambiarPreguntaSeguridad(@PathVariable String id, @RequestBody Map<String, String> payload) {
    String nuevaPregunta = payload.get("preguntaSeguridad");
    String nuevaRespuesta = payload.get("respuestaSeguridad");
    String contraseñaConfirmada = payload.get("confirmPassword");

    Optional<UsuariosModel> usuarioOpt = usuariosService.findById(id);

    if (usuarioOpt.isPresent()) {
        UsuariosModel usuario = usuarioOpt.get();

        // Verificar si la contraseña confirmada es correcta
        if (!usuario.getContraseña().equals(contraseñaConfirmada)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta. Intenta nuevamente.");
        }

        // Verificar que la nueva pregunta y respuesta no sean iguales a la actual
        if (usuario.getPreguntaSeguridad().equals(nuevaPregunta) || usuario.getRespuestaSeguridad().equals(nuevaRespuesta) ||
            nuevaPregunta.isEmpty() || nuevaRespuesta.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La nueva pregunta o respuesta no puede ser la misma que la anterior ni estar vacía.");
        }

        // Actualizar pregunta y respuesta
        usuario.setPreguntaSeguridad(nuevaPregunta);
        usuario.setRespuestaSeguridad(nuevaRespuesta);

        usuariosService.save(usuario);
        return ResponseEntity.ok("Pregunta de seguridad cambiada con éxito.");
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
    }
}
 @Autowired
    private PublicacionesServiceImp publicacionesService;

@DeleteMapping("/{id}")
public ResponseEntity<?> eliminarCuenta(@PathVariable String id) {
    try {
        // Convert the user ID to ObjectId
        ObjectId userId = new ObjectId(id);

        // First, delete all publications associated with the user
        publicacionesService.eliminarPublicacionesPorUsuario(userId);

        // Then, delete the user
        usuariosService.eliminarUsuarioPorId(userId);

        // Return success response
        return ResponseEntity.ok("Cuenta y todas las publicaciones asociadas han sido eliminadas con éxito.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar la cuenta y sus publicaciones.");
    }
}

@PutMapping("/{id}/cambiarContrasena")
public ResponseEntity<?> cambiarContrasena(@PathVariable String id, @RequestBody Map<String, String> payload) {
    ObjectId userId = new ObjectId(id);
    String currentPassword = payload.get("currentPassword");
    String newPassword = payload.get("newPassword");

    if (currentPassword == null || newPassword == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Debe proporcionar tanto la contraseña actual como la nueva.");
    }

    try {
        String resultado = usuariosService.cambiarContrasena(userId, currentPassword, newPassword);
        return ResponseEntity.ok(resultado);
    } catch (IllegalArgumentException e) {
        // Aquí el mensaje de error del servicio se pasa directamente en el cuerpo de la respuesta
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al cambiar la contraseña.");
    }
}





}