# CodingAgentFragmentsIntegration

## Objective

Combine `coding-agent-template` (tasks + Vercel Sandbox + git ops) with `fragments` (E2B sandboxes + generation/orchestration) in a production-safe, minimal, and reversible way.

## Current Capabilities (at a glance)

- coding-agent-template
  - Tasks persisted in Postgres (Drizzle), queue, progress, logs, branch creation
  - Vercel Sandbox to clone repo, install deps, run agent CLIs; agent switch via `executeAgentInSandbox`
- fragments
  - E2B sandboxes and multi-provider LLMs; APIs for chat/orchestrate/sandbox; rich preview components

## Integration Options

### Option A — Add a new agent: `fragments` (smallest change)

- Description: Treat Fragments/E2B as another agent strategy. Keep Vercel Sandbox path intact.
- Changes
  - `lib/sandbox/agents/index.ts`: add `'fragments'` to the switch → `executeFragmentsInSandbox(...)`
  - New: `lib/sandbox/agents/fragments.ts`
    - Calls Fragments API or E2B SDK for generation/execution
    - Streams logs via `TaskLogger`
    - Returns `AgentExecutionResult` (optionally includes preview URL)
  - DB (optional, additive): add `sandboxProvider` ('vercel'|'e2b'), `e2bTemplateId?`
  - UI (optional): if `sandboxProvider==='e2b'`, render preview (iframe or import Fragments preview component)
- Pros: Minimal diff, fast to ship; reuse existing task lifecycle
- Cons: E2B is adapter-like; provider selection is implicit
- T-shirt size: S

### Option B — Abstract sandbox provider (cleaner long-term)

- Description: Introduce provider interface and support both Vercel and E2B uniformly
- Changes
  - New: `lib/sandbox/providers.ts` with `SandboxProvider` interface
  - Implement `VercelSandboxProvider` (wrap existing logic)
  - Implement `E2BSandboxProvider` (invoke Fragments/E2B engine)
  - Update `createSandbox` to delegate by `config.provider`
  - DB: add `sandboxProvider`, optional E2B metadata fields (templateId, preview URL)
- Pros: Clear separation, future providers trivial; uniform lifecycle
- Cons: Slightly larger change set
- T-shirt size: M

## Exact Touchpoints

- Agent routing

```
executeAgentInSandbox(sandbox, instruction, agentType, logger, selectedModel?, onCancellationCheck?)
  switch (agentType) {
    case 'claude' | 'codex' | 'grok' | 'cursor' | 'opencode': ...
    case 'fragments': return executeFragmentsInSandbox(...)
    default: return executeCustomAgentInSandbox(...)
  }
```

- Sandbox creation (Option B)

```
const provider = config.provider ?? 'vercel'
return providers[provider].create(config)
```

- DB fields (additive)

```
 tasks.sandboxProvider ('vercel'|'e2b')
 tasks.e2bTemplateId? (string)
 tasks.sandboxUrl? (string) // already present
```

## Environment & Secrets

- Add: `E2B_API_KEY`
- Optional: `FRAGMENTS_BASE_URL` if proxying Fragments API via server route
- Keep secrets server-side; use API routes as proxy when needed

## Risks and Mitigations

- Git vs E2B lifecycle: keep git ops with Vercel path; for E2B runs, surface preview URL and optionally sync artifacts later
- Ports/domains: read template port from Fragments/E2B; store `sandboxUrl` to display in UI
- Provider drift: keep Option A thin; move to Option B when multiple providers are routine

## Recommended Path

- Start with Option A to validate value quickly.
- If E2B becomes a primary path, refactor to Option B without breaking tasks.

## Implementation Checklist (Option A)

- [ ] Extend `AgentType` and switch-case to include `'fragments'`
- [ ] Implement `lib/sandbox/agents/fragments.ts`
- [ ] Add env validation for `E2B_API_KEY`
- [ ] (Optional) Add `sandboxProvider` and `e2bTemplateId` columns
- [ ] (Optional) Task UI preview when provider is `e2b`

## Rollback Plan

- Remove `'fragments'` case and the adapter file; no DB migration needed if optional fields left unused.
