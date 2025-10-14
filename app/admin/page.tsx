'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Database,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  FileText,
  Bot,
  Image as ImageIcon,
  TrendingUp,
  Users,
  Activity,
} from 'lucide-react'

interface Stats {
  tasks: {
    total: number
    pending: number
    processing: number
    completed: number
    failed: number
    queued: number
  }
  templates: {
    total: number
    custom: number
    default: number
  }
  customAgents: {
    total: number
    active: number
    inactive: number
  }
  images: {
    total: number
    providers: Record<string, number>
  }
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !stats) {
    return (
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Admin Dashboard" description="Monitor and manage your coding agent platform" />

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tasks.total}</div>
              <p className="text-xs text-muted-foreground">{stats.tasks.completed} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.templates.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.templates.custom} custom, {stats.templates.default} default
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custom Agents</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.customAgents.total}</div>
              <p className="text-xs text-muted-foreground">{stats.customAgents.active} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Images</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.images.total}</div>
              <p className="text-xs text-muted-foreground">Generated images</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full max-w-xl grid-cols-4">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Statistics</CardTitle>
                <CardDescription>Overview of all tasks in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold">{stats.tasks.pending}</p>
                        <p className="text-sm text-muted-foreground">Pending</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-2xl font-bold">{stats.tasks.queued}</p>
                        <p className="text-sm text-muted-foreground">Queued</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{stats.tasks.processing}</p>
                        <p className="text-sm text-muted-foreground">Processing</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{stats.tasks.completed}</p>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-2xl font-bold">{stats.tasks.failed}</p>
                        <p className="text-sm text-muted-foreground">Failed</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-2xl font-bold">
                          {stats.tasks.completed > 0
                            ? Math.round((stats.tasks.completed / stats.tasks.total) * 100)
                            : 0}
                          %
                        </p>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button asChild>
                      <a href="/api/admin/tasks/export">Export All Tasks</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Library</CardTitle>
                <CardDescription>Manage your task templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-3xl font-bold">{stats.templates.total}</p>
                      <p className="text-sm text-muted-foreground">Total Templates</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{stats.templates.custom}</p>
                      <p className="text-sm text-muted-foreground">Custom Templates</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-x-2">
                    <Button asChild>
                      <a href="/settings">Manage Templates</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Agents</CardTitle>
                <CardDescription>Overview of your custom AI agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-3xl font-bold">{stats.customAgents.total}</p>
                      <p className="text-sm text-muted-foreground">Total Agents</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-500">
                          {stats.customAgents.active}
                        </Badge>
                        <Badge variant="secondary">{stats.customAgents.inactive}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Active / Inactive</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-x-2">
                    <Button asChild>
                      <a href="/settings">Manage Agents</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Generated Images</CardTitle>
                <CardDescription>AI image generation statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold">{stats.images.total}</p>
                    <p className="text-sm text-muted-foreground">Total Images Generated</p>
                  </div>

                  {Object.keys(stats.images.providers).length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2">By Provider:</p>
                      <div className="space-y-2">
                        {Object.entries(stats.images.providers).map(([provider, count]) => (
                          <div key={provider} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{provider}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Database</p>
                <p className="font-medium">PostgreSQL (Drizzle ORM)</p>
              </div>
              <div>
                <p className="text-muted-foreground">Queue System</p>
                <p className="font-medium">Active (Max 3 concurrent)</p>
              </div>
              <div>
                <p className="text-muted-foreground">Built-in Agents</p>
                <p className="font-medium">Claude, Codex, Cursor, OpenCode</p>
              </div>
              <div>
                <p className="text-muted-foreground">Image Providers</p>
                <p className="font-medium">OpenAI, Stability AI, Replicate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
