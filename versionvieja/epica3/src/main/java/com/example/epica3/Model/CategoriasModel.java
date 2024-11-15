package com.example.epica3.Model;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document ("Categorias")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoriasModel {
    @Id
    private ObjectId id;  // ObjectId
    @JsonProperty("id")
    public String getIdAsString() {
        return id != null ? id.toHexString() : null;
    }
    private String nombre;
    private List<Subcategoria> subCategorias = new ArrayList<>();
}
