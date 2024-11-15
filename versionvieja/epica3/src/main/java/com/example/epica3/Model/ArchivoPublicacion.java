package com.example.epica3.Model;


import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArchivoPublicacion {

    private ObjectId _archivoId;
    private String name;
    private String type;
    private byte[] data;
   
    @JsonProperty("_archivoId")
    public String getArchivoIdAsString() {
        return _archivoId != null ? _archivoId.toHexString() : null;
    }
}



