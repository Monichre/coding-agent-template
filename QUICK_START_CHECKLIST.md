# Quick Start Checklist ✅

Use this checklist to get up and running with all your API keys and new features.

---

## Step 1: Environment Setup

### 1.1 Create .env File
```bash
cp .env.example .env
```
- [ ] File created

### 1.2 Add Your API Keys

Open `.env` and add your keys (you provided them earlier):

**Required (Core Functionality):**
- [ ] `POSTGRES_URL` - Your database URL
- [ ] `ANTHROPIC_API_KEY` - Your Claude key
- [ ] `GITHUB_TOKEN` - Your GitHub token
- [ ] `VERCEL_TEAM_ID` - Your Vercel team
- [ ] `VERCEL_PROJECT_ID` - Your Vercel project
- [ ] `VERCEL_TOKEN` - Your Vercel token

**Your Additional Keys:**
- [ ] `E2B_API_KEY` - e2b_eebfcfdfcc5c9455228693f8545d829fc05128e9
- [ ] `OPENAI_API_KEY` - sk-proj-e5utiJzC... (your key)
- [ ] `ANTHROPIC_API_KEY` - sk-ant-api03-BP3g92Z3... (your key)
- [ ] `XAI_API_KEY` - xai-AqOPbpwh... (your key)
- [ ] `GROQ_API_KEY` - gsk_Q3ioStzP... (your key)
- [ ] `GEMINI_API_KEY` - AIzaSyD_fv79... (your key)
- [ ] `RAGIE_API_KEY` - tnt_KgH8k3C2... (your key)
- [ ] `DEEPGRAM_API_KEY` - 58db455a6f... (your key)
- [ ] `TOGETHERAI_API_KEY` - bc3acfa5317... (your key)
- [ ] `SERPER_API_KEY` - 773974adef... (your key)
- [ ] `PERPLEXITY_API_KEY` - pplx-sCRkYN... (your key)
- [ ] `NEXT_PUBLIC_MEM0_API_KEY` - m0-12SZ3wZ... (your key)
- [ ] `FIRECRAWL_API_KEY` - fc-1533e8a... (your key)
- [ ] `NEXT_PUBLIC_FIRECRAWL_API_KEY` - fc-1533e8a... (same as above)
- [ ] `COMPOSIO_API_KEY` - mfcv0l300... (your key)
- [ ] `MULTIONAI_API_KEY` - 602e191c7... (your key)
- [ ] `PERIGNON_API_KEY` - 065efe41-6c... (your key)
- [ ] `SEARCH1API_KEY` - C758D027-BA... (your key)
- [ ] `SCRAPEGRAPH_API_KEY` - sgai-130e88... (your key)
- [ ] `MORPH_API_KEY` - sk-bOj2Ksk... (your key)
- [ ] `FAL_API_KEY` - 7df1836b-ed... (your key)
- [ ] `OPENAI_ASSISTANT_ID` - asst_sdNxYC9... (your ID)
- [ ] `OPENAI_VECTOR_STORE_ID` - vs_meWOEnU... (your ID)

### 1.3 Verify .env Is Gitignored
```bash
git status
```
Should **NOT** show `.env` file
- [ ] `.env` is not in git status

---

## Step 2: Install & Setup

### 2.1 Install Dependencies
```bash
npm install
```
- [ ] Dependencies installed

### 2.2 Apply Database Migrations
```bash
npm run db:push
```
- [ ] Migration applied successfully
- [ ] Tables created: `tasks`, `templates`, `custom_agents`, `generated_images`

### 2.3 Start Development Server
```bash
npm run dev
```
- [ ] Server running on http://localhost:3000

---

## Step 3: Test Core Features

### 3.1 Create a Task
1. Visit http://localhost:3000
2. Select a repository
3. Choose Claude agent
4. Enter a prompt
5. Click submit
- [ ] Task created successfully
- [ ] Task appears in sidebar
- [ ] Logs are streaming

### 3.2 Test Queue System
1. Create 4 tasks quickly
2. Watch 3 run, 1 get queued
- [ ] Queue system working
- [ ] Queue position shown in sidebar

---

## Step 4: Test New Features

### 4.1 Custom Templates
1. Click "Settings" in sidebar
2. Go to "Templates" tab
3. Click "New Template"
4. Create a test template
5. Use it from home page (file icon)
- [ ] Can create custom templates
- [ ] Can edit custom templates
- [ ] Can delete custom templates
- [ ] Can use templates in task form

### 4.2 Custom Agents
1. Go to Settings → "Custom Agents" tab
2. Click "New Agent"
3. Add a test agent:
   - Name: "Test Agent"
   - Endpoint: https://api.example.com/agent (can be fake for testing)
   - Icon: 🧪
4. Check task form agent dropdown
- [ ] Can create custom agents
- [ ] Custom agents appear in dropdown
- [ ] Can edit/delete custom agents

### 4.3 Image Generation
1. On home page, click "Generate Image"
2. Enter prompt: "A futuristic robot coding"
3. Select OpenAI provider
4. Click "Generate Image"
5. Download the image
- [ ] Image generated successfully
- [ ] Can download image
- [ ] Image appears in UI

---

## Step 5: Test Built-In Agents

### 5.1 Claude Agent (Primary)
- [ ] Create task with Claude
- [ ] Task executes successfully
- [ ] Changes pushed to GitHub

### 5.2 Codex Agent (OpenAI)
- [ ] Select "Codex" agent
- [ ] Create task
- [ ] Task executes

### 5.3 Custom Agent (If configured)
- [ ] Select custom agent
- [ ] Task attempts execution

---

## Step 6: Review New Documentation

- [ ] Read `NEW_FEATURES.md` - Full feature guide
- [ ] Read `API_KEYS_GUIDE.md` - All API key info
- [ ] Read `FEATURES_SUMMARY.md` - Quick reference
- [ ] Read `IMPROVEMENTS.md` - Previous improvements
- [ ] Read `SETUP_YOUR_ENV.md` - This setup guide

---

## Step 7: Security Check

### 7.1 Verify Security
```bash
git status
```
- [ ] `.env` is NOT listed
- [ ] Only `.env.example` is tracked

### 7.2 Set Billing Alerts
- [ ] OpenAI: Set $100/month limit
- [ ] Anthropic: Set $150/month limit  
- [ ] Vercel: Set $100/month limit

### 7.3 Save Backup
- [ ] Copy `.env` to secure location
- [ ] Store in password manager (recommended)

---

## Step 8: Optional Enhancements

### 8.1 Add Monitoring
- [ ] Add `NEXT_PUBLIC_SENTRY_DSN` for error tracking
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` for analytics

### 8.2 Configure Image Providers
- [ ] Add `STABILITY_API_KEY` for Stable Diffusion
- [ ] Add `REPLICATE_API_TOKEN` for Replicate

### 8.3 Enable Advanced Features
- [ ] Configure rate limiting with Upstash KV
- [ ] Set up PostHog analytics
- [ ] Enable Sentry error tracking

---

## Troubleshooting

### Issue: "Cannot connect to database"
**Solution:**
```bash
# Check POSTGRES_URL format
postgresql://user:password@host:port/database
```
- [ ] POSTGRES_URL is correct

### Issue: "API key invalid"
**Solution:**
1. Check key has no extra spaces
2. Verify key starts with correct prefix
3. Test key in provider dashboard
- [ ] Keys are valid

### Issue: "Module not found"
**Solution:**
```bash
npm install
```
- [ ] All modules installed

### Issue: "Database table not found"
**Solution:**
```bash
npm run db:push
```
- [ ] Migrations applied

---

## Success Indicators

You're ready when you can:

✅ **Core Features:**
- [x] Create tasks with Claude
- [x] View tasks in sidebar
- [x] See real-time logs
- [x] Tasks execute in sandbox
- [x] Changes pushed to GitHub

✅ **New Features:**
- [x] Create custom templates
- [x] Add custom agents
- [x] Generate images
- [x] View images in tasks
- [x] Manage settings

✅ **Queue System:**
- [x] Multiple tasks queue properly
- [x] Queue positions show in UI
- [x] Tasks process automatically

---

## Quick Commands Reference

```bash
# Setup
cp .env.example .env
npm install
npm run db:push

# Development
npm run dev                    # Start server
npm run db:studio              # Database GUI

# Testing
npm run type-check             # TypeScript check
npm run lint                   # ESLint check
npm run format                 # Format code

# Database
npm run db:generate            # Generate migrations
npm run db:push                # Apply migrations
```

---

## Next Steps

### Immediate
1. ✅ Complete this checklist
2. ✅ Test all features
3. ✅ Review documentation

### Short Term
- [ ] Create your own custom templates
- [ ] Set up your first custom agent
- [ ] Generate some images for your project
- [ ] Configure monitoring (Sentry/PostHog)

### Long Term
- [ ] Scale to production
- [ ] Add more custom agents
- [ ] Build a template library
- [ ] Integrate with your workflow

---

## Support & Resources

### Documentation
- `NEW_FEATURES.md` - Feature documentation
- `API_KEYS_GUIDE.md` - API key reference
- `SETUP_YOUR_ENV.md` - Environment setup
- `README.md` - Project overview

### Getting Help
1. Check error logs in console
2. Review relevant docs
3. Test API keys individually
4. Check provider status pages

---

## Celebration! 🎉

When everything is checked:

✅ **You now have:**
- Complete coding agent platform
- 30+ API integrations ready
- Custom templates system
- Custom agents support
- AI image generation
- Task queue management
- Comprehensive monitoring

**You're ready to automate your development workflow!**

Happy coding! 🚀

---

**Pro Tips:**

💡 Start with simple tasks to test each agent  
💡 Create template library for common operations  
💡 Monitor API usage to optimize costs  
💡 Use custom agents for specialized workflows  
💡 Generate images for mockups and designs  

**Enjoy your supercharged development environment!** 🎊
