# Setup Your .env File

**IMPORTANT:** You provided actual API keys. Follow these steps to set them up securely.

## Step 1: Create .env File

Create a `.env` file in the project root (this file is in `.gitignore` and won't be committed):

```bash
cp .env.example .env
```

## Step 2: Add Your API Keys

Open the `.env` file and replace the placeholder values with your actual keys that you provided:

### Core Required Keys
```bash
POSTGRES_URL=postgresql://username:password@localhost:5432/coding_agent
GITHUB_TOKEN=ghp_your-github-token-here
VERCEL_TEAM_ID=your-team-id
VERCEL_PROJECT_ID=your-project-id
VERCEL_TOKEN=your-vercel-token
```

### Your Provided API Keys

**IMPORTANT:** Copy these from your original message. I've organized them here:

#### Core AI Services
- `E2B_API_KEY` - Code execution
- `ANTHROPIC_API_KEY` - Claude AI
- `OPENAI_API_KEY` - GPT models & DALL-E
- `XAI_API_KEY` - Grok
- `GROQ_API_KEY` - Fast inference
- `GEMINI_API_KEY` - Google AI

#### Extended Services  
- `RAGIE_API_KEY` - RAG/Knowledge
- `DEEPGRAM_API_KEY` - Speech
- `TOGETHERAI_API_KEY` - Open source models
- `SERPER_API_KEY` - Google Search
- `PERPLEXITY_API_KEY` - AI Search
- `MORPH_API_KEY` - Data API
- `FAL_API_KEY` - Fast AI inference

#### Tools & Automation
- `NEXT_PUBLIC_MEM0_API_KEY` - Memory
- `FIRECRAWL_API_KEY` + `NEXT_PUBLIC_FIRECRAWL_API_KEY` - Web scraping
- `COMPOSIO_API_KEY` - Tool integration
- `MULTIONAI_API_KEY` - Browser automation
- `SCRAPEGRAPH_API_KEY` - Graph scraping

#### Other Services
- `PERIGNON_API_KEY`
- `SEARCH1API_KEY`

#### OpenAI Extended
- `OPENAI_ASSISTANT_ID` - Party Martian Assistant
- `OPENAI_VECTOR_STORE_ID` - UFO Data Store

## Step 3: Verify Setup

Run this command to check which keys are set:

```bash
node -e "const dotenv = require('dotenv'); dotenv.config(); console.log(Object.keys(process.env).filter(k => k.includes('API_KEY') || k.includes('_KEY')).join('\n'));"
```

## Step 4: Apply Database Migrations

```bash
npm run db:push
```

## Step 5: Start the Application

```bash
npm run dev
```

Visit: http://localhost:3000

---

## Security Reminders

### ⚠️ CRITICAL SECURITY PRACTICES

1. **NEVER commit .env to git**
   - It's already in `.gitignore` ✅
   - Double-check before pushing: `git status`

2. **Rotate keys regularly**
   - Set a calendar reminder for 90 days
   - Rotate immediately if you suspect compromise

3. **Use environment-specific files**
   ```
   .env.local       # Local development (gitignored)
   .env.production  # Production (gitignored)
   .env.example     # Template only (safe to commit)
   ```

4. **Set up billing alerts**
   - OpenAI: https://platform.openai.com/account/billing/limits
   - Anthropic: https://console.anthropic.com/settings/limits
   - Vercel: https://vercel.com/dashboard/settings/billing

5. **Monitor usage**
   - Check API usage dashboards weekly
   - Set up alerts for unusual activity
   - Use rate limiting in production

---

## What Each Key Enables

### With Your Keys, You Can:

✅ **E2B_API_KEY**
- Alternative code execution sandboxes
- Faster than Vercel Sandbox for some use cases

✅ **ANTHROPIC_API_KEY**  
- Claude AI agent (primary coding agent)
- Required for core functionality

✅ **OPENAI_API_KEY**
- Codex agent for OpenAI models
- DALL-E image generation
- GPT-4 and GPT-5 access

✅ **Multiple Image Providers**
- OpenAI DALL-E (included above)
- Can add: Stability AI, Replicate, Fal AI

✅ **Search Capabilities**
- Serper (Google Search)
- Perplexity (AI Search)
- Search1API

✅ **Web Scraping**
- Firecrawl for website data extraction
- ScrapeGraph for structured scraping

✅ **Fast Inference**
- Groq for ultra-fast LLM responses
- Together AI for open-source models

✅ **Extended AI Models**
- xAI Grok
- Google Gemini
- Various open-source models

---

## Testing Your Setup

### 1. Test Database Connection
```bash
npm run db:studio
```
Visit: http://localhost:4983

### 2. Test Core Features
1. Create a task with Claude agent ✓
2. Generate an image with OpenAI ✓
3. View task in task details ✓

### 3. Test Custom Agents
1. Go to Settings → Custom Agents
2. Add a custom agent endpoint
3. Use it in a task

### 4. Test Templates
1. Go to Settings → Templates
2. Create a custom template
3. Use it from task form

---

## Common Issues

### "Cannot find module 'dotenv'"
```bash
npm install
```

### "POSTGRES_URL not set"
1. Make sure `.env` file exists
2. Check the file has `POSTGRES_URL=...`
3. Restart the dev server

### "Invalid API key format"
1. Check for extra spaces or quotes
2. Ensure key starts with correct prefix (e.g., `sk-ant-`, `sk-proj-`)
3. Verify key is active in provider dashboard

### "Module not found" errors
```bash
npm install
```

### Database errors
```bash
npm run db:push
```

---

## File Checklist

After setup, you should have:

```
project-root/
├── .env                    ✅ Created (with your keys)
├── .env.example           ✅ Template (committed to git)
├── .gitignore             ✅ Contains .env
├── package.json           ✅ 
├── lib/db/migrations/     ✅ Applied with db:push
└── node_modules/          ✅ Installed
```

---

## Next Steps

1. ✅ Set up `.env` with your keys
2. ✅ Run `npm run db:push`
3. ✅ Run `npm run dev`
4. ✅ Create your first task
5. ✅ Explore Settings → Templates
6. ✅ Explore Settings → Custom Agents
7. ✅ Generate an image
8. ✅ Review the new features docs

---

## Cost Tracking

With all these keys active, monitor your usage:

### Monthly Budget Example
- Anthropic (Claude): $50-150
- OpenAI (GPT + Images): $50-100
- Vercel Sandbox: $20-100
- Other services: $20-50
- **Total**: ~$140-400/month (depending on usage)

### Set Alerts
1. OpenAI: Set $100/month limit
2. Anthropic: Set $150/month limit
3. Vercel: Set $100/month limit

---

## Support

If you encounter issues:

1. Check `API_KEYS_GUIDE.md` for provider-specific help
2. Review `NEW_FEATURES.md` for feature documentation
3. Check console logs for errors
4. Verify API key is active in provider dashboard

**Ready to build! 🚀**

---

## Quick Command Reference

```bash
# Setup
cp .env.example .env           # Create env file
npm install                    # Install dependencies
npm run db:push                # Apply migrations

# Development
npm run dev                    # Start dev server
npm run db:studio              # Open database GUI

# Database
npm run db:generate            # Generate migrations
npm run db:push                # Apply migrations
npm run db:migrate             # Run migrations (alternative)

# Code Quality
npm run lint                   # Check linting
npm run type-check             # Check TypeScript
npm run format                 # Format code
```

Done! Your environment is ready to use all the amazing features! 🎉
