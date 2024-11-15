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
public class Subcategoria {
    
    private ObjectId _categoriaId; 
    @JsonProperty("_categoriaId")
    public String getIdAsString() {
        return _categoriaId != null ? _categoriaId.toHexString() : null;
    }
    private String nombreSubcategoria;
}
