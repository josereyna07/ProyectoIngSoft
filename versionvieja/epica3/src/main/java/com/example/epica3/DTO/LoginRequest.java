package com.example.epica3.DTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String identificador; // Puede ser nombre de usuario o email
    private String contraseña;     // Manteniendo "contraseña" para consistencia con el modelo
}