# CV Generator Composables

This directory contains reusable composables for the CV Generator application.

## useFormModel

A composable for managing form model state in Vue components. This composable handles:

1. Creating and maintaining a local reactive model
2. Synchronizing with external model value (from props)
3. Handling field updates
4. Emitting model changes
5. Initializing default values

### Installation

```typescript
import { useFormModel } from "@ui/modules/cv/presentation/composables/useFormModel";
```

### Basic Usage

```typescript
<script setup lang="ts">
import { computed } from 'vue'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import type { WorkInterface } from '@cv-generator/shared/src/types/resume.interface'

// Define props and emits
const props = defineProps<{
  modelValue: WorkInterface
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: WorkInterface): void
  (e: 'validate'): void
}>()

// Use the composable
const {
  localModel,
  updateField,
  updateNestedField
} = useFormModel<WorkInterface>({
  modelValue: computed(() => props.modelValue),
  emit: (event, value) => emit(event, value)
})

// Handle field updates
const handleFieldUpdate = (field: keyof WorkInterface, value: any) => {
  updateField(field, value)
}

// Handle nested field updates (e.g., for location fields)
const handleLocationUpdate = (field: string, value: string) => {
  updateNestedField('location', field as any, value)
}
</script>

<template>
  <FormField
    name="name"
    label="Company Name"
    :model-value="localModel.name"
    @update:model-value="handleFieldUpdate('name', $event)"
  />
</template>
```

### API Reference

#### Options

The `useFormModel` composable accepts the following options:

```typescript
interface FormModelOptions<T extends Record<string, any>> {
  /**
   * The model value from props
   */
  modelValue: Ref<T> | ComputedRef<T>;

  /**
   * The emit function from the component
   */
  emit: (event: "update:modelValue", value: T) => void;

  /**
   * Default values to use when creating a new model
   * @default {}
   */
  defaultValues?: Partial<T>;

  /**
   * Whether to enable performance logging
   * @default false
   */
  enableLogging?: boolean;
}
```

#### Return Value

The `useFormModel` composable returns the following:

```typescript
interface FormModelReturn<T extends Record<string, any>> {
  /**
   * The local reactive model
   */
  localModel: T;

  /**
   * Update a field in the model and emit the change
   */
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;

  /**
   * Update a nested field in the model and emit the change
   */
  updateNestedField: <K extends keyof T, N extends keyof T[K]>(
    parent: K,
    field: N,
    value: T[K][N]
  ) => void;

  /**
   * Update the entire model and emit the change
   */
  updateModel: (newModel: T) => void;

  /**
   * Reset the model to its default values
   */
  resetModel: () => void;

  /**
   * Performance metrics (if logging is enabled)
   */
  perfMetrics?: {
    modelUpdates: number;
    fieldUpdates: number;
    nestedUpdates: number;
    renderTime: number;
  };
}
```

### Advanced Usage

#### With Default Values

```typescript
const { localModel, updateField, resetModel } = useFormModel<WorkInterface>({
  modelValue: computed(() => props.modelValue),
  emit: (event, value) => emit(event, value),
  defaultValues: {
    name: "",
    position: "",
    startDate: "",
    endDate: "",
    summary: "",
    highlights: [],
  },
});

// Reset the form to default values
const handleReset = () => {
  resetModel();
};
```

#### With Performance Logging

```typescript
const { localModel, updateField, perfMetrics } = useFormModel<WorkInterface>({
  modelValue: computed(() => props.modelValue),
  emit: (event, value) => emit(event, value),
  enableLogging: true,
});

// Log performance metrics when needed
const logPerformance = () => {
  if (perfMetrics) {
    console.log("Performance metrics:", perfMetrics);
  }
};
```

### Migration Guide

To migrate existing form components to use the `useFormModel` composable:

1. Replace the local reactive model with the `localModel` from the composable
2. Replace manual field update handlers with the `updateField` and `updateNestedField` methods
3. Replace the watch on props with the built-in watch in the composable
4. Replace the emit logic with the built-in emit in the composable

#### Before:

```typescript
// Create a local form model
const localModel = reactive<WorkInterface>({
  name: "",
  position: "",
  // ...
});

// Watch for changes to props
watch(
  () => props.modelValue,
  (newValue) => {
    updateLocalModel(newValue);
  },
  { deep: true }
);

// Update field handler
const handleFieldUpdate = (field: keyof WorkInterface, value: string) => {
  localModel[field] = value;
  emit("update:modelValue", { ...localModel });
};
```

#### After:

```typescript
// Use the composable
const { localModel, updateField } = useFormModel<WorkInterface>({
  modelValue: computed(() => props.modelValue),
  emit: (event, value) => emit(event, value),
});

// Update field handler
const handleFieldUpdate = (field: keyof WorkInterface, value: string) => {
  updateField(field, value);
};
```

### Best Practices

1. Always use `computed` to wrap the `modelValue` prop to ensure reactivity
2. Use TypeScript generics to ensure type safety
3. Use the `defaultValues` option to provide default values for new models
4. Use the `enableLogging` option only in development mode
5. Use the `updateNestedField` method for nested fields instead of manually handling them
6. Use the `resetModel` method to reset the form to default values
7. Use the `perfMetrics` to track performance in development mode

### Performance Considerations

The `useFormModel` composable is designed to be performant by:

1. Using a local reactive model to minimize prop updates
2. Using a deep watch on the model value to detect changes
3. Using a shallow copy of the model when emitting changes
4. Providing performance metrics to help identify bottlenecks

Enable performance logging in development mode to track:

- Model updates
- Field updates
- Nested field updates
- Render time

### Compatibility

The `useFormModel` composable is compatible with:

- Vue 3.4+
- TypeScript 5.7+
- Composition API
- `v-model` directive
- Reactive and computed refs

# Form Validation Composables

This directory contains composables for form validation and state management in the CV Generator application.

## useValidation

A powerful, flexible validation composable for Vue 3 applications that provides schema-based validation using Zod, with support for field-level validation, form-level validation, and performance tracking.

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

## Installation

Ensure you have the required dependencies installed:

```bash
pnpm add zod lodash-es
```

## Basic Usage

```typescript
<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { useValidation } from './composables/useValidation'

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
  enablePerformanceMetrics: true
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
```

## API Reference

### Parameters

The `useValidation` composable accepts the following parameters:

| Parameter | Type                | Description                        |
| --------- | ------------------- | ---------------------------------- |
| `schema`  | `ZodSchema`         | The Zod schema to validate against |
| `options` | `ValidationOptions` | Optional configuration options     |

### Options

The `ValidationOptions` interface supports the following options:

| Option                     | Type                                          | Default           | Description                                  |
| -------------------------- | --------------------------------------------- | ----------------- | -------------------------------------------- |
| `requiredFields`           | `string[]`                                    | `[]`              | Array of field paths that are required       |
| `customErrorFormatter`     | `(error: ZodError) => Record<string, string>` | Default formatter | Custom function to format Zod errors         |
| `enablePerformanceMetrics` | `boolean`                                     | `false`           | Whether to track validation performance      |
| `enableLogging`            | `boolean`                                     | `false`           | Whether to log validation operations         |
| `debounceMs`               | `number`                                      | `300`             | Debounce time in milliseconds for validation |

### Return Values

The composable returns an object with the following properties and methods:

| Property/Method | Type                                                       | Description                                       |
| --------------- | ---------------------------------------------------------- | ------------------------------------------------- |
| `validateValue` | `(value: any) => boolean \| void`                          | Validates a single value against the schema       |
| `validateField` | `(field: string, value: any) => boolean`                   | Validates a specific field and updates errors     |
| `validateForm`  | `(data: any) => boolean`                                   | Validates the entire form data object             |
| `errors`        | `Ref<Record<string, string>>`                              | Reactive object containing validation errors      |
| `isValid`       | `ComputedRef<boolean>`                                     | Computed property indicating if the form is valid |
| `resetErrors`   | `() => void`                                               | Resets all validation errors                      |
| `perfMetrics`   | `Ref<{ validationCount: number, validationTime: number }>` | Performance metrics (if enabled)                  |

## Advanced Usage

### Nested Fields Validation

The composable supports validation of nested fields using dot notation:

```typescript
const addressSchema = z.object({
  user: z.object({
    address: z.object({
      street: z.string().min(5, "Street name is too short"),
      city: z.string().min(2, "City name is too short"),
    }),
  }),
});

// Validate a nested field
validateField("user.address.street", streetValue);
```

### Custom Error Formatting

You can provide a custom error formatter to customize how errors are displayed:

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

### Performance Tracking

Enable performance metrics to track validation operations:

```typescript
const { validateForm, perfMetrics } = useValidation(userSchema, {
  enablePerformanceMetrics: true,
});

// After validation, check the metrics
console.log(`Validation count: ${perfMetrics.value.validationCount}`);
console.log(
  `Total validation time: ${perfMetrics.value.validationTime.toFixed(2)} ms`
);
```

### Combining with useFormModel

For a complete form solution, combine `useValidation` with `useFormModel`:

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

## Example Components

Check out the example components in the `components/examples` directory:

- `ValidationExample.vue` - Basic form validation example
- `ValidationFormExample.vue` - Complete form with validation
- `CombinedFormExample.vue` - Example combining useValidation with useFormModel

## Best Practices

1. **Define schemas separately** from your components for better reusability
2. **Use typed schemas** to leverage TypeScript's type checking
3. **Validate on input** for immediate feedback, but **debounce** for better performance
4. **Validate the entire form** before submission
5. **Reset errors** when appropriate (e.g., when a form is reset)
6. **Track performance** in development to identify potential bottlenecks

## License

MIT

# Composables for CV Generator

This directory contains Vue 3 composables used throughout the CV Generator application.

## useCollectionField

`useCollectionField` is a composable that simplifies the management of collection fields in form components. It provides a standardized way to:

- Add items to a collection
- Remove items from a collection
- Update specific items in a collection
- Handle temporary state for adding new items
- Validate collection items
- Manage UI state for forms (showing/hiding add forms, edit state, etc.)

### Basic Usage

Here's a simple example of how to use the `useCollectionField` composable:

```typescript
import { reactive } from "vue";
import { useCollectionField } from "../composables/useCollectionField";

// Define your collection item interface
interface MyCollectionItem {
  id?: string;
  name: string;
  value: string;
}

// Your form model that contains the collection
const formModel = reactive({
  myItems: [] as MyCollectionItem[],
});

// Default values for new items
const defaultItem: MyCollectionItem = {
  name: "",
  value: "",
};

// Function to update the field in your model
const updateField = (field: string, value: MyCollectionItem[]) => {
  formModel[field as keyof typeof formModel] = value;
};

// Optional: Validation function
const validateItem = (item: MyCollectionItem) => {
  const errors: Record<string, string> = {};

  if (!item.name) {
    errors.name = "Name is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Initialize the composable
const {
  items, // Ref<MyCollectionItem[]> - Current items in the collection
  newItem, // Ref<MyCollectionItem> - Model for new item being created
  isAddingItem, // Ref<boolean> - Whether the add form is displayed
  editingItemId, // Ref<string | null> - ID of item being edited (if any)
  validationErrors, // Ref<Record<string, string>> - Current validation errors
  addItem, // (item?: MyCollectionItem) => void - Add an item to collection
  removeItem, // (idOrIndex: string | number) => void - Remove an item
  updateItem, // (id: string, updatedItem: MyCollectionItem) => void - Update item
  startEditing, // (idOrIndex: string | number) => MyCollectionItem - Begin editing
  resetNewItem, // () => void - Reset the new item to defaults
  toggleAddForm, // () => void - Toggle add form visibility
  cancelEditing, // () => void - Cancel edit mode
  reorderItems, // (newOrder: string[]) => void - Reorder items
} = useCollectionField<MyCollectionItem>({
  fieldName: "myItems", // Field name in parent model
  updateField, // Function to update parent model
  collection: () => formModel.myItems, // Access to collection data
  defaultItemValues: defaultItem, // Default values for new items
  validateItem, // Optional validation function
  identifierField: "id", // Default: 'id'
  enableLogging: false, // Enable performance logging
});
```

### Usage in Templates

In your template, you can use the returned values and functions like this:

```vue
<template>
  <!-- Toggle add form button -->
  <button @click="toggleAddForm">
    {{ isAddingItem ? "Cancel" : "Add Item" }}
  </button>

  <!-- Add/Edit form -->
  <div v-if="isAddingItem">
    <h3>{{ editingItemId ? "Edit Item" : "Add New Item" }}</h3>

    <input v-model="newItem.name" placeholder="Name" />
    <p v-if="validationErrors.name" class="error">
      {{ validationErrors.name }}
    </p>

    <input v-model="newItem.value" placeholder="Value" />

    <button @click="isAddingItem = false">Cancel</button>
    <button
      @click="editingItemId ? updateItem(editingItemId, newItem) : addItem()"
    >
      {{ editingItemId ? "Update" : "Add" }}
    </button>
  </div>

  <!-- List of items -->
  <div v-for="item in items" :key="item.id">
    <div>{{ item.name }}: {{ item.value }}</div>
    <button @click="editItem(item.id)">Edit</button>
    <button @click="removeItem(item.id)">Delete</button>
  </div>
</template>

<script setup>
// Helper function to start editing an item
const editItem = (id) => {
  const itemToEdit = startEditing(id);
  Object.assign(newItem, itemToEdit);
  isAddingItem.value = true;
};
</script>
```

### API Reference

#### Options

| Option              | Type                                                                 | Required | Description                                                     |
| ------------------- | -------------------------------------------------------------------- | -------- | --------------------------------------------------------------- |
| `fieldName`         | `string`                                                             | Yes      | The field name in the parent model that contains the collection |
| `updateField`       | `(field: string, value: T[]) => void`                                | Yes      | Function to update the collection in the parent model           |
| `collection`        | `Ref<T[]> \| (() => T[])`                                            | Yes      | Current collection from the parent model                        |
| `defaultItemValues` | `T`                                                                  | Yes      | Default values for a new item                                   |
| `validateItem`      | `(item: T) => { isValid: boolean; errors?: Record<string, string> }` | No       | Optional validator function for items                           |
| `identifierField`   | `keyof T`                                                            | No       | Field to use as a unique identifier (defaults to 'id')          |
| `enableLogging`     | `boolean`                                                            | No       | Whether to enable performance logging                           |

#### Returns

| Property           | Type                                                                                                                       | Description                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `items`            | `Ref<T[]>`                                                                                                                 | Current collection items                                       |
| `newItem`          | `Ref<T>`                                                                                                                   | New item being prepared for addition                           |
| `isAddingItem`     | `Ref<boolean>`                                                                                                             | Whether the add form is currently visible                      |
| `editingItemId`    | `Ref<string \| null>`                                                                                                      | ID of the item being edited (if any)                           |
| `validationErrors` | `Ref<Record<string, string>>`                                                                                              | Any validation errors for the current item                     |
| `addItem`          | `(item?: T) => void`                                                                                                       | Add a new item to the collection                               |
| `removeItem`       | `(idOrIndex: string \| number) => void`                                                                                    | Remove an item from the collection by ID or index              |
| `updateItem`       | `(id: string, updatedItem: T) => void`                                                                                     | Update an existing item in the collection                      |
| `startEditing`     | `(idOrIndex: string \| number) => T`                                                                                       | Setup editing for an existing item, returns a copy of the item |
| `resetNewItem`     | `() => void`                                                                                                               | Reset the new item to default values                           |
| `toggleAddForm`    | `() => void`                                                                                                               | Toggle the visibility of the add form                          |
| `cancelEditing`    | `() => void`                                                                                                               | Cancel current editing operation                               |
| `reorderItems`     | `(newOrder: string[]) => void`                                                                                             | Reorder collection items based on array of IDs                 |
| `perfMetrics`      | `{ addOperations: number, removeOperations: number, updateOperations: number, validationOperations: number } \| undefined` | Performance metrics if logging is enabled                      |

### Example Components

For a complete working example, see:

- `packages/ui/src/modules/cv/presentation/components/examples/CollectionFieldExample.vue`

This composable is used to standardize collection field handling across the CV Generator application.
