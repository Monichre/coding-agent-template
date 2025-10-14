import { db } from '@/lib/db/client'
import { tasks } from '@/lib/db/schema'
import { eq, inArray, and } from 'drizzle-orm'

// Maximum number of concurrent tasks that can be processed
const MAX_CONCURRENT_TASKS = 3

// Singleton to track processing state across invocations
let queueProcessorRunning = false

// Get count of currently processing tasks
export async function getProcessingTasksCount(): Promise<number> {
  const processingTasks = await db.select().from(tasks).where(eq(tasks.status, 'processing'))

  return processingTasks.length
}

// Get the next queued task to process
async function getNextQueuedTask() {
  const queuedTasks = await db.select().from(tasks).where(eq(tasks.status, 'queued')).orderBy(tasks.createdAt).limit(1)

  return queuedTasks[0] || null
}

// Update queue positions for all queued tasks
export async function updateQueuePositions() {
  const queuedTasks = await db.select().from(tasks).where(eq(tasks.status, 'queued')).orderBy(tasks.createdAt)

  // Update positions (1-indexed)
  for (let i = 0; i < queuedTasks.length; i++) {
    await db
      .update(tasks)
      .set({
        queuePosition: i + 1,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, queuedTasks[i].id))
  }
}

// Check if we can process more tasks and return whether task should be queued
export async function shouldQueueTask(): Promise<{ shouldQueue: boolean; queuePosition?: number }> {
  const processingCount = await getProcessingTasksCount()

  if (processingCount >= MAX_CONCURRENT_TASKS) {
    // Get the next queue position
    const queuedTasks = await db.select().from(tasks).where(eq(tasks.status, 'queued'))

    const queuePosition = queuedTasks.length + 1

    return { shouldQueue: true, queuePosition }
  }

  return { shouldQueue: false }
}

// Process the queue - move queued tasks to processing when slots are available
export async function processQueue() {
  // Prevent multiple simultaneous queue processors
  if (queueProcessorRunning) {
    return
  }

  queueProcessorRunning = true

  try {
    const processingCount = await getProcessingTasksCount()
    const availableSlots = MAX_CONCURRENT_TASKS - processingCount

    if (availableSlots <= 0) {
      // No slots available
      return
    }

    // Get the next queued task
    const nextTask = await getNextQueuedTask()

    if (!nextTask) {
      // No tasks in queue
      return
    }

    // Move task from queued to pending (which will then be picked up by the task processor)
    await db
      .update(tasks)
      .set({
        status: 'pending',
        queuePosition: null,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, nextTask.id))

    // Update queue positions for remaining tasks
    await updateQueuePositions()

    // Recursively process more tasks if there are more slots
    if (availableSlots > 1) {
      // Use setTimeout to avoid deep recursion
      setTimeout(() => {
        queueProcessorRunning = false
        processQueue()
      }, 100)
    }
  } catch (error) {
    console.error('Error processing queue:', error)
  } finally {
    queueProcessorRunning = false
  }
}

// Get queue status for display
export async function getQueueStatus() {
  const processingCount = await getProcessingTasksCount()
  const queuedTasks = await db.select().from(tasks).where(eq(tasks.status, 'queued'))

  return {
    processingCount,
    queuedCount: queuedTasks.length,
    maxConcurrent: MAX_CONCURRENT_TASKS,
    availableSlots: Math.max(0, MAX_CONCURRENT_TASKS - processingCount),
  }
}
