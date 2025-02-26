# Docker Guide for CV Generator

> This document provides a comprehensive guide to Docker usage in the CV Generator application. It serves as a reference for developers working with Docker containerization in this project.

## Table of Contents

- [Overview](#overview)
- [Docker Architecture](#docker-architecture)
- [Development Environment](#development-environment)
- [Production Deployment](#production-deployment)
- [Testing with Docker](#testing-with-docker)
- [Utility Scripts](#utility-scripts)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)

## Overview

The CV Generator application uses Docker for containerized development, testing, and deployment. This ensures a consistent environment across all stages of development and provides an easy way to deploy the application in various environments.

### Core Components

- **Dockerfile**: Multi-stage build for production deployment
- **Dockerfile.dev**: Development environment configuration
- **docker-compose.yml**: Service definitions for the application
- **Utility Scripts**: Shell scripts for common Docker operations

## Docker Architecture

The Docker setup follows a clean architecture approach with:

1. **Multi-stage builds** in production Dockerfile to minimize image size
2. **Separation of concerns** between development and production environments
3. **Consistent script patterns** for all Docker operations
4. **Volume management** for persistent data and efficient development

### File Structure

```
/
├── .docker/
│   ├── config/                 # Docker configuration files
│   ├── scripts/                # Implementation scripts (legacy)
│   ├── Dockerfile              # Production Dockerfile
│   ├── Dockerfile.dev          # Development Dockerfile
│   └── docker-compose.yml      # Docker Compose configuration
├── docker-cleanup.sh           # Script to clean Docker resources
├── docker-healthcheck.sh       # Script to check container health
├── start.sh                    # Script to start Docker containers
├── test-docker.sh              # Script to run tests in Docker
├── update-docker.sh            # Script to update Docker images
├── dev-environment.sh          # Script to set up dev environment
└── .dockerignore               # Files to exclude from Docker context
```

### Image Specifications

#### Production Image

- **Base**: nginx:alpine
- **Exposed Ports**: 80
- **Artifacts**: Built Vue.js application

#### Development Image

- **Base**: node:22-alpine
- **Exposed Ports**: 5173
- **Volume Mounts**: App code and node_modules

## Development Environment

### Prerequisites

- Docker Engine (latest version)
- Docker Compose (latest version)

### Setup Development Environment

Run the following command to set up your development environment:

```bash
./dev-environment.sh
```

This script will:

- Check for required tools (Docker, Docker Compose)
- Set up necessary permissions
- Copy environment variables if needed
- Offer to build Docker images
- Offer to run tests
- Offer to start the development environment

### Starting Development Server

```bash
# Using the script directly
./start.sh development

# Or using npm script
pnpm docker:start:dev
```

This will:

1. Build the development Docker image if needed
2. Start the container with appropriate volume mounts
3. Expose the development server on port 8080

### Development Workflow

1. Code changes in the host are immediately reflected in the container due to volume mounting
2. The development server in the container auto-reloads on changes
3. Run tests inside Docker to ensure consistent test environment

## Production Deployment

### Building for Production

```bash
# Build the production image
docker-compose build cv-generator
```

### Deploying to Production

```bash
# Start production container
./start.sh
# or
pnpm docker:start
```

This will:

1. Stop any running containers
2. Build the production image if needed
3. Start the container in detached mode
4. Expose the application on port 8080 (configurable)

### Environment Variables

The production deployment can be configured using environment variables:

| Variable | Default | Description               |
| -------- | ------- | ------------------------- |
| PORT     | 8080    | Port to expose the app on |

## Testing with Docker

### Running Tests

```bash
# Run unit tests
./test-docker.sh unit
# or
pnpm docker:test

# Run e2e tests
./test-docker.sh e2e
# or
pnpm docker:test:e2e

# Run all tests
./test-docker.sh all
# or
pnpm docker:test:all
```

### Test Options

| Option     | Description                                |
| ---------- | ------------------------------------------ |
| unit       | Run unit tests only                        |
| e2e        | Run end-to-end tests only                  |
| all        | Run all tests                              |
| true/false | Enable/disable watch mode (default: false) |

## Utility Scripts

### Health Check

```bash
./docker-healthcheck.sh
# or
pnpm docker:health
```

This script verifies:

- If Docker containers are running
- Resource usage (CPU and memory)
- Application accessibility
- Errors in logs

### Cleanup

```bash
# Basic cleanup (project-specific resources)
./docker-cleanup.sh
# or
pnpm docker:clean

# Full cleanup (including system-wide resources)
./docker-cleanup.sh full
# or
pnpm docker:clean:full
```

### Update

```bash
./update-docker.sh
```

This script:

- Backs up current environment
- Pulls latest Docker images
- Updates base images
- Rebuilds containers if needed
- Restarts running containers
- Cleans up old images

## Common Commands

Here are some common Docker commands used in the project:

```bash
# View running containers
docker-compose ps

# View container logs
docker-compose logs

# Stop all containers
docker-compose down

# Rebuild and restart containers
docker-compose up -d --build

# Execute command in container
docker-compose exec service_name command
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: If port 8080 is already in use, specify a different port:

   ```bash
   ./start.sh production 8081
   ```

2. **Container not starting**: Check logs for errors:

   ```bash
   docker-compose logs
   ```

3. **Performance issues**: Check resource usage:

   ```bash
   ./docker-healthcheck.sh
   ```

4. **Build errors**: Clean Docker resources and try again:
   ```bash
   ./docker-cleanup.sh
   docker-compose build --no-cache
   ```

### Getting Help

If you encounter issues not covered here, please:

1. Check the Docker logs for specific error messages
2. Run the health check script for diagnostics
3. Consult the Docker documentation for specific Docker errors
4. Open an issue in the repository with detailed error information

---

This documentation is maintained as part of the CV Generator project. For updates or improvements, please submit a pull request.
