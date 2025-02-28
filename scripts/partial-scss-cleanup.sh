#!/bin/bash

# Script for partially cleaning up SCSS files during Tailwind migration
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

# Function to update dashboard.scss
update_dashboard_scss() {
  local file_path="${STYLES_DIR}/layouts/_dashboard.scss"
  local temp_file="${file_path}.temp"
  
  echo -e "${YELLOW}Processing: _dashboard.scss${NC}"
  
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
 * Layout principal du dashboard
 * Structure de base pour l'interface utilisateur
 * Optimisé avec Tailwind CSS v4
 * 
 * MIGRATION STATUS: Partial - In Progress
 * 
 * This file is being progressively migrated to Tailwind components.
 * The following sections have been fully migrated and can be removed:
 * - Sidebar (→ DashboardLayout.vue)
 * - Navigation menu (→ NavMenu.vue)
 * - Breadcrumbs (→ BreadcrumbNav.vue)
 * - User info (→ UserInfo.vue)
 * - Search input (→ SearchInput.vue)
 * - Page header (→ PageHeader.vue)
 * 
 * Remaining sections need verification before removal.
 */

// =========================================================
// Dashboard Layout - Tech Dashboard
// Amélioré pour compatibilité Tailwind v3/v4
// =========================================================

// Main dashboard container
.dashboard {
  @apply flex flex-col md:flex-row min-h-screen w-full bg-neutral-900 text-white relative;
}

/* 
 * The following sections have been migrated to Vue components with Tailwind:
 * 
 * MIGRATED → DashboardLayout.vue:
 * - .dashboard-sidebar
 * - .sidebar-header
 * - .sidebar-content
 * - .sidebar-footer
 * 
 * MIGRATED → NavMenu.vue:
 * - .nav-menu
 * - .nav-group
 * - .nav-item
 * 
 * MIGRATED → BreadcrumbNav.vue:
 * - .breadcrumb
 * - .breadcrumb-item
 * 
 * MIGRATED → UserInfo.vue:
 * - .user-info
 * 
 * MIGRATED → SearchInput.vue:
 * - .search-input
 * 
 * MIGRATED → PageHeader.vue:
 * - .page-header
 */

// Main content area - Keep for now as it might be referenced in other components
.dashboard-content {
  @apply flex-1 p-4 pt-14 md:pt-4 overflow-y-auto;
  min-height: calc(100vh - 56px);
  
  @screen md {
    min-height: 100vh;
  }
}

// Remaining dashboard content styles kept for compatibility
EOL

  # 4. Append remaining needed styles
  grep -A 1000 "// Remaining dashboard content styles kept for compatibility" "$file_path" | tail -n +2 >> "$temp_file" || true
  
  # 5. Move temp file to original location
  mv "$temp_file" "$file_path"
  echo -e "  Updated file with migration status and removed migrated sections"
  
  echo -e "${GREEN}  Successfully processed: _dashboard.scss${NC}"
  return 0
}

# Main execution
echo -e "${GREEN}=== Partial SCSS Cleanup for Tailwind Migration ===${NC}"
echo "This script will update SCSS files that have been partially migrated to Tailwind CSS"
echo "by adding migration notes and removing sections that have been fully migrated."
echo ""
echo -e "${YELLOW}The following files will be processed:${NC}"
echo "1. packages/ui/src/assets/styles/layouts/_dashboard.scss"
echo ""
read -p "Do you want to proceed? (y/n): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
  # Process dashboard.scss
  echo ""
  echo -e "${GREEN}Processing dashboard.scss...${NC}"
  update_dashboard_scss
  
  echo ""
  echo -e "${GREEN}=== Partial Cleanup Complete ===${NC}"
  echo "Files have been updated with migration notes and cleaned up."
  echo "Backups have been created with .bak extension in case you need to restore them."
  echo "Please build and test the application to verify no styling issues."
else
  echo -e "${YELLOW}Operation cancelled.${NC}"
  exit 0
fi 