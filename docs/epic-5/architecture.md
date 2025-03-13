# CV Generator Architecture

## Overview

The CV Generator application follows Clean Architecture principles, organizing code into distinct layers with clear responsibilities. This document outlines the high-level architecture and key components of the system.

## Package Structure

The application is organized as a monorepo with the following packages:

- **@cv-generator/core**: Contains domain entities, use cases, and port interfaces
- **@cv-generator/infrastructure**: Contains adapters for external services and infrastructure concerns
- **@cv-generator/shared**: Contains shared utilities, constants, and types
- **@cv-generator/ui**: Contains the Vue.js user interface components and adapters

## Internationalization (i18n) Architecture

The i18n system follows Clean Architecture principles, ensuring that the domain logic remains independent of the specific i18n implementation.

### Key Components

1. **Domain Port Interface** (`@cv-generator/core`):

   - Defines the contract for i18n functionality
   - Allows domain logic to use translations without depending on specific implementations

2. **Shared Constants** (`@cv-generator/shared`):

   - Translation keys organized by domain/feature
   - Supported locales configuration
   - Type definitions for locales

3. **Vue I18n Adapter** (`@cv-generator/ui`):
   - Implements the domain port interface using Vue I18n
   - Isolates the Vue I18n implementation from the domain
   - Provides composables for easy access in components

### Benefits

- **Separation of Concerns**: Domain logic is independent of the i18n implementation
- **Testability**: Each component can be tested in isolation
- **Maintainability**: Changes to the i18n library don't affect the domain
- **Type Safety**: TypeScript ensures type safety throughout the i18n system

For detailed information about the i18n architecture, see [i18n Architecture Documentation](./i18n-architecture.md).

## Other Architectural Components

(Additional architectural components will be documented here as they are implemented)
