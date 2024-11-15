package com.example.epica3.Service;

import com.example.epica3.DTO.LoginRequest;
import com.example.epica3.DTO.LoginResponse;
import com.example.epica3.Model.UsuariosModel;
import java.util.Optional;

import org.bson.types.ObjectId;

public interface IUsuariosService {
    LoginResponse login(String nombreUsuario, String contraseña);
    LoginResponse verificarCredenciales(LoginRequest loginRequest);

    // Nuevo método para registrar un usuario
    UsuariosModel registerUser(UsuariosModel newUser);

    boolean existsByNombreUsuario(String nombreUsuario);

    boolean existsByEmail(String email);
    Optional<UsuariosModel> findByEmailOrNombreUsuario(String identificador);
    boolean actualizarContraseña(String identificador, String nuevaContraseña);
    Optional<UsuariosModel> findById(String id);
     // Método que devuelve el usuario actualizado
     UsuariosModel saveAndReturn(UsuariosModel usuario);
     Optional<UsuariosModel> obtenerDetallesAutor(ObjectId usuarioId);

     // Método que solo guarda el usuario sin retornar nada
     void save(UsuariosModel usuario);
     void eliminarUsuarioPorId(ObjectId _id);
     String cambiarContrasena(ObjectId _id, String currentPassword, String newPassword);

    
}