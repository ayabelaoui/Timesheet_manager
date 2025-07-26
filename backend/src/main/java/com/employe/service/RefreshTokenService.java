package com.employe.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.TokenRefreshException;
import com.employe.model.RefreshToken;
import com.employe.repository.RefreshTokenRepository;
import com.employe.repository.UserRepository;

import jakarta.transaction.Transactional;


// RefreshTokenService.java
@Service
public class RefreshTokenService {
    
    private final long refreshTokenDurationMs;

     @Autowired
    public RefreshTokenService(
            @Value("${jwt.refreshExpirationMs}") long refreshTokenDurationMs,
            RefreshTokenRepository refreshTokenRepository,
            UserRepository userRepository) {
        this.refreshTokenDurationMs = refreshTokenDurationMs;
        // ... other dependencies
    }

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

   
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    
    public RefreshToken createRefreshToken(Long userId) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(userRepository.findById(userId).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());
        
        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public void deleteByUserId(Long userId) {
         refreshTokenRepository.deleteByUserId(userRepository.findById(userId).get().getId());
    }

    public Long getRefreshTokenDurationMs() {
        return refreshTokenDurationMs;
    }

}