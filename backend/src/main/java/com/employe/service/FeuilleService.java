package com.employe.service;

import com.employe.model.Feuille;
import com.employe.repository.FeuilleRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FeuilleService {

    private final FeuilleRepository feuilleRepository;

    public FeuilleService(FeuilleRepository feuilleRepository) {
        this.feuilleRepository = feuilleRepository;
    }

    public void rejeterFeuille(Long id, String remarque) {
        Feuille feuille = feuilleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feuille non trouvée"));

        feuille.setStatut("REJETEE");
        feuille.setRemarque(remarque);
        feuilleRepository.save(feuille);
    }

    public void validerFeuille(Long id) {
        Feuille feuille = feuilleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feuille non trouvée"));

        feuille.setStatut("VALIDEE");
        feuilleRepository.save(feuille);
    }

    public Feuille findById(Long id) {
        return feuilleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feuille non trouvée"));
    }

    public Feuille save(Feuille feuille) {
        return feuilleRepository.save(feuille);
    }

    public void soumettreFeuille(Long id) {
        Feuille feuille = feuilleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feuille non trouvée"));
        feuille.setStatut("SOUMISE");
        feuilleRepository.save(feuille);
    }

}
