// Main layout components
export { default as DashboardLayout } from './DashboardLayout.vue';
// DEPRECATED: Utiliser UnifiedNavigation dans components/navigation à la place
export { default as NavMenu } from './NavMenu.vue';
export { default as BreadcrumbNav } from './BreadcrumbNav.vue';
export { default as UserInfo } from './UserInfo.vue';
export { default as SearchInput } from './SearchInput.vue';
export { default as PageHeader } from './PageHeader.vue';
export { default as SectionHeader } from './SectionHeader.vue';
export { default as SectionWrapper } from './SectionWrapper.vue';

// Types
export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  active?: boolean;
  children?: NavItem[];
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  path?: string;
} 