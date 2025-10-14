import { Sandbox } from '@vercel/sandbox'
import { AgentExecutionResult } from '../types'
import { executeClaudeInSandbox } from './claude'
import { executeCodexInSandbox } from './codex'
import { executeGrokInSandbox } from './grok'
import { executeCursorInSandbox } from './cursor'
import { executeOpenCodeInSandbox } from './opencode'
import { executeCustomAgentInSandbox } from './custom'
import { TaskLogger } from '@/lib/utils/task-logger'

export type AgentType = 'claude' | 'codex' | 'grok' | 'cursor' | 'opencode' | string // Allow custom agent IDs

// Re-export types
export type { AgentExecutionResult } from '../types'

// Main agent execution function
export async function executeAgentInSandbox(
  sandbox: Sandbox,
  instruction: string,
  agentType: AgentType,
  logger: TaskLogger,
  selectedModel?: string,
  onCancellationCheck?: () => Promise<boolean>,
): Promise<AgentExecutionResult> {
  // Check for cancellation before starting agent execution
  if (onCancellationCheck && (await onCancellationCheck())) {
    await logger.info('Task was cancelled before agent execution')
    return {
      success: false,
      error: 'Task was cancelled',
      cliName: agentType,
      changesDetected: false,
    }
  }

  // Handle built-in agents
  switch (agentType) {
    case 'claude':
      return executeClaudeInSandbox(sandbox, instruction, logger, selectedModel)

    case 'codex':
      return executeCodexInSandbox(sandbox, instruction, logger, selectedModel)

    case 'grok':
      return executeGrokInSandbox(sandbox, instruction, logger, selectedModel)

    case 'cursor':
      return executeCursorInSandbox(sandbox, instruction, logger, selectedModel)

    case 'opencode':
      return executeOpenCodeInSandbox(sandbox, instruction, logger, selectedModel)

    default:
      // Assume it's a custom agent ID
      return executeCustomAgentInSandbox(sandbox, instruction, agentType, logger, selectedModel)
  }
}
