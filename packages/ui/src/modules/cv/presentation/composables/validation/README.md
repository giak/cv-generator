# Form Validation Module

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Zod](https://img.shields.io/badge/Zod-3.x-3E67B1?style=flat-square)](https://github.com/colinhacks/zod)

A powerful, flexible validation module for Vue 3 applications that provides schema-based validation using Zod, with support for field-level validation, form-level validation, and performance tracking.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Advanced Usage](#advanced-usage)
  - [Example Components](#example-components)
- [API Reference](#api-reference)
  - [useValidation](#usevalidation)
  - [ValidationOptions](#validationoptions)
  - [ValidationResult](#validationresult)
- [Best Practices](#best-practices)
- [Performance Considerations](#performance-considerations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🔍 **Schema-based validation** using [Zod](https://github.com/colinhacks/zod)
- 🎯 **Field-level validation** with error tracking
- 📋 **Form-level validation** for complete data objects
- ⚡ **Performance metrics** for validation operations
- 🔄 **Reactive error handling** with Vue 3 refs
- 🛠️ **Customizable error formatting**
- 📝 **Required fields support**
- 📧 **Email format validation**
- ⏱️ **Debounced validation** for improved performance
- 🧩 **Nested field validation** with dot notation
- 🔗 **Integration with useFormModel** for complete form state management

## Installation

Ensure you have the required dependencies installed:

```bash
pnpm add zod lodash-es
```

## Usage

### Basic Usage

```typescript
<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { useValidation } from '@ui/modules/cv/presentation/composables/validation'

// Define your schema using Zod
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  age: z.number().min(18, 'Must be at least 18 years old')
})

// Define your form data
const formData = ref({
  name: '',
  email: '',
  age: 0
})

// Initialize the validation composable
const {
  validateField,
  validateForm,
  errors,
  isValid,
  perfMetrics
} = useValidation(userSchema, {
  requiredFields: ['name', 'email'],
  enableLogging: true
})

// Validate a specific field
function handleNameChange(value: string) {
  formData.value.name = value
  validateField('name', value)
}

// Validate the entire form
function handleSubmit() {
  const valid = validateForm(formData.value)
  if (valid) {
    // Form is valid, proceed with submission
    console.log('Form submitted:', formData.value)
  } else {
    // Form has errors
    console.error('Validation errors:', errors.value)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="name">Name</label>
      <input
        id="name"
        v-model="formData.name"
        @input="handleNameChange(formData.name)"
      />
      <p v-if="errors.name" class="error">{{ errors.name }}</p>
    </div>

    <!-- Other form fields -->

    <button type="submit" :disabled="!isValid">Submit</button>
  </form>
</template>
```

### Advanced Usage

#### Nested Fields Validation

```typescript
const addressSchema = z.object({
  user: z.object({
    address: z.object({
      street: z.string().min(5, 'Street name is too short'),
      city: z.string().min(2, 'City name is too short')
    })
  })
})

// Helper function for nested field validation
const validateNestedField = (parent: string, field: string, value: any) => {
  validateField(`${parent}.${field}`, value)
}

// Usage in template
<input
  v-model="formData.user.address.street"
  @input="validateNestedField('user.address', 'street', formData.user.address.street)"
/>
```

#### Custom Error Formatting

```typescript
const { validateForm, errors } = useValidation(userSchema, {
  customErrorFormatter: (error) => {
    const formattedErrors: Record<string, string> = {};
    error.errors.forEach((err) => {
      const path = err.path.join(".");
      formattedErrors[path] = `Error: ${err.message}`;
    });
    return formattedErrors;
  },
});
```

#### Performance Tracking

```typescript
const { validateForm, perfMetrics } = useValidation(userSchema, {
  enableLogging: true,
});

// After validation, check the metrics
console.log(`Validation count: ${perfMetrics.value.validationCount}`);
console.log(
  `Total validation time: ${perfMetrics.value.validationTime.toFixed(2)} ms`
);
```

#### Combining with useFormModel

```typescript
const { localModel, updateField } = useFormModel({
  modelValue: computed(() => props.modelValue || defaultValues),
  emit: (event, value) => emit(event, value),
  defaultValues,
});

const { validateField, validateForm, errors, isValid } = useValidation(
  formSchema,
  {
    requiredFields: ["name", "email"],
  }
);

// Handle field updates with validation
const handleFieldUpdate = (field, value) => {
  updateField(field, value);
  validateField(field, value);
};
```

### Example Components

The module includes several example components that demonstrate different validation scenarios:

- **ValidationExample.vue**: Basic form validation example
- **ValidationFormExample.vue**: Complete form with validation
- **CombinedFormExample.vue**: Example combining useValidation with useFormModel
- **AdvancedValidationExample.vue**: Complex form with nested fields, custom validation, and dynamic fields

## API Reference

### useValidation

```typescript
function useValidation<T extends Record<string, any>>(
  schema?: ZodSchema<any>,
  options?: ValidationOptions
): ValidationResult<T>;
```

#### Parameters

| Parameter | Type                | Description                        |
| --------- | ------------------- | ---------------------------------- |
| `schema`  | `ZodSchema`         | The Zod schema to validate against |
| `options` | `ValidationOptions` | Optional configuration options     |

### ValidationOptions

```typescript
interface ValidationOptions {
  /**
   * Array of field paths that are required
   * @default []
   */
  requiredFields?: string[];

  /**
   * Custom function to format Zod errors
   * @default DefaultErrorFormatter
   */
  customErrorFormatter?: (error: ZodError) => Record<string, string>;

  /**
   * Whether to log validation operations
   * @default false
   */
  enableLogging?: boolean;

  /**
   * Debounce time in milliseconds for validation
   * @default 300
   */
  debounceTime?: number;
}
```

### ValidationResult

```typescript
interface ValidationResult<T> {
  /**
   * Validates a single value against the schema
   * @param value The value to validate
   * @returns Whether the value is valid
   */
  validateValue: (value: any) => boolean | void;

  /**
   * Validates a specific field and updates errors
   * @param field The field to validate
   * @param value The value to validate
   * @returns Whether the field is valid
   */
  validateField: (field: keyof T, value: any) => boolean;

  /**
   * Validates the entire form data object
   * @param data The form data to validate
   * @returns Whether the form is valid
   */
  validateForm: (data: T) => boolean;

  /**
   * Reactive object containing validation errors
   */
  errors: Ref<Record<string, string>>;

  /**
   * Computed property indicating if the form is valid
   */
  isValid: ComputedRef<boolean>;

  /**
   * Performance metrics (if enabled)
   */
  perfMetrics?: Ref<{
    validationCount: number;
    validationTime: number;
  }>;
}
```

## Best Practices

1. **Define schemas separately** from your components for better reusability
2. **Use typed schemas** to leverage TypeScript's type checking
3. **Validate on input** for immediate feedback, but **debounce** for better performance
4. **Validate the entire form** before submission
5. **Reset errors** when appropriate (e.g., when a form is reset)
6. **Track performance** in development to identify potential bottlenecks
7. **Use helper functions** for nested field validation
8. **Combine with useFormModel** for complete form state management
9. **Provide clear error messages** to guide users
10. **Test validation logic** thoroughly

## Performance Considerations

- **Debounce validation** for fields that change frequently
- **Enable performance metrics** in development to identify bottlenecks
- **Validate only what's necessary** - don't validate the entire form on every field change
- **Use memoization** for expensive validation operations
- **Consider lazy validation** for complex forms

## Troubleshooting

### Common Issues

1. **Validation not working for nested fields**

   - Ensure you're using dot notation for nested fields (e.g., `user.address.street`)
   - Use a helper function like `validateNestedField` to simplify validation

2. **Type errors with validateField**

   - Use type assertions for nested fields: `validateField('user.address.street' as any, value)`
   - Define proper types for your form data

3. **Performance issues**
   - Enable debouncing for frequently changing fields
   - Use performance metrics to identify bottlenecks
   - Consider lazy validation for complex forms

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT
