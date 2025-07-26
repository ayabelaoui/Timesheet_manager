package com.employe.config;

import java.time.LocalDate;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.employe.model.Role;
import com.employe.model.User;
import com.employe.repository.RoleRepository;
import com.employe.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(RoleRepository roleRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder,Environment env) {
        return args -> {
            boolean shouldInitialize = env.getProperty("app.init-data", Boolean.class, false);
            if (shouldInitialize) {
                // Création des rôles s'ils n'existent pas
                if (roleRepository.findByName("ROLE_USER").isEmpty()) {
                    roleRepository.save(new Role(null, "ROLE_USER"));
                }
                Role userRole = roleRepository.findByName("ROLE_USER").get();
                if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
                    roleRepository.save(new Role(null, "ROLE_ADMIN"));
                }
                 Role adminRole = roleRepository.findByName("ROLE_ADMIN").get();

                if (roleRepository.findByName("ROLE_APPROBATEUR").isEmpty()) {
                    roleRepository.save(new Role(null, "ROLE_APPROBATEUR"));
                }

                Role approbateurRole = roleRepository.findByName("ROLE_APPROBATEUR").get();

                // Création de l'utilisateur approbateur s'il n'existe pas
                if (userRepository.findByEmail("ahmed@gmail.com").isEmpty()) {
                    User user = User.builder()
                            .email("ahmed@gmail.com")
                            .password(passwordEncoder.encode("Ay123456"))
                            .name("Ahmed Alaoui")
                            .address("LOT WIFAQ 01 IMM 1381 APPRT 02 TEMARA")
                            .phone("0681701542")
                            .roles(Set.of(approbateurRole))
                            .build();
                    user.setHireDate(LocalDate.now().minusDays(5));
                    userRepository.save(user);
                }
                if (userRepository.findByEmail("user@yopmail.com").isEmpty()) {
                    User user = new User();
                    user.setEmail("user@yopmail.com");
                    user.setPassword(passwordEncoder.encode("123456"));
                    user.setName("User");
                    user.setHireDate(LocalDate.now().minusDays(5));
                    user.setRoles(Set.of(userRole)); // ✅ Corrigé ici
                    userRepository.save(user);
                }
                if (userRepository.findByEmail("admin@yopmail.com").isEmpty()) {
                    User adminuser = new User();
                    adminuser.setEmail("admin@yopmail.com");
                    adminuser.setPassword(passwordEncoder.encode("123456"));
                    adminuser.setName("Admin 1");
                    adminuser.setRoles(Set.of(adminRole)); // ✅ Corrigé ici
                    adminuser.setHireDate(LocalDate.now().minusDays(5));
                    userRepository.save(adminuser);
                }
                if (userRepository.findByEmail("approbateur@yopmail.com").isEmpty()) {
                    User approbateur = new User();
                    approbateur.setEmail("approbateur@yopmail.com");
                    approbateur.setPassword(passwordEncoder.encode("123456"));
                    approbateur.setName("Approbateur 1");
                    approbateur.setRoles(Set.of(approbateurRole)); // ✅ Corrigé ici
                    approbateur.setHireDate(LocalDate.now().minusDays(5));
                    userRepository.save(approbateur);
                }

            }
        };
      
    }
}
