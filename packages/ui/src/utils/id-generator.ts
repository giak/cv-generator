/**
 * Génère un ID unique pour les éléments du DOM
 * 
 * @param prefix Préfixe pour l'ID (optionnel)
 * @returns Un ID unique sous forme de chaîne de caractères
 */
export const uniqueId = (prefix = 'id') => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `${prefix}-${timestamp}-${random}`
} 