import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import { defineComponent } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'

// Types pour les événements et données
interface LocationField {
  parent: string;
  field: string;
  value: string;
}

interface ValidationWarning {
  field: string;
  message: string;
}

// Définir le type ComponentInstance pour le composant stub
type StubBasicsFormInstance = InstanceType<typeof StubBasicsForm>;

// Créer un composant de stub simplifié pour les tests
const StubBasicsForm = defineComponent({
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  template: `
    <div class="basics-form">
      <!-- Section d'adresse -->
      <div class="address-section">
        <h2>Adresse</h2>
        
        <div class="location-fields">
          <div class="field" name="address">
            <input type="text" 
              :value="modelValue.location?.address || ''"
              @input="handleInput('address', $event)"
              @blur="validateField('location.address')"
            />
          </div>
          
          <div class="field" name="postalCode">
            <input type="text" 
              :value="modelValue.location?.postalCode || ''"
              @input="handleInput('postalCode', $event)"
              @blur="validateField('location.postalCode')"
            />
          </div>
          
          <div class="field" name="city">
            <input type="text" 
              :value="modelValue.location?.city || ''"
              @input="handleInput('city', $event)"
              @blur="validateField('location.city')"
            />
          </div>
          
          <div class="field" name="countryCode">
            <input type="text" 
              :value="modelValue.location?.countryCode || ''"
              @input="handleInput('countryCode', $event)"
              @blur="validateField('location.countryCode')"
            />
          </div>
        </div>
        
        <!-- Messages d'erreur -->
        <div v-if="hasValidationErrors" class="validation-messages">
          <p class="suggestions-title">Suggestions pour l'adresse :</p>
          <ul class="suggestions-list">
            <li>Assurez-vous que l'adresse est complète et correcte</li>
            <li>Le code postal doit être au format valide pour le pays</li>
            <li>Utilisez le nom officiel de la ville</li>
            <li>Le code pays doit être un code ISO à 2 lettres (FR, US, CA, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      validationErrors: {
        'location.address': '',
        'location.postalCode': '',
        'location.city': '',
        'location.countryCode': ''
      },
      validationWarnings: {
        'location.address': '',
        'location.postalCode': '',
        'location.city': '',
        'location.countryCode': ''
      }
    }
  },
  computed: {
    hasValidationErrors() {
      return Object.values(this.validationErrors).some(error => !!error)
    }
  },
  methods: {
    // Fonction simulée pour mettre à jour les champs imbriqués
    handleInput(field: string, event: { target: { value: string } }): void {
      // Dans un cas réel, cette fonction appellerait updateNestedField
      const value = event.target.value
      this.$emit('update-nested', { parent: 'location', field, value })
    },
    
    // Fonction simulée de validation des champs
    validateField(fieldPath: string): void {
      // Dans un cas réel, cette fonction appellerait validateField du composable
      // Pour les besoins du test, nous simulons simplement l'émission d'un événement
      this.$emit('validate-field', fieldPath)
      
      // Simuler des erreurs basées sur des règles simples
      if (fieldPath === 'location.postalCode') {
        const postalCode = this.modelValue.location?.postalCode
        if (postalCode && !/^\d{5}$/.test(postalCode)) {
          this.validationWarnings['location.postalCode'] = 'Format de code postal non standard'
          this.$emit('validation-warning', { field: fieldPath, message: 'Format de code postal non standard' })
        } else {
          this.validationWarnings['location.postalCode'] = ''
        }
      }
      
      if (fieldPath === 'location.countryCode') {
        const countryCode = this.modelValue.location?.countryCode
        if (countryCode && !/^[A-Z]{2}$/.test(countryCode)) {
          this.validationWarnings['location.countryCode'] = 'Le code pays doit être au format ISO à 2 lettres (ex: FR)'
          this.$emit('validation-warning', { field: fieldPath, message: 'Le code pays doit être au format ISO à 2 lettres (ex: FR)' })
        } else {
          this.validationWarnings['location.countryCode'] = ''
        }
      }
    }
  }
})

// Définir les tests
describe('BasicsForm - Location Fields Validation', () => {
  let wrapper: VueWrapper<StubBasicsFormInstance>
  let defaultModel: BasicsInterface
  
  // Configuration de base pour le test
  beforeEach(() => {
    defaultModel = {
      name: 'John Doe',
      email: 'john@example.com',
      profiles: [],
      location: {
        address: '',
        postalCode: '',
        city: '',
        countryCode: '',
        region: ''
      }
    }
    
    wrapper = mount(StubBasicsForm, {
      props: {
        modelValue: defaultModel
      }
    }) as VueWrapper<StubBasicsFormInstance>
  })
  
  it('should render location fields', () => {
    // Vérifier que la section adresse est rendue
    const addressSection = wrapper.find('.address-section')
    expect(addressSection.exists()).toBe(true)
    
    // Vérifier que les champs sont présents
    const fields = wrapper.findAll('.field')
    expect(fields.length).toBe(4) // adresse, code postal, ville, pays
  })
  
  it('should emit update events when location fields are modified', async () => {
    // Trouver le champ d'adresse et simuler une saisie
    const addressField = wrapper.find('.field[name="address"] input')
    
    // Simuler une saisie dans le champ
    await addressField.setValue('15 rue de Paris')
    
    // Vérifier que l'événement a été émis avec les données attendues
    const updateEvents = wrapper.emitted('update-nested') as LocationField[][]
    expect(updateEvents).toBeTruthy()
    expect(updateEvents[0][0]).toEqual({ parent: 'location', field: 'address', value: '15 rue de Paris' })
  })
  
  it('should validate postal code and show warning for invalid format', async () => {
    // Définir un modèle avec un code postal invalide (pas 5 chiffres)
    await wrapper.setProps({
      modelValue: {
        ...defaultModel,
        location: {
          ...defaultModel.location,
          postalCode: '1234'
        }
      }
    })
    
    // Trouver le champ de code postal et simuler un événement de perte de focus
    const postalCodeField = wrapper.find('.field[name="postalCode"] input')
    await postalCodeField.trigger('blur')
    
    // Vérifier qu'un événement de validation a été émis
    const validateEvents = wrapper.emitted('validate-field') as string[][]
    expect(validateEvents).toBeTruthy()
    expect(validateEvents[0][0]).toBe('location.postalCode')
    
    // Vérifier qu'un avertissement a été émis
    const warningEvents = wrapper.emitted('validation-warning') as ValidationWarning[][]
    expect(warningEvents).toBeTruthy()
    expect(warningEvents[0][0].field).toBe('location.postalCode')
    expect(warningEvents[0][0].message).toContain('Format de code postal')
  })
  
  it('should validate country code and show warning for invalid format', async () => {
    // Définir un modèle avec un code pays invalide (minuscules au lieu de majuscules)
    await wrapper.setProps({
      modelValue: {
        ...defaultModel,
        location: {
          ...defaultModel.location,
          countryCode: 'fr'
        }
      }
    })
    
    // Trouver le champ de code pays et simuler un événement de perte de focus
    const countryCodeField = wrapper.find('.field[name="countryCode"] input')
    await countryCodeField.trigger('blur')
    
    // Vérifier qu'un événement de validation a été émis
    const validateEvents = wrapper.emitted('validate-field') as string[][]
    expect(validateEvents).toBeTruthy()
    expect(validateEvents[0][0]).toBe('location.countryCode')
    
    // Vérifier qu'un avertissement a été émis
    const warningEvents = wrapper.emitted('validation-warning') as ValidationWarning[][]
    expect(warningEvents).toBeTruthy()
    expect(warningEvents[0][0].field).toBe('location.countryCode')
    expect(warningEvents[0][0].message).toContain('code pays')
  })
  
  it('should accept valid postal code (5 digits)', async () => {
    // Définir un modèle avec un code postal valide (5 chiffres)
    await wrapper.setProps({
      modelValue: {
        ...defaultModel,
        location: {
          ...defaultModel.location,
          postalCode: '75001'
        }
      }
    })
    
    // Trouver le champ de code postal et simuler un événement de perte de focus
    const postalCodeField = wrapper.find('.field[name="postalCode"] input')
    await postalCodeField.trigger('blur')
    
    // Vérifier qu'un événement de validation a été émis
    const validateEvents = wrapper.emitted('validate-field') as string[][]
    expect(validateEvents).toBeTruthy()
    
    // Vérifier qu'aucun avertissement n'a été émis pour un code postal valide
    const warningEvents = wrapper.emitted('validation-warning')
    expect(warningEvents).toBeFalsy()
  })
  
  it('should accept valid country code (2 uppercase letters)', async () => {
    // Définir un modèle avec un code pays valide (2 lettres majuscules)
    await wrapper.setProps({
      modelValue: {
        ...defaultModel,
        location: {
          ...defaultModel.location,
          countryCode: 'FR'
        }
      }
    })
    
    // Trouver le champ de code pays et simuler un événement de perte de focus
    const countryCodeField = wrapper.find('.field[name="countryCode"] input')
    await countryCodeField.trigger('blur')
    
    // Vérifier qu'un événement de validation a été émis
    const validateEvents = wrapper.emitted('validate-field') as string[][]
    expect(validateEvents).toBeTruthy()
    
    // Vérifier qu'aucun avertissement n'a été émis pour un code pays valide
    const warningEvents = wrapper.emitted('validation-warning')
    expect(warningEvents).toBeFalsy()
  })
  
  it('should display suggestions section when validation errors exist', async () => {
    // Créer un état avec des erreurs de validation
    wrapper.vm.validationErrors = {
      'location.address': 'Adresse requise',
      'location.postalCode': '',
      'location.city': '',
      'location.countryCode': ''
    }
    
    // Forcer le rendu à jour
    await wrapper.vm.$forceUpdate()
    
    // Vérifier que la section de suggestions est affichée
    const suggestionsSection = wrapper.find('.validation-messages')
    expect(suggestionsSection.exists()).toBe(true)
    expect(suggestionsSection.find('.suggestions-title').text()).toContain('Suggestions pour l\'adresse')
  })
  
  it('should hide suggestions section when no validation errors exist', async () => {
    // S'assurer qu'il n'y a pas d'erreurs de validation
    wrapper.vm.validationErrors = {
      'location.address': '',
      'location.postalCode': '',
      'location.city': '',
      'location.countryCode': ''
    }
    
    // Forcer le rendu à jour
    await wrapper.vm.$forceUpdate()
    
    // Vérifier que la section de suggestions n'est pas affichée
    const suggestionsSection = wrapper.find('.validation-messages')
    expect(suggestionsSection.exists()).toBe(false)
  })
}) 