package com.example.epica3.DTO;


import java.util.Date;


import lombok.Data;

@Data
public class LoginResponse {
    private boolean autenticado;
    private String mensaje;
    private String _id; 
    private String nombre;
    private String email;
    private String nombreUsuario;
    private String preguntaSeguridad;
    private String respuestaSeguridad;
    private String rol;
    private Integer telefono;
    private String direccion;
    private Date fechaNacimiento;

    public LoginResponse(boolean autenticado, String mensaje, String _id, String nombre, String email, String nombreUsuario, String preguntaSeguridad ,String respuestaSeguridad, String rol, Integer telefono, String direccion, Date fechaNacimiento) {
        this.autenticado = autenticado;
        this.mensaje = mensaje;
        this._id = _id;
        this.nombre = nombre;
        this.email = email;
        this.nombreUsuario = nombreUsuario;
        this.preguntaSeguridad = preguntaSeguridad;
        this.respuestaSeguridad = respuestaSeguridad;
        this.rol = rol;
        this.telefono = telefono;
        this.direccion = direccion;
        this.fechaNacimiento = fechaNacimiento;
    }
}