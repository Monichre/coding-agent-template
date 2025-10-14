'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Template } from '@/lib/db/schema'
import { Pencil, Trash2, Plus } from 'lucide-react'

interface TemplateManagerProps {
  templates: Template[]
  onTemplateChange: () => void
}

const CATEGORIES = [
  { value: 'feature', label: 'Feature' },
  { value: 'bugfix', label: 'Bug Fix' },
  { value: 'refactor', label: 'Refactoring' },
  { value: 'docs', label: 'Documentation' },
  { value: 'test', label: 'Testing' },
  { value: 'chore', label: 'Chore' },
]

export function TemplateManager({ templates, onTemplateChange }: TemplateManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState<string>('feature')

  const resetForm = () => {
    setName('')
    setDescription('')
    setPrompt('')
    setCategory('feature')
    setEditingTemplate(null)
  }

  const openEditDialog = (template: Template) => {
    setEditingTemplate(template)
    setName(template.name)
    setDescription(template.description)
    setPrompt(template.prompt)
    setCategory(template.category)
    setShowEditDialog(true)
  }

  const handleCreate = async () => {
    if (!name || !description || !prompt) {
      toast.error('All fields are required')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          prompt,
          category,
        }),
      })

      if (response.ok) {
        toast.success('Template created successfully!')
        setShowCreateDialog(false)
        resetForm()
        onTemplateChange()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create template')
      }
    } catch (error) {
      console.error('Error creating template:', error)
      toast.error('Failed to create template')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingTemplate || !name || !description || !prompt) {
      toast.error('All fields are required')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTemplate.id,
          name,
          description,
          prompt,
          category,
        }),
      })

      if (response.ok) {
        toast.success('Template updated successfully!')
        setShowEditDialog(false)
        resetForm()
        onTemplateChange()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update template')
      }
    } catch (error) {
      console.error('Error updating template:', error)
      toast.error('Failed to update template')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (template: Template) => {
    if (template.isDefault) {
      toast.error('Cannot delete default templates')
      return
    }

    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/templates?id=${template.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Template deleted successfully!')
        onTemplateChange()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete template')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete template')
    }
  }

  const userTemplates = templates.filter((t) => !t.isDefault)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Your Custom Templates</h3>
          <p className="text-sm text-muted-foreground">Create and manage your own task templates</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {userTemplates.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">No custom templates yet</p>
          <Button variant="link" onClick={() => setShowCreateDialog(true)} className="mt-2">
            Create your first template
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {userTemplates.map((template) => (
            <div key={template.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{template.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted capitalize">{template.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                  <p className="text-xs text-muted-foreground italic line-clamp-2">{template.prompt}</p>
                </div>
                <div className="flex gap-1 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(template)} className="h-8 w-8 p-0">
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(template)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Custom Template</DialogTitle>
            <DialogDescription>Create a reusable template for common tasks</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                placeholder="e.g., Add Authentication"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of what this template does"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt Template</Label>
              <Textarea
                id="prompt"
                placeholder="Enter the task prompt. Use [PLACEHOLDER] for customizable parts."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use placeholders like [FEATURE_NAME] or [FILE_PATH] for parts users should customize
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Update your custom template</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Template Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Add Authentication"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Brief description of what this template does"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="edit-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-prompt">Prompt Template</Label>
              <Textarea
                id="edit-prompt"
                placeholder="Enter the task prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
