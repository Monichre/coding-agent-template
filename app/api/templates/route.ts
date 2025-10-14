import { NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { templates, insertTemplateSchema } from '@/lib/db/schema'
import { defaultTemplates } from '@/lib/templates/default-templates'
import { eq } from 'drizzle-orm'
import { generateId } from '@/lib/utils/id'

// GET all templates
export async function GET() {
  try {
    // Fetch all templates from database
    const allTemplates = await db.select().from(templates).orderBy(templates.category, templates.name)

    // If no templates exist, seed with defaults
    if (allTemplates.length === 0) {
      await db.insert(templates).values(defaultTemplates)
      const seededTemplates = await db.select().from(templates).orderBy(templates.category, templates.name)
      return NextResponse.json({ templates: seededTemplates })
    }

    return NextResponse.json({ templates: allTemplates })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

// POST - Create a new template
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validatedData = insertTemplateSchema.parse({
      ...body,
      id: body.id || generateId(),
      isDefault: false, // User-created templates are not default
    })

    const [newTemplate] = await db.insert(templates).values(validatedData).returning()

    return NextResponse.json({ template: newTemplate })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}

// PUT - Update a template
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 })
    }

    // Check if template exists and is not default
    const [template] = await db.select().from(templates).where(eq(templates.id, id))

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    if (template.isDefault) {
      return NextResponse.json({ error: 'Cannot edit default templates' }, { status: 400 })
    }

    const [updatedTemplate] = await db
      .update(templates)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(templates.id, id))
      .returning()

    return NextResponse.json({ template: updatedTemplate })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 })
  }
}

// DELETE - Delete a template (only non-default templates)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 })
    }

    // Check if template is default
    const [template] = await db.select().from(templates).where(eq(templates.id, id))

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    if (template.isDefault) {
      return NextResponse.json({ error: 'Cannot delete default templates' }, { status: 400 })
    }

    await db.delete(templates).where(eq(templates.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}
