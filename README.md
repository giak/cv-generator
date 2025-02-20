---
title: CV Generator
author: Giak
date: 2025-02-20
status: active
version: 0.1.0
---

# CV Generator

> 💡 **Modern CV builder with JSON Resume support**

## Overview

CV Generator is a modern web application built with Vue 3, TypeScript, and Vite that helps you create professional CVs using the JSON Resume standard. The application features a clean, intuitive interface and supports multiple export formats.

## Tech Stack

- Vue 3 with Composition API
- TypeScript 5.7+
- Vite 6.1
- Tailwind CSS 4
- Vitest for Testing
- Clean Architecture & DDD principles

## Project Structure

```
cv-generator/
├── packages/
│   ├── core/           # Domain & Business Logic
│   │   ├── src/
│   │   │   ├── domain/
│   │   │   │   ├── entities/      # Business objects
│   │   │   │   ├── repositories/   # Repository interfaces
│   │   │   │   └── services/       # Domain services
│   │   │   └── application/
│   │   │       ├── useCases/       # Application use cases
│   │   │       └── services/       # Application services
│   │   └── __tests__/             # Core tests
│   │
│   ├── infrastructure/ # External Integrations
│   │   ├── src/
│   │   │   ├── repositories/       # Repository implementations
│   │   │   ├── services/          # External service integrations
│   │   │   └── adapters/          # External adapters
│   │   └── __tests__/             # Infrastructure tests
│   │
│   ├── shared/         # Shared Types & Utils
│   │   ├── src/
│   │   │   ├── types/             # Shared TypeScript types
│   │   │   ├── utils/             # Shared utilities
│   │   │   └── constants/         # Shared constants
│   │   └── __tests__/             # Shared module tests
│   │
│   └── ui/            # Vue 3 Frontend App
│       ├── src/
│       │   ├── assets/            # Static assets
│       │   ├── components/        # Shared components
│       │   ├── modules/           # Feature modules
│       │   │   └── cv/
│       │   │       ├── domain/    # Module-specific domain
│       │   │       ├── application/# Module-specific logic
│       │   │       └── presentation/# UI components
│       │   ├── stores/            # Pinia stores
│       │   └── types/             # UI-specific types
│       ├── e2e/                   # E2E tests
│       └── __tests__/             # Unit tests
│
├── docs/              # Project Documentation
│   ├── architecture/  # Architecture decisions
│   ├── api/          # API documentation
│   └── guides/       # Development guides
│
└── .github/          # GitHub Actions & Config
    ├── workflows/    # CI/CD pipelines
    └── environments/ # Environment configs
```

## Architecture

```mermaid
---
title: CV Generator Clean Architecture
---
graph TD
    subgraph "UI Layer"
        A1[Vue Components]
        A2[Stores]
        A3[Pages]
    end

    subgraph "Application Layer"
        B1[Use Cases]
        B2[Services]
        B3[DTOs]
    end

    subgraph "Domain Layer"
        C1[Entities]
        C2[Value Objects]
        C3[Repository Interfaces]
        C4[Domain Services]
    end

    subgraph "Infrastructure Layer"
        D1[Repositories]
        D2[External Services]
        D3[Adapters]
    end

    %% UI Layer Dependencies
    A1 --> A2
    A2 --> B1
    A3 --> A1

    %% Application Layer Dependencies
    B1 --> C1
    B1 --> C3
    B2 --> C4

    %% Domain Layer Dependencies
    C1 --> C2
    C3 --> C1
    C4 --> C1

    %% Infrastructure Layer Dependencies
    D1 --> C3
    D2 --> B2
    D3 --> D2
```

### Key Principles

1. **Clean Architecture**

   - Independent of frameworks
   - Testable by design
   - Independent of UI
   - Independent of database
   - Independent of external services

2. **Domain-Driven Design**

   - Rich domain model
   - Encapsulated business logic
   - Ubiquitous language
   - Bounded contexts

3. **SOLID Principles**

   - Single Responsibility
   - Open/Closed
   - Liskov Substitution
   - Interface Segregation
   - Dependency Inversion

4. **Testing Strategy**
   - Unit tests for domain logic
   - Integration tests for repositories
   - E2E tests for critical paths
   - Component tests for UI

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cv-generator.git

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Development Commands

| Command         | Description              |
| :-------------- | :----------------------- |
| `pnpm dev`      | Start development server |
| `pnpm build`    | Build for production     |
| `pnpm test`     | Run unit tests           |
| `pnpm test:e2e` | Run end-to-end tests     |
| `pnpm lint`     | Lint code                |
| `pnpm format`   | Format code              |

## Features

- 📝 JSON Resume format support
- 🎨 Modern, responsive design
- 📤 Multiple export formats
- 🔄 Real-time preview
- 💾 Local storage support
- 🌐 Offline capabilities

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

> ℹ️ **Note:** Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [JSON Resume](https://jsonresume.org/) for the CV schema standard
- [Vue.js](https://vuejs.org/) for the excellent framework
- [Vite](https://vitejs.dev/) for the blazing fast build tool
