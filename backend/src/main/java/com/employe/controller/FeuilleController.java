package com.employe.controller;

import com.employe.model.Feuille;
import com.employe.model.User;
import com.employe.payload.RejetRequest;
import com.employe.service.FeuilleService;
import com.employe.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feuilles")
public class FeuilleController {

    private final FeuilleService feuilleService;
    private final UserService userService;

    public FeuilleController(FeuilleService feuilleService, UserService userService) {
        this.feuilleService = feuilleService;
        this.userService = userService;
    }

    // EMPLOYE : Mettre à jour brouillon
    @PutMapping("/update-draft/{id}")
    @PreAuthorize("hasRole('EMPLOYE')")
    public ResponseEntity<?> updateFeuilleDraft(@PathVariable Long id,
            @RequestBody Feuille updatedFeuille,
            Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        Feuille feuille = feuilleService.findById(id);

        if (!feuille.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accès interdit à cette feuille");
        }

        if (feuille.isSoumise()) {
            return ResponseEntity.badRequest().body("Feuille déjà soumise, non modifiable");
        }

        feuille.setHeures(updatedFeuille.getHeures());
        feuille.setTotalHeures(updatedFeuille.getTotalHeures());
        feuilleService.save(feuille);

        return ResponseEntity.ok("Brouillon mis à jour avec succès");
    }

    // EMPLOYE : Soumettre une feuille
    @PutMapping("/submit/{id}")
    @PreAuthorize("hasRole('EMPLOYE')")
    public ResponseEntity<?> submitFeuille(@PathVariable Long id, Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        Feuille feuille = feuilleService.findById(id);

        if (!feuille.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Ce n’est pas votre feuille");
        }

        if (feuille.isSoumise()) {
            return ResponseEntity.badRequest().body("Feuille déjà soumise");
        }

        feuille.setSoumise(true);
        feuille.setStatut("EN_ATTENTE");
        feuilleService.save(feuille);

        return ResponseEntity.ok("Feuille soumise avec succès");
    }

    // ADMIN : Valider une feuille
    @PutMapping("/{id}/valider")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> validerFeuille(@PathVariable Long id) {
        feuilleService.validerFeuille(id);
        return ResponseEntity.ok("Feuille validée");
    }

    // ADMIN : Rejeter une feuille
    @PutMapping("/{id}/rejeter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejeterFeuille(@PathVariable Long id, @RequestBody RejetRequest request) {
        feuilleService.rejeterFeuille(id, request.getRemarque());
        return ResponseEntity.ok("Feuille rejetée avec remarque");
    }
}
