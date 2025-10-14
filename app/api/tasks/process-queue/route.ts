import { NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { tasks } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { processQueue } from '@/lib/queue/task-queue'

// This endpoint is called to process the next task in the queue
// It moves queued tasks to pending and triggers their processing
export async function POST() {
  try {
    // Process the queue (moves queued tasks to pending)
    await processQueue()

    // Get all pending tasks that need to be started
    const pendingTasks = await db.select().from(tasks).where(eq(tasks.status, 'pending'))

    // For each pending task, trigger a serverless function to process it
    // We use dynamic imports to avoid circular dependencies
    for (const task of pendingTasks) {
      // Trigger task processing by making an internal request
      // This will be handled by the main task route
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/tasks/${task.id}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Request': 'true',
        },
      }).catch((error) => {
        console.error(`Failed to start task ${task.id}:`, error)
      })
    }

    return NextResponse.json({ success: true, pendingTasksTriggered: pendingTasks.length })
  } catch (error) {
    console.error('Error processing queue:', error)
    return NextResponse.json({ error: 'Failed to process queue' }, { status: 500 })
  }
}
