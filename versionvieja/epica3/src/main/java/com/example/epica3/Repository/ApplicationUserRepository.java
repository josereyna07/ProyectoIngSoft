package com.example.epica3.Repository;

import com.example.epica3.Config.ApplicationUser;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ApplicationUserRepository extends MongoRepository<ApplicationUser, ObjectId> {
    Optional<ApplicationUser> findByUsername(String username);  // Método para buscar por nombre de usuario
}