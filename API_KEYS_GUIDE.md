# API Keys Guide

This guide explains all the API keys that can be configured in the Coding Agent Template and how to obtain them.

---

## Core Services (Required)

### Database
```bash
POSTGRES_URL=postgresql://username:password@localhost:5432/coding_agent
```
**What:** PostgreSQL database connection string  
**Get it:** Set up a [Neon](https://neon.tech), [Supabase](https://supabase.com), or local PostgreSQL database

### Anthropic (Claude)
```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```
**What:** Powers Claude AI agent  
**Get it:** [https://console.anthropic.com](https://console.anthropic.com)  
**Pricing:** Pay-as-you-go, ~$3-15 per million tokens

### GitHub
```bash
GITHUB_TOKEN=ghp_your-github-token-here
```
**What:** Access repositories, create PRs, push code  
**Get it:** GitHub Settings → Developer Settings → Personal Access Tokens  
**Scopes:** `repo`, `workflow`

### Vercel Sandbox
```bash
VERCEL_TEAM_ID=your-team-id
VERCEL_PROJECT_ID=your-project-id
VERCEL_TOKEN=your-vercel-token
```
**What:** Code execution sandboxes  
**Get it:** [Vercel Dashboard](https://vercel.com/dashboard) → Settings  
**Pricing:** Check [Vercel Sandbox pricing](https://vercel.com/docs/vercel-sandbox)

### AI Gateway
```bash
AI_GATEWAY_API_KEY=your-ai-gateway-key-here
```
**What:** Branch name generation, model routing  
**Get it:** [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)  
**Required for:** AI-generated branch names, Codex agent

---

## Built-in Agents (Optional)

### OpenAI
```bash
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_ASSISTANT_ID=asst_your-assistant-id-here  # Optional
OPENAI_VECTOR_STORE_ID=vs_your-vector-store-id-here  # Optional
```
**What:** Codex agent, DALL-E image generation  
**Get it:** [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)  
**Pricing:** ~$0.01-0.06 per 1K tokens, $0.04 per image

### Cursor
```bash
CURSOR_API_KEY=your-cursor-api-key
```
**What:** Cursor AI agent integration  
**Get it:** Cursor IDE Settings  
**Pricing:** Included with Cursor Pro subscription

### NPM
```bash
NPM_TOKEN=npm_your-npm-token
```
**What:** Access private npm packages  
**Get it:** [https://www.npmjs.com/settings/~/tokens](https://www.npmjs.com/settings/~/tokens)

---

## AI/ML Services (Optional)

### E2B
```bash
E2B_API_KEY=e2b_your-key-here
```
**What:** Code execution sandboxes (alternative to Vercel)  
**Get it:** [https://e2b.dev](https://e2b.dev)  
**Pricing:** Free tier available, then pay-as-you-go

### xAI (Grok)
```bash
XAI_API_KEY=xai-your-key-here
```
**What:** Grok AI models  
**Get it:** [https://x.ai](https://x.ai) (requires waitlist approval)  
**Pricing:** TBA

### Groq
```bash
GROQ_API_KEY=gsk_your-key-here
```
**What:** Ultra-fast LLM inference  
**Get it:** [https://console.groq.com](https://console.groq.com)  
**Pricing:** Free tier: 14,400 requests/day

### Together AI
```bash
TOGETHERAI_API_KEY=your-together-api-key-here
```
**What:** Open-source LLMs (Llama, Mixtral, etc.)  
**Get it:** [https://api.together.xyz](https://api.together.xyz)  
**Pricing:** Starting at $0.20 per million tokens

### Google Gemini
```bash
GEMINI_API_KEY=your-gemini-key-here
```
**What:** Gemini AI models  
**Get it:** [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)  
**Pricing:** Free tier available, then pay-as-you-go

### Perplexity
```bash
PERPLEXITY_API_KEY=pplx-your-key-here
```
**What:** AI-powered search and answers  
**Get it:** [https://www.perplexity.ai/settings/api](https://www.perplexity.ai/settings/api)  
**Pricing:** $0.20 per 1M tokens

---

## Image Generation (Optional)

### Stability AI
```bash
STABILITY_API_KEY=your-stability-key-here
```
**What:** Stable Diffusion image generation  
**Get it:** [https://platform.stability.ai](https://platform.stability.ai)  
**Pricing:** $10 credits = 5,000 images

### Replicate
```bash
REPLICATE_API_TOKEN=your-replicate-token-here
```
**What:** Run various AI models (SDXL, Flux, etc.)  
**Get it:** [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)  
**Pricing:** Pay per prediction, varies by model

### Fal AI
```bash
FAL_API_KEY=your-fal-key-here
```
**What:** Fast AI model inference  
**Get it:** [https://fal.ai](https://fal.ai)  
**Pricing:** Pay-as-you-go

---

## Data & Search (Optional)

### Ragie
```bash
RAGIE_API_KEY=tnt_your-key-here
```
**What:** RAG (Retrieval Augmented Generation)  
**Get it:** [https://ragie.ai](https://ragie.ai)  
**Pricing:** Contact for pricing

### Serper
```bash
SERPER_API_KEY=your-serper-key-here
```
**What:** Google Search API  
**Get it:** [https://serper.dev](https://serper.dev)  
**Pricing:** 2,500 free searches, then $50/5K searches

### Search1API
```bash
SEARCH1API_KEY=your-search1api-key-here
```
**What:** Unified search API  
**Get it:** [https://www.search1api.com](https://www.search1api.com)  
**Pricing:** Free tier available

---

## Web Scraping (Optional)

### Firecrawl
```bash
FIRECRAWL_API_KEY=fc-your-key-here
NEXT_PUBLIC_FIRECRAWL_API_KEY=fc-your-key-here
```
**What:** Web scraping and crawling  
**Get it:** [https://firecrawl.dev](https://firecrawl.dev)  
**Pricing:** 500 free credits/month, then pay-as-you-go

### ScrapeGraph AI
```bash
SCRAPEGRAPH_API_KEY=sgai-your-key-here
```
**What:** Graph-based web scraping  
**Get it:** [https://scrapegraphai.com](https://scrapegraphai.com)  
**Pricing:** Contact for pricing

---

## Automation & Tools (Optional)

### Composio
```bash
COMPOSIO_API_KEY=your-composio-key-here
```
**What:** Tool integration platform  
**Get it:** [https://composio.dev](https://composio.dev)  
**Pricing:** Free tier available

### MultiOn AI
```bash
MULTIONAI_API_KEY=your-multion-key-here
```
**What:** Browser automation with AI  
**Get it:** [https://www.multion.ai](https://www.multion.ai)  
**Pricing:** Beta - Contact for access

---

## Voice & Audio (Optional)

### Deepgram
```bash
DEEPGRAM_API_KEY=your-deepgram-key-here
```
**What:** Speech-to-Text / Text-to-Speech  
**Get it:** [https://console.deepgram.com](https://console.deepgram.com)  
**Pricing:** $200 free credits, then $0.0043/min

---

## Memory & Context (Optional)

### Mem0
```bash
NEXT_PUBLIC_MEM0_API_KEY=m0-your-key-here
```
**What:** Memory layer for AI agents  
**Get it:** [https://mem0.ai](https://mem0.ai)  
**Pricing:** Free tier available

---

## Data APIs (Optional)

### Morph
```bash
MORPH_API_KEY=sk-your-morph-key-here
```
**What:** Data API service  
**Get it:** [https://morph.so](https://morph.so)  
**Pricing:** Contact for pricing

### Perignon
```bash
PERIGNON_API_KEY=your-perignon-key-here
```
**What:** AI API service  
**Get it:** Contact vendor  
**Pricing:** Enterprise pricing

---

## Monitoring & Analytics (Optional)

### Sentry
```bash
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
```
**What:** Error tracking and monitoring  
**Get it:** [https://sentry.io](https://sentry.io)  
**Pricing:** Free up to 5K errors/month

### PostHog
```bash
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key-here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```
**What:** Product analytics  
**Get it:** [https://posthog.com](https://posthog.com)  
**Pricing:** Free up to 1M events/month

---

## Infrastructure (Optional)

### Upstash KV
```bash
KV_REST_API_URL=your-kv-url-here
KV_REST_API_TOKEN=your-kv-token-here
```
**What:** Redis-compatible key-value store  
**Get it:** [https://console.upstash.com](https://console.upstash.com)  
**Usage:** Rate limiting, short URLs  
**Pricing:** Free tier: 10K commands/day

---

## Configuration Variables

### Site Configuration
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
**What:** Your site's base URL  
**Use:** Set to production URL in deployment

### Rate Limiting
```bash
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW=60
```
**What:** Rate limit configuration (requests per window)  
**Requires:** Upstash KV

---

## Feature Flags

### Disable API Key Input
```bash
NEXT_PUBLIC_NO_API_KEY_INPUT=true
```
**What:** Hide API key input in chat interface

### Disable Base URL Input
```bash
NEXT_PUBLIC_NO_BASE_URL_INPUT=true
```
**What:** Hide base URL input in chat interface

### Hide Local Models
```bash
NEXT_PUBLIC_HIDE_LOCAL_MODELS=true
```
**What:** Hide local models from available models list

---

## Quick Setup Priorities

### Minimum Setup (Core Features)
1. ✅ `POSTGRES_URL` - Database
2. ✅ `ANTHROPIC_API_KEY` - Claude agent
3. ✅ `GITHUB_TOKEN` - Repository access
4. ✅ `VERCEL_TEAM_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN` - Sandboxes

### Recommended (Enhanced Features)
5. ✅ `AI_GATEWAY_API_KEY` - Branch name generation
6. ✅ `OPENAI_API_KEY` - Image generation, Codex agent

### Optional (Extended Features)
7. Choose image provider: `STABILITY_API_KEY` or `REPLICATE_API_TOKEN`
8. Add search: `SERPER_API_KEY`
9. Add monitoring: `NEXT_PUBLIC_SENTRY_DSN`
10. Add analytics: `NEXT_PUBLIC_POSTHOG_KEY`

---

## Cost Estimation

### Basic Usage (1000 tasks/month)
- **PostgreSQL**: $0-25/month (Neon free tier or Supabase)
- **Claude API**: $50-150/month
- **Vercel Sandbox**: $20-100/month
- **GitHub**: Free
- **Total**: ~$70-275/month

### With Images (100 images/month)
- Add **OpenAI DALL-E**: ~$4/month
- Or **Stability AI**: ~$2/month
- **Total**: ~$72-279/month

### Heavy Usage (5000 tasks/month + images)
- **Claude API**: $200-500/month
- **Vercel Sandbox**: $100-300/month
- **Other services**: $50-100/month
- **Total**: ~$350-900/month

---

## Security Best Practices

### 1. Never Commit .env
```bash
# Already in .gitignore
.env
.env.local
.env*.local
```

### 2. Use Environment-Specific Files
```bash
.env.local          # Local development
.env.production     # Production (never commit!)
.env.example        # Template (safe to commit)
```

### 3. Rotate Keys Regularly
- Set calendar reminders
- Rotate every 90 days minimum
- Immediately rotate if compromised

### 4. Use Minimum Permissions
- GitHub: Only grant necessary scopes
- API keys: Use read-only when possible
- Database: Separate read/write credentials

### 5. Monitor Usage
- Set up billing alerts
- Review API usage regularly
- Use rate limiting in production

---

## Troubleshooting

### "API key not configured"
**Solution:** Add the required key to `.env` and restart server

### "Invalid API key"
**Solution:** 
1. Check key format (starts with correct prefix)
2. Verify key is active in provider dashboard
3. Ensure no extra spaces or quotes

### "Rate limit exceeded"
**Solutions:**
1. Upgrade to higher tier
2. Implement caching
3. Add rate limiting (`RATE_LIMIT_*` vars)

### "Connection refused"
**Solutions:**
1. Check service is running
2. Verify endpoint URL is correct
3. Test connection with curl

---

## Getting Help

### Resources
- [Vercel Docs](https://vercel.com/docs)
- [Anthropic Docs](https://docs.anthropic.com)
- [OpenAI Docs](https://platform.openai.com/docs)

### Support Channels
1. Check provider documentation
2. Review error logs in Sentry
3. Test API keys with curl
4. Contact provider support

---

## API Key Checklist

Use this checklist when setting up:

**Core Setup:**
- [ ] PostgreSQL database created
- [ ] Anthropic API key obtained
- [ ] GitHub token generated
- [ ] Vercel sandbox credentials configured
- [ ] `.env` file created from `.env.example`
- [ ] Database migrations applied (`npm run db:push`)

**Optional Features:**
- [ ] AI Gateway key (for branch names)
- [ ] OpenAI key (for Codex + images)
- [ ] Image generation provider chosen
- [ ] Custom agents configured
- [ ] Monitoring tools set up

**Security:**
- [ ] `.env` added to `.gitignore`
- [ ] Keys stored securely (not in code)
- [ ] Billing alerts configured
- [ ] Rate limiting enabled

Ready to code! 🚀
