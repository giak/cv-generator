# Project Scripts

This directory contains utility scripts for the CV Generator project.

## Translation Workflow Script

### i18n-workflow.js

The `i18n-workflow.js` script is a tool for managing translations, built on top of the `vue-i18n-extract` library. It provides an interactive workflow for analyzing and fixing translation issues.

#### Features

- Generates a detailed report of translation issues
- Interactively offers to add missing translation keys
- Interactively offers to remove unused translation keys
- Provides a summary of translation status

#### Usage

Run the script with npm/pnpm:

```bash
pnpm i18n:workflow
```

## Vue-i18n-extract Integration

The project also integrates directly with `vue-i18n-extract` for more granular control over translation management.

### Available Commands

| Command                   | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| `pnpm i18n:report`        | Generate a report of missing and unused translation keys |
| `pnpm i18n:add-missing`   | Add all missing translation keys to language files       |
| `pnpm i18n:remove-unused` | Remove all unused translation keys from language files   |
| `pnpm i18n:cleanup`       | Both add missing and remove unused translation keys      |

### Configuration

The `vue-i18n-extract` tool is configured in the `vue-i18n-extract.config.js` file at the root of the project. Key settings include:

- **vueFiles**: Paths to Vue, JavaScript, and TypeScript files to scan for translation keys
- **languageFiles**: Paths to language JSON files
- **output**: Path to the generated report
- **add**: Whether to automatically add missing keys (default: false)
- **remove**: Whether to automatically remove unused keys (default: false)
- **exclude**: Paths to exclude from analysis
- **separator**: Separator for nested translation keys
- **noEmptyTranslation**: Whether to prevent empty translations
- **missingtranslationstring**: Value to use for missing translations

## Integration with CI/CD

The translation analysis tools can be integrated into CI/CD pipelines to ensure translation consistency:

```yaml
- name: Check translations
  run: pnpm i18n:report
```

For more information, refer to the [vue-i18n-extract documentation](https://github.com/Spittal/vue-i18n-extract).
