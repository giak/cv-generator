# Internationalization (i18n) Architecture

## Overview

The CV Generator application implements a Clean Architecture approach to internationalization (i18n), ensuring that the domain logic remains independent of the specific i18n implementation. This document outlines the architecture, components, and usage patterns for the i18n system.

## Architecture Components

The i18n architecture is organized across three packages:

### 1. Core Package (`@cv-generator/core`)

Contains the domain port interface that defines the contract for any i18n implementation:

```typescript
// packages/core/src/shared/i18n/domain-i18n.port.ts
export interface DomainI18nPortInterface {
  translate(key: string, params?: Record<string, unknown>): string;
  exists(key: string): boolean;
}
```

This interface follows Clean Architecture principles by defining the contract that any i18n implementation must fulfill, allowing the domain to remain independent of specific i18n libraries.

### 2. Shared Package (`@cv-generator/shared`)

Contains shared constants and translation keys:

- **Translation Keys**: Centralized constants for all translation keys used in the application
- **Supported Locales**: Configuration for supported languages and default locale

```typescript
// packages/shared/src/i18n/constants/supported-locales.ts
export const SUPPORTED_LOCALES = ["en", "fr"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = "en";
```

### 3. UI Package (`@cv-generator/ui`)

Contains the Vue I18n implementation and adapter:

- **Vue I18n Adapter**: Implements the domain port interface using Vue I18n
- **Composables**: Provides easy access to i18n functionality in components
- **Setup**: Configuration for Vue I18n
- **Locales**: Translation files for each supported language

## Implementation Details

### Adapter Pattern

The Vue I18n adapter implements the domain port interface, isolating the Vue I18n implementation from the domain:

```typescript
// packages/ui/src/i18n/vue-i18n-adapter.ts
export class VueI18nAdapter implements DomainI18nPortInterface {
  private readonly i18n;

  constructor() {
    this.i18n = useI18n();
  }

  translate(key: string, params?: Record<string, unknown>): string {
    return this.i18n.t(key, params || {});
  }

  exists(key: string): boolean {
    return this.i18n.te(key);
  }
}
```

### Composable for Component Usage

A composable function provides easy access to i18n functionality in components:

```typescript
// packages/ui/src/i18n/composables/use-i18n.ts
export function useAppI18n() {
  const adapter = new VueI18nAdapter();
  const currentLocale = ref<SupportedLocale>("en");

  const changeLocale = async (locale: SupportedLocale): Promise<void> => {
    await loadLocaleMessages(locale);
    currentLocale.value = locale;
  };

  return {
    i18n: adapter,
    currentLocale: currentLocale.value,
    changeLocale,
  };
}
```

## Usage Examples

### In Vue Components

```vue
<script setup lang="ts">
import { useAppI18n } from "@cv-generator/ui/src/i18n/composables/use-i18n";
import { TRANSLATION_KEYS } from "@cv-generator/shared/src/i18n/keys";

const { i18n } = useAppI18n();

// Simple translation
const saveButtonText = i18n.translate(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE);

// Translation with parameters
const errorMessage = i18n.translate(
  TRANSLATION_KEYS.COMMON.ERRORS.REQUIRED_FIELD,
  {
    field: "Email",
  }
);
</script>

<template>
  <button>{{ saveButtonText }}</button>
  <p v-if="showError">{{ errorMessage }}</p>
</template>
```

### Changing Locale

```typescript
import { useAppI18n } from "@cv-generator/ui/src/i18n/composables/use-i18n";

const { changeLocale, currentLocale } = useAppI18n();

// Change to French
await changeLocale("fr");
console.log(currentLocale); // 'fr'
```

## Testing

The i18n implementation includes comprehensive tests:

1. **Unit Tests**: Test the adapter and composable in isolation
2. **Integration Tests**: Test the i18n functionality in components

## Benefits of This Architecture

1. **Separation of Concerns**: Domain logic is independent of the i18n implementation
2. **Testability**: Each component can be tested in isolation
3. **Maintainability**: Changes to the i18n library don't affect the domain
4. **Type Safety**: TypeScript ensures type safety throughout the i18n system
5. **Centralized Keys**: Translation keys are centralized and strongly typed
