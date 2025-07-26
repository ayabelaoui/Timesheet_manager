package com.employe.controller;

import com.employe.model.User;
import com.employe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApprobateurController {

    @Autowired
    private UserService userService;

    @GetMapping("/approbateurs")
    public List<User> getApprobateurs() {
        return userService.findUsersByRole("APPROBATEUR");
    }
}
