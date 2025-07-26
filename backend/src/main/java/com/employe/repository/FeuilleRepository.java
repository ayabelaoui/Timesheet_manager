package com.employe.repository;

import com.employe.model.Feuille;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeuilleRepository extends JpaRepository<Feuille, Long> {
    List<Feuille> findByStatut(String statut);
}
