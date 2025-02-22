<script setup lang="ts">
import { ref } from "vue";
import { useResumeStore } from "@ui/stores/resume";
import Form from "@ui/components/shared/form/Form.vue";
import FormField from "@ui/components/shared/form/FormField.vue";

const store = useResumeStore();
const emit = defineEmits<{
  (e: "save", data: { basics: { name: string; email: string } }): void;
}>();

const name = ref("");
const email = ref("");

const handleSubmit = () => {
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
    <div v-if="!store.resume" data-test="empty-state">
      <p>No resume data available. Please fill in the form below.</p>
    </div>

    <Form @submit="handleSubmit">
      <FormField
        v-model="name"
        name="name"
        label="Name"
        type="text"
        required
      />
      <FormField
        v-model="email"
        name="email"
        label="Email"
        type="email"
        required
      />
    </Form>
  </div>
</template> 