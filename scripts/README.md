# Project Scripts

This directory contains utility scripts for the CV Generator project.

## Translation Management Script

### i18n-guardian.js

The `i18n-guardian.js` script is an intelligent and secure system for managing translations in the CV Generator project. It provides a robust approach to detecting, adding, and removing translation keys with built-in safeguards.

#### Features

- Uses 12 different patterns to accurately detect translation keys
- Automatically creates backups before making any modifications
- Protects essential key categories from accidental deletion
- Provides detailed context for each detected translation key
- Requires confirmation for potentially destructive actions
- Generates a comprehensive analysis report

#### Usage

Run the script with npm/pnpm:

```bash
pnpm i18n:guardian
```

The script will:

1. Analyze the codebase to detect used translation keys
2. Compare with existing translation files
3. Identify missing and unused keys
4. Protect essential keys based on defined patterns
5. Generate a detailed report
6. Prompt for confirmation before making changes

## Translation Backup

A manual backup utility is also available:

```bash
pnpm i18n:backup
```

This creates timestamped backups of all translation files in the `/packages/ui/src/i18n/locales/backups/` directory.

## Integration with CI/CD

The translation analysis tools can be integrated into CI/CD pipelines to ensure translation consistency:

```yaml
- name: Check translations
  run: pnpm i18n:guardian
```

## Report Format

The generated report at `/reports/i18n/i18n-guardian-report.json` contains:

- **Summary**: Counts of used, missing, unused and protected keys
- **Used Keys**: List of all translation keys detected in the code
- **Missing Keys**: Keys used in code but missing from translation files
- **Unused Keys**: Keys in translation files not detected in the code
- **Protected Keys**: Keys protected from deletion by defined patterns
- **Key Contexts**: File locations and surrounding code for each key

## Key Protection System

The script uses regular expression patterns to protect essential key categories:

```javascript
const ESSENTIAL_KEYS_PATTERNS = [
  /^common\./,
  /^resume\./,
  /^ui\./,
  /^navigation\./,
];
```

This ensures that even if a key is not detected as used, it will be preserved if it matches these patterns.
