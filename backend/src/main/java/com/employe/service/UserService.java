package com.employe.service;

import java.util.List;

import javax.management.relation.RoleNotFoundException;

import com.employe.dto.CreateUserDTO;
import com.employe.dto.RoleDTO;
import com.employe.dto.UpdateUserDTO;
import com.employe.dto.UserDTO;
import com.employe.model.User;

public interface UserService {
    User saveUser(User user);

    User findByEmail(String email);

    List<User> findUsersByRole(String roleName); // Ajouté ici

    List<UserDTO> findAllUsers();

    UserDTO findUserById(Long id);

    UserDTO createUser(CreateUserDTO userDTO);

    List<UserDTO> findSupervisors();

    void deleteUser(Long id);

    UserDTO updateUser(Long id, UpdateUserDTO userDTO);

    List<RoleDTO> findAllRoles();

    RoleDTO findRole(Long id) throws RoleNotFoundException;

}
