package com.employe.service;


import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.management.relation.RoleNotFoundException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.employe.DuplicateEmailException;
import com.employe.dto.CreateUserDTO;
import com.employe.dto.RoleDTO;
import com.employe.dto.UpdateUserDTO;
import com.employe.dto.UserDTO;
import com.employe.model.Role;
import com.employe.model.User;
import com.employe.repository.RoleRepository;
import com.employe.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    // Constructor with all required dependencies
    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository,
                          ModelMapper modelMapper,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User saveUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Role defaultRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Default role not found"));
            Set<Role> roles = new HashSet<>();
            roles.add(defaultRole);
            user.setRoles(roles);
        }
        return userRepository.save(user);
    }

    @Override
    public User findByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.orElse(null);
    }

    @Override
    public List<User> findUsersByRole(String roleName) {
        List<User> users = userRepository.findByRoleName(roleName);
        return users;
    }

    @Override
    public List<UserDTO> findAllUsers() {
        List<User> users = userRepository.findAllWithRoles();
        return users.stream()
                .map(this::mapToUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO findUserById(Long id) {
        User user = userRepository.getOne(id);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDTO createUser(CreateUserDTO userDTO) {
        // Validate input
        if (userDTO == null) {
            throw new IllegalArgumentException("User data must not be null");
        }

        // Check for duplicate email (example validation)
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new DuplicateEmailException("Email already exists: " , "Email",userDTO.getEmail());
        }

        // Map DTO to Entity
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        
        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        // Save to database
        User savedUser = userRepository.save(user);

        // Map Entity to UserDTO for response
        return mapToUserDTO(savedUser);
    }

    private UserDTO mapToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setHireDate(user.getHireDate());
        // Exclude sensitive fields like password
        // Map roles to RoleDTO
        if (user.getRoles() != null) {
        Set<RoleDTO> roleDTOs = user.getRoles().stream()
                .map(this::mapToRoleDTO)
                .collect(Collectors.toSet());
        dto.setRoles(roleDTOs);
    }

        return dto;
    }


    @Override
    public List<UserDTO> findSupervisors() {
       List<User> supervisors = userRepository.findByRoleName("ROLE_APPROBATEUR");
    return supervisors.stream()
        .map(user -> modelMapper.map(user, UserDTO.class))
        .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO updateUser(Long id, UpdateUserDTO userDTO) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public UserDTO convertToDto(User user) {
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        
        // Custom mappings for special cases
        if (user.getSupervisor() != null) {
            userDTO.setSupervisorId(user.getSupervisor().getId());
            userDTO.setSupervisorName(user.getSupervisor().getName());
        }
        
        if (user.getRoles() != null) {
        Set<RoleDTO> roleDTOs = user.getRoles().stream()
                .map(this::mapToRoleDTO)
                .collect(Collectors.toSet());
        userDTO.setRoles(roleDTOs);
    }
            
        return userDTO;
    }
    
    public User convertToEntity(UserDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);
        
        // Custom mappings for special cases
        if (userDTO.getSupervisorId() != null) {
            User supervisor = new User();
            supervisor.setId(userDTO.getSupervisorId());
            user.setSupervisor(supervisor);
        }
        
        return user;
    }

    public PasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }

    public RoleDTO mapToRoleDTO(Role role) {
        RoleDTO roleDTO = modelMapper.map(role, RoleDTO.class);
        return roleDTO;
    }
    
    @Override
    public List<RoleDTO> findAllRoles() {
       List<Role> roles = roleRepository.findAll();
    return roles.stream()
        .map(role -> modelMapper.map(role, RoleDTO.class))
        .collect(Collectors.toList());
    }


    @Override
    public RoleDTO findRole(Long id) throws RoleNotFoundException {
        // Validate input
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid role ID: " + id);
        }

        // Fetch role with exception handling
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RoleNotFoundException("Role not found with ID: " + id));

        // Map entity to DTO
        return mapToRoleDTO(role);
    }

}
