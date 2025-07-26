package com.employe.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.TokenRefreshException;
import com.employe.model.RefreshToken;
import com.employe.model.RefreshTokenRequest;
import com.employe.model.RefreshTokenResponse;
import com.employe.model.Role;
import com.employe.model.User;
import com.employe.payload.AuthRequest;
import com.employe.payload.RegisterRequest;
import com.employe.repository.RoleRepository;
import com.employe.repository.UserRepository;
import com.employe.security.JwtUtil;
import com.employe.service.RefreshTokenService;
import com.employe.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthenticationController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final RoleRepository roleRepository; // Ajouté pour chercher les rôles
    private final RefreshTokenService refreshTokenService;

    // LOGIN Endpoint
    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {

            // You could bypass AuthenticationManager if:
            // You're using stateless JWT authentication and doing manual credential
            // verification
            // You have a very custom authentication flow that doesn't fit Spring Security's
            // model
            // You're using OAuth or other external authentication providers
            // In these cases, you can directly authenticate the user and generate a token
            // without using AuthenticationManager
            // Authentication authenticate = authenticationManager.authenticate(
            // new UsernamePasswordAuthenticationToken(request.getEmail(),
            // request.getPassword()));

            if (StringUtils.isEmpty(request.getEmail()) || StringUtils.isEmpty(request.getPassword())) {
                return ResponseEntity.badRequest().body("Email et mot de passe sont obligatoires.");
            }
            String email = request.getEmail().trim();
            // Authenticate the user using the AuthenticationManager
            User user = userService.findByEmail(email);

            if (user == null) {
                throw new BadCredentialsException("Invalid email or password");
            }
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                // More detailed debug
                throw new BadCredentialsException("Invalid password");
            }
            String token = jwtUtil.generateToken(user.getEmail());

            // return ResponseEntity.ok(new AuthResponse(token));
            return ResponseEntity.ok()
                    .body(Map.of(
                            "success", true,
                            "token", token,
                            "user", user,
                            "message", "Utilisateur authentifié avec succès !"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

     @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshtoken(@Valid @RequestBody RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        
        return refreshTokenService.findByToken(requestRefreshToken)
            .map(refreshTokenService::verifyExpiration)
            .map(RefreshToken::getUser)
            .map(user -> {
              
                String token = jwtUtil.generateToken(user.getName());
                RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());
                
                RefreshTokenResponse response = new RefreshTokenResponse();
                response.setToken(token);
                response.setRefreshToken(newRefreshToken.getToken());
                return ResponseEntity.ok(response);
            })
            .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                "Refresh token is not in database!"));
    }

    // REGISTER Endpoint
    @PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Validation des champs requis
            if (request == null) {
                return ResponseEntity.badRequest().body("Requête invalide.");
            }
            if (StringUtils.isEmpty(request.getEmail()) || StringUtils.isEmpty(request.getPassword())) {
                return ResponseEntity.badRequest().body("Email et mot de passe sont obligatoires.");
            }
            if (StringUtils.isEmpty(request.getName())) {
                return ResponseEntity.badRequest().body("Nom est obligatoire.");
            }

            if (StringUtils.isEmpty(request.getRole())) {
                return ResponseEntity.badRequest().body("Rôle est obligatoire.");
            }
            if (!request.getRole().equals("ROLE_USER") && !request.getRole().equals("ROLE_ADMIN")) {
                return ResponseEntity.badRequest().body("Rôle invalide.");
            }
            String email = request.getEmail().trim();
            String password = request.getPassword().trim();
            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body("Email déjà utilisé.");
            }

            User user = new User();
            user.setEmail(email);
            user.setPassword(password);
            user.setName(request.getName());
            user.setPhone(request.getPhoneNumber());
            user.setAddress(request.getAddress());

            // ⚡ Chercher le rôle par son nom
            Role role = roleRepository.findByName(request.getRole())
                    .orElseThrow(() -> new RuntimeException("Role not found"));

            Set<Role> roles = new HashSet<>();
            roles.add(role);
            user.setRoles(roles);
            validateRoles(roles.stream().map(Role::getName).toList()); // Validate roles before saving
            userService.saveUser(user);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "success", true,
                            "userId", user.getId(),
                            "message", "Utilisateur enregistré avec succès !"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    private void validateRoles(List<String> roles) {
        if (roles == null || roles.isEmpty()) {
            roles = List.of("ROLE_USER"); // Default role
        }
        /*
         * This code to be uncommented if you want to restrict admin creation to admins
         * only
         * // Check if the user has the ROLE_ADMIN role
         * if (roles.contains("ROLE_ADMIN")) {
         * // Check if current user has permission to create admin accounts
         * Authentication auth = SecurityContextHolder.getContext().getAuthentication();
         * if (auth == null || !auth.getAuthorities().contains(new
         * SimpleGrantedAuthority("ROLE_ADMIN"))) {
         * throw new AccessDeniedException("Only admins can create admin accounts");
         * }
         * }
         */
    }

    @GetMapping("/test-encoder")
    public String testEncoder(@RequestParam String password) {
        String encoded = passwordEncoder.encode(password);
        boolean matches = passwordEncoder.matches(password, encoded);
        System.out.println("Test Encoded input: " + encoded);
        System.out.println("Test Input: " + password);
        return "Encoded: " + encoded + "<br> Matches: " + matches;
    }

    public String getName() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getName'");
    }
}
