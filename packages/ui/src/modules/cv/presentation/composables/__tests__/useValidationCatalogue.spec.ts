/**
 * Tests unitaires pour le composable useValidationCatalogue
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useValidationCatalogue } from '../validation/useValidationCatalogue';

describe('useValidationCatalogue', () => {
  // Données de test
  const errorMessages = [
    { 
      code: 'ERR1', 
      message: 'Erreur 1', 
      field: 'field1', 
      severity: 'error', 
      layer: 'domain' 
    },
    { 
      code: 'ERR2', 
      message: 'Erreur 2', 
      field: 'field2', 
      severity: 'error', 
      layer: 'domain' 
    },
    { 
      code: 'ERR3', 
      message: 'Erreur 3', 
      field: 'field1', 
      severity: 'warning', 
      layer: 'presentation' 
    }
  ];
  
  const helpMessages = [
    {
      id: 'HELP1',
      title: 'Aide 1',
      content: 'Contenu d\'aide 1',
      field: 'field1',
      autoShow: true
    },
    {
      id: 'HELP2',
      title: 'Aide 2',
      content: 'Contenu d\'aide 2',
      field: 'field2',
      autoShow: false
    }
  ];
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('devrait initialiser avec des catalogues vides par défaut', () => {
    const { getErrorMessage, getHelpMessage } = useValidationCatalogue();
    
    expect(getErrorMessage('ERR1')).toBeUndefined();
    expect(getHelpMessage('HELP1')).toBeUndefined();
  });
  
  it('devrait initialiser avec les messages fournis', () => {
    const { getErrorMessage, getHelpMessage } = useValidationCatalogue(
      errorMessages,
      helpMessages
    );
    
    expect(getErrorMessage('ERR1')).toEqual(errorMessages[0]);
    expect(getHelpMessage('HELP1')).toEqual(helpMessages[0]);
  });
  
  it('devrait permettre d\'ajouter des messages d\'erreur', () => {
    const { addErrorMessage, getErrorMessage } = useValidationCatalogue();
    
    addErrorMessage(errorMessages[0]);
    expect(getErrorMessage('ERR1')).toEqual(errorMessages[0]);
  });
  
  it('devrait permettre d\'ajouter plusieurs messages d\'erreur', () => {
    const { addErrorMessages, getErrorMessage } = useValidationCatalogue();
    
    addErrorMessages(errorMessages);
    
    expect(getErrorMessage('ERR1')).toEqual(errorMessages[0]);
    expect(getErrorMessage('ERR2')).toEqual(errorMessages[1]);
  });
  
  it('devrait permettre d\'ajouter des messages d\'aide', () => {
    const { addHelpMessage, getHelpMessage } = useValidationCatalogue();
    
    addHelpMessage(helpMessages[0]);
    expect(getHelpMessage('HELP1')).toEqual(helpMessages[0]);
  });
  
  it('devrait permettre d\'ajouter plusieurs messages d\'aide', () => {
    const { addHelpMessages, getHelpMessage } = useValidationCatalogue();
    
    addHelpMessages(helpMessages);
    
    expect(getHelpMessage('HELP1')).toEqual(helpMessages[0]);
    expect(getHelpMessage('HELP2')).toEqual(helpMessages[1]);
  });
  
  it('devrait récupérer les erreurs pour un champ spécifique', () => {
    const { getErrorsForField } = useValidationCatalogue(errorMessages);
    
    const field1Errors = getErrorsForField('field1');
    const field2Errors = getErrorsForField('field2');
    const field3Errors = getErrorsForField('field3');
    
    expect(field1Errors).toHaveLength(2);
    expect(field1Errors[0].code).toBe('ERR1');
    expect(field1Errors[1].code).toBe('ERR3');
    
    expect(field2Errors).toHaveLength(1);
    expect(field2Errors[0].code).toBe('ERR2');
    
    expect(field3Errors).toHaveLength(0);
  });
  
  it('devrait récupérer les aides pour un champ spécifique', () => {
    const { getHelpForField } = useValidationCatalogue([], helpMessages);
    
    const field1Help = getHelpForField('field1');
    const field2Help = getHelpForField('field2');
    const field3Help = getHelpForField('field3');
    
    expect(field1Help).toHaveLength(1);
    expect(field1Help[0].id).toBe('HELP1');
    
    expect(field2Help).toHaveLength(1);
    expect(field2Help[0].id).toBe('HELP2');
    
    expect(field3Help).toHaveLength(0);
  });
  
  it('devrait filtrer les messages d\'aide à afficher automatiquement', () => {
    const { autoShowHelp } = useValidationCatalogue([], helpMessages);
    
    expect(autoShowHelp.value).toHaveLength(1);
    expect(autoShowHelp.value[0].id).toBe('HELP1');
  });
  
  it('devrait remplacer le catalogue d\'erreurs', () => {
    const { setErrorCatalogue, getErrorMessage } = useValidationCatalogue([errorMessages[0]]);
    
    expect(getErrorMessage('ERR1')).toBeDefined();
    expect(getErrorMessage('ERR2')).toBeUndefined();
    
    setErrorCatalogue([errorMessages[1]]);
    
    expect(getErrorMessage('ERR1')).toBeUndefined();
    expect(getErrorMessage('ERR2')).toBeDefined();
  });
  
  it('devrait remplacer le catalogue d\'aide', () => {
    const { setHelpCatalogue, getHelpMessage } = useValidationCatalogue([], [helpMessages[0]]);
    
    expect(getHelpMessage('HELP1')).toBeDefined();
    expect(getHelpMessage('HELP2')).toBeUndefined();
    
    setHelpCatalogue([helpMessages[1]]);
    
    expect(getHelpMessage('HELP1')).toBeUndefined();
    expect(getHelpMessage('HELP2')).toBeDefined();
  });
  
  it('devrait réinitialiser les catalogues', () => {
    const { resetCatalogue, getErrorMessage, getHelpMessage } = useValidationCatalogue(
      errorMessages,
      helpMessages
    );
    
    expect(getErrorMessage('ERR1')).toBeDefined();
    expect(getHelpMessage('HELP1')).toBeDefined();
    
    resetCatalogue();
    
    expect(getErrorMessage('ERR1')).toBeUndefined();
    expect(getHelpMessage('HELP1')).toBeUndefined();
  });
  
  it('devrait utiliser le cache correctement', () => {
    const { getErrorsForField } = useValidationCatalogue(errorMessages, [], { enableCache: true });
    
    // Premier appel (remplit le cache)
    const field1Errors1 = getErrorsForField('field1');
    expect(field1Errors1).toHaveLength(2);
    
    // Deuxième appel (doit utiliser le cache)
    const field1Errors2 = getErrorsForField('field1');
    expect(field1Errors2).toBe(field1Errors1); // Même référence grâce au cache
  });
  
  it('devrait désactiver le cache si demandé', () => {
    const { getErrorsForField } = useValidationCatalogue(errorMessages, [], { enableCache: false });
    
    // Premier appel
    const field1Errors1 = getErrorsForField('field1');
    expect(field1Errors1).toHaveLength(2);
    
    // Deuxième appel (ne doit pas utiliser le cache)
    const field1Errors2 = getErrorsForField('field1');
    expect(field1Errors2).not.toBe(field1Errors1); // Référence différente car pas de cache
    expect(field1Errors2).toHaveLength(2); // Mais même contenu
  });
}); 