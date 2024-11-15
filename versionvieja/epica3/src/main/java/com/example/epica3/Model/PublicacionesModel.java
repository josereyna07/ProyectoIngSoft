package com.example.epica3.Model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document("Publicaciones")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicacionesModel {
    @Id
    private ObjectId _id;

    @JsonProperty("_id")
    public String getIdAsString() {
        return _id != null ? _id.toHexString() : null;
    }
    private String titulo;
    private String descripcion;
    private List<Autores> autores = new ArrayList<>();
    private String visibilidad;
    private List<ValoracionesPublicacion> valoraciones = new ArrayList<>();
    private List<Comentarios> comentarios = new ArrayList<>(); // Lista de comentarios

    
    
    private Date fechaPublicacion;
    
    private List<CategoriaReferencia> categorias = new ArrayList<>();
    private List<DescargasPublicacion> descargas = new ArrayList<>();
    private List<VisualizacionesPublicacion> visualizaciones = new ArrayList<>();
    private ArchivoPublicacion archivo;

    public List<Comentarios> getComentarios() {
        return comentarios;
    }

    public void setComentarios(List<Comentarios> comentarios) {
        this.comentarios = comentarios;
    }
}



