import { Sandbox } from '@vercel/sandbox'
import { AgentExecutionResult } from '../types'
import { TaskLogger } from '@/lib/utils/task-logger'

export async function executeGrokInSandbox(
  sandbox: Sandbox,
  instruction: string,
  logger: TaskLogger,
  selectedModel?: string,
): Promise<AgentExecutionResult> {
  await logger.info('Starting Grok agent execution')
  await logger.info(`Model: ${selectedModel || 'grok-2-latest'}`)

  const xaiApiKey = process.env.XAI_API_KEY

  if (!xaiApiKey) {
    await logger.error('XAI_API_KEY environment variable is required')
    return {
      success: false,
      error: 'XAI_API_KEY not configured',
      cliName: 'grok',
      changesDetected: false,
    }
  }

  try {
    // Use xAI API (Grok)
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${xaiApiKey}`,
      },
      body: JSON.stringify({
        model: selectedModel || 'grok-2-latest',
        messages: [
          {
            role: 'system',
            content:
              'You are Grok, an AI coding assistant. You help users write, debug, and improve code. Provide clear, concise, and working code solutions.',
          },
          {
            role: 'user',
            content: instruction,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      await logger.error(`xAI API error: ${response.status} ${response.statusText}`)
      await logger.error(errorText)
      return {
        success: false,
        error: `xAI API error: ${response.status}`,
        cliName: 'grok',
        changesDetected: false,
      }
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      await logger.error('No response from Grok')
      return {
        success: false,
        error: 'Empty response from Grok',
        cliName: 'grok',
        changesDetected: false,
      }
    }

    await logger.info('Grok response received')
    await logger.code(aiResponse)

    // For now, we'll return the response as-is
    // In a production scenario, you'd parse the response and apply changes to files
    await logger.info('Note: Grok agent currently returns analysis only. File modification coming soon.')

    return {
      success: true,
      error: null,
      cliName: 'grok',
      changesDetected: false,
      output: aiResponse,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await logger.error(`Error executing Grok: ${errorMessage}`)
    return {
      success: false,
      error: errorMessage,
      cliName: 'grok',
      changesDetected: false,
    }
  }
}
