# Epic-0: Project Maintenance and Optimization

# Story-4: Improve Test Coverage and TDD Implementation

## Story Description

**As a** developer  
**I want** to improve test coverage across all packages and enforce proper TDD workflow  
**so that** we can ensure code quality, catch regressions early, and provide a solid foundation for future development

## Status

Draft

## Context

While the CV Generator project has established a testing infrastructure with Vitest, the current test coverage is inconsistent across packages. Some core domain logic has good coverage, but UI components and infrastructure code lack comprehensive tests. Additionally, the team hasn't consistently followed the TDD (Test-Driven Development) workflow as outlined in our @003-tdd-workflow.mdc standards.

This story aims to address these gaps by improving test coverage and establishing proper TDD practices for all future development. We'll follow the Red-Green-Refactor cycle and ensure tests are co-located with the code they test.

### Technical Context

- Vitest as the primary testing framework
- Vue Testing Library for component testing
- Jest DOM matchers for DOM assertions
- Pinia testing utilities for store testing
- Current coverage metrics by package:
  - core: ~80% coverage
  - infrastructure: ~60% coverage
  - ui: ~45% coverage
  - shared: ~75% coverage

### Business Drivers

- Prevent regressions when implementing new features
- Improve code quality and maintainability
- Enhance developer confidence in making changes
- Reduce debugging time and support costs
- Ensure a stable application as complexity grows

## Estimation

Story Points: 3 (3 days of human development or 30 minutes of AI/human collaboration)

## Tasks

### 1. - [ ] Testing Infrastructure Improvement

1.  - [ ] Update Vitest configuration for consistent coverage reporting
2.  - [ ] Create standardized test helpers and utilities
3.  - [ ] Implement snapshot testing for UI components
4.  - [ ] Set up test factories for common data objects
5.  - [ ] Configure automated test runs in CI/CD pipeline

### 2. - [ ] Domain Layer Testing (core package)

1.  - [ ] Audit current core package test coverage
2.  - [ ] Implement missing entity and value object tests
3.  - [ ] Add edge case tests for domain validation
4.  - [ ] Test domain events and interactions
5.  - [ ] Achieve >90% test coverage for domain layer

### 3. - [ ] Application Layer Testing (core package)

1.  - [ ] Write tests for all use cases
2.  - [ ] Test error handling and edge cases
3.  - [ ] Create mocks for repository interfaces
4.  - [ ] Test cross-cutting concerns (logging, validation)
5.  - [ ] Achieve >90% test coverage for application layer

### 4. - [ ] Infrastructure Layer Testing

1.  - [ ] Write tests for repository implementations
2.  - [ ] Create tests for external services
3.  - [ ] Test error handling and recovery
4.  - [ ] Implement integration tests for infrastructure components
5.  - [ ] Achieve >80% test coverage for infrastructure layer

### 5. - [ ] UI Component Testing

1.  - [ ] Create test templates for common component patterns
2.  - [ ] Implement tests for all shared components
3.  - [ ] Test form validation and user interactions
4.  - [ ] Test component composition and slots
5.  - [ ] Achieve >80% test coverage for UI components

### 6. - [ ] TDD Workflow Implementation

1.  - [ ] Create TDD workflow documentation with examples
2.  - [ ] Set up pre-commit hooks to enforce TDD
3.  - [ ] Implement TDD pair programming sessions
4.  - [ ] Create templates for test-first development
5.  - [ ] Establish code review criteria for test quality

## Constraints

- Must maintain or improve application performance
- Tests must be fast and reliable (no flaky tests)
- Must follow our established test patterns and standards
- Must be compatible with CI/CD workflow
- Must not significantly increase build times

## Testing Strategy

### Test Types and Organization

```
packages/
├── core/
│   ├── src/
│   │   ├── cv/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── Resume.ts
│   │   │   │   │   └── __tests__/          # Co-located domain tests
│   │   │   │   │       └── Resume.spec.ts
│   │   │   ├── application/
│   │   │   │   ├── use-cases/
│   │   │   │   │   ├── ManageResume.ts
│   │   │   │   │   └── __tests__/          # Co-located use case tests
│   │   │   │   │       └── ManageResume.spec.ts
├── ui/
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/
│   │   │   │   ├── Button.vue
│   │   │   │   └── __tests__/              # Co-located component tests
│   │   │   │       └── Button.spec.ts
│   ├── __tests__/
│   │   └── integration/                    # Integration tests
│   │       └── FormFlow.spec.ts
```

### Testing Guidelines by Layer

#### Domain Layer

- Unit tests for all entities, value objects, and domain services
- Tests for domain validation rules
- Tests for domain events and behaviors
- Tests for invariant enforcement

#### Application Layer

- Unit tests for use cases with mocked dependencies
- Tests for business rule enforcement
- Tests for error handling and edge cases
- Tests for transaction and unit of work patterns

#### Infrastructure Layer

- Unit tests for adapters and repositories
- Integration tests for external service integration
- Tests for error handling and recovery strategies
- Mock external dependencies for isolation

#### UI Layer

- Unit tests for component rendering
- Tests for component props and events
- Tests for user interactions and form behavior
- Tests for accessibility compliance
- Visual regression tests for key components

## Dev Notes

### Red-Green-Refactor Workflow

1. **RED**: Write a failing test that clearly describes the expected behavior

   ```typescript
   // Example: Testing a domain entity validation
   it("should validate that email is in correct format", () => {
     // Arrange
     const invalidEmail = "not-an-email";

     // Act
     const result = () => new Email(invalidEmail);

     // Assert
     expect(result).toThrow("Invalid email format");
   });
   ```

2. **GREEN**: Write the minimal code to make the test pass

   ```typescript
   // Simple implementation to pass the test
   export class Email {
     private value: string;

     constructor(email: string) {
       if (!email.includes("@")) {
         throw new Error("Invalid email format");
       }
       this.value = email;
     }

     getValue(): string {
       return this.value;
     }
   }
   ```

3. **REFACTOR**: Improve the code while keeping tests passing

   ```typescript
   // Refactored implementation with better validation
   export class Email {
     private value: string;

     constructor(email: string) {
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!emailRegex.test(email)) {
         throw new Error("Invalid email format");
       }
       this.value = email;
     }

     getValue(): string {
       return this.value;
     }
   }
   ```

### Testing Anti-Patterns to Avoid

1. Testing implementation details instead of behavior
2. Brittle tests that break with minor changes
3. Overlapping tests that test the same thing
4. Missing edge case and error scenario tests
5. Testing trivial code without business value
6. Slow or flaky tests that diminish confidence
7. Complex test setups that obscure the test intent

## Next Actions (Prioritized)

1. Update Vitest configuration and setup test utilities
2. Create test templates for different types of tests
3. Implement missing tests for critical domain entities
4. Add tests for UI components with highest usage
5. Document TDD workflow with concrete examples
