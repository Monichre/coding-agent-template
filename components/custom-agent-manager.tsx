'use client'

import { useState } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { CustomAgent } from '@/lib/db/schema'
import { Pencil, Trash2, Plus, Bot } from 'lucide-react'

interface CustomAgentManagerProps {
  agents: CustomAgent[]
  onAgentChange: () => void
}

export function CustomAgentManager({ agents, onAgentChange }: CustomAgentManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingAgent, setEditingAgent] = useState<CustomAgent | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [apiEndpoint, setApiEndpoint] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [defaultModel, setDefaultModel] = useState('')
  const [icon, setIcon] = useState('🤖')
  const [isActive, setIsActive] = useState(true)

  const resetForm = () => {
    setName('')
    setDescription('')
    setApiEndpoint('')
    setApiKey('')
    setDefaultModel('')
    setIcon('🤖')
    setIsActive(true)
    setEditingAgent(null)
  }

  const openEditDialog = (agent: CustomAgent) => {
    setEditingAgent(agent)
    setName(agent.name)
    setDescription(agent.description)
    setApiEndpoint(agent.apiEndpoint)
    setApiKey(agent.apiKey || '')
    setDefaultModel(agent.defaultModel || '')
    setIcon(agent.icon || '🤖')
    setIsActive(agent.isActive ?? true)
    setShowEditDialog(true)
  }

  const handleCreate = async () => {
    if (!name || !description || !apiEndpoint) {
      toast.error('Name, description, and API endpoint are required')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/custom-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          apiEndpoint,
          apiKey: apiKey || undefined,
          defaultModel: defaultModel || undefined,
          icon: icon || '🤖',
          isActive,
        }),
      })

      if (response.ok) {
        toast.success('Custom agent created successfully!')
        setShowCreateDialog(false)
        resetForm()
        onAgentChange()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create agent')
      }
    } catch (error) {
      console.error('Error creating agent:', error)
      toast.error('Failed to create agent')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingAgent || !name || !description || !apiEndpoint) {
      toast.error('Name, description, and API endpoint are required')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/custom-agents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAgent.id,
          name,
          description,
          apiEndpoint,
          apiKey: apiKey || undefined,
          defaultModel: defaultModel || undefined,
          icon: icon || '🤖',
          isActive,
        }),
      })

      if (response.ok) {
        toast.success('Custom agent updated successfully!')
        setShowEditDialog(false)
        resetForm()
        onAgentChange()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update agent')
      }
    } catch (error) {
      console.error('Error updating agent:', error)
      toast.error('Failed to update agent')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (agent: CustomAgent) => {
    if (!confirm(`Are you sure you want to delete "${agent.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/custom-agents?id=${agent.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Custom agent deleted successfully!')
        onAgentChange()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete agent')
      }
    } catch (error) {
      console.error('Error deleting agent:', error)
      toast.error('Failed to delete agent')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Custom Agents</h3>
          <p className="text-sm text-muted-foreground">Connect your own AI agents or custom endpoints</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Agent
        </Button>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No custom agents yet</p>
          <Button variant="link" onClick={() => setShowCreateDialog(true)} className="mt-2">
            Add your first custom agent
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {agents.map((agent) => (
            <div key={agent.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl">{agent.icon || '🤖'}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{agent.name}</h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${agent.isActive ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-600'}`}
                      >
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Endpoint:</span>
                        <code className="bg-muted px-1.5 py-0.5 rounded">{agent.apiEndpoint}</code>
                      </div>
                      {agent.defaultModel && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Model:</span>
                          <span>{agent.defaultModel}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(agent)} className="h-8 w-8 p-0">
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(agent)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Custom Agent</DialogTitle>
            <DialogDescription>Connect your own AI agent or custom API endpoint</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., My Custom Agent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  placeholder="🤖"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={2}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of what this agent does"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiEndpoint">API Endpoint</Label>
              <Input
                id="apiEndpoint"
                placeholder="https://api.example.com/v1/agent"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                The endpoint should accept POST requests with prompt and return results
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key (Optional)</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultModel">Default Model (Optional)</Label>
              <Input
                id="defaultModel"
                placeholder="e.g., gpt-4"
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Agent'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Custom Agent</DialogTitle>
            <DialogDescription>Update your custom agent configuration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Agent Name</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., My Custom Agent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon (Emoji)</Label>
                <Input
                  id="edit-icon"
                  placeholder="🤖"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={2}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Brief description of what this agent does"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-apiEndpoint">API Endpoint</Label>
              <Input
                id="edit-apiEndpoint"
                placeholder="https://api.example.com/v1/agent"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-apiKey">API Key (Optional)</Label>
              <Input
                id="edit-apiKey"
                type="password"
                placeholder="Your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-defaultModel">Default Model (Optional)</Label>
              <Input
                id="edit-defaultModel"
                placeholder="e.g., gpt-4"
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="edit-isActive" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Agent'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
