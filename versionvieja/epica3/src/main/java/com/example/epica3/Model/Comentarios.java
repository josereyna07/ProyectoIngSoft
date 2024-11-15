package com.example.epica3.Model;

import org.bson.types.ObjectId;
import java.util.Date;

public class Comentarios {
    private String id;  // ID único para cada comentario
    private String usuarioId;  // ID o nombre del usuario que hizo el comentario
    private String contenido;
    private Date fechaCreacion;
    private Date fechaEdicion;

    // Constructor sin argumentos para facilitar la serialización
    public Comentarios() {
        this.id = new ObjectId().toHexString(); // Genera un ID único para cada comentario
        this.fechaCreacion = new Date(); // Fecha de creación por defecto
    }

    // Constructor con parámetros
    public Comentarios(String usuarioId, String contenido) {
        this.id = new ObjectId().toHexString(); // Genera un ID único para cada comentario
        this.usuarioId = usuarioId;
        this.contenido = contenido;
        this.fechaCreacion = new Date();
    }

    // Getter y Setter para id
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    // Getter y Setter para usuarioId
    public String getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(String usuarioId) {
        this.usuarioId = usuarioId;
    }

    // Getter y Setter para contenido
    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    // Getter y Setter para fechaCreacion
    public Date getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Date fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    // Getter y Setter para fechaEdicion
    public Date getFechaEdicion() {
        return fechaEdicion;
    }

    public void setFechaEdicion(Date fechaEdicion) {
        this.fechaEdicion = fechaEdicion;
    }
}
