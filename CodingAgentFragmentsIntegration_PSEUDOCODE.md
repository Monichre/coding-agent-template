# CodingAgentFragmentsIntegration_PSEUDOCODE

- Objective: Combine coding-agent-template (tasks + Vercel Sandbox + git ops) with Fragments (E2B sandboxes + generation/orchestration) with minimal changes.

- Option A (Add a new agent: 'fragments')
  - Extend `AgentType` union to include 'fragments'
  - In `lib/sandbox/agents/index.ts` add case 'fragments' → call `executeFragmentsInSandbox`
  - Implement `lib/sandbox/agents/fragments.ts`
    - function executeFragmentsInSandbox(sandbox, instruction, logger, selectedModel?) → AgentExecutionResult
      - call Fragments API (or direct E2B SDK) to generate artifacts/logs
      - stream logs via TaskLogger
      - return { success, agentResponse, changesDetected?, streamingLogs? }
  - DB: optionally add `sandboxProvider` ('vercel'|'e2b'), `e2bTemplateId?`
  - UI: in task page, if sandboxProvider==='e2b', render preview (iframe or imported Fragments component)

- Option B (Abstract sandbox provider)
  - Define interface SandboxProvider { create(config): SandboxResult; run(cmd): Result; domain(port): string; destroy(): void }
  - Implement VercelSandboxProvider wrapping current logic
  - Implement E2BSandboxProvider calling Fragments/E2B engine
  - Modify `createSandbox` to delegate based on config.provider
  - DB: add `sandboxProvider`, optional E2B metadata fields

- Shared concerns
  - Env: add E2B_API_KEY, optional FRAGMENTS_BASE_URL
  - Security: server-side proxy when calling Fragments/E2B
  - Git: for E2B runs, preview URL is primary; repo sync can be separate step

- Minimal flow (Option A)
  1) User creates task → `selectedAgent: 'fragments'`, optional `sandboxProvider: 'e2b'`
  2) createSandbox as-is (Vercel) OR skip to E2B preview if desired
  3) executeAgentInSandbox routes to executeFragmentsInSandbox → Fragments/E2B generates output
  4) logger streams updates; task gets `sandboxUrl` if available
  5) complete task, optionally commit changes or provide download
