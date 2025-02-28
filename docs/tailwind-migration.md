# Tailwind CSS Migration Guide

## Overview

This document outlines our approach to migrating the CV Generator application to use Tailwind CSS exclusively. We're following a component-by-component migration approach to ensure a smooth transition while maintaining backward compatibility.

## Migration Principles

1. **Replace custom classes with Tailwind utilities**

   - Convert all custom CSS classes to equivalent Tailwind utilities
   - Maintain the same visual appearance and behavior
   - Preserve responsive design patterns

2. **Eliminate custom CSS**

   - Remove all scoped CSS in component files
   - Remove global CSS classes that duplicate Tailwind functionality
   - Use Tailwind's configuration for customizations when needed

3. **Maintain Backward Compatibility**

   - Ensure all tests continue to pass
   - Preserve existing DOM structure for stable selectors
   - Maintain all accessibility attributes

4. **Follow Best Practices**
   - Use dynamic class binding for conditional states
   - Extract complex class combinations into computed properties
   - Use Tailwind's group-_ and peer-_ modifiers for relational styling

## Reference Library Components

The following components have been migrated to serve as reference implementations:

1. **Form.vue**

   - Simple form container with header and action buttons
   - Migrated button styles from custom classes to Tailwind utilities
   - Added explicit transition classes for hover/focus states

2. **ValidationFeedback.vue**

   - Minimalistic error display component
   - Added font-medium class to maintain consistency with design system

3. **ErrorNotification.vue**

   - Complex component with conditional styling based on error severity
   - Added duration-300 to transition-all for smoother animations
   - Maintained all accessibility attributes

4. **FormField.vue**

   - Interactive form field with multiple states (focus, error, hover)
   - Replaced custom CSS classes with computed Tailwind classes
   - Improved state management by adding a hasError computed property
   - Eliminated inline styles in favor of conditional classes

5. **BasicsForm.vue**

   - Form component for CV personal information
   - Already implemented with Tailwind CSS classes
   - Uses grid layout with responsive breakpoints
   - Demonstrates best practices for form organization

6. **Button.vue**

   - Universal button component with multiple variants and states
   - Implements all styles from \_buttons.scss with pure Tailwind
   - Supports icons, loading states, and size variations
   - Can render as button or anchor element based on props

7. **TechButton.vue**

   - Specialized button for technical dashboards
   - Features distinctive bottom-border accent in different colors
   - Shares common API with the main Button component
   - Shows how to implement themed variations of components

8. **StatusBadge.vue**

   - Simple status indicator component
   - Implements color variants for different states (success, warning, etc.)
   - Optional status dot indicator
   - Compact design for dashboard usage

9. **ButtonGroup.vue**

   - Container for grouping related buttons
   - Makes buttons appear connected with shared borders
   - Supports horizontal and vertical orientations
   - Uses scoped styles with :deep() for child button styling

10. **ActionButton.vue**

    - Icon-based action button for dashboard toolbars
    - Minimalist design with hover and focus states
    - Color variants for different action types
    - Optimized for icon-only interactions

11. **Card.vue**

    - Versatile container component with multiple variants
    - Supports header, body, and footer sections
    - Optional title, subtitle, icon, and action slots
    - Customizable padding and compact modes

12. **FeatureBox.vue**

    - Specialized card for featuring capabilities
    - Includes icon, title, and description
    - Hover effects for interactive elements
    - Consistent design with the card system

13. **InfoBox.vue**

    - Alert-style component for contextual messages
    - Color variants for different message types
    - Left border accent for visual distinction
    - Icon support for better visual communication

14. **EmptyState.vue**

    - Component for displaying empty state messages
    - Centralized layout with icon, title, and description
    - Support for action buttons
    - Consistent styling with the application design

15. **DashboardLayout.vue**

    - Main layout container for the application
    - Responsive sidebar with mobile toggle
    - Sticky header with navigation and user controls
    - Content area with customizable slots

16. **NavMenu.vue**

    - Navigation menu for the dashboard sidebar
    - Support for grouped navigation items
    - Active state styling
    - Multi-level navigation with dropdowns

17. **BreadcrumbNav.vue**

    - Breadcrumb navigation component
    - Dynamic trail based on provided items
    - Interactive navigation links
    - Current page indicator

18. **UserInfo.vue**

    - User information display for dashboard sidebar
    - Avatar with fallback to initials
    - User name and role display
    - Menu interaction support

19. **SearchInput.vue**

    - Search input for the dashboard header
    - Icon and placeholder customization
    - Clear button for resetting search
    - Visual feedback for focus states

20. **PageHeader.vue**
    - Page header component for dashboard pages
    - Title and description display
    - Support for action buttons
    - Responsive layout on mobile and desktop

## SCSS Optimization Progress

| SCSS File           | Status            | Notes                               |
| ------------------- | ----------------- | ----------------------------------- |
| `_buttons.scss`     | Ready for removal | All components migrated (100%)      |
| `_cards.scss`       | Ready for removal | All components migrated (100%)      |
| `_dashboard.scss`   | Partial cleanup   | Most components migrated (95%)      |
| `_forms.scss`       | Partial cleanup   | Components partially migrated (73%) |
| `_alerts.scss`      | Partial cleanup   | Components partially migrated (58%) |
| `_navigation.scss`  | Pending           | Not started yet                     |
| `_data-panels.scss` | Pending           | Not started yet                     |

### Cleanup Scripts

We have created several scripts to assist with the SCSS optimization process:

1. **Full Removal Script** - `scripts/clean-scss.sh` ✅

   - Removes fully migrated SCSS files (`_buttons.scss` and `_cards.scss`)
   - Updates imports in `main.scss`
   - Creates backups before removal

2. **Dashboard Layout Cleanup Script** - `scripts/partial-scss-cleanup.sh` ✅
   - Updates partially migrated SCSS files (`_dashboard.scss`)
   - Adds migration status comments
   - Removes migrated sections while retaining necessary styles
   - Creates backups before modification
3. **Forms Cleanup Script** - `scripts/forms-scss-cleanup.sh` ✅

   - Partially cleans up `_forms.scss` (73% migrated)
   - Adds migration status comments
   - Removes migrated sections while retaining necessary styles
   - Creates backups before modification

4. **Alerts Cleanup Script** - `scripts/alerts-scss-cleanup.sh` 🆕
   - Partially cleans up `_alerts.scss` (58% migrated)
   - Adds migration status comments
   - Removes migrated sections (alert container and variants)
   - Retains toast notification styles that still need migration
   - Creates backups before modification

The next focus will be on migrating the remaining form control components and cleaning up `_alerts.scss`.

### Benefits of SCSS Optimization

1. **Reduced Bundle Size** - Eliminates duplicate styles between SCSS and Tailwind
2. **Simplified Maintenance** - Single source of styling truth
3. **Improved Developer Experience** - Consistent styling approach
4. **Better Performance** - Fewer CSS rules to process

## Benefits Realized

- **Reduced CSS bundle size** - Eliminating custom CSS in favor of utility classes
- **Improved consistency** - Using standard Tailwind patterns for common UI elements
- **Better maintainability** - Components are self-contained with all styling defined inline
- **Enhanced developer experience** - More intuitive styling approach with predictable results
- **Future-proof** - Ready for Tailwind CSS v4 upgrades

## Next Steps

1. Continue methodically migrating components by module:

   - Shared components
   - Form components
   - Layout components
   - Module-specific components

2. Refactor global styles:

   - Remove redundant CSS
   - Migrate necessary global styles to Tailwind config
   - Update CSS reset strategies

3. Create automated test workflow:
   - Visual regression tests
   - Style lint checks for Tailwind usage
   - Accessibility validation

## Progress Tracking (20/20 components completed - 100%)

- [x] Form.vue
- [x] ValidationFeedback.vue
- [x] ErrorNotification.vue
- [x] FormField.vue
- [x] BasicsForm.vue
- [x] Button.vue
- [x] TechButton.vue
- [x] StatusBadge.vue
- [x] ButtonGroup.vue
- [x] ActionButton.vue
- [x] Card.vue
- [x] FeatureBox.vue
- [x] InfoBox.vue
- [x] EmptyState.vue
- [x] DashboardLayout.vue
- [x] NavMenu.vue
- [x] BreadcrumbNav.vue
- [x] UserInfo.vue
- [x] SearchInput.vue
- [x] PageHeader.vue
