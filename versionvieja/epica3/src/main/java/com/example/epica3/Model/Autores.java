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
public class Autores {
    
    private ObjectId _autorId;
    private String nombre;
    private String rol;
    @JsonProperty("_autorId")
    public String getIdAsString() {
        return _autorId != null ? _autorId.toHexString() : null;
    } 
}
