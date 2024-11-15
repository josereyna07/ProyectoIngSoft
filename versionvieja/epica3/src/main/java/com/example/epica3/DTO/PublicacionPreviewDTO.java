package com.example.epica3.DTO;

import java.util.Date;
import java.util.List;
import com.example.epica3.Model.Autores;
import com.example.epica3.Model.CategoriaReferencia;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PublicacionPreviewDTO {
    private String _id;
    private String titulo;
    private String descripcion;
    private List<CategoriaReferencia> categorias;
    private List<Autores> autores; 
    private Date fechaPublicacion;
    private Visibilidad visibilidad;
    private String archivoUrl; // URL para acceder al PDF
    private String imagenUrl;  // URL de la imagen de previsualización

    public enum Visibilidad {
        publico,
        privado
    }
}
