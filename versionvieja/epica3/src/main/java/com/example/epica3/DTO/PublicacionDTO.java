package com.example.epica3.DTO;

import java.util.Date;
import java.util.List;
import com.example.epica3.Model.Autores;
import com.example.epica3.Model.CategoriaReferencia;
import com.example.epica3.Model.ValoracionesPublicacion;
import com.example.epica3.Model.VisualizacionesPublicacion;

public class PublicacionDTO {
    private String titulo;
    private List<CategoriaReferencia> categorias;
    private String descripcion;
    private Date fechaPublicacion;
    private String visibilidad;
    private List<VisualizacionesPublicacion> visualizaciones;
    private List<Autores> autores;
    private String archivoBase64; // El archivo PDF en formato Base64
    private String archivoId;

    public PublicacionDTO(String titulo, List<CategoriaReferencia> categorias, String descripcion, Date fechaPublicacion, String visibilidad, List<VisualizacionesPublicacion> visualizaciones,List<Autores> autores, String archivoBase64, String archivoId) {
        this.titulo = titulo;
        this.categorias = categorias;
        this.descripcion = descripcion;
        this.fechaPublicacion = fechaPublicacion;
        this.visibilidad = visibilidad;
        this.visualizaciones = visualizaciones;
        this.autores = autores;
        this.archivoBase64 = archivoBase64;
        this.archivoId = archivoId; // Asigna el archivoId
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public List<CategoriaReferencia> getCategorias() {
        return categorias;
    }

    public void setCategorias(List<CategoriaReferencia> categorias) {
        this.categorias = categorias;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Date getFechaPublicacion() {
        return fechaPublicacion;
    }

    public void setFechaPublicacion(Date fechaPublicacion) {
        this.fechaPublicacion = fechaPublicacion;
    }

    public String getVisibilidad() {
        return visibilidad;
    }

    public void setVisibilidad(String visibilidad) {
        this.visibilidad = visibilidad;
    }

    public List<VisualizacionesPublicacion> getVisualizaciones() {
        return visualizaciones;
    }

    public void setVisualizaciones(List<VisualizacionesPublicacion> visualizaciones) {
        this.visualizaciones = visualizaciones;
    }

    public List<Autores> getAutores() {
        return autores;
    }

    public void setAutores(List<Autores> autores) {
        this.autores = autores;
    }

    public String getArchivoBase64() {
        return archivoBase64;
    }

    public void setArchivoBase64(String archivoBase64) {
        this.archivoBase64 = archivoBase64;
    }

    public String getArchivoId() {
        return archivoId;
    }

    public void setArchivoId(String archivoId) {
        this.archivoId = archivoId;
    }

    // Getters y Setters
}