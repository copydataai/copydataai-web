---
author: Jose Sanchez
title: Continuous Integration (CI) with GitHub Actions
description: Continuos Integration (CI) with Github Actions
pubDatetime: 2024-12-03T08:22:00Z
modDatetime: 2024-12-03T08:22:47.00Z
slug: continuos-integration
featured: true
draft: false
tags:
  - programming
  - go
  - Docker
  - GitHub Actions
  - DevOps
---

## Introduction

Continuous Integration (CI) is a cornerstone of modern software development, enabling teams to merge code frequently while maintaining code quality and reducing integration problems. GitHub Actions offers a robust, built-in CI/CD platform that integrates seamlessly with your GitHub repositories.

In this blog, we’ll explore the essentials of CI, why GitHub Actions is an excellent choice, and how to implement a basic CI pipeline for a Go project.

---

## What is Continuous Integration (CI)?

CI automates the process of integrating code changes into a shared repository. The goal is to detect issues early by running automated tests, linting, and builds for every code change.

### Key Benefits of CI:
- **Early Detection of Bugs**: Run tests on every commit to catch bugs before they reach production.
- **Faster Development Cycles**: Automate repetitive tasks like builds and deployments.
- **Improved Collaboration**: Ensure consistency across contributions from different team members.
- **High Code Quality**: Enforce linting, testing, and code coverage checks.

---

## Why Use GitHub Actions for CI?

GitHub Actions is a powerful CI/CD tool because:
- **Seamless Integration**: Built into GitHub, it requires no additional setup for repository access.
- **Custom Workflows**: Define workflows tailored to your project using YAML files.
- **Reusable Actions**: Use community-contributed actions or create your own for repetitive tasks.
- **Free for Small Projects**: GitHub provides free minutes for public repositories and small-scale private projects.

---

## Implementing a CI Workflow for a Go Project

Here’s how to set up a basic CI pipeline using GitHub Actions to build, test, and lint a Go project.

---

### Step 1: Project Setup

Ensure your Go project has the following structure:

```
my-go-project/
├── go.mod
├── go.sum
├── main.go
├── handlers/
│   ├── handler.go
│   └── handler_test.go
└── .github/
    └── workflows/
        └── ci.yml
```

The `handlers/` directory contains Go code and tests, while the `.github/workflows/` directory stores CI configurations.

---

### Step 2: Write the Workflow File

Create a file named `.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # Checkout the repository
      - name: Checkout code
        uses: actions/checkout@v3

      # Set up Go
      - name: Setup Go
        uses: actions/setup-go@v4
        with:
          go-version: 1.20

      # Install dependencies
      - name: Install dependencies
        run: go mod tidy

      # Run tests
      - name: Run tests
        run: go test ./... -v

      # Run lint checks
      - name: Run golangci-lint
        uses: golangci/golangci-lint-action@v3
        with:
          version: v1.53.3
```

---

### Explanation of Workflow Steps

1. **Triggering the Workflow**:
   - The workflow triggers on pushes or pull requests to the `main` branch.

2. **Checkout the Code**:
   - The `actions/checkout` action pulls your repository into the CI environment.

3. **Set Up Go**:
   - The `actions/setup-go` action installs the specified version of Go.

4. **Install Dependencies**:
   - The `go mod tidy` command ensures all required modules are installed and cleans up unused ones.

5. **Run Tests**:
   - The `go test ./... -v` command runs all tests in the project.

6. **Lint the Code**:
   - The `golangci-lint` action checks the code for issues like formatting errors, unused variables, or potential bugs.

---

### Step 3: Commit and Push

Commit the workflow file and push it to your repository:

```bash
git add .github/workflows/ci.yml
git commit -m "Add CI pipeline"
git push origin main
```

GitHub Actions will automatically trigger the workflow. You can monitor its progress under the **Actions** tab in your repository.

---

## Advanced Enhancements

### 1. Add Code Coverage
Include a step to measure code coverage using `go test` and generate a report:

```yaml
- name: Test with coverage
  run: go test ./... -coverprofile=coverage.out

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    file: coverage.out
    flags: unittests
```

### 2. Add Build Artifacts
Archive and upload build artifacts (e.g., binaries):

```yaml
- name: Build binary
  run: go build -o my-go-app

- name: Upload artifact
  uses: actions/upload-artifact@v3
  with:
    name: my-go-app
    path: ./my-go-app
```

### 3. Parallelize Tests
Run tests in parallel for faster execution:

```yaml
strategy:
  matrix:
    go-version: [1.18, 1.19, 1.20]
steps:
  - name: Setup Go
    uses: actions/setup-go@v4
    with:
      go-version: ${{ matrix.go-version }}
```

---

## Conclusion

Setting up Continuous Integration with GitHub Actions is straightforward and provides immense value for your development workflow. From automated testing to linting and beyond, CI ensures your codebase remains robust and consistent.

Start implementing GitHub Actions today and enjoy the benefits of streamlined development and deployment!

---

Let me know if you’d like additional enhancements, such as Docker integration or multi-environment testing!