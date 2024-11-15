package com.example.epica3.Service;

import com.example.epica3.DTO.LoginRequest;
import com.example.epica3.DTO.LoginResponse;
import com.example.epica3.Model.Credenciales;
import com.example.epica3.Model.UsuariosModel;
import com.example.epica3.Repository.UsuariosRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuariosServiceImpl implements IUsuariosService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Override
    public LoginResponse verificarCredenciales(LoginRequest loginRequest) {
        String identificador = loginRequest.getIdentificador();
        String contraseña = loginRequest.getContraseña();

        Optional<UsuariosModel> usuarioOpt = usuariosRepository.findByNombreUsuario(identificador);

        if (!usuarioOpt.isPresent()) {
            usuarioOpt = usuariosRepository.findByEmail(identificador);
        }

        if (usuarioOpt.isPresent()) {
            UsuariosModel usuarioEncontrado = usuarioOpt.get();
            String contraseñaValida = usuarioEncontrado.getContraseña();

            if (contraseñaValida != null && contraseñaValida.equals(contraseña)) {
                String rol = usuarioEncontrado.getRol();
                if ("USER".equalsIgnoreCase(rol) || "ADMIN".equalsIgnoreCase(rol)) {
                    return new LoginResponse(
                        true, 
                        "Login exitoso", 
                        usuarioEncontrado.getIdAsString(),
                        usuarioEncontrado.getNombre(),
                        usuarioEncontrado.getEmail(),
                        usuarioEncontrado.getNombreUsuario(),
                        usuarioEncontrado.getPreguntaSeguridad(),
                        usuarioEncontrado.getRespuestaSeguridad(),
                        usuarioEncontrado.getRol(),
                        usuarioEncontrado.getTelefono(),
                        usuarioEncontrado.getDireccion(),
                        usuarioEncontrado.getFechaNacimiento()
                    );
                } else {
                    return new LoginResponse(false, "Rol no autorizado", null, null, null, null, null, null, null, null, null, null);
                }
            } else {
                return new LoginResponse(false, "Contraseña incorrecta", null, null, null, null, null, null, null, null, null, null);
            }
        }

        return new LoginResponse(false, "Correo o nombre de usuario no registrado", null, null, null, null, null, null, null, null, null, null);
    }

    @Override
    public UsuariosModel registerUser(UsuariosModel newUser) {
        if (usuariosRepository.findByNombreUsuario(newUser.getNombreUsuario()).isPresent()) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso.");
        }
        if (usuariosRepository.findByEmail(newUser.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El correo electrónico ya está en uso.");
        }

        Credenciales credenciales = new Credenciales(newUser.getContraseña(), true);
        newUser.getHistorialContraseñas().add(credenciales);

        if (newUser.getRol() == null) {
            newUser.setRol("USER");
        }

        return usuariosRepository.save(newUser);
    }

    @Override
    public boolean existsByNombreUsuario(String nombreUsuario) {
        return usuariosRepository.existsByNombreUsuario(nombreUsuario);
    }

    @Override
    public boolean existsByEmail(String email) {
        return usuariosRepository.existsByEmail(email);
    }

    @Override
    public LoginResponse login(String nombreUsuario, String contraseña) {
        throw new UnsupportedOperationException("Unimplemented method 'login'");
    }

    @Override
    public Optional<UsuariosModel> findByEmailOrNombreUsuario(String identificador) {
        return usuariosRepository.findByEmail(identificador)
                .or(() -> usuariosRepository.findByNombreUsuario(identificador));
    }

    @Override
    public boolean actualizarContraseña(String identificador, String nuevaContraseña) {
        Optional<UsuariosModel> usuarioOpt = usuariosRepository.findByEmail(identificador)
                .or(() -> usuariosRepository.findByNombreUsuario(identificador));

        if (usuarioOpt.isPresent()) {
            UsuariosModel usuario = usuarioOpt.get();
            usuario.getHistorialContraseñas().forEach(c -> c.setEstado(false));
            usuario.getHistorialContraseñas().add(new Credenciales(nuevaContraseña, true));
            usuariosRepository.save(usuario);
            return true;
        }
        return false;
    }

    @Override
    public Optional<UsuariosModel> findById(String id) {
        return usuariosRepository.findById(new ObjectId(id));
    }
    @Override
    public UsuariosModel saveAndReturn(UsuariosModel usuario) {
        return usuariosRepository.save(usuario); // Devuelve el usuario guardado
    }
    
    @Override
    public void save(UsuariosModel usuario) {
        usuariosRepository.save(usuario); // No devuelve nada
    }
    @Override
    public Optional<UsuariosModel> obtenerDetallesAutor(ObjectId _id) {
        return usuariosRepository.findById(_id); // usa usuarioId como ObjectId si aplica
            }

    
    @Override
    public void eliminarUsuarioPorId(ObjectId _id) {
        usuariosRepository.deleteById(_id);
           }
    
           @Override
           public String cambiarContrasena(ObjectId _id, String currentPassword, String newPassword) {
               Optional<UsuariosModel> usuarioOpt = usuariosRepository.findById(_id);
           
               if (usuarioOpt.isEmpty()) {
                   throw new IllegalArgumentException("Usuario no encontrado.");
               }
           
               UsuariosModel usuario = usuarioOpt.get();
           
               // Validar que la contraseña actual sea correcta
               if (!usuario.getContraseña().equals(currentPassword)) {
                   throw new IllegalArgumentException("La contraseña actual no es correcta.");
               }
           
               // Validar que la nueva contraseña cumpla con los requisitos de seguridad
               if (newPassword.length() < 8) {
                   throw new IllegalArgumentException("La nueva contraseña debe tener al menos 8 caracteres.");
               }
           
               // Validar que la nueva contraseña no haya sido utilizada anteriormente
               for (Credenciales credencial : usuario.getHistorialContraseñas()) {
                   // UsuariosServiceImpl.java
                    if (credencial.getContraseña().equals(newPassword)) {
                     throw new IllegalArgumentException("No puedes utilizar una contraseña que hayas usado anteriormente.");
                    } }           
               // Desactivar la contraseña actual en el historial
               usuario.getHistorialContraseñas().forEach(credencial -> credencial.setEstado(false));
           
               // Añadir la nueva contraseña como activa al historial
               Credenciales nuevaCredencial = new Credenciales(newPassword, true);
               usuario.getHistorialContraseñas().add(nuevaCredencial);
           
               // Guardar los cambios
               usuariosRepository.save(usuario);
           
               return "Contraseña cambiada con éxito.";
           }
           
           
}
