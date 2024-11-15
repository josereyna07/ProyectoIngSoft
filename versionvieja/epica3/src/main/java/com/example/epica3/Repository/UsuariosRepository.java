package com.example.epica3.Repository;

import com.example.epica3.Model.UsuariosModel;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import com.example.epica3.Model.Credenciales;


@Repository
public interface UsuariosRepository extends MongoRepository<UsuariosModel, ObjectId> {
    // Método para buscar por nombre de usuario
    Optional<UsuariosModel> findByNombreUsuario(String nombreUsuario);

    // Método para buscar por correo electrónico
    Optional<UsuariosModel> findByEmail(String email);

    List<UsuariosModel> findByHistorialContraseñas(List<Credenciales> historialContraseñas);

    boolean existsByNombreUsuario(String nombreUsuario);

    boolean existsByEmail(String email);

    Optional<UsuariosModel> findByEmailOrNombreUsuario(String identificador);
    
}


