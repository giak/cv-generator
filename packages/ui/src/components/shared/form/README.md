# Form Components

This directory contains reusable form components designed to standardize form handling across the CV Generator application.

## Components

### FormField

A standardized input field component that handles various types of input with consistent styling and validation.

### Form

A wrapper component for form layouts with standardized styling and submission handling.

### DateRangeFields

A specialized component for handling date ranges with "currently active" functionality.

## DateRangeFields Documentation

### Overview

`DateRangeFields` is a reusable component that simplifies the management of date ranges (start date and end date) with a "currently active" option. This component is particularly useful for scenarios like work experiences, education, or volunteer activities where there may be an ongoing activity without an end date.

### Features

- Standardized interface for date range inputs
- "Currently active" checkbox that automatically clears and disables the end date field
- Built-in validation for date formats and ranges
- Accessibility support with auto-generated IDs
- Customizable labels, placeholders, and helper texts
- Internationalization support through props
- Type-safe implementation with TypeScript

### Installation

```typescript
import DateRangeFields from "@ui/components/shared/form/DateRangeFields.vue";
```

### Props

| Prop                   | Type      | Default                                 | Description                               |
| ---------------------- | --------- | --------------------------------------- | ----------------------------------------- |
| `startDate`            | `string`  | (required)                              | Start date value (YYYY-MM-DD format)      |
| `endDate`              | `string`  | `''`                                    | End date value (YYYY-MM-DD format)        |
| `isCurrentlyActive`    | `boolean` | `false`                                 | Whether the activity is currently ongoing |
| `startDateLabel`       | `string`  | `'Date de début'`                       | Label for the start date field            |
| `endDateLabel`         | `string`  | `'Date de fin'`                         | Label for the end date field              |
| `currentlyActiveLabel` | `string`  | `'En cours'`                            | Label for the "currently active" checkbox |
| `startDatePlaceholder` | `string`  | `'YYYY-MM-DD'`                          | Placeholder for the start date field      |
| `endDatePlaceholder`   | `string`  | `'YYYY-MM-DD (ou vide si en cours)'`    | Placeholder for the end date field        |
| `required`             | `boolean` | `false`                                 | Whether the start date is required        |
| `startDateError`       | `string`  | `''`                                    | Error message for the start date field    |
| `endDateError`         | `string`  | `''`                                    | Error message for the end date field      |
| `startDateHelpText`    | `string`  | `'Format: AAAA-MM-JJ (ex: 2020-01-15)'` | Helper text for the start date field      |
| `endDateHelpText`      | `string`  | `'Laissez vide si en cours'`            | Helper text for the end date field        |
| `startDateIcon`        | `string`  | `(calendar icon SVG)`                   | Icon for the start date field             |
| `endDateIcon`          | `string`  | `(calendar icon SVG)`                   | Icon for the end date field               |
| `startDateId`          | `string`  | `(auto-generated)`                      | ID for the start date field               |
| `endDateId`            | `string`  | `(auto-generated)`                      | ID for the end date field                 |
| `currentlyActiveId`    | `string`  | `(auto-generated)`                      | ID for the "currently active" checkbox    |
| `dateFormat`           | `string`  | `'YYYY-MM-DD'`                          | Expected date format                      |

### Events

| Event                      | Payload                                                               | Description                                       |
| -------------------------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| `update:startDate`         | `string`                                                              | Emitted when the start date changes               |
| `update:endDate`           | `string`                                                              | Emitted when the end date changes                 |
| `update:isCurrentlyActive` | `boolean`                                                             | Emitted when the "currently active" state changes |
| `startDate-blur`           | `string`                                                              | Emitted when the start date field loses focus     |
| `endDate-blur`             | `string`                                                              | Emitted when the end date field loses focus       |
| `date-range-change`        | `{ startDate: string; endDate?: string; isCurrentlyActive: boolean }` | Emitted when any part of the date range changes   |

### Basic Usage

```vue
<template>
  <DateRangeFields
    v-model:startDate="formData.startDate"
    v-model:endDate="formData.endDate"
    v-model:isCurrentlyActive="formData.isCurrentlyActive"
    :required="true"
    :startDateError="errors.startDate"
    :endDateError="errors.endDate"
    @startDate-blur="validateField('startDate', $event)"
    @endDate-blur="validateField('endDate', $event)"
  />
</template>

<script setup>
import { ref } from "vue";
import DateRangeFields from "@ui/components/shared/form/DateRangeFields.vue";

const formData = ref({
  startDate: "",
  endDate: "",
  isCurrentlyActive: false,
});

const errors = ref({
  startDate: "",
  endDate: "",
});

const validateField = (field, value) => {
  // Your validation logic here
};
</script>
```

### Integration with Form Model

```vue
<template>
  <DateRangeFields
    :startDate="formModel.startDate"
    :endDate="formModel.endDate"
    :isCurrentlyActive="!formModel.endDate"
    :required="true"
    :startDateError="errors.startDate"
    :endDateError="errors.endDate"
    @update:startDate="handleFieldUpdate('startDate', $event)"
    @update:endDate="handleFieldUpdate('endDate', $event)"
    @update:isCurrentlyActive="handleCurrentActivityChange"
    @startDate-blur="validateField('startDate', $event)"
    @endDate-blur="validateField('endDate', $event)"
  />
</template>

<script setup>
import { computed } from "vue";
import DateRangeFields from "@ui/components/shared/form/DateRangeFields.vue";

// Your form model setup
const formModel = computed(() => ({
  startDate: props.modelValue.startDate || "",
  endDate: props.modelValue.endDate || "",
  // other fields...
}));

// Field update handler
const handleFieldUpdate = (field, value) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [field]: value,
  });
};

// Handle "currently active" state
const handleCurrentActivityChange = (isCurrentlyActive) => {
  if (isCurrentlyActive) {
    // If currently active, clear the end date
    handleFieldUpdate("endDate", "");
  }
};
</script>
```

### Customizing Labels for Different Contexts

The component is designed to be context-aware through prop customization:

```vue
<!-- For work experience -->
<DateRangeFields
  :currentlyActiveLabel="'Emploi actuel'"
  :startDateHelpText="'Date de début de l\'emploi'"
  :endDateHelpText="'Date de fin (ou vide si emploi actuel)'"
  ...
/>

<!-- For education -->
<DateRangeFields
  :currentlyActiveLabel="'Formation en cours'"
  :startDateHelpText="'Date de début des études'"
  :endDateHelpText="'Date de fin (ou vide si en cours d\'études)'"
  ...
/>

<!-- For volunteer work -->
<DateRangeFields
  :currentlyActiveLabel="'Bénévolat en cours'"
  :startDateHelpText="'Date de début du bénévolat'"
  :endDateHelpText="'Date de fin (ou vide si bénévolat en cours)'"
  ...
/>
```

### Validation

The component includes built-in validation for:

1. **Date format**: Ensures dates follow the YYYY-MM-DD format
2. **Date range**: Ensures the end date is not before the start date (when both are provided)

You can also provide your own validation through the `startDateError` and `endDateError` props, which will be displayed alongside the respective fields.

### Accessibility

The component is built with accessibility in mind:

- Auto-generated IDs for form fields
- Proper label associations for screen readers
- Optional custom IDs for integration with external accessibility tools
- Focus management for keyboard navigation

### Best Practices

1. **Date Format**: Always use YYYY-MM-DD format for consistency
2. **Form Integration**: Use with form validation libraries for additional validation
3. **Error Handling**: Provide clear error messages through the error props
4. **Localization**: Customize all text props for different languages

### Performance Considerations

The component uses Vue's reactivity system efficiently and avoids unnecessary re-renders:

- Local state is managed through `ref` and `computed` values
- Event handlers are debounced where appropriate
- DOM updates are minimized when toggling the "currently active" state

### Troubleshooting

**Issue**: Date fields not updating parent component
**Solution**: Ensure you're handling the update events (`@update:startDate`, etc.) and updating your model

**Issue**: Validation not working
**Solution**: The component provides basic format validation but delegates business logic validation to the parent component

**Issue**: "Currently active" state not working correctly
**Solution**: Ensure the `isCurrentlyActive` prop is reactive and properly bound

## Contributing

When enhancing these components, please:

1. Maintain TypeScript type safety
2. Add comprehensive tests for new functionality
3. Update this documentation with any API changes
4. Follow the project's UI/UX guidelines for consistency
