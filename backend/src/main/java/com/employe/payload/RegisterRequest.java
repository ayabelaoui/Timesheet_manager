package com.employe.payload;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String role;
    private String name;
    private String phoneNumber;
    private String address;
}
