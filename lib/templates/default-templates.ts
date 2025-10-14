import { InsertTemplate } from '@/lib/db/schema'

export const defaultTemplates: InsertTemplate[] = [
  {
    id: 'feature-basic',
    name: 'Add New Feature',
    description: 'Scaffold and implement a new feature from scratch',
    prompt: 'Add a new feature: [DESCRIBE FEATURE]. Follow the existing project architecture and coding conventions.',
    category: 'feature',
    isDefault: true,
  },
  {
    id: 'bugfix-investigate',
    name: 'Fix Bug',
    description: 'Investigate and fix a specific bug or error',
    prompt:
      'Fix the following bug: [DESCRIBE BUG]. Investigate the root cause, implement a fix, and add tests to prevent regression.',
    category: 'bugfix',
    isDefault: true,
  },
  {
    id: 'refactor-improve',
    name: 'Code Refactoring',
    description: 'Improve code quality and structure',
    prompt:
      'Refactor the following code: [SPECIFY FILE/COMPONENT]. Improve readability, maintainability, and performance while preserving functionality.',
    category: 'refactor',
    isDefault: true,
  },
  {
    id: 'docs-api',
    name: 'Document API',
    description: 'Add comprehensive API documentation',
    prompt:
      'Add comprehensive documentation for the API endpoints. Include descriptions, request/response examples, and error handling.',
    category: 'docs',
    isDefault: true,
  },
  {
    id: 'docs-readme',
    name: 'Update README',
    description: 'Improve project README documentation',
    prompt: 'Update the README.md with clear setup instructions, usage examples, and feature descriptions.',
    category: 'docs',
    isDefault: true,
  },
  {
    id: 'test-unit',
    name: 'Add Unit Tests',
    description: 'Write unit tests for a component or module',
    prompt:
      'Add comprehensive unit tests for: [SPECIFY MODULE/COMPONENT]. Achieve good code coverage and test edge cases.',
    category: 'test',
    isDefault: true,
  },
  {
    id: 'test-integration',
    name: 'Add Integration Tests',
    description: 'Write integration tests for workflows',
    prompt:
      'Add integration tests for: [SPECIFY WORKFLOW]. Test the end-to-end functionality and interactions between components.',
    category: 'test',
    isDefault: true,
  },
  {
    id: 'chore-deps',
    name: 'Update Dependencies',
    description: 'Update project dependencies safely',
    prompt:
      'Update project dependencies to their latest compatible versions. Test for breaking changes and update code if necessary.',
    category: 'chore',
    isDefault: true,
  },
  {
    id: 'chore-lint',
    name: 'Fix Linting Issues',
    description: 'Fix all linting and formatting issues',
    prompt:
      "Fix all linting and formatting issues in the codebase. Follow the project's ESLint and Prettier configurations.",
    category: 'chore',
    isDefault: true,
  },
  {
    id: 'feature-api',
    name: 'Add REST API Endpoint',
    description: 'Create a new REST API endpoint',
    prompt:
      'Create a new REST API endpoint: [METHOD] /api/[endpoint]. Include request validation, error handling, and proper status codes.',
    category: 'feature',
    isDefault: true,
  },
  {
    id: 'feature-ui',
    name: 'Add UI Component',
    description: 'Create a new reusable UI component',
    prompt:
      'Create a new UI component: [COMPONENT NAME]. Make it reusable, accessible, and responsive. Include proper props and TypeScript types.',
    category: 'feature',
    isDefault: true,
  },
  {
    id: 'refactor-typescript',
    name: 'Improve TypeScript Types',
    description: 'Add or improve TypeScript type definitions',
    prompt:
      'Improve TypeScript types for: [SPECIFY AREA]. Add proper interfaces, types, and generics. Fix any type errors.',
    category: 'refactor',
    isDefault: true,
  },
]
