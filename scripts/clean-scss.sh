#!/bin/bash

# Script for cleaning up SCSS files that have been migrated to Tailwind CSS
# This script will remove the specified SCSS files and update the main.scss imports

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Root directory
ROOT_DIR="$(pwd)"
STYLES_DIR="${ROOT_DIR}/packages/ui/src/assets/styles"
MAIN_SCSS="${STYLES_DIR}/main.scss"

# Check if the styles directory exists
if [ ! -d "$STYLES_DIR" ]; then
  echo -e "${RED}Error: Styles directory not found at ${STYLES_DIR}${NC}"
  exit 1
fi

# Function to remove a SCSS file and update main.scss
remove_scss_file() {
  local file_path="$1"
  local file_name=$(basename "$file_path")
  local import_path="$2"
  
  echo -e "${YELLOW}Processing: $file_name${NC}"
  
  # 1. Check if the file exists
  if [ ! -f "$file_path" ]; then
    echo -e "${RED}  Error: File not found at ${file_path}${NC}"
    return 1
  fi
  
  # 2. Create backup of the file
  cp "$file_path" "${file_path}.bak"
  echo -e "  Created backup: ${file_path}.bak"
  
  # 3. Remove the file
  rm "$file_path"
  echo -e "  Removed: $file_path"
  
  # 4. Update main.scss to remove the import
  if [ -f "$MAIN_SCSS" ]; then
    # Create a backup of main.scss
    cp "$MAIN_SCSS" "${MAIN_SCSS}.bak"
    echo -e "  Created backup of main.scss"
    
    # Remove the import line
    sed -i "/@import '${import_path}';/d" "$MAIN_SCSS"
    echo -e "  Updated main.scss: Removed @import '${import_path}';"
  else
    echo -e "${RED}  Error: main.scss not found at ${MAIN_SCSS}${NC}"
    return 1
  fi
  
  echo -e "${GREEN}  Successfully processed: $file_name${NC}"
  return 0
}

# Function to restore from backup if needed
restore_from_backup() {
  local file_path="$1"
  
  if [ -f "${file_path}.bak" ]; then
    cp "${file_path}.bak" "$file_path"
    echo -e "${YELLOW}Restored from backup: $file_path${NC}"
    return 0
  else
    echo -e "${RED}No backup found for: $file_path${NC}"
    return 1
  fi
}

# Main execution
echo -e "${GREEN}=== SCSS Cleanup for Tailwind Migration ===${NC}"
echo "This script will remove SCSS files that have been fully migrated to Tailwind CSS"
echo "and update the main.scss file to remove their imports."
echo ""
echo -e "${YELLOW}The following files will be processed:${NC}"
echo "1. packages/ui/src/assets/styles/components/_buttons.scss"
echo "2. packages/ui/src/assets/styles/components/_cards.scss"
echo ""
read -p "Do you want to proceed? (y/n): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
  # Process buttons.scss
  echo ""
  echo -e "${GREEN}Processing buttons.scss...${NC}"
  remove_scss_file "${STYLES_DIR}/components/_buttons.scss" "components/buttons"
  
  # Process cards.scss
  echo ""
  echo -e "${GREEN}Processing cards.scss...${NC}"
  remove_scss_file "${STYLES_DIR}/components/_cards.scss" "components/cards"
  
  echo ""
  echo -e "${GREEN}=== Cleanup Complete ===${NC}"
  echo "Files have been removed and main.scss has been updated."
  echo "Backups have been created with .bak extension in case you need to restore them."
  echo "Please build and test the application to verify no styling issues."
else
  echo -e "${YELLOW}Operation cancelled.${NC}"
  exit 0
fi 