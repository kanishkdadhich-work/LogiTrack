package com.logitrack.logitrack.backend.service;

import com.logitrack.logitrack.backend.dto.UserRegistrationDTO;
import com.logitrack.logitrack.backend.entity.User;
import com.logitrack.logitrack.backend.entity.UserRole;

import java.util.List;

public interface UserService {
    User registerUser(User user, UserRole role);
    List<User> findAllUsers();
    User createUser(UserRegistrationDTO dto);
}