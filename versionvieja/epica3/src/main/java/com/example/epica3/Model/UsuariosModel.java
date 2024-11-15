package com.example.epica3.Model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.data.annotation.Transient;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Usuarios")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuariosModel {
    @Id 
    private ObjectId _id;  
    
    private String nombre;
    private String email;
    private String nombreUsuario;
    private String preguntaSeguridad;
    private String respuestaSeguridad;
    private List<Credenciales> historialContraseñas = new ArrayList<>();
    private String rol;
    private Integer telefono;
    private String direccion;
    private Date fechaNacimiento; 

    @Transient
    private String contraseña;

    public String getContraseña() {
        return historialContraseñas.stream()
                .filter(Credenciales::isEstado)
                .map(Credenciales::getContraseña)
                .findFirst()
                .orElse(null);
    }



    @JsonProperty("_id")
    public String getIdAsString() {
        return _id != null ? _id.toHexString() : null;
    } 

    public List<GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        if (rol != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + rol.toUpperCase()));
        }
        return authorities;
    }

    // Nuevo método getUsername
    public String getNombreUsuario() {
        return nombreUsuario;
    }
    public String getEmail(){
        return email;
    }
}