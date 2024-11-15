package com.example.epica3.Model;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ValoracionesPublicacion {
    
    private ObjectId _usuarioId;

    @JsonProperty("_usuarioId")
    public String getIdAsString() {
        return _usuarioId!= null ? _usuarioId.toHexString() : null;
    } 

    private int puntuacion;
    private String comentarios;
}
