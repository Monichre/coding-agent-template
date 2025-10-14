// Helper to trigger task processing for queued tasks that become pending
// This is called by an internal API to start tasks from the queue

export async function triggerPendingTaskProcessing(taskId: string) {
  try {
    // Make an internal API call to trigger the task processing
    // This will be handled by a polling mechanism or webhook
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/tasks/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskId }),
    })

    if (!response.ok) {
      console.error('Failed to trigger task processing:', await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error('Error triggering task processing:', error)
    return false
  }
}
