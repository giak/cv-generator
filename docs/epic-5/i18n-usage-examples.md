# i18n Usage Examples

This document provides practical examples of how to use the internationalization (i18n) system in the CV Generator application.

## Basic Usage in Vue Components

### Example 1: Simple Text Translation

```vue
<script setup lang="ts">
import { useAppI18n } from "@cv-generator/ui/src/i18n/composables/use-i18n";
import { TRANSLATION_KEYS } from "@cv-generator/shared/src/i18n/keys";

const { i18n } = useAppI18n();
</script>

<template>
  <h1>{{ i18n.translate(TRANSLATION_KEYS.RESUME.SECTIONS.BASICS) }}</h1>
  <button>{{ i18n.translate(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE) }}</button>
</template>
```

### Example 2: Translation with Parameters

```vue
<script setup lang="ts">
import { useAppI18n } from "@cv-generator/ui/src/i18n/composables/use-i18n";
import { TRANSLATION_KEYS } from "@cv-generator/shared/src/i18n/keys";

const { i18n } = useAppI18n();
const fieldName = "Email";
</script>

<template>
  <p class="error">
    {{
      i18n.translate(TRANSLATION_KEYS.COMMON.ERRORS.REQUIRED_FIELD, {
        field: fieldName,
      })
    }}
  </p>
</template>
```

## Changing the Application Language

### Example 3: Language Selector Component

```vue
<script setup lang="ts">
import { useAppI18n } from "@cv-generator/ui/src/i18n/composables/use-i18n";
import {
  LOCALE_NAMES,
  type SupportedLocale,
} from "@cv-generator/shared/src/i18n/constants/supported-locales";

const { changeLocale, currentLocale } = useAppI18n();

const handleLanguageChange = async (event: Event) => {
  const select = event.target as HTMLSelectElement;
  await changeLocale(select.value as SupportedLocale);
};
</script>

<template>
  <div class="language-selector">
    <label for="language-select">Language:</label>
    <select
      id="language-select"
      :value="currentLocale"
      @change="handleLanguageChange"
    >
      <option v-for="(name, code) in LOCALE_NAMES" :key="code" :value="code">
        {{ name }}
      </option>
    </select>
  </div>
</template>
```

## Checking for Translation Existence

### Example 4: Conditional Rendering Based on Translation Existence

```vue
<script setup lang="ts">
import { useAppI18n } from "@cv-generator/ui/src/i18n/composables/use-i18n";

const { i18n } = useAppI18n();
const customKey = "feature.new.beta";
</script>

<template>
  <div v-if="i18n.exists(customKey)" class="beta-feature">
    {{ i18n.translate(customKey) }}
  </div>
</template>
```

## Using i18n in JavaScript/TypeScript Files

### Example 5: Using i18n in a Service or Utility

```typescript
import { useAppI18n } from "@cv-generator/ui/src/i18n/composables/use-i18n";
import { TRANSLATION_KEYS } from "@cv-generator/shared/src/i18n/keys";

export function validateForm(data: Record<string, any>): string[] {
  const { i18n } = useAppI18n();
  const errors: string[] = [];

  if (!data.email) {
    errors.push(
      i18n.translate(TRANSLATION_KEYS.COMMON.ERRORS.REQUIRED_FIELD, {
        field: "Email",
      })
    );
  } else if (!isValidEmail(data.email)) {
    errors.push(i18n.translate(TRANSLATION_KEYS.COMMON.ERRORS.INVALID_EMAIL));
  }

  return errors;
}

function isValidEmail(email: string): boolean {
  // Email validation logic
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

## Adding New Translations

### Example 6: Extending Translation Keys

To add new translation keys:

1. Add the key to the `TRANSLATION_KEYS` object in `packages/shared/src/i18n/keys/index.ts`:

```typescript
export const TRANSLATION_KEYS = {
  // ... existing keys
  PROFILE: {
    TITLE: "profile.title",
    DESCRIPTION: "profile.description",
    SETTINGS: "profile.settings",
  },
} as const;
```

2. Add the translations to each locale file:

In `packages/ui/src/i18n/locales/en.json`:

```json
{
  "profile": {
    "title": "Profile",
    "description": "Manage your personal information",
    "settings": "Profile Settings"
  }
}
```

In `packages/ui/src/i18n/locales/fr.json`:

```json
{
  "profile": {
    "title": "Profil",
    "description": "Gérer vos informations personnelles",
    "settings": "Paramètres du profil"
  }
}
```

## Best Practices

1. **Always use the `TRANSLATION_KEYS` constants** instead of hardcoding string keys
2. **Keep translations organized** by domain/feature in the JSON files
3. **Use parameters** for dynamic content instead of concatenating strings
4. **Add new locales** by extending the `SUPPORTED_LOCALES` array and creating new locale files
5. **Document new translation keys** to help translators understand the context
