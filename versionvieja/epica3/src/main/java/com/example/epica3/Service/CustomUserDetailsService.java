package com.example.epica3.Service;

import com.example.epica3.Model.UsuariosModel;
import com.example.epica3.Repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuariosRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String nombreUsuario) throws UsernameNotFoundException {
        UsuariosModel usuario = usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con nombre: " + nombreUsuario));

        return new org.springframework.security.core.userdetails.User(
                usuario.getNombreUsuario(),
                usuario.getContraseña(), // Aquí se utiliza el nuevo método
                usuario.getAuthorities() // Asegúrate de que esta función esté implementada
        );
    }
}
