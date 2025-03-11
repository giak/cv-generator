/**
 * Couches architecturales où les validations peuvent se produire
 * Cette stratification permet de catégoriser les erreurs selon leur nature
 */
export declare enum ValidationLayerType {
    /**
     * Règles métier fondamentales, invariants du domaine
     * Ex: "Une expérience professionnelle ne peut pas avoir une date de fin antérieure à sa date de début"
     */
    DOMAIN = "domain",
    /**
     * Règles d'orchestration, logique d'application
     * Ex: "L'utilisateur doit être authentifié pour modifier ce CV"
     */
    APPLICATION = "application",
    /**
     * Validation UI/UX, feedback immédiat
     * Ex: "Format d'email incorrect"
     */
    PRESENTATION = "presentation"
}
