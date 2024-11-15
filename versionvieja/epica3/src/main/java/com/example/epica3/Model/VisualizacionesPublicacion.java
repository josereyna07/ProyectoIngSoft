package com.example.epica3.Model;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VisualizacionesPublicacion {
@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "UTC")    private Date fechaVisualizacion;

    
    private ObjectId _usuarioId;

    @JsonProperty("_usuarioId")
    public String getIdAsString() {
        return _usuarioId != null ? _usuarioId.toHexString() : null;
    }

    public void set_publicacion(String uRL) {
        throw new UnsupportedOperationException("Unimplemented method 'set_publicacion'");
    }
}
