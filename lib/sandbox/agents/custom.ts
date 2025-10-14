import { Sandbox } from '@vercel/sandbox'
import { AgentExecutionResult } from '../types'
import { TaskLogger } from '@/lib/utils/task-logger'
import { db } from '@/lib/db/client'
import { customAgents } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function executeCustomAgentInSandbox(
  sandbox: Sandbox,
  instruction: string,
  agentId: string,
  logger: TaskLogger,
  selectedModel?: string,
): Promise<AgentExecutionResult> {
  try {
    // Fetch custom agent configuration
    const [agent] = await db.select().from(customAgents).where(eq(customAgents.id, agentId))

    if (!agent) {
      await logger.error(`Custom agent with ID ${agentId} not found`)
      return {
        success: false,
        error: 'Custom agent not found',
        cliName: 'custom',
        changesDetected: false,
      }
    }

    if (!agent.isActive) {
      await logger.error(`Custom agent ${agent.name} is not active`)
      return {
        success: false,
        error: 'Custom agent is not active',
        cliName: 'custom',
        changesDetected: false,
      }
    }

    await logger.info(`Executing custom agent: ${agent.name}`)
    await logger.info(`Endpoint: ${agent.apiEndpoint}`)

    // Prepare request payload
    const payload: any = {
      prompt: instruction,
      model: selectedModel || agent.defaultModel,
    }

    // Add any additional config options
    if (agent.configOptions) {
      Object.assign(payload, agent.configOptions)
    }

    // Make request to custom agent API
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (agent.apiKey) {
      headers['Authorization'] = `Bearer ${agent.apiKey}`
    }

    await logger.info('Sending request to custom agent...')

    const response = await fetch(agent.apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      await logger.error(`Custom agent API error: ${response.status} ${response.statusText}`)
      await logger.error(errorText)
      return {
        success: false,
        error: `API request failed: ${response.status} ${response.statusText}`,
        cliName: 'custom',
        changesDetected: false,
      }
    }

    const result = await response.json()
    await logger.success('Custom agent completed successfully')

    // Log response summary
    if (result.output) {
      await logger.info(`Agent output: ${result.output}`)
    }

    // Check if there are any file changes to apply
    if (result.files && Array.isArray(result.files)) {
      await logger.info(`Applying ${result.files.length} file changes...`)

      for (const fileChange of result.files) {
        const { path, content, operation = 'write' } = fileChange

        if (operation === 'write') {
          // Write file content
          await sandbox.files.write(path, content)
          await logger.info(`Updated: ${path}`)
        } else if (operation === 'delete') {
          // Delete file
          const deleteResult = await sandbox.commands.run('rm', ['-f', path])
          if (deleteResult.exitCode === 0) {
            await logger.info(`Deleted: ${path}`)
          }
        }
      }

      await logger.success('File changes applied')
    }

    // If result includes commands to run
    if (result.commands && Array.isArray(result.commands)) {
      await logger.info(`Running ${result.commands.length} command(s)...`)

      for (const cmd of result.commands) {
        await logger.command(cmd)
        const cmdResult = await sandbox.commands.run('sh', ['-c', cmd])

        if (cmdResult.stdout) {
          await logger.info(cmdResult.stdout)
        }

        if (cmdResult.exitCode !== 0 && cmdResult.stderr) {
          await logger.error(cmdResult.stderr)
        }
      }
    }

    return {
      success: true,
      output: result.output || result.message || 'Task completed',
      cliName: 'custom',
      changesDetected: result.changesDetected !== false, // Default to true unless explicitly false
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await logger.error(`Custom agent execution failed: ${errorMessage}`)

    return {
      success: false,
      error: errorMessage,
      cliName: 'custom',
      changesDetected: false,
    }
  }
}
