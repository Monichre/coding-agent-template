'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TemplateManager } from '@/components/template-manager'
import { CustomAgentManager } from '@/components/custom-agent-manager'
import { Template, CustomAgent } from '@/lib/db/schema'
import { Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [agents, setAgents] = useState<CustomAgent[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)
  const [isLoadingAgents, setIsLoadingAgents] = useState(true)

  const fetchTemplates = async () => {
    setIsLoadingTemplates(true)
    try {
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setIsLoadingTemplates(false)
    }
  }

  const fetchAgents = async () => {
    setIsLoadingAgents(true)
    try {
      const response = await fetch('/api/custom-agents')
      if (response.ok) {
        const data = await response.json()
        setAgents(data.agents)
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    } finally {
      setIsLoadingAgents(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
    fetchAgents()
  }, [])

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader title="Settings" description="Manage your custom templates and agents" />

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="agents">Custom Agents</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-6">
            {isLoadingTemplates ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <TemplateManager templates={templates} onTemplateChange={fetchTemplates} />
            )}
          </TabsContent>

          <TabsContent value="agents" className="mt-6">
            {isLoadingAgents ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <CustomAgentManager agents={agents} onAgentChange={fetchAgents} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
