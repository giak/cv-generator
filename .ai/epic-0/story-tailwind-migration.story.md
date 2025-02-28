# Epic-0: Project Maintenance and Optimization

# Story-2: Tailwind CSS Migration (v3.4.0 to v4.0.0)

## Story Description

**As a** developer  
**I want** to migrate the project from Tailwind CSS v3.4.0 to v4.0.0  
**so that** we can benefit from the latest features, performance improvements, and better alignment with our design system

## Status

Draft

## Context

The CV Generator application currently uses Tailwind CSS v3.4.0 for styling. Tailwind CSS v4.0.0 introduces significant improvements in performance, features, and developer experience. This migration will help us stay current with the ecosystem and take advantage of new capabilities.

The migration includes updating dependencies, adapting configurations, and ensuring our custom components and styles work correctly with the new version. We also need to address the mixed usage of SCSS and Tailwind utility classes, moving toward a more consistent approach as outlined in our @2001-tailwind-vue3.mdc standards.

### Technical Context

- Current: Tailwind CSS v3.4.0
- Target: Tailwind CSS v4.0.0
- Related dependencies: PostCSS, Autoprefixer, Tailwind plugins
- UI components using Tailwind classes
- Custom SCSS with @apply directives
- Custom Tailwind configuration for our design system

### Business Drivers

- Improved performance for better user experience
- Enhanced developer productivity with new Tailwind features
- Better maintainability through consistent styling approach
- Future-proofing the application against CSS ecosystem changes
- Alignment with design system requirements

## Estimation

Story Points: 2 (2 days of human development or 20 minutes of AI/human collaboration)

## Tasks

### 1. - [ ] Pre-Migration Analysis

1.  - [ ] Create inventory of custom Tailwind configurations
2.  - [ ] Identify breaking changes in v4 that affect our codebase
3.  - [ ] Evaluate current SCSS usage and plan for harmonization
4.  - [ ] Audit plugins and extensions for v4 compatibility
5.  - [ ] Create snapshot of current UI for visual regression testing

### 2. - [ ] Dependency Updates

1.  - [ ] Update Tailwind CSS from v3.4.0 to v4.0.0
2.  - [ ] Update PostCSS and Autoprefixer to compatible versions
3.  - [ ] Update Tailwind plugins (@tailwindcss/forms, @tailwindcss/typography)
4.  - [ ] Adapt Tailwind configuration to v4 format
5.  - [ ] Update build configuration in Vite

### 3. - [ ] Configuration Adaptation

1.  - [ ] Migrate tailwind.config.ts to v4 format
2.  - [ ] Update color palette definitions to RGB format
3.  - [ ] Refine typography configuration
4.  - [ ] Adapt custom plugins to v4 API
5.  - [ ] Update responsive breakpoints if needed

### 4. - [ ] SCSS Harmonization

1.  - [ ] Identify SCSS files that need conversion
2.  - [ ] Rewrite custom CSS to use Tailwind utilities
3.  - [ ] Update @apply usage to match v4 syntax
4.  - [ ] Convert direct color usage to Tailwind color classes
5.  - [ ] Refactor media queries to use Tailwind responsive modifiers

### 5. - [ ] Component Updates

1.  - [ ] Update base components with new v4 patterns
2.  - [ ] Refactor form components to use consistent Tailwind approach
3.  - [ ] Fix any deprecated classes or syntax
4.  - [ ] Implement new v4 features where beneficial
5.  - [ ] Update dark mode implementation if needed

### 6. - [ ] Testing and Verification

1.  - [ ] Perform visual regression testing against snapshots
2.  - [ ] Verify responsive behavior across breakpoints
3.  - [ ] Test dark mode functionality
4.  - [ ] Validate accessibility with updated styles
5.  - [ ] Check bundle size and performance metrics

## Constraints

- Must maintain visual consistency with current design
- Cannot increase bundle size significantly
- Must maintain or improve performance metrics
- All components must remain responsive
- Accessibility standards must be maintained or improved
- Dark mode must continue to function correctly

## Structure

The migration primarily affects the UI package:

```
packages/ui/
├── src/
│   ├── assets/
│   │   └── styles/               # Main style directory to update
│   │       ├── main.scss         # Main entry point
│   │       ├── base/             # Base styles to convert
│   │       ├── components/       # Component styles to harmonize
│   │       └── themes/           # Theme definitions to update
│   ├── components/               # Components using Tailwind classes
│   └── modules/                  # Feature-specific components
├── tailwind.config.ts            # Main configuration file to update
└── postcss.config.js             # PostCSS configuration
```

## Dev Notes

### Migration Strategy

#### Approach to CSS Variables

Tailwind CSS v4 has enhanced support for CSS variables, particularly for colors. We'll update our approach to:

```css
/* Before */
:root {
  --color-primary: #06b6d4;
}

/* After */
:root {
  --color-primary-rgb: 6 182 212;
}

/* Usage */
.custom-element {
  color: rgb(var(--color-primary-rgb));
  /* Instead of color: var(--color-primary); */
}
```

#### Class Organization Pattern

When applying Tailwind classes, we'll follow this organization:

1. Layout (display, position)
2. Box model (width, height, padding, margin)
3. Typography (font, text)
4. Visual (colors, backgrounds)
5. Interactive (hover, focus)
6. Miscellaneous

Example:

```html
<div
  class="
  /* Layout */
  flex flex-col md:flex-row
  /* Box model */
  w-full max-w-lg p-4 m-2
  /* Typography */
  text-base font-medium
  /* Visual */
  bg-white dark:bg-neutral-800 rounded-lg
  /* Interactive */
  hover:bg-neutral-50 dark:hover:bg-neutral-700
"
>
  Content
</div>
```

#### Key Changes in Tailwind v4

- Improved color opacity syntax
- Enhanced arbitrary value support
- More consistent responsive design patterns
- Better dark mode implementation
- New CSS variables approach

### Performance Benefits

- Reduced CSS bundle size
- Faster JIT compilation
- Improved rendering performance
- Better browser support
- Reduced specificity issues

## Next Actions (Prioritized)

1. Create dependency update plan with exact version numbers
2. Update tailwind.config.ts with v4 format
3. Migrate color system to RGB format
4. Update base components for consistent styling
5. Create test plan for visual regression testing
