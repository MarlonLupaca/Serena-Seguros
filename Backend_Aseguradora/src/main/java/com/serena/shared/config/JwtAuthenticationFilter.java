package com.serena.shared.config;

import com.serena.modules.seguridad.auth.entity.Usuario;
import com.serena.modules.seguridad.auth.repository.UsuarioRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String HEADER_AUTH = "Authorization";
    private static final String PREFIX_BEARER = "Bearer ";

    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // 1. IGNORAR RUTAS PÚBLICAS (Swagger y Auth)
        // Esto le dice al filtro que se haga a un lado y deje pasar la petición
        if (path.startsWith("/v3/api-docs") ||
                path.startsWith("/swagger-ui") ||
                path.startsWith("/api/v1/auth")) {

            filterChain.doFilter(request, response);
            return; // Corta la ejecución de este filtro aquí mismo
        }

        // 2. LÓGICA NORMAL PARA RUTAS PROTEGIDAS
        String header = request.getHeader(HEADER_AUTH);

        if (header != null && header.startsWith(PREFIX_BEARER)) {
            String token = header.substring(PREFIX_BEARER.length());
            try {
                Claims claims = jwtTokenProvider.validarToken(token);
                Integer userId = Integer.parseInt(claims.getSubject());

                usuarioRepository.findById(userId).ifPresent(usuario -> {
                    if (usuario.getEstado() == Usuario.Estado.ACTIVO) {
                        var authority = new SimpleGrantedAuthority(
                                "ROLE_" + usuario.getPortalAcceso().name()
                        );
                        var auth = new UsernamePasswordAuthenticationToken(
                                usuario, null, List.of(authority)
                        );
                        auth.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                        );
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                });
            } catch (JwtException | NumberFormatException e) {
                SecurityContextHolder.clearContext();
            }
        }

        // Continúa la cadena para las rutas protegidas
        filterChain.doFilter(request, response);
    }
}