---
title: "Project Foundation - CV Generator"
version: "1.1.0"
description: "Technical foundation document for the CV Generator application with JSON Resume standard support"
lastUpdated: "2024-07-05"
tags:
  [
    "project-setup",
    "architecture",
    "technical-stack",
    "foundation",
    "json-resume",
    "monorepo",
    "pnpm-workspace",
    "i18n",
  ]
---

# 🏗️ Project Foundation - CV Generator

## 1️⃣ General Information

- **Project Name**: CV Generator
- **Technical Description**: Modern web application for creating, editing and exporting CVs conforming to the JSON Resume standard (https://jsonresume.org/schema/) with a clean and maintainable frontend architecture based on a PNPM monorepo.
- **Category**: Web (Frontend)
- **Expected Scale**: Lightweight application intended for individual users, with an estimated few thousand monthly active users.
- **Key Constraints**:
  - Client-side only functionality without backend
  - Data persistence via localStorage
  - Performance (response time < 500ms)
  - Compatibility with modern browsers
  - Accessibility (WCAG 2.1 AA)
  - Offline functionality
  - Support for export in JSON compliant with JSON Resume standard
  - Support for additional exports in HTML and PDF
  - Easy maintenance through monorepo architecture
  - Complete internationalization (i18n) with multi-language support

## 2️⃣ Technical Vision & Objectives

- **Technical Vision**: Create a lightweight and efficient web application that provides a smooth user experience for CV editing, with a robust architecture based on Clean Architecture principles, allowing for long-term evolution and maintenance. The application must produce CVs conforming to the JSON Resume standard to ensure interoperability with other tools and services.
- **Technical Objectives**:
  - Implement a clean and modular architecture to facilitate maintenance and evolution
  - Structure the project as a monorepo with well-defined packages and clear responsibilities
  - Provide real-time data validation to guide the user
  - Guarantee optimal performance even on low-power devices
  - Enable CV export in different formats (JSON standard-compliant, HTML, PDF)
  - Ensure full compatibility with the JSON Resume standard (https://jsonresume.org/schema/)
  - Provide ATS optimization tips for users
  - Support complete application internationalization to reach a global audience
- **Guiding Principles**:
  - **Separation of Concerns**: Clear organization of layers according to Clean Architecture
  - **Rich Entities**: Business logic encapsulated in domain entities
  - **SOLID**: Systematic application of SOLID principles
  - **Immutability**: Use of immutable data structures for better state management
  - **Simplicity**: Priority to simple and direct solutions
  - **Multi-level Validation**: Validation in both UI and domain
  - **Interoperability**: Strict adherence to the JSON Resume standard
  - **Modularity**: Organization of packages with clear responsibilities and minimal dependencies
  - **Native Internationalization**: Architecture designed for i18n from the start

## 3️⃣ Technology Stack

- **Frontend**:

  - Framework: Vue.js 3.4+
  - Language: TypeScript 5.7+
  - Main Libraries:
    - Pinia 2.3+ (state management)
    - Vue Router 4.2+ (navigation)
    - Vue I18n 11.0+ (internationalization)
    - Tailwind CSS 3.4+ (styling)
    - Zod 3.22+ (JSON Resume schema validation)
    - Heroicons Vue 2.2+ (icons)
    - Lodash-es 4.17+ (utilities)
  - Build Tools:
    - Vite 6.2+ (bundling and dev server)
    - Biome 1.9+ (linting and formatting)
    - TypeScript (type checking)

- **Backend**:

  - N/A (frontend-only application)

- **Data**:

  - Persistence: localStorage (client-side storage)
  - Format: JSON Resume standard (https://jsonresume.org/schema/)
  - Migration Strategy: Automatic data update in case of schema evolution
  - Caching Strategy: Automatic caching via localStorage

- **Infrastructure**:

  - Hosting Environment: Static service (GitHub Pages, Netlify, Vercel)
  - Containerization: Docker for development and deployment
  - CI/CD: GitHub Actions
  - Monorepo: PNPM Workspace with isolated packages for each layer

- **Monitoring & Observability**:
  - Logging: Console only (frontend application)
  - Monitoring: N/A for MVP (potential later addition of anonymized analytics)
  - Analytics: N/A for MVP
  - Tests: Vitest for unit tests, Playwright for E2E tests

## 4️⃣ Fundamental Architecture

- **Architectural Pattern**: Simplified Clean Architecture, PNPM monorepo with package structure
- **Functional Breakdown**:

  - **@cv-generator/core**: Domain entities (Resume, Work, Education, etc.) and use cases based on the JSON Resume standard
  - **@cv-generator/ui**: User interface components, pages and stores (presentation)
  - **@cv-generator/infrastructure**: Concrete implementations for localStorage and exports
  - **@cv-generator/shared**: Shared types and utilities, including Zod validation schemas for the JSON Resume format

- **Monorepo Organization**:

  ```
  cv-generator/
  ├── packages/
  │   ├── core/           # Business logic, entities and use cases
  │   │   └── src/
  │   │       └── shared/
  │   │           └── i18n/  # Internationalization port for the domain
  │   ├── infrastructure/ # Concrete implementations (localStorage, exports)
  │   ├── shared/         # Types, constants and shared utilities
  │   │   └── src/
  │   │       ├── constants/
  │   │       │   └── error-codes.const.ts  # Existing error codes
  │   │       └── i18n/
  │   │           └── keys/  # Centralized translation keys
  │   └── ui/             # Vue.js user interface
  │       └── src/
  │           ├── i18n/   # Vue I18n configuration and adapters
  │           └── locales/  # Translation files by language
  ├── pnpm-workspace.yaml # Workspace configuration
  └── package.json        # Root scripts and dependencies
  ```

- **Internationalization Architecture**:

  Internationalization follows Clean Architecture principles:

  1. **@cv-generator/shared**: Contains centralized translation keys
  2. **@cv-generator/core**: Defines an agnostic internationalization port
  3. **@cv-generator/ui**: Implements a Vue I18n adapter that connects the UI to the core

  This approach allows the domain to remain isolated while benefiting from i18n features.

- **Main Data Flows**:

  1. **CV Creation/Editing**:

     - User interacts with UI forms (@cv-generator/ui)
     - Vue.js composables call use cases (@cv-generator/core)
     - Domain entities validate and encapsulate logic according to the JSON Resume standard
     - Data is persisted in localStorage via repository (@cv-generator/infrastructure)

  2. **CV Export**:

     - User requests an export (JSON, HTML or PDF)
     - Application prepares and formats the data according to the format
     - For JSON export, the application checks compliance with the JSON Resume standard
     - The file is generated and offered for download (@cv-generator/infrastructure)

  3. **ATS Optimization**:

     - Application analyzes the CV content
     - Real-time optimization tips are displayed
     - An ATS readability score is calculated

  4. **Internationalization**:
     - UI texts use the Vue I18n plugin via `$t('key')`
     - Domain error messages use keys defined in shared
     - An adapter passes translations from the UI to the domain via the internationalization port

- **External Integration Points**:
  - Ability to import CVs in standard JSON Resume format from other tools
  - Ability to export CVs in standard JSON Resume format for use in other services

## 5️⃣ Development Principles

- **Code Standards**:

  - Naming conventions:
    - PascalCase for components, interfaces and types
    - camelCase for variables, functions and properties
    - UPPER_CASE for constants
    - kebab-case for files and folders (except Vue components)
  - Biome for code quality and formatting
  - Systematic use of TypeScript types
  - JSDoc documentation for public APIs
  - Preferred immutability
  - Composition API for Vue components

- **Internationalization**:

  - Centralization of translation keys in @cv-generator/shared
  - Separation of messages by functional domain (ui, validation, etc.)
  - Use of the Adapter pattern to isolate the domain from the Vue I18n implementation
  - Support for pluralization and variables in messages
  - Automatic detection of browser language
  - Saving user language preference

- **Testing Strategy**:

  - Unit tests with Vitest for business logic (@cv-generator/core)
  - Component tests for the UI with Testing Library (@cv-generator/ui)
  - E2E tests for complete user flows with Playwright
  - Automatic validation of JSON Resume format in tests
  - Minimum coverage: 80% for core, 70% for UI
  - Translation tests to verify completeness and consistency

- **Collaboration Model**:

  - GitHub Flow (branching model)
  - Pull Requests with at least one approver
  - Continuous integration (CI/CD)
  - Conventional commits (enforced via Husky)
  - Systematic code review

- **Documentation**:
  - Complete README with installation guide and usage
  - Architecture documentation (Clean Architecture)
  - Documentation of data structures according to the JSON Resume standard
  - JSDoc for public APIs
  - Automatically maintained changelog
  - Internationalization guide for new developers

## 6️⃣ Implementation Plan

- **Technical Phases**:

  1. **MVP (1-2 weeks)**:

     - Setup of PNPM monorepo structure with essential packages
     - Complete implementation of the JSON Resume standard schema
     - Basic editing forms
     - localStorage storage
     - JSON export conforming to the JSON Resume standard
     - Complete schema validation

  2. **UX Improvements and export formats (2-3 weeks)**:

     - User interface improvement
     - Complete form validation
     - CV preview
     - HTML and PDF export
     - Basic ATS tips
     - Import of existing JSON Resume files

  3. **Internationalization (1-2 weeks)**:

     - Vue I18n integration
     - Extraction of all hardcoded text to translation files
     - Creation of internationalization architecture (port/adapter)
     - Initial French/English support
     - Translation tests

  4. **Refinement (2 weeks)**:
     - Improvements based on user feedback
     - Performance optimization
     - Enhanced ATS tips
     - User testing and final adjustments
     - Enhanced compatibility with other tools in the JSON Resume ecosystem

- **Technical Priorities**:

  - **High**: Monorepo structure, core conforming to JSON Resume, complete schema validation, localStorage storage, standard JSON export
  - **Medium**: UI/UX, CV preview, HTML/PDF export, basic ATS tips, import of existing CVs, internationalization
  - **Low**: UI animations, template customization, usage analytics, additional languages

- **Proof of Concepts**:
  - POC for client-side PDF generation
  - POC for performance optimization with large CVs
  - POC for complete JSON Resume schema validation
  - POC for internationalization architecture conforming to Clean Architecture

## 7️⃣ Risks and Mitigations

- **Technical Risks**:

  1. **localStorage Limitations**:

     - Risk: Limited storage capacity for large CVs
     - Mitigation: Data compression, JSON export for external backup

  2. **PDF Export Performance**:

     - Risk: Potentially slow PDF generation time on weak devices
     - Mitigation: Rendering optimization, visual feedback, asynchronous generation

  3. **Browser Compatibility**:

     - Risk: Feature divergence between browsers
     - Mitigation: Cross-browser testing, polyfills, feature detection

  4. **JSON Resume Standard Evolution**:

     - Risk: The standard could evolve and require adaptations
     - Mitigation: Modular architecture allowing easy updates, data migration system

  5. **Offline Experience**:

     - Risk: Limited functionality in offline mode
     - Mitigation: PWA architecture, intelligent synchronization, explicit offline mode

  6. **Monorepo Complexity**:

     - Risk: Complex dependency management and integration
     - Mitigation: Automation scripts, robust CI/CD, clear documentation

  7. **Translation Consistency**:

     - Risk: Inconsistency of messages between layers and incomplete translations
     - Mitigation: Centralization of keys, automatic validation of translation completeness, dedicated tests

  8. **Clean Architecture Principles Violation with i18n**:
     - Risk: The domain could become dependent on the Vue I18n framework
     - Mitigation: Use of the Adapter pattern, abstract port interface in the domain

- **Mitigation Strategies**:

  - Extensive automated tests
  - Performance monitoring
  - Early detection of incompatibilities
  - Regular monitoring of JSON Resume standard evolution
  - Proactive user feedback
  - Complete architecture and development documentation
  - Automatic checking of translation consistency

- **Alternatives Considered**:
  - Architecture with lightweight backend (rejected to favor simplicity and offline operation)
  - Use of IndexedDB database (kept as a future option if localStorage becomes limiting)
  - React framework (Vue.js preferred for its simplicity and Composition API)
  - Proprietary CV format (rejected in favor of the open JSON Resume standard)
  - Multirepo structure (rejected in favor of monorepo for consistency and ease of development)
  - i18next library (rejected in favor of Vue I18n for better Vue.js integration)
