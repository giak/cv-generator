<script setup lang="ts">
import type { VolunteerWithId } from '@ui/modules/cv/presentation/stores/volunteer'
import type { VolunteerInterface } from '../../../../../node_modules/@cv-generator/shared/src/types/resume.interface'
import { useVolunteerStore } from '@ui/modules/cv/presentation/stores/volunteer'
import { computed, onMounted, ref } from 'vue'
import VolunteerForm from './VolunteerForm.vue'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'
import CollectionManager from '@ui/components/shared/CollectionManager.vue'

// Initialisation de i18n
const { t } = useI18n()

// Fonction pour gérer les erreurs de traduction
const safeTranslate = (key: string, fallback: string) => {
  try {
    const translation = t(key)
    return translation !== key ? translation : fallback
  } catch (e) {
    return fallback
  }
}

// State for managing the volunteer list
const volunteerStore = useVolunteerStore()
const volunteers = computed(() => volunteerStore.volunteers || [])
const loading = computed(() => volunteerStore.loading)

// Active dialog state
const showDialog = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingVolunteerIndex = ref<number | null>(null)
const editingVolunteer = ref<VolunteerInterface>({
  organization: '',
  position: '',
  startDate: '',
  highlights: []
})

// Load volunteers on component mount
onMounted(async () => {
  await volunteerStore.loadVolunteers()
})

// Format date for display
const formatDate = (dateString?: string): string => {
  if (!dateString) return t(TRANSLATION_KEYS.RESUME.VOLUNTEER.LIST.PRESENT)
  
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short'
  })
}

// Dialog management
const openAddDialog = () => {
  dialogMode.value = 'add'
  editingVolunteerIndex.value = null
  editingVolunteer.value = {
    organization: '',
    position: '',
    startDate: '',
    highlights: []
  }
  showDialog.value = true
}

const openEditDialog = (volunteer: VolunteerWithId, index: number) => {
  dialogMode.value = 'edit'
  editingVolunteerIndex.value = index
  editingVolunteer.value = { ...volunteer }
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

// Save volunteer
const saveVolunteer = async () => {
  try {
    if (dialogMode.value === 'add') {
      await volunteerStore.addVolunteer(editingVolunteer.value)
    } else if (dialogMode.value === 'edit' && editingVolunteerIndex.value !== null) {
      const volunteer = volunteers.value[editingVolunteerIndex.value]
      if (volunteer && volunteer.id) {
        await volunteerStore.updateVolunteer(volunteer.id, editingVolunteer.value)
      }
    }
    
    closeDialog()
  } catch (error) {
    console.error('Error saving volunteer:', error)
  }
}

// Delete volunteer
const deleteVolunteer = async (index: number) => {
  try {
    const volunteer = volunteers.value[index]
    if (volunteer && volunteer.id) {
      if (confirm(safeTranslate('resume.volunteer.list.deleteConfirmation', 'Êtes-vous sûr de vouloir supprimer cette expérience de bénévolat ?'))) {
        await volunteerStore.deleteVolunteer(volunteer.id)
      }
    }
  } catch (error) {
    console.error('Error deleting volunteer:', error)
  }
}

// Update order of volunteers

// Function to handle reordering from CollectionManager
const handleReorder = async (newOrder: string[]) => {
  try {
    await volunteerStore.reorderVolunteers(newOrder)
  } catch (error) {
    console.error('Error reordering volunteer experiences:', error)
  }
}
</script>

<template>
  <div class="bg-neutral-900 rounded-xl">
    <!-- Section title & description -->
    <div class="mb-6 px-6 pt-6">
      <h2 class="text-xl font-semibold text-white">{{ t(TRANSLATION_KEYS.RESUME.VOLUNTEER.LIST.TITLE) }}</h2>
      <p class="text-sm text-neutral-400 mt-1">
        {{ t(TRANSLATION_KEYS.RESUME.VOLUNTEER.LIST.DESCRIPTION) }}
      </p>
    </div>

    <CollectionManager
      :items="volunteers"
      empty-text="t(TRANSLATION_KEYS.RESUME.VOLUNTEER.LIST.EMPTY_STATE_TITLE)"
      add-button-text="t(TRANSLATION_KEYS.RESUME.VOLUNTEER.LIST.ADD_BUTTON)"
      :loading="loading"
      @add="openAddDialog"
      @edit="(item) => openEditDialog(item, volunteers.indexOf(item))"
      @delete="deleteVolunteer"
      @reorder="handleReorder"
    >
      <!-- Empty state -->
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-10 text-center">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-4">
            <path d="M48 20.5714C30.3812 20.5714 16 34.9525 16 52.5714C16 70.1902 30.3812 84.5714 48 84.5714C65.6188 84.5714 80 70.1902 80 52.5714C80 34.9525 65.6188 20.5714 48 20.5714ZM48 25.1429C63.0989 25.1429 75.4286 37.4725 75.4286 52.5714C75.4286 67.6703 63.0989 80 48 80C32.9011 80 20.5714 67.6703 20.5714 52.5714C20.5714 37.4725 32.9011 25.1429 48 25.1429Z" fill="#4338CA"/>
            <path d="M48 43.4286C51.3426 43.4286 54.0342 40.7369 54.0342 37.3943C54.0342 34.0517 51.3426 31.36 48 31.36C44.6574 31.36 41.9657 34.0517 41.9657 37.3943C41.9657 40.7369 44.6574 43.4286 48 43.4286Z" fill="#4338CA"/>
            <path d="M36.0114 59.9886L41.0851 65.0623L42.6286 63.5543L37.4971 58.4229L40.3657 55.6C40.5486 55.4172 40.648 55.1657 40.6343 54.9143C40.6343 54.6286 40.5349 54.3771 40.3109 54.1943L36.5714 50.9143C36.3886 50.7657 36.1714 50.6914 35.9543 50.6914C35.7371 50.6914 35.52 50.7657 35.3371 50.9143L28.2857 57.8057C28.0686 57.9886 27.9691 58.24 27.9829 58.4915C27.9829 58.7771 28.0823 59.0286 28.3063 59.2115L31.9657 62.4H31.9794L36.0114 59.9886Z" fill="#4338CA"/>
            <path d="M60.6857 55.6C60.8686 55.4172 60.9681 55.1657 60.9543 54.9143C60.9543 54.6286 60.8548 54.3771 60.6309 54.1943L56.8914 50.9143C56.7085 50.7657 56.4914 50.6914 56.2743 50.6914C56.0571 50.6914 55.84 50.7657 55.6571 50.9143L48.6057 57.8057C48.3885 57.9886 48.2891 58.24 48.3028 58.4915C48.3028 58.7771 48.4023 59.0286 48.6263 59.2115L52.2857 62.4H52.2994L56.3314 59.9886L61.4051 65.0623L62.9486 63.5543L57.8171 58.4229L60.6857 55.6Z" fill="#4338CA"/>
            <path d="M79.7145 31.5428C79.2288 30.3086 77.6574 29.7714 76.4231 30.2571L65.8859 34.5885C64.6516 35.0742 64.1145 36.6456 64.6002 37.8799C64.938 38.7999 65.8091 39.3714 66.7416 39.3714C67.0345 39.3714 67.3416 39.3142 67.6345 39.1999L78.1717 34.8685C79.3917 34.3828 79.9288 32.8114 79.4431 31.5771V31.5428H79.7145Z" fill="#4338CA"/>
            <path d="M31.2572 39.1999C31.55 39.3142 31.8572 39.3714 32.1501 39.3714C33.0826 39.3714 33.9537 38.7999 34.2915 37.8799C34.7772 36.6456 34.2401 35.0742 33.0058 34.5885L22.4686 30.2571C21.2344 29.7714 19.663 30.3086 19.1772 31.5428C18.6915 32.7771 19.2287 34.3485 20.463 34.8342L31.0001 39.1657L31.2572 39.1999Z" fill="#4338CA"/>
            <path d="M32 11.4286C32 9.53143 33.5314 8 35.4286 8H38.8572C40.7543 8 42.2857 9.53143 42.2857 11.4286V16C42.2857 16.9486 41.5257 17.7143 40.5714 17.7143C39.6172 17.7143 38.8572 16.9486 38.8572 16V11.4286H35.4286V16C35.4286 16.9486 34.6686 17.7143 33.7143 17.7143C32.76 17.7143 32 16.9486 32 16V11.4286Z" fill="#4338CA"/>
            <path d="M53.7143 11.4286C53.7143 9.53143 55.2457 8 57.1429 8H60.5714C62.4686 8 64 9.53143 64 11.4286V16C64 16.9486 63.24 17.7143 62.2857 17.7143C61.3314 17.7143 60.5714 16.9486 60.5714 16V11.4286H57.1429V16C57.1429 16.9486 56.3829 17.7143 55.4286 17.7143C54.4743 17.7143 53.7143 16.9486 53.7143 16V11.4286Z" fill="#4338CA"/>
            <path d="M48 16C48.9543 16 49.7143 15.2343 49.7143 14.2857V11.4286C49.7143 10.48 48.9543 9.71429 48 9.71429C47.0457 9.71429 46.2857 10.48 46.2857 11.4286V14.2857C46.2857 15.2343 47.0457 16 48 16Z" fill="#4338CA"/>
          </svg>
          <h3 class="text-lg font-medium text-neutral-200 mb-1">{{ t(TRANSLATION_KEYS.RESUME.VOLUNTEER.LIST.EMPTY_STATE_TITLE) }}</h3>
          <p class="text-sm text-neutral-400 max-w-md">
            {{ t(TRANSLATION_KEYS.RESUME.VOLUNTEER.LIST.EMPTY_STATE_DESCRIPTION) }}
          </p>
        </div>
      </template>
      
      <template #item="{ item: volunteer }">
        <div class="flex-grow">
          <h3 class="text-lg font-medium">{{ volunteer.position }}</h3>
          <div class="text-primary-400 font-medium mb-1">{{ volunteer.organization }}</div>
          <div class="text-sm text-neutral-400 mb-2">
            {{ formatDate(volunteer.startDate) }} - {{ formatDate(volunteer.endDate) }}
          </div>
          
          <div v-if="volunteer.summary" class="text-sm text-neutral-300 mb-3">
            {{ volunteer.summary }}
          </div>
          
          <ul v-if="volunteer.highlights && volunteer.highlights.length > 0" class="list-disc pl-5 space-y-1 mb-3">
            <li 
              v-for="(highlight, hIndex) in volunteer.highlights" 
              :key="hIndex"
              class="text-xs text-neutral-300"
            >
              {{ highlight }}
            </li>
          </ul>
          
          <a 
            v-if="volunteer.url" 
            :href="volunteer.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-xs text-primary-400 hover:text-primary-300 transition-colors inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            {{ volunteer.url }}
          </a>
        </div>
      </template>
    </CollectionManager>
    
    <!-- Dialog for adding/editing volunteer experience -->
    <div v-if="showDialog" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-neutral-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 sm:p-6">
          <VolunteerForm
            v-model="editingVolunteer"
            :loading="loading"
            :is-new="dialogMode === 'add'"
            @validate="saveVolunteer"
            @cancel="closeDialog"
          />
        </div>
      </div>
    </div>
  </div>
</template>
