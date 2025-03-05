<template>
  <div class="space-y-10 p-6 bg-neutral-800 rounded-lg">
    <div>
      <h2 class="text-xl font-bold mb-4">DateRangeFields - Exemples d'utilisation</h2>
      <p class="text-neutral-400 text-sm mb-6">
        Démonstration du composant DateRangeFields dans différents contextes
      </p>
    </div>
    
    <!-- Exemple basique -->
    <div class="example-section">
      <h3 class="text-lg font-medium mb-2">Exemple basique</h3>
      <div class="bg-neutral-900 p-4 rounded-lg">
        <DateRangeFields
          v-model:startDate="basicExample.startDate"
          v-model:endDate="basicExample.endDate"
          v-model:isCurrentlyActive="basicExample.isCurrentlyActive"
        />
        <div class="mt-4 p-2 bg-neutral-800 rounded">
          <h4 class="text-sm font-medium mb-1">État actuel :</h4>
          <pre class="text-xs">{{ JSON.stringify(basicExample, null, 2) }}</pre>
        </div>
      </div>
    </div>
    
    <!-- Exemple avec validation -->
    <div class="example-section">
      <h3 class="text-lg font-medium mb-2">Avec validation</h3>
      <div class="bg-neutral-900 p-4 rounded-lg">
        <DateRangeFields
          v-model:startDate="validationExample.startDate"
          v-model:endDate="validationExample.endDate"
          v-model:isCurrentlyActive="validationExample.isCurrentlyActive"
          :startDateError="validationErrors.startDate"
          :endDateError="validationErrors.endDate"
          :required="true"
          @startDate-blur="validateStartDate"
          @endDate-blur="validateEndDate"
          @date-range-change="validateDateRange"
        />
        <div class="mt-4 p-2 bg-neutral-800 rounded">
          <h4 class="text-sm font-medium mb-1">État actuel :</h4>
          <pre class="text-xs">{{ JSON.stringify(validationExample, null, 2) }}</pre>
        </div>
      </div>
    </div>
    
    <!-- Exemple avec différents contextes -->
    <div class="example-section">
      <h3 class="text-lg font-medium mb-2">Personnalisation pour différents contextes</h3>
      <div class="bg-neutral-900 p-4 rounded-lg space-y-6">
        <!-- Emploi -->
        <div>
          <h4 class="text-md font-medium mb-2">Contexte d'emploi</h4>
          <DateRangeFields
            v-model:startDate="workExample.startDate"
            v-model:endDate="workExample.endDate"
            v-model:isCurrentlyActive="workExample.isCurrentlyActive"
            currentlyActiveLabel="Emploi actuel"
            startDateLabel="Date d'embauche"
            endDateLabel="Date de départ"
            startDateHelpText="Quand avez-vous commencé ce travail ?"
            endDateHelpText="Laissez vide si c'est votre emploi actuel"
          />
        </div>
        
        <!-- Formation -->
        <div>
          <h4 class="text-md font-medium mb-2">Contexte de formation</h4>
          <DateRangeFields
            v-model:startDate="educationExample.startDate"
            v-model:endDate="educationExample.endDate"
            v-model:isCurrentlyActive="educationExample.isCurrentlyActive"
            currentlyActiveLabel="Formation en cours"
            startDateLabel="Date d'entrée"
            endDateLabel="Date d'obtention"
            startDateHelpText="Quand avez-vous commencé cette formation ?"
            endDateHelpText="Laissez vide si vous êtes actuellement en formation"
          />
        </div>
        
        <!-- Bénévolat -->
        <div>
          <h4 class="text-md font-medium mb-2">Contexte de bénévolat</h4>
          <DateRangeFields
            v-model:startDate="volunteerExample.startDate"
            v-model:endDate="volunteerExample.endDate"
            v-model:isCurrentlyActive="volunteerExample.isCurrentlyActive"
            currentlyActiveLabel="Bénévolat en cours"
            startDateLabel="Date de début"
            endDateLabel="Date de fin"
            startDateHelpText="Quand avez-vous commencé ce bénévolat ?"
            endDateHelpText="Laissez vide si vous êtes actuellement bénévole"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import DateRangeFields from '../DateRangeFields.vue'

// Exemple basique
const basicExample = reactive({
  startDate: '',
  endDate: '',
  isCurrentlyActive: false
})

// Exemple avec validation
const validationExample = reactive({
  startDate: '',
  endDate: '',
  isCurrentlyActive: false
})

const validationErrors = reactive({
  startDate: '',
  endDate: ''
})

// Exemples contextuels
const workExample = reactive({
  startDate: '2020-01-15',
  endDate: '',
  isCurrentlyActive: true
})

const educationExample = reactive({
  startDate: '2018-09-01',
  endDate: '2022-06-30',
  isCurrentlyActive: false
})

const volunteerExample = reactive({
  startDate: '2021-03-10',
  endDate: '',
  isCurrentlyActive: true
})

// Fonctions de validation
const validateStartDate = () => {
  validationErrors.startDate = ''
  
  if (!validationExample.startDate) {
    validationErrors.startDate = 'La date de début est requise'
    return
  }
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(validationExample.startDate)) {
    validationErrors.startDate = 'Format de date invalide (YYYY-MM-DD)'
  }
}

const validateEndDate = () => {
  validationErrors.endDate = ''
  
  if (!validationExample.endDate) {
    // Date de fin vide est valide si "en cours" est coché
    if (!validationExample.isCurrentlyActive) {
      validationErrors.endDate = 'La date de fin est requise ou cochez "En cours"'
    }
    return
  }
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(validationExample.endDate)) {
    validationErrors.endDate = 'Format de date invalide (YYYY-MM-DD)'
  }
}

const validateDateRange = (range: { startDate: string; endDate?: string; isCurrentlyActive: boolean }) => {
  // Vider les erreurs existantes
  validationErrors.startDate = ''
  validationErrors.endDate = ''
  
  // Valider la date de début
  if (!range.startDate) {
    validationErrors.startDate = 'La date de début est requise'
  }
  
  // Valider la plage de dates si les deux sont présentes
  if (range.startDate && range.endDate) {
    const start = new Date(range.startDate)
    const end = new Date(range.endDate)
    
    if (end < start) {
      validationErrors.endDate = 'La date de fin doit être après la date de début'
    }
  }
}
</script>

<style scoped>
.example-section {
  @apply border-t border-neutral-700 pt-6;
}
</style> 