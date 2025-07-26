package com.employe.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.employe.model.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long>{
    
    Optional<RefreshToken> findByToken(String token);
    
    @Override
    RefreshToken save(RefreshToken refreshToken);
    
    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.token = :token")
    void deleteByToken(String token);
    @Modifying
    @Query("DELETE FROM RefreshToken r WHERE r.user.id = :userId")
    int deleteByUserId(Long userId);
    void delete(RefreshToken token);
}