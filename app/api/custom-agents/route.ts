import { NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { customAgents, insertCustomAgentSchema } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { generateId } from '@/lib/utils/id'

// GET all custom agents
export async function GET() {
  try {
    const allAgents = await db.select().from(customAgents).orderBy(customAgents.name)
    return NextResponse.json({ agents: allAgents })
  } catch (error) {
    console.error('Error fetching custom agents:', error)
    return NextResponse.json({ error: 'Failed to fetch custom agents' }, { status: 500 })
  }
}

// POST - Create a new custom agent
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validatedData = insertCustomAgentSchema.parse({
      ...body,
      id: body.id || generateId(),
    })

    const [newAgent] = await db.insert(customAgents).values(validatedData).returning()

    return NextResponse.json({ agent: newAgent })
  } catch (error) {
    console.error('Error creating custom agent:', error)
    return NextResponse.json({ error: 'Failed to create custom agent' }, { status: 500 })
  }
}

// PUT - Update a custom agent
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 })
    }

    // Check if agent exists
    const [agent] = await db.select().from(customAgents).where(eq(customAgents.id, id))

    if (!agent) {
      return NextResponse.json({ error: 'Custom agent not found' }, { status: 404 })
    }

    const [updatedAgent] = await db
      .update(customAgents)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(customAgents.id, id))
      .returning()

    return NextResponse.json({ agent: updatedAgent })
  } catch (error) {
    console.error('Error updating custom agent:', error)
    return NextResponse.json({ error: 'Failed to update custom agent' }, { status: 500 })
  }
}

// DELETE - Delete a custom agent
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 })
    }

    // Check if agent exists
    const [agent] = await db.select().from(customAgents).where(eq(customAgents.id, id))

    if (!agent) {
      return NextResponse.json({ error: 'Custom agent not found' }, { status: 404 })
    }

    await db.delete(customAgents).where(eq(customAgents.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting custom agent:', error)
    return NextResponse.json({ error: 'Failed to delete custom agent' }, { status: 500 })
  }
}
