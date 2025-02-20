<script setup lang="ts">
import type { Resume } from "@cv-generator/shared/src/types/resume";
import { ref } from "vue";

const emit = defineEmits<{
  save: [resume: Partial<Resume>];
}>();

const name = ref("");
const email = ref("");

const handleSubmit = () => {
  if (!name.value || !email.value) return;

  emit("save", {
    basics: {
      name: name.value,
      email: email.value,
    },
  });
};
</script>

<template>
  <div>
    <div v-if="!name && !email" data-test="empty-state">
      <p>No resume data yet. Start by filling in your basic information.</p>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label for="name" class="form-label">Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            data-test="name-input"
            class="form-input"
            required
          />
          <p v-if="!name" class="form-error">Name is required</p>
        </div>

        <div>
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            data-test="email-input"
            class="form-input"
            required
          />
          <p v-if="!email" class="form-error">Email is required</p>
        </div>

        <button type="submit" class="btn-primary">
          Save
        </button>
      </div>
    </form>
  </div>
</template> 