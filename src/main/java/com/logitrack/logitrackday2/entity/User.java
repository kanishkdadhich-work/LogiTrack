package com.logitrack.logitrackday2.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(unique = true)
    private String email;

    private String fullName;
    private String phoneNumber;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean active = true;

    public User(String username, String password, Role role, String email, String fullName, String phoneNumber) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.email = email;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
    }

    public enum Role {
        ADMIN, MANAGER, DRIVER
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // FIX: Added null check to prevent HttpMessageNotWritableException
        if (role == null) {
            return List.of(new SimpleGrantedAuthority("ROLE_NONE"));
        }
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }


    @Override public String getPassword() { return this.password; }
    @Override public String getUsername() { return this.username; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return this.active; }
}