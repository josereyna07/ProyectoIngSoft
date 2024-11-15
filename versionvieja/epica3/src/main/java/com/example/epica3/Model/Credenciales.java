package com.example.epica3.Model;

public class Credenciales {
    private String contraseña;
    private boolean estado;

    // Constructor vacío
    public Credenciales() {}

    // Constructor con parámetros
    public Credenciales(String contraseña, boolean estado) {
        this.contraseña = contraseña;
        this.estado = estado;
    }

    // Getters y Setters
    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }
}