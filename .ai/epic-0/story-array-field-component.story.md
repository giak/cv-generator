# Epic-0: Project Maintenance and Optimization

# Story-3: Implement Reusable ArrayField Component

## Story Description

**As a** developer  
**I want** to create a reusable ArrayField component for managing collections of data  
**so that** we can efficiently implement the Work Experience, Education, and other multi-entry sections of the CV

## Status

Draft

## Context

Epic-2 requires implementing several CV sections that contain arrays of entries, such as Work Experience, Education, Skills, and Projects. Instead of creating separate implementations for each section, we need a reusable component that can handle arrays of objects with consistent validation, interactions, and styling.

This component will be central to our implementation of Epic-2 and will follow our architectural principles, including Clean Architecture separation, proper validation using Zod, and adherence to our UI standards with Tailwind CSS.

### Technical Context

- Vue 3 Composition API with TypeScript
- Zod for schema validation
- Pinia for state management
- Tailwind CSS for styling
- Component architecture with proper separation of concerns
- Testing with Vitest and Vue Testing Library

### Business Drivers

- Accelerate development of multiple CV sections with similar structure
- Ensure consistent user experience across different array-based sections
- Maintain data integrity with proper validation
- Improve maintainability through component reuse
- Support complex interactions (add, remove, reorder) consistently

## Estimation

Story Points: 3 (3 days of human development or 30 minutes of AI/human collaboration)

## Tasks

### 1. - [ ] ArrayField Component Design

1.  - [ ] Write tests for ArrayField component behavior
2.  - [ ] Design component API and props interface
3.  - [ ] Create component skeleton with TypeScript types
4.  - [ ] Define events and communication patterns
5.  - [ ] Plan integration with form validation system

### 2. - [ ] Core Functionality Implementation

1.  - [ ] Implement basic array management (add, remove)
2.  - [ ] Add item reordering capability
3.  - [ ] Create item template slot system
4.  - [ ] Implement validation integration
5.  - [ ] Add error display for array and items

### 3. - [ ] UI Implementation

1.  - [ ] Design responsive layout for array items
2.  - [ ] Create item actions (edit, delete, reorder)
3.  - [ ] Implement empty state and add button
4.  - [ ] Add animations for item operations
5.  - [ ] Style consistently with Tailwind CSS

### 4. - [ ] Advanced Features

1.  - [ ] Implement drag-and-drop reordering
2.  - [ ] Add bulk operations (delete multiple, copy)
3.  - [ ] Create collapsed/expanded item views
4.  - [ ] Implement pagination for large arrays
5.  - [ ] Add search/filter capabilities

### 5. - [ ] Integration and Testing

1.  - [ ] Integrate with Zod schema validation
2.  - [ ] Test with Work Experience schema
3.  - [ ] Test with Education schema
4.  - [ ] Verify accessibility compliance
5.  - [ ] Performance testing with large arrays

## Constraints

- Must work with any array of objects conforming to a Zod schema
- Must maintain proper TypeScript typing
- Must be accessible (WCAG 2.1 AA compliant)
- Must be responsive across all device sizes
- Must support theming and dark mode
- Must have comprehensive test coverage

## Data Models

### Component API

```typescript
// ArrayField.vue component props
interface ArrayFieldProps<T> {
  // Array of items to manage
  modelValue: T[];

  // Zod schema for validation
  schema: z.ZodType<T[]>;

  // Optional initial item template
  initialItem?: Partial<T>;

  // Maximum number of items allowed
  maxItems?: number;

  // Minimum number of items required
  minItems?: number;

  // Whether drag-and-drop reordering is enabled
  draggable?: boolean;

  // Allow collapsing items
  collapsible?: boolean;

  // Field is read-only
  readonly?: boolean;
}

// ArrayField.vue component events
interface ArrayFieldEvents<T> {
  // V-model update
  "update:modelValue": (items: T[]) => void;

  // Emitted when validation status changes
  validation: (valid: boolean, errors: Record<string, string[]>) => void;

  // Emitted when an item is added
  "item-added": (item: T, index: number) => void;

  // Emitted when an item is removed
  "item-removed": (item: T, index: number) => void;

  // Emitted when items are reordered
  "items-reordered": (items: T[]) => void;
}
```

### Example Usage

```vue
<template>
  <ArrayField
    v-model="resume.work"
    :schema="workSchema"
    :initial-item="initialWorkItem"
    :min-items="1"
    :max-items="10"
    draggable
    collapsible
    @validation="handleValidation"
  >
    <template #item="{ item, index, errors }">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          v-model="item.position"
          label="Position"
          :error="errors?.position"
        />
        <FormField
          v-model="item.company"
          label="Company"
          :error="errors?.company"
        />
        <!-- More fields -->
      </div>
    </template>

    <template #empty>
      <div class="text-center py-8 text-neutral-500">
        No work experience added yet. Click "Add Experience" to begin.
      </div>
    </template>

    <template #add-button>
      <Button>Add Experience</Button>
    </template>
  </ArrayField>
</template>
```

## Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   └── shared/
│   │       └── form/
│   │           ├── ArrayField/
│   │           │   ├── ArrayField.vue          # Main component
│   │           │   ├── ArrayFieldItem.vue      # Individual item wrapper
│   │           │   ├── ArrayFieldActions.vue   # Actions bar component
│   │           │   ├── DragHandle.vue          # Drag handle for reordering
│   │           │   └── __tests__/              # Test files
│   │           │       ├── ArrayField.spec.ts    # Unit tests
│   │           │       └── ArrayField.stories.ts # Storybook stories
│   │           └── index.ts                    # Exports
│   └── composables/
│       └── useArrayField.ts                  # Optional composable for headless usage
└── __tests__/
    └── integration/
        └── ArrayFieldIntegration.spec.ts     # Integration tests
```

## Dev Notes

### Component Design Considerations

#### 1. Slots vs Props

We've chosen a slot-based approach for item templates rather than a more opinionated component to maximize flexibility. This allows each section to define its own form fields while the ArrayField handles the array operations.

#### 2. Validation Strategy

The component will support two validation levels:

- Array-level validation (min/max items, required)
- Item-level validation (schema validation for each object)

Errors will be provided to the item slot for display.

#### 3. Performance Optimizations

For large arrays, we'll implement:

- Virtual scrolling for efficient rendering
- Lazy validation (validate only visible/changed items)
- Memoization of validation results
- Optional pagination

#### 4. Accessibility

We'll ensure:

- Proper ARIA attributes for drag-and-drop
- Keyboard navigation for all operations
- Focus management when adding/removing items
- Screen reader announcements for dynamic changes

## Next Actions (Prioritized)

1. Create basic component structure and TypeScript interfaces
2. Implement core add/remove functionality with tests
3. Create item slot system with error propagation
4. Implement basic styling with Tailwind CSS
5. Add drag-and-drop reordering capability
