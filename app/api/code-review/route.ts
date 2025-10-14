import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { tasks } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { fetchPRDetails, postPRComment, generateCodeReview, createPR } from '@/lib/code-review/github-pr'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId } = body

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    // Fetch task details
    const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId))

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (!task.repoUrl || !task.branchName) {
      return NextResponse.json({ error: 'Task does not have a repository URL or branch name' }, { status: 400 })
    }

    // Check if PR exists
    let prDetails = await fetchPRDetails(task.repoUrl, task.branchName)

    // If no PR exists, create one
    if (!prDetails) {
      const prResult = await createPR(
        task.repoUrl,
        task.branchName,
        task.prompt.substring(0, 100) + (task.prompt.length > 100 ? '...' : ''),
        `## Task Description\n\n${task.prompt}\n\n---\n\nAutomatically created by Coding Agent Template`,
      )

      if (!prResult) {
        return NextResponse.json({ error: 'Failed to create PR' }, { status: 500 })
      }

      // Fetch the newly created PR details
      prDetails = await fetchPRDetails(task.repoUrl, task.branchName)

      if (!prDetails) {
        return NextResponse.json({ error: 'Failed to fetch PR details after creation' }, { status: 500 })
      }
    }

    // Generate code review
    const review = await generateCodeReview(prDetails)

    // Post review as comment
    const commentPosted = await postPRComment(task.repoUrl, prDetails.number, review)

    if (!commentPosted) {
      return NextResponse.json({ error: 'Failed to post review comment' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      prUrl: prDetails.html_url,
      prNumber: prDetails.number,
      review,
    })
  } catch (error) {
    console.error('Error in code review:', error)
    return NextResponse.json({ error: 'Failed to perform code review' }, { status: 500 })
  }
}
