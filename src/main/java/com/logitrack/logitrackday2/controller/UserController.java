package com.logitrack.logitrackday2.controller;

import com.logitrack.logitrackday2.entity.User;
import com.logitrack.logitrackday2.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createNewUser(@RequestBody User newUser) {
        return ResponseEntity.ok(userService.createNewUser(newUser));
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> resetPassword(@PathVariable Long id, @RequestBody String newPass) {
        userService.resetPassword(id, newPass);
        return ResponseEntity.ok("Password updated successfully");
    }
}
