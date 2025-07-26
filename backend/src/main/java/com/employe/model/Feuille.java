package com.employe.model;

import jakarta.persistence.*;

@Entity
@Table(name = "feuilles_de_temps")
public class Feuille {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String statut;

    @Column(name = "mois")
    private String mois;

    @Column(name = "heures", columnDefinition = "TEXT")
    private String heures; // JSON ou string formaté

    @Column(name = "total_heures")
    private int totalHeures;

    @Column(name = "soumise")
    private boolean soumise = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 1000)
    private String remarque;

    // ======== GETTERS & SETTERS ========
    public Long getId() {
        return id;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getMois() {
        return mois;
    }

    public void setMois(String mois) {
        this.mois = mois;
    }

    public String getHeures() {
        return heures;
    }

    public void setHeures(String heures) {
        this.heures = heures;
    }

    public int getTotalHeures() {
        return totalHeures;
    }

    public void setTotalHeures(int totalHeures) {
        this.totalHeures = totalHeures;
    }

    public boolean isSoumise() {
        return soumise;
    }

    public void setSoumise(boolean soumise) {
        this.soumise = soumise;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRemarque() {
        return remarque;
    }

    public void setRemarque(String remarque) {
        this.remarque = remarque;
    }
}
