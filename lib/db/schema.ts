import { pgTable, text, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core'
import { z } from 'zod'

// Log entry types
export const logEntrySchema = z.object({
  type: z.enum(['info', 'command', 'error', 'success']),
  message: z.string(),
  timestamp: z.date().optional(),
})

export type LogEntry = z.infer<typeof logEntrySchema>

export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),
  prompt: text('prompt').notNull(),
  repoUrl: text('repo_url'),
  selectedAgent: text('selected_agent').default('claude'),
  selectedModel: text('selected_model'),
  installDependencies: boolean('install_dependencies').default(false),
  maxDuration: integer('max_duration').default(5),
  status: text('status', {
    enum: ['pending', 'queued', 'processing', 'completed', 'error', 'stopped'],
  })
    .notNull()
    .default('pending'),
  queuePosition: integer('queue_position'),
  progress: integer('progress').default(0),
  logs: jsonb('logs').$type<LogEntry[]>(),
  error: text('error'),
  branchName: text('branch_name'),
  sandboxUrl: text('sandbox_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
})

// Manual Zod schemas for validation
export const insertTaskSchema = z.object({
  id: z.string().optional(),
  prompt: z.string().min(1, 'Prompt is required'),
  repoUrl: z.string().url('Must be a valid URL').optional(),
  selectedAgent: z.enum(['claude', 'codex', 'cursor', 'opencode']).default('claude'),
  selectedModel: z.string().optional(),
  installDependencies: z.boolean().default(false),
  maxDuration: z.number().default(5),
  status: z.enum(['pending', 'queued', 'processing', 'completed', 'error', 'stopped']).default('pending'),
  queuePosition: z.number().optional(),
  progress: z.number().min(0).max(100).default(0),
  logs: z.array(logEntrySchema).optional(),
  error: z.string().optional(),
  branchName: z.string().optional(),
  sandboxUrl: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  completedAt: z.date().optional(),
})

export const selectTaskSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  repoUrl: z.string().nullable(),
  selectedAgent: z.string().nullable(),
  selectedModel: z.string().nullable(),
  installDependencies: z.boolean().nullable(),
  maxDuration: z.number().nullable(),
  status: z.enum(['pending', 'queued', 'processing', 'completed', 'error', 'stopped']),
  queuePosition: z.number().nullable(),
  progress: z.number().nullable(),
  logs: z.array(logEntrySchema).nullable(),
  error: z.string().nullable(),
  branchName: z.string().nullable(),
  sandboxUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().nullable(),
})

export type Task = z.infer<typeof selectTaskSchema>
export type InsertTask = z.infer<typeof insertTaskSchema>

// Templates table
export const templates = pgTable('templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  prompt: text('prompt').notNull(),
  category: text('category', {
    enum: ['feature', 'bugfix', 'refactor', 'docs', 'test', 'chore'],
  }).notNull(),
  isDefault: boolean('is_default').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const insertTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  prompt: z.string().min(1, 'Prompt is required'),
  category: z.enum(['feature', 'bugfix', 'refactor', 'docs', 'test', 'chore']),
  isDefault: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const selectTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  prompt: z.string(),
  category: z.enum(['feature', 'bugfix', 'refactor', 'docs', 'test', 'chore']),
  isDefault: z.boolean().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Template = z.infer<typeof selectTemplateSchema>
export type InsertTemplate = z.infer<typeof insertTemplateSchema>

// Custom Agents table
export const customAgents = pgTable('custom_agents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  apiEndpoint: text('api_endpoint').notNull(),
  apiKey: text('api_key'),
  defaultModel: text('default_model'),
  icon: text('icon'), // URL or emoji
  configOptions: jsonb('config_options').$type<Record<string, any>>(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const insertCustomAgentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  apiEndpoint: z.string().url('Must be a valid URL'),
  apiKey: z.string().optional(),
  defaultModel: z.string().optional(),
  icon: z.string().optional(),
  configOptions: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const selectCustomAgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  apiEndpoint: z.string(),
  apiKey: z.string().nullable(),
  defaultModel: z.string().nullable(),
  icon: z.string().nullable(),
  configOptions: z.record(z.any()).nullable(),
  isActive: z.boolean().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type CustomAgent = z.infer<typeof selectCustomAgentSchema>
export type InsertCustomAgent = z.infer<typeof insertCustomAgentSchema>

// Image Generation table - stores generated images
export const generatedImages = pgTable('generated_images', {
  id: text('id').primaryKey(),
  taskId: text('task_id'),
  prompt: text('prompt').notNull(),
  imageUrl: text('image_url').notNull(),
  model: text('model'),
  provider: text('provider'), // e.g., 'openai', 'stability-ai', 'replicate'
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const insertGeneratedImageSchema = z.object({
  id: z.string().optional(),
  taskId: z.string().optional(),
  prompt: z.string().min(1, 'Prompt is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  model: z.string().optional(),
  provider: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
})

export const selectGeneratedImageSchema = z.object({
  id: z.string(),
  taskId: z.string().nullable(),
  prompt: z.string(),
  imageUrl: z.string(),
  model: z.string().nullable(),
  provider: z.string().nullable(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.date(),
})

export type GeneratedImage = z.infer<typeof selectGeneratedImageSchema>
export type InsertGeneratedImage = z.infer<typeof insertGeneratedImageSchema>
