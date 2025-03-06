/**
 * Navigation components
 * Ces composants gèrent la navigation et les transitions entre différentes vues
 */

export { default as TabNav } from './TabNav.vue';
export { default as TabNavItem } from './TabNavItem.vue';
export { default as TabContent } from './TabContent.vue';
export { default as FormNavigation } from './FormNavigation.vue';
export { default as UnifiedNavigation } from './UnifiedNavigation.vue';

// Note: Vue 3 with TypeScript doesn't easily allow exporting interfaces from SFC
// Type imports should be done directly from the component file 