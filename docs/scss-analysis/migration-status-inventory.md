# SCSS to Tailwind Migration Status Inventory

This document provides a comprehensive mapping of SCSS styles to their Tailwind component implementations.

## Component Styles

### Buttons (`_buttons.scss`)

| SCSS Class/Selector | Migration Status | Tailwind Component | Notes                                   |
| ------------------- | ---------------- | ------------------ | --------------------------------------- |
| `.btn`              | ✅ Completed     | `Button.vue`       | Base button styles                      |
| `.btn-primary`      | ✅ Completed     | `Button.vue`       | Primary variant with appropriate colors |
| `.btn-secondary`    | ✅ Completed     | `Button.vue`       | Secondary variant with muted styling    |
| `.btn-success`      | ✅ Completed     | `Button.vue`       | Success variant with green styling      |
| `.btn-danger`       | ✅ Completed     | `Button.vue`       | Danger variant with red styling         |
| `.btn-warning`      | ✅ Completed     | `Button.vue`       | Warning variant with yellow styling     |
| `.btn-info`         | ✅ Completed     | `Button.vue`       | Info variant with blue styling          |
| `.btn-sm`           | ✅ Completed     | `Button.vue`       | Small size variant                      |
| `.btn-lg`           | ✅ Completed     | `Button.vue`       | Large size variant                      |
| `.btn-icon`         | ✅ Completed     | `Button.vue`       | Button with icon styling                |
| `.btn-text`         | ✅ Completed     | `Button.vue`       | Text within button                      |
| `.btn-disabled`     | ✅ Completed     | `Button.vue`       | Disabled state styling                  |
| `.btn-loading`      | ✅ Completed     | `Button.vue`       | Loading state with spinner              |
| `.btn-outline`      | ✅ Completed     | `Button.vue`       | Outline variant with border             |
| `.btn-ghost`        | ✅ Completed     | `Button.vue`       | Ghost variant without background        |
| `.btn-link`         | ✅ Completed     | `Button.vue`       | Link-style button                       |
| `.tech-btn`         | ✅ Completed     | `TechButton.vue`   | Technical dashboard button              |
| `.action-btn`       | ✅ Completed     | `ActionButton.vue` | Action button with icon                 |
| `.btn-group`        | ✅ Completed     | `ButtonGroup.vue`  | Button group container                  |

### Cards (`_cards.scss`)

| SCSS Class/Selector        | Migration Status | Tailwind Component | Notes                      |
| -------------------------- | ---------------- | ------------------ | -------------------------- |
| `.card`                    | ✅ Completed     | `Card.vue`         | Base card container        |
| `.card-header`             | ✅ Completed     | `Card.vue`         | Card header section        |
| `.card-title`              | ✅ Completed     | `Card.vue`         | Card title styling         |
| `.card-subtitle`           | ✅ Completed     | `Card.vue`         | Card subtitle styling      |
| `.card-body`               | ✅ Completed     | `Card.vue`         | Card body/content area     |
| `.card-footer`             | ✅ Completed     | `Card.vue`         | Card footer section        |
| `.card-compact`            | ✅ Completed     | `Card.vue`         | Compact card variant       |
| `.card-hoverable`          | ✅ Completed     | `Card.vue`         | Hover effects for cards    |
| `.feature-box`             | ✅ Completed     | `FeatureBox.vue`   | Feature highlight box      |
| `.feature-icon`            | ✅ Completed     | `FeatureBox.vue`   | Feature icon styling       |
| `.feature-title`           | ✅ Completed     | `FeatureBox.vue`   | Feature title styling      |
| `.feature-description`     | ✅ Completed     | `FeatureBox.vue`   | Feature description text   |
| `.info-box`                | ✅ Completed     | `InfoBox.vue`      | Information box container  |
| `.info-box-primary`        | ✅ Completed     | `InfoBox.vue`      | Primary variant            |
| `.info-box-success`        | ✅ Completed     | `InfoBox.vue`      | Success variant            |
| `.info-box-warning`        | ✅ Completed     | `InfoBox.vue`      | Warning variant            |
| `.info-box-error`          | ✅ Completed     | `InfoBox.vue`      | Error variant              |
| `.info-box-icon`           | ✅ Completed     | `InfoBox.vue`      | Icon within info box       |
| `.empty-state`             | ✅ Completed     | `EmptyState.vue`   | Empty state container      |
| `.empty-state-icon`        | ✅ Completed     | `EmptyState.vue`   | Empty state icon           |
| `.empty-state-title`       | ✅ Completed     | `EmptyState.vue`   | Empty state title          |
| `.empty-state-description` | ✅ Completed     | `EmptyState.vue`   | Empty state description    |
| `.empty-state-actions`     | ✅ Completed     | `EmptyState.vue`   | Empty state action buttons |

### Forms (`_forms.scss`)

| SCSS Class/Selector | Migration Status | Tailwind Component       | Notes                    |
| ------------------- | ---------------- | ------------------------ | ------------------------ |
| `.form-control`     | ✅ Completed     | `FormField.vue`          | Form control wrapper     |
| `.form-group`       | ✅ Completed     | `FormField.vue`          | Form group container     |
| `.form-label`       | ✅ Completed     | `FormField.vue`          | Form label styling       |
| `.form-input`       | ✅ Completed     | `FormField.vue`          | Input field styling      |
| `.form-select`      | ✅ Completed     | `FormField.vue`          | Select field styling     |
| `.form-textarea`    | ✅ Completed     | `FormField.vue`          | Textarea styling         |
| `.form-checkbox`    | 🔄 In Progress   | -                        | Checkbox styling         |
| `.form-radio`       | 🔄 In Progress   | -                        | Radio button styling     |
| `.form-switch`      | 🔄 In Progress   | -                        | Toggle switch styling    |
| `.form-error`       | ✅ Completed     | `ValidationFeedback.vue` | Form error state         |
| `.form-helper`      | ✅ Completed     | `FormField.vue`          | Helper text below inputs |

### Alerts (`_alerts.scss`)

| SCSS Class/Selector  | Migration Status | Tailwind Component      | Notes                                 |
| -------------------- | ---------------- | ----------------------- | ------------------------------------- |
| `.alert`             | ✅ Completed     | `ErrorNotification.vue` | Base alert container                  |
| `.alert-success`     | ✅ Completed     | `ErrorNotification.vue` | Success alert variant                 |
| `.alert-warning`     | ✅ Completed     | `ErrorNotification.vue` | Warning alert variant                 |
| `.alert-error`       | ✅ Completed     | `ErrorNotification.vue` | Error alert variant                   |
| `.alert-info`        | ✅ Completed     | `ErrorNotification.vue` | Info alert variant                    |
| `.alert-dismissible` | ✅ Completed     | `ErrorNotification.vue` | Dismissible alert with close button   |
| `.alert-icon`        | ✅ Completed     | `ErrorNotification.vue` | Alert with icon                       |
| `.toast`             | ✅ Completed     | `Toast.vue`             | Toast notification container          |
| `.toast-success`     | ✅ Completed     | `Toast.vue`             | Success toast variant                 |
| `.toast-warning`     | ✅ Completed     | `Toast.vue`             | Warning toast variant                 |
| `.toast-error`       | ✅ Completed     | `Toast.vue`             | Error toast variant                   |
| `.toast-info`        | ✅ Completed     | `Toast.vue`             | Info toast variant                    |
| `.toast-container`   | ✅ Completed     | `ToastContainer.vue`    | Container for positioning toast items |

## Layout Styles

### Dashboard (`_dashboard.scss`)

| SCSS Class/Selector  | Migration Status | Tailwind Component    | Notes                                |
| -------------------- | ---------------- | --------------------- | ------------------------------------ |
| `.dashboard`         | ✅ Completed     | `DashboardLayout.vue` | Main dashboard container             |
| `.dashboard-sidebar` | ✅ Completed     | `DashboardLayout.vue` | Dashboard sidebar                    |
| `.sidebar-header`    | ✅ Completed     | `DashboardLayout.vue` | Sidebar header with logo             |
| `.sidebar-content`   | ✅ Completed     | `DashboardLayout.vue` | Sidebar content area                 |
| `.sidebar-footer`    | ✅ Completed     | `DashboardLayout.vue` | Sidebar footer                       |
| `.dashboard-content` | ⚠️ Partial       | `DashboardLayout.vue` | Main content area - some styles kept |
| `.dashboard-header`  | ✅ Completed     | `DashboardLayout.vue` | Dashboard header area                |
| `.nav-menu`          | ✅ Completed     | `NavMenu.vue`         | Navigation menu                      |
| `.nav-group`         | ✅ Completed     | `NavMenu.vue`         | Navigation group                     |
| `.nav-item`          | ✅ Completed     | `NavMenu.vue`         | Navigation item                      |
| `.nav-link`          | ✅ Completed     | `NavMenu.vue`         | Navigation link                      |
| `.nav-icon`          | ✅ Completed     | `NavMenu.vue`         | Navigation icon                      |
| `.breadcrumb`        | ✅ Completed     | `BreadcrumbNav.vue`   | Breadcrumb container                 |
| `.breadcrumb-item`   | ✅ Completed     | `BreadcrumbNav.vue`   | Breadcrumb item                      |
| `.user-info`         | ✅ Completed     | `UserInfo.vue`        | User info container                  |
| `.user-avatar`       | ✅ Completed     | `UserInfo.vue`        | User avatar                          |
| `.user-details`      | ✅ Completed     | `UserInfo.vue`        | User name and role                   |
| `.search-input`      | ✅ Completed     | `SearchInput.vue`     | Search input container               |
| `.page-header`       | ✅ Completed     | `PageHeader.vue`      | Page header container                |
| `.page-title`        | ✅ Completed     | `PageHeader.vue`      | Page title                           |
| `.page-description`  | ✅ Completed     | `PageHeader.vue`      | Page description                     |
| `.page-actions`      | ✅ Completed     | `PageHeader.vue`      | Page action buttons                  |

### Navigation (`_navigation.scss`)

| SCSS Class/Selector | Migration Status | Tailwind Component | Notes                                |
| ------------------- | ---------------- | ------------------ | ------------------------------------ |
| `.tabs`             | 🔄 In Progress   | -                  | Tab container                        |
| `.tab`              | 🔄 In Progress   | -                  | Individual tab                       |
| `.tab-active`       | 🔄 In Progress   | -                  | Active tab state                     |
| `.tab-content`      | 🔄 In Progress   | -                  | Tab content area                     |
| `.tab-panel`        | 🔄 In Progress   | -                  | Tab panel                            |
| `.dropdown`         | 🔄 In Progress   | -                  | Dropdown container                   |
| `.dropdown-trigger` | 🔄 In Progress   | -                  | Dropdown trigger                     |
| `.dropdown-menu`    | 🔄 In Progress   | -                  | Dropdown menu                        |
| `.dropdown-item`    | 🔄 In Progress   | -                  | Dropdown item                        |
| `.pagination`       | 🔄 In Progress   | -                  | Pagination container                 |
| `.page-item`        | 🔄 In Progress   | -                  | Pagination item                      |
| `.page-link`        | 🔄 In Progress   | -                  | Pagination link                      |
| `.steps`            | 🔄 In Progress   | -                  | Steps container for multi-step forms |
| `.step`             | 🔄 In Progress   | -                  | Individual step                      |
| `.step-active`      | 🔄 In Progress   | -                  | Active step                          |
| `.step-completed`   | 🔄 In Progress   | -                  | Completed step                       |

### Data Panels (`_data-panels.scss`)

| SCSS Class/Selector | Migration Status | Tailwind Component | Notes                |
| ------------------- | ---------------- | ------------------ | -------------------- |
| `.data-table`       | 🔄 In Progress   | -                  | Data table container |
| `.table-header`     | 🔄 In Progress   | -                  | Table header         |
| `.table-body`       | 🔄 In Progress   | -                  | Table body           |
| `.table-row`        | 🔄 In Progress   | -                  | Table row            |
| `.table-cell`       | 🔄 In Progress   | -                  | Table cell           |
| `.table-pagination` | 🔄 In Progress   | -                  | Table pagination     |
| `.table-empty`      | 🔄 In Progress   | -                  | Empty table state    |
| `.data-list`        | 🔄 In Progress   | -                  | Data list container  |
| `.list-item`        | 🔄 In Progress   | -                  | List item            |
| `.list-header`      | 🔄 In Progress   | -                  | List header          |
| `.list-footer`      | 🔄 In Progress   | -                  | List footer          |
| `.grid-view`        | 🔄 In Progress   | -                  | Grid view for data   |
| `.grid-item`        | 🔄 In Progress   | -                  | Grid item            |
| `.stat-card`        | 🔄 In Progress   | -                  | Statistic card       |
| `.stat-value`       | 🔄 In Progress   | -                  | Statistic value      |
| `.stat-label`       | 🔄 In Progress   | -                  | Statistic label      |
| `.stat-icon`        | 🔄 In Progress   | -                  | Statistic icon       |

## Migration Progress Summary

| SCSS File           | Total Classes | Migrated Classes | Progress   |
| ------------------- | ------------- | ---------------- | ---------- |
| `_buttons.scss`     | 19            | 19               | 100% ✅    |
| `_cards.scss`       | 23            | 23               | 100% ✅    |
| `_forms.scss`       | 11            | 8                | 73% 🔄     |
| `_alerts.scss`      | 13            | 13               | 100% ✅    |
| `_dashboard.scss`   | 21            | 20               | 95% ⚠️     |
| `_navigation.scss`  | 16            | 0                | 0% 🔄      |
| `_data-panels.scss` | 17            | 0                | 0% 🔄      |
| **Total**           | **120**       | **83**           | **69%** 🔄 |

## Next Steps

Based on this inventory, the following SCSS files should be prioritized:

1. **Ready for removal:**

   - `_buttons.scss` (100% migrated)
   - `_cards.scss` (100% migrated)
   - `_alerts.scss` (100% migrated)

2. **Partial cleanup needed:**

   - `_dashboard.scss` (95% migrated, needs partial cleanup)
   - `_forms.scss` (73% migrated, needs partial cleanup)

3. **Not yet started:**
   - `_navigation.scss` (0% migrated)
   - `_data-panels.scss` (0% migrated)

## Migration Velocity

Based on current progress:

- **83 of 120** styles have been migrated (69%)
- **3 of 7** SCSS files are ready for removal
- **2 of 7** SCSS files are ready for partial cleanup
- Approximately **31%** of styles remain to be migrated
