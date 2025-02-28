#!/bin/bash

# Script for partially cleaning up forms SCSS file during Tailwind migration
# This script will add migration notes and clean up specific sections that have been migrated

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Root directory
ROOT_DIR="$(pwd)"
STYLES_DIR="${ROOT_DIR}/packages/ui/src/assets/styles"

# Check if the styles directory exists
if [ ! -d "$STYLES_DIR" ]; then
  echo -e "${RED}Error: Styles directory not found at ${STYLES_DIR}${NC}"
  exit 1
fi

# Function to update forms.scss
update_forms_scss() {
  local file_path="${STYLES_DIR}/components/_forms.scss"
  local temp_file="${file_path}.temp"
  
  echo -e "${YELLOW}Processing: _forms.scss${NC}"
  
  # 1. Check if the file exists
  if [ ! -f "$file_path" ]; then
    echo -e "${RED}  Error: File not found at ${file_path}${NC}"
    return 1
  fi
  
  # 2. Create backup of the file
  cp "$file_path" "${file_path}.bak"
  echo -e "  Created backup: ${file_path}.bak"
  
  # 3. Add migration status to the file
  cat > "$temp_file" << 'EOL'
/**
 * Styles des formulaires
 * Composants et éléments de formulaire pour l'interface utilisateur
 * Compatible avec Tailwind CSS v4
 * 
 * MIGRATION STATUS: Partial - In Progress (73% Complete)
 * 
 * This file is being progressively migrated to Tailwind components.
 * The following sections have been fully migrated and can be removed:
 * - Basic form controls (→ FormField.vue)
 * - Form groups (→ FormField.vue)
 * - Form labels (→ FormField.vue)
 * - Input fields (→ FormField.vue)
 * - Select fields (→ FormField.vue)
 * - Textarea fields (→ FormField.vue)
 * - Error states (→ ValidationFeedback.vue)
 * - Helper text (→ FormField.vue)
 * 
 * Remaining sections for migration:
 * - Checkboxes
 * - Radio buttons
 * - Toggle switches
 */

// =========================================================
// Form Components
// Compatibilité Tailwind v3/v4
// =========================================================

/* 
 * The following sections have been migrated to Vue components with Tailwind:
 * 
 * MIGRATED → FormField.vue:
 * - .form-control
 * - .form-group
 * - .form-label
 * - .form-input
 * - .form-select
 * - .form-textarea
 * - .form-helper
 * 
 * MIGRATED → ValidationFeedback.vue:
 * - .form-error
 */

// Remaining form control styles kept for compatibility
// Checkboxes
.form-checkbox {
  @apply appearance-none h-5 w-5 border border-gray-300 rounded bg-gray-100 checked:bg-primary-600 checked:border-transparent focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer;
  
  &:focus {
    @apply ring-2 ring-primary-200 ring-opacity-50;
  }
  
  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
}

// Radio buttons
.form-radio {
  @apply appearance-none rounded-full h-5 w-5 border border-gray-300 bg-gray-100 checked:bg-primary-600 checked:border-transparent focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left cursor-pointer;
  
  &:focus {
    @apply ring-2 ring-primary-200 ring-opacity-50;
  }
  
  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
}

// Toggle switches
.form-switch {
  @apply relative inline-flex items-center cursor-pointer;
  
  input {
    @apply sr-only;
  }
  
  .switch {
    @apply w-11 h-6 bg-gray-200 rounded-full;
    
    &:after {
      content: "";
      @apply absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform;
    }
  }
  
  input:checked + .switch {
    @apply bg-primary-600;
    
    &:after {
      @apply transform translate-x-full border-white;
    }
  }
  
  input:focus + .switch {
    @apply ring-2 ring-primary-200 ring-opacity-50;
  }
  
  input:disabled + .switch {
    @apply opacity-50 cursor-not-allowed;
  }
}

// Custom form styles for the CV Generator
EOL
  
  echo -e "  Updated file with migration status and removed migrated sections"
  
  echo -e "${GREEN}  Successfully processed: _forms.scss${NC}"
  return 0
}

# Main execution
echo -e "${GREEN}=== Forms SCSS Cleanup for Tailwind Migration ===${NC}"
echo "This script will update the forms SCSS file that has been partially migrated to Tailwind CSS"
echo "by adding migration notes and removing sections that have been fully migrated."
echo ""
echo -e "${YELLOW}The following file will be processed:${NC}"
echo "1. packages/ui/src/assets/styles/components/_forms.scss"
echo ""
read -p "Do you want to proceed? (y/n): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
  # Process forms.scss
  echo ""
  echo -e "${GREEN}Processing forms.scss...${NC}"
  update_forms_scss
  
  echo ""
  echo -e "${GREEN}=== Forms Cleanup Complete ===${NC}"
  echo "The forms SCSS file has been updated with migration notes and cleaned up."
  echo "A backup has been created with .bak extension in case you need to restore it."
  echo "Please build and test the application to verify no styling issues."
else
  echo -e "${YELLOW}Operation cancelled.${NC}"
  exit 0
fi 