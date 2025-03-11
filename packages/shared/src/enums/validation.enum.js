/**
 * Couches architecturales où les validations peuvent se produire
 * Cette stratification permet de catégoriser les erreurs selon leur nature
 */
export var ValidationLayerType;
(function (ValidationLayerType) {
    /**
     * Règles métier fondamentales, invariants du domaine
     * Ex: "Une expérience professionnelle ne peut pas avoir une date de fin antérieure à sa date de début"
     */
    ValidationLayerType["DOMAIN"] = "domain";
    /**
     * Règles d'orchestration, logique d'application
     * Ex: "L'utilisateur doit être authentifié pour modifier ce CV"
     */
    ValidationLayerType["APPLICATION"] = "application";
    /**
     * Validation UI/UX, feedback immédiat
     * Ex: "Format d'email incorrect"
     */
    ValidationLayerType["PRESENTATION"] = "presentation";
})(ValidationLayerType || (ValidationLayerType = {}));
