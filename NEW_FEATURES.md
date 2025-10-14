# New Features Documentation

This document describes the three major features added to the Coding Agent Template: Custom Prompts, Custom Agents, and Image Generation.

---

## 1. Custom Prompts (Template Management)

### Overview
Users can now create, edit, and manage their own custom task templates in addition to the 12 built-in templates.

### Features
- **Create custom templates** with name, description, prompt, and category
- **Edit existing custom templates** (default templates cannot be edited)
- **Delete custom templates** (default templates cannot be deleted)
- **Categorize templates** by: feature, bugfix, refactor, docs, test, chore
- **Use placeholders** in templates (e.g., `[FEATURE_NAME]`, `[FILE_PATH]`)

### How to Use

#### Access Template Manager
1. Click the **Settings** link in the sidebar (at the bottom)
2. Navigate to the **Templates** tab

#### Create a New Template
1. Click **"New Template"** button
2. Fill in the form:
   - **Template Name**: Short descriptive name (e.g., "Add Authentication")
   - **Description**: Brief explanation of what it does
   - **Category**: Choose from feature, bugfix, refactor, docs, test, or chore
   - **Prompt Template**: The actual prompt text with optional placeholders
3. Click **"Create Template"**

#### Use a Template
1. Go to the home page
2. Click the **File icon** button next to the agent selector
3. Browse templates by category
4. Click on a template to auto-fill the prompt

#### Edit a Template
1. Go to Settings → Templates
2. Find your custom template (shown under "Your Custom Templates")
3. Click the **pencil icon**
4. Make your changes
5. Click **"Update Template"**

#### Delete a Template
1. Go to Settings → Templates
2. Find your custom template
3. Click the **trash icon**
4. Confirm deletion

### Technical Details

**API Endpoints:**
- `GET /api/templates` - Fetch all templates
- `POST /api/templates` - Create a new template
- `PUT /api/templates` - Update a template
- `DELETE /api/templates?id={id}` - Delete a template

**Database Schema:**
```sql
templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL,
  is_default BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

**Components:**
- `components/template-manager.tsx` - Management UI
- `lib/templates/default-templates.ts` - Built-in templates

---

## 2. Custom Agents

### Overview
Connect your own AI agents or custom API endpoints to execute tasks. Custom agents allow you to integrate any external AI service or custom code execution endpoint.

### Features
- **Add unlimited custom agents** with unique configurations
- **Configure API endpoints** and authentication
- **Set default models** for each agent
- **Activate/deactivate agents** without deletion
- **Use custom icons** (emojis) to distinguish agents
- **Secure API key storage** for authenticated endpoints

### How to Use

#### Access Custom Agent Manager
1. Click the **Settings** link in the sidebar
2. Navigate to the **Custom Agents** tab

#### Add a New Agent
1. Click **"New Agent"** button
2. Fill in the configuration:
   - **Agent Name**: Display name (e.g., "My Custom AI")
   - **Icon**: Emoji icon (e.g., 🤖, 🎯, ⚡)
   - **Description**: What this agent does
   - **API Endpoint**: Full URL to your agent's API
   - **API Key** (Optional): Bearer token for authentication
   - **Default Model** (Optional): Model identifier to use
   - **Active**: Toggle to enable/disable the agent
3. Click **"Create Agent"**

#### Use a Custom Agent
1. Go to the home page
2. Open the **Agent** dropdown
3. Scroll down to the "Custom Agents" section
4. Select your custom agent
5. Create your task as normal

#### Custom Agent API Requirements

Your custom agent endpoint should:

**Accept POST requests with:**
```json
{
  "prompt": "The task instruction",
  "model": "optional-model-name"
}
```

**Return JSON response:**
```json
{
  "output": "Summary of what was done",
  "files": [
    {
      "path": "src/file.ts",
      "content": "file content here",
      "operation": "write" // or "delete"
    }
  ],
  "commands": [
    "npm install",
    "npm test"
  ],
  "changesDetected": true
}
```

**Authentication:**
- If an API key is configured, it will be sent as: `Authorization: Bearer {apiKey}`

### Technical Details

**API Endpoints:**
- `GET /api/custom-agents` - Fetch all custom agents
- `POST /api/custom-agents` - Create a new agent
- `PUT /api/custom-agents` - Update an agent
- `DELETE /api/custom-agents?id={id}` - Delete an agent

**Database Schema:**
```sql
custom_agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  api_endpoint TEXT NOT NULL,
  api_key TEXT,
  default_model TEXT,
  icon TEXT,
  config_options JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

**Components:**
- `components/custom-agent-manager.tsx` - Management UI
- `lib/sandbox/agents/custom.ts` - Custom agent executor
- `lib/sandbox/agents/index.ts` - Updated to route custom agents

**Example Custom Agent Response:**
```javascript
// Your custom agent endpoint
app.post('/api/agent', async (req, res) => {
  const { prompt, model } = req.body;
  
  // Your AI logic here
  const result = await yourAI.process(prompt);
  
  res.json({
    output: "Task completed successfully",
    files: [
      {
        path: "example.txt",
        content: "Hello World",
        operation: "write"
      }
    ],
    changesDetected: true
  });
});
```

---

## 3. Image Generation

### Overview
Generate AI images using multiple providers: OpenAI DALL-E, Stability AI, or Replicate. Generated images are stored and associated with tasks.

### Features
- **Multiple providers**: OpenAI, Stability AI, Replicate
- **Automatic provider selection** based on API keys
- **Download generated images**
- **View images in task details**
- **Store image metadata** (prompt, model, provider)

### How to Use

#### Generate an Image

**From Home Page:**
1. Click **"Generate Image"** button below the task form
2. Enter your image prompt
3. Select a provider:
   - **DALL-E 3 (OpenAI)**: Best for photorealistic and artistic images
   - **Stable Diffusion (Stability AI)**: Great for creative artwork
   - **Replicate**: Access to various community models
4. Click **"Generate Image"**
5. Wait for generation (typically 10-30 seconds)
6. Download or generate another

**From Task Page:**
- Generated images appear automatically if any were created for that task

#### Setup Required API Keys

Add to your `.env` file:

```bash
# OpenAI (for DALL-E)
OPENAI_API_KEY=sk-your-openai-key-here

# Stability AI (for Stable Diffusion)
STABILITY_API_KEY=your-stability-api-key-here

# Replicate (for various models)
REPLICATE_API_TOKEN=your-replicate-token-here
```

**Note:** You only need to set up keys for the providers you want to use.

#### Tips for Better Results

1. **Be specific**: Instead of "a dog", try "a golden retriever puppy playing in a sunny park"
2. **Include style**: Add terms like "digital art", "photorealistic", "watercolor", "3D render"
3. **Specify details**: Mention lighting, mood, colors, composition
4. **Avoid contradictions**: Keep prompts coherent and consistent

### Technical Details

**API Endpoints:**
- `POST /api/images/generate` - Generate a new image
- `GET /api/images/generate?taskId={id}` - Get images for a task

**Database Schema:**
```sql
generated_images (
  id TEXT PRIMARY KEY,
  task_id TEXT,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  model TEXT,
  provider TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
)
```

**Components:**
- `components/image-generator.tsx` - Generation dialog
- `components/task-images.tsx` - Display images in task details
- `app/api/images/generate/route.ts` - API handler

**Provider Integration:**

**OpenAI DALL-E 3:**
- Endpoint: `https://api.openai.com/v1/images/generations`
- Models: `dall-e-3`, `dall-e-2`
- Size: 1024x1024
- Quality: standard

**Stability AI:**
- Endpoint: `https://api.stability.ai/v2beta/stable-image/generate/core`
- Models: `stable-diffusion-xl`
- Format: PNG

**Replicate:**
- Endpoint: `https://api.replicate.com/v1/predictions`
- Models: Various community models
- Async prediction with polling

---

## Database Migrations

### Apply Migrations

Run this command to create the new tables:

```bash
npm run db:push
```

Or if you prefer migrations:

```bash
npm run db:migrate
```

### Migration Generated

**File:** `lib/db/migrations/0007_cooing_maximus.sql`

Creates three new tables:
1. `templates` - Custom task templates
2. `custom_agents` - Custom AI agent configurations
3. `generated_images` - Generated image records

---

## Environment Variables

### Required for Image Generation

Add these to your `.env` file (only the ones you plan to use):

```bash
# OpenAI DALL-E (Optional)
OPENAI_API_KEY=sk-your-key-here

# Stability AI (Optional)
STABILITY_API_KEY=your-key-here

# Replicate (Optional)
REPLICATE_API_TOKEN=your-token-here
```

---

## UI Improvements

### New Settings Page

**Location:** `/settings`

**Access:** Click "Settings" in the sidebar

**Tabs:**
1. **Templates** - Manage custom task templates
2. **Custom Agents** - Configure external AI agents

### Updated Components

1. **Task Form** (`components/task-form.tsx`)
   - Template selector button (file icon)
   - Image generator button
   - Custom agents in agent dropdown

2. **Task Sidebar** (`components/task-sidebar.tsx`)
   - Settings link at bottom

3. **Task Details** (`components/task-page-client.tsx`)
   - Generated images display

---

## File Structure

### New Files Created

```
app/
├── settings/
│   └── page.tsx                        # Settings page
├── api/
│   ├── custom-agents/
│   │   └── route.ts                    # Custom agents CRUD API
│   └── images/
│       └── generate/
│           └── route.ts                # Image generation API

components/
├── template-manager.tsx                # Template management UI
├── custom-agent-manager.tsx            # Custom agent management UI
├── image-generator.tsx                 # Image generation dialog
├── task-images.tsx                     # Display images in tasks
└── ui/
    └── switch.tsx                      # Switch component (new)

lib/
├── templates/
│   └── default-templates.ts            # Built-in templates
└── sandbox/
    └── agents/
        └── custom.ts                   # Custom agent executor
```

### Modified Files

```
lib/db/schema.ts                        # Added 3 new tables
lib/sandbox/agents/index.ts             # Support custom agents
components/task-form.tsx                # Template & image buttons
components/task-sidebar.tsx             # Settings link
components/task-page-client.tsx         # Display images
app/api/templates/route.ts              # Added PUT endpoint
```

---

## Usage Examples

### Example 1: Create a Custom Template

```javascript
// Template: Add User Authentication
{
  name: "Add User Authentication",
  description: "Implement JWT-based authentication",
  category: "feature",
  prompt: `Add JWT authentication to the project:
1. Create user model with [DB_TYPE]
2. Add login/register endpoints
3. Implement JWT token generation
4. Add authentication middleware
5. Protect routes that require auth

Use [AUTH_LIBRARY] for password hashing.`
}
```

### Example 2: Connect Custom Agent

```javascript
// Custom Agent: Local LLM
{
  name: "Local LLM",
  description: "Run LLaMA locally via Ollama",
  apiEndpoint: "http://localhost:11434/api/generate",
  icon: "🦙",
  defaultModel: "llama2",
  isActive: true
}
```

### Example 3: Generate Image

```javascript
// Good prompt for logo design
"A modern, minimalist logo for a tech startup 
called 'CodeFlow'. Use blue and white colors. 
Clean geometric shapes. Professional. Vector style."

// Good prompt for mockup
"A smartphone mockup showing a task management app 
interface. Clean UI, light theme, rounded corners. 
Photorealistic. On a white desk with coffee mug."
```

---

## Troubleshooting

### Templates

**Issue:** Can't edit a template
- **Solution:** Only custom templates can be edited. Default templates are read-only.

**Issue:** Template not appearing in list
- **Solution:** Make sure you created it successfully. Check Settings → Templates.

### Custom Agents

**Issue:** Custom agent not working
- **Solutions:**
  1. Check if agent is marked as "Active"
  2. Verify API endpoint is accessible
  3. Check API key is correct
  4. Review agent API response format

**Issue:** Agent appears in dropdown but task fails
- **Solution:** Your agent API must return the correct response format. Check logs.

### Image Generation

**Issue:** "API key not configured" error
- **Solution:** Add the appropriate API key to `.env` file and restart the server.

**Issue:** Generation is slow
- **Solution:** Image generation typically takes 10-30 seconds. This is normal.

**Issue:** Image doesn't appear in task
- **Solution:** Make sure you selected a task ID when generating, or generate from the task page.

---

## Best Practices

### Template Design
1. Use descriptive names
2. Include clear step-by-step instructions
3. Use `[PLACEHOLDERS]` for customizable parts
4. Add context about tools/libraries to use
5. Specify desired file structure

### Custom Agent Design
1. Return structured, consistent responses
2. Include error handling in your agent
3. Test endpoint before adding to platform
4. Use descriptive names and icons
5. Document your agent's capabilities

### Image Generation
1. Be specific and detailed in prompts
2. Mention style, mood, and composition
3. Test with different providers for best results
4. Download important images immediately
5. Keep prompts under 400 characters for DALL-E

---

## API Reference

### Templates API

```typescript
// GET /api/templates
Response: { templates: Template[] }

// POST /api/templates
Body: {
  name: string
  description: string
  prompt: string
  category: 'feature' | 'bugfix' | 'refactor' | 'docs' | 'test' | 'chore'
}
Response: { template: Template }

// PUT /api/templates
Body: {
  id: string
  name?: string
  description?: string
  prompt?: string
  category?: string
}
Response: { template: Template }

// DELETE /api/templates?id={id}
Response: { success: boolean }
```

### Custom Agents API

```typescript
// GET /api/custom-agents
Response: { agents: CustomAgent[] }

// POST /api/custom-agents
Body: {
  name: string
  description: string
  apiEndpoint: string
  apiKey?: string
  defaultModel?: string
  icon?: string
  isActive?: boolean
}
Response: { agent: CustomAgent }

// PUT /api/custom-agents
Body: {
  id: string
  [key: string]: any
}
Response: { agent: CustomAgent }

// DELETE /api/custom-agents?id={id}
Response: { success: boolean }
```

### Images API

```typescript
// POST /api/images/generate
Body: {
  prompt: string
  provider: 'openai' | 'stability-ai' | 'replicate'
  taskId?: string
  model?: string
}
Response: {
  image: {
    id: string
    imageUrl: string
    prompt: string
    provider: string
    model: string
    metadata: object
  }
}

// GET /api/images/generate?taskId={id}
Response: { images: GeneratedImage[] }
```

---

## Future Enhancements

Potential improvements for these features:

### Templates
- [ ] Import/export templates as JSON
- [ ] Share templates with team
- [ ] Template versioning
- [ ] Template categories with tags

### Custom Agents
- [ ] Test agent connectivity
- [ ] Agent usage analytics
- [ ] Batch processing support
- [ ] Custom agent marketplace

### Image Generation
- [ ] Image editing/variations
- [ ] Batch generation
- [ ] Image-to-image transformation
- [ ] Custom image sizes/formats
- [ ] Image gallery view

---

## Support

For issues or questions:
1. Check this documentation
2. Review example code in the repository
3. Check API endpoint logs
4. Verify environment variables are set

Happy coding! 🚀
