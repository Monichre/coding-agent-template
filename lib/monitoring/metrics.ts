// Performance metrics tracking
import { db } from '@/lib/db/client'
import { tasks } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export interface TaskMetrics {
  taskId: string
  totalDuration: number // in milliseconds
  sandboxCreationTime?: number
  dependencyInstallTime?: number
  agentExecutionTime?: number
  gitOperationsTime?: number
  status: 'completed' | 'error' | 'stopped'
}

// Track when a phase starts
const phaseTimers: Map<string, number> = new Map()

export function startPhaseTimer(taskId: string, phase: string) {
  const key = `${taskId}:${phase}`
  phaseTimers.set(key, Date.now())
}

export function endPhaseTimer(taskId: string, phase: string): number {
  const key = `${taskId}:${phase}`
  const startTime = phaseTimers.get(key)
  if (!startTime) {
    return 0
  }

  const duration = Date.now() - startTime
  phaseTimers.delete(key)
  return duration
}

// Calculate task metrics from database
export async function calculateTaskMetrics(taskId: string): Promise<TaskMetrics | null> {
  try {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId))

    if (!task || !task.createdAt || !task.completedAt) {
      return null
    }

    const totalDuration = new Date(task.completedAt).getTime() - new Date(task.createdAt).getTime()

    return {
      taskId,
      totalDuration,
      status: task.status as 'completed' | 'error' | 'stopped',
    }
  } catch (error) {
    console.error('Error calculating task metrics:', error)
    return null
  }
}

// Get aggregate metrics for all tasks
export async function getAggregateMetrics() {
  try {
    const allTasks = await db.select().from(tasks)

    const completedTasks = allTasks.filter((task) => task.status === 'completed' && task.createdAt && task.completedAt)

    const failedTasks = allTasks.filter((task) => task.status === 'error')
    const stoppedTasks = allTasks.filter((task) => task.status === 'stopped')

    const durations = completedTasks.map(
      (task) => new Date(task.completedAt!).getTime() - new Date(task.createdAt).getTime(),
    )

    const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0

    const maxDuration = durations.length > 0 ? Math.max(...durations) : 0
    const minDuration = durations.length > 0 ? Math.min(...durations) : 0

    return {
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      failedTasks: failedTasks.length,
      stoppedTasks: stoppedTasks.length,
      successRate: allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0,
      avgDuration: Math.round(avgDuration / 1000), // in seconds
      maxDuration: Math.round(maxDuration / 1000), // in seconds
      minDuration: Math.round(minDuration / 1000), // in seconds
    }
  } catch (error) {
    console.error('Error calculating aggregate metrics:', error)
    return null
  }
}

// Log performance metric to console or external service
export function logMetric(metricName: string, value: number, unit: string = 'ms', metadata?: Record<string, any>) {
  const metric = {
    name: metricName,
    value,
    unit,
    timestamp: new Date().toISOString(),
    ...metadata,
  }

  console.log('[METRIC]', JSON.stringify(metric))

  // In production, you could send this to a metrics service like:
  // - DataDog
  // - New Relic
  // - CloudWatch
  // - Custom metrics endpoint
}
