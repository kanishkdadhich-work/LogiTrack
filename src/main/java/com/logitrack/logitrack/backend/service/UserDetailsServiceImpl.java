package com.logitrack.logitrack.backend.service;

import com.logitrack.logitrack.backend.entity.User;
import com.logitrack.logitrack.backend.repository.UserRepository;
import com.logitrack.logitrack.backend.security.UserDetailsImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Change this from the builder to your custom UserDetailsImpl
        return UserDetailsImpl.build(user);
    }
}