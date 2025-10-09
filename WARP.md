# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Next.js 15 (App Router) + React 19 application that runs AI coding agents inside a Vercel Sandbox to modify repositories and push branches.
- Supported agents: Claude Code, OpenAI Codex CLI (via Vercel AI Gateway), Cursor CLI, and OpenCode. Persistent storage via PostgreSQL with Drizzle ORM. Includes a small queue, GitHub helpers, code-review, and image generation.

Prerequisites
- Package manager: pnpm (pnpm-lock.yaml present)
- Environment: copy .env.example to .env.local and populate at minimum:
  - POSTGRES_URL
  - GITHUB_TOKEN
  - VERCEL_TEAM_ID, VERCEL_PROJECT_ID, VERCEL_TOKEN
  - ANTHROPIC_API_KEY (Claude) and/or OPENAI_API_KEY (Codex/OpenCode)
  - AI_GATEWAY_API_KEY (for AI branch names and Codex agent)
  - Optional: CURSOR_API_KEY (Cursor), STABILITY_API_KEY, REPLICATE_API_TOKEN

Common commands
- Install dependencies
  - pnpm install
- Database (Drizzle)
  - pnpm db:generate
  - pnpm db:push
  - pnpm db:studio
- Dev server (Next.js, port 3000)
  - pnpm dev
- Production
  - pnpm build
  - pnpm start
- Lint / type-check / format
  - pnpm lint .
  - pnpm type-check
  - pnpm format
  - pnpm format:check
- Tests
  - No test runner is configured in package.json (no Jest/Vitest present).

API quick tests (local)
- Create a task (queues if concurrency limit reached)
  - curl -X POST http://localhost:3000/api/tasks \
    -H 'Content-Type: application/json' \
    -d '{
      "prompt": "Add a health check endpoint",
      "repoUrl": "https://github.com/OWNER/REPO.git",
      "selectedAgent": "claude",
      "installDependencies": true,
      "maxDuration": 5
    }'
- Get tasks (newest first)
  - curl http://localhost:3000/api/tasks
- Stop an in-progress task
  - curl -X PATCH http://localhost:3000/api/tasks/TASK_ID \
    -H 'Content-Type: application/json' \
    -d '{"action":"stop"}'
- Delete completed/failed/stopped tasks
  - curl -X DELETE 'http://localhost:3000/api/tasks?action=completed,failed,stopped'
- Trigger code review comment on PR for a task branch
  - curl -X POST http://localhost:3000/api/code-review \
    -H 'Content-Type: application/json' \
    -d '{"taskId":"TASK_ID"}'
- GitHub helper endpoints (require GITHUB_TOKEN)
  - curl http://localhost:3000/api/github/user
  - curl 'http://localhost:3000/api/github/repos?owner=OWNER'
- Generate an image (saved to generated_images)
  - curl -X POST http://localhost:3000/api/images/generate \
    -H 'Content-Type: application/json' \
    -d '{"prompt":"a minimal robot icon","provider":"openai"}'

Big-picture architecture
- App Router (Next.js 15)
  - app/page.tsx: home page that drives task creation
  - app/tasks/[taskId]: task details and polling
  - API endpoints under app/api handle the lifecycle and utilities
- Task lifecycle (app/api/tasks/route.ts)
  1) POST inserts a task (status queued or pending based on concurrency). If a repo is provided, uses Next.js after() to asynchronously generate an AI branch name via AI Gateway; a timestamp fallback is used if generation fails.
  2) processTask creates a Vercel Sandbox (lib/sandbox/creation.ts), shallow-clones the repo with GITHUB_TOKEN, detects package manager, optionally installs dependencies (pnpm/yarn/npm, timed), configures git, checks out or creates the working branch.
  3) The selected agent runs inside the sandbox (lib/sandbox/agents/*). On success, changes are committed and pushed. Sandbox shutdown is attempted either way.
  4) Logs and progress stream to tasks.logs (JSONB) via TaskLogger; status becomes completed/error/stopped.
- Queue and concurrency (lib/queue/task-queue.ts)
  - MAX_CONCURRENT_TASKS = 3. New tasks beyond this are queued with queuePosition. When a slot frees up, queued tasks move to pending and begin processing.
  - PATCH /api/tasks/:id with { action: "stop" } flips status to stopped and kills the registered sandbox (lib/sandbox/sandbox-registry.ts).
- Agents (CLI orchestration inside sandbox)
  - claude: @anthropic-ai/claude-code; needs ANTHROPIC_API_KEY
  - codex: @openai/codex via AI Gateway; needs AI_GATEWAY_API_KEY (sk- or vck_); non-interactive codex exec
  - cursor: cursor-agent installed via cursor.com/install; needs CURSOR_API_KEY; runs in print/force mode and captures output
  - opencode: opencode-ai CLI; uses OPENAI_API_KEY and/or ANTHROPIC_API_KEY; non-interactive opencode run
  - All agents log commands/output and check git status for changes
- Git integration (lib/sandbox/git.ts)
  - Git configured in sandbox; commits and pushes target the working branch. If push fails (e.g., permissions), work is still considered successful and flagged pushFailed.
  - app/api/code-review/route.ts can open/find a PR and post an AI review summary.
- Database (Drizzle + Postgres) (lib/db/schema.ts)
  - tasks: id, prompt, repoUrl, selectedAgent, status, queuePosition, progress, logs, error, branchName, sandboxUrl, timestamps
  - templates: default and user-defined task templates
  - custom_agents: user-registered external agent endpoints and metadata
  - generated_images: prompt, URL, provider/model metadata
- Observability
  - lib/monitoring/metrics.ts: helpers to compute per-task and aggregate timings (console logging)
  - lib/monitoring/sentry.ts: optional Sentry wiring (placeholder until @sentry/nextjs is added)
- UI/Styling
  - Tailwind CSS v4 via @tailwindcss/postcss; shadcn/ui primitives in components/ui
  - next.config.ts whitelists GitHub image hosts for avatars

Operational notes
- Timeouts: sandbox creation defaults to ~5 minutes; agent timeouts vary (cursor ~5m, others ~3m). Heavy dependency installs can hit limits.
- Branch naming: AI branch name generation is non-blocking; a deterministic timestamp fallback is used when needed.
- Package manager detection in sandbox prefers pnpm if pnpm-lock.yaml is present; falls back to npm if install fails.
