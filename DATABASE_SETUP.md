# Database Setup Guide

You have 4 options. Pick the fastest one for you!

---

## Option 1: Neon (Recommended) ⚡

**Why:** Free, instant, no credit card  
**Time:** 2 minutes

### Steps:

1. **Go to:** https://neon.tech

2. **Sign up** with GitHub (fastest)

3. **Create a project:**
   - Click "New Project"
   - Name: `coding-agent`
   - Region: Choose closest to you
   - PostgreSQL Version: Latest (default)
   - Click "Create"

4. **Copy your connection string:**
   ```
   Format: postgresql://username:password@host/database
   Example: postgresql://alex:AbC123@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb
   ```

5. **Update `.env`:**
   
   **Option A - Manual:**
   - Open `.env` file
   - Find line: `POSTGRES_URL=postgresql://username:password@host:port/database`
   - Replace with your actual connection string
   
   **Option B - Script:**
   ```bash
   ./UPDATE_DATABASE.sh
   ```

6. **Apply migrations:**
   ```bash
   npm run db:push
   ```

7. **Start the app:**
   ```bash
   npm run dev
   ```

**Free Tier:** 
- 3GB storage
- Unlimited databases
- Perfect for development

---

## Option 2: Supabase 🔥

**Why:** Free, includes auth & storage  
**Time:** 3 minutes

### Steps:

1. **Go to:** https://supabase.com

2. **Sign up** with GitHub

3. **Create a project:**
   - Organization: Create new or use existing
   - Name: `coding-agent`
   - Database Password: Generate strong password
   - Region: Choose closest
   - Click "Create new project"

4. **Get connection string:**
   - Go to: Project Settings → Database
   - Under "Connection string" → "URI"
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual password

5. **Update `.env`:**
   ```bash
   POSTGRES_URL=postgresql://postgres:YOUR-PASSWORD@db.xxx.supabase.co:5432/postgres
   ```

6. **Apply migrations:**
   ```bash
   npm run db:push
   ```

**Free Tier:**
- 500MB database
- Unlimited API requests
- 50MB file storage

---

## Option 3: Vercel Postgres 💚

**Why:** Integrated with Vercel  
**Time:** 3 minutes  
**Note:** Requires Vercel Pro plan ($20/month)

### Steps:

1. **Go to:** https://vercel.com/dashboard

2. **Create storage:**
   - Click "Storage" tab
   - Click "Create Database"
   - Choose "Postgres"
   - Name: `coding-agent-db`
   - Region: Choose closest
   - Click "Create"

3. **Get credentials:**
   - Click your new database
   - Go to "Settings" → "General"
   - Copy "POSTGRES_URL"

4. **Update `.env`:**
   - Paste the POSTGRES_URL value

5. **Apply migrations:**
   ```bash
   npm run db:push
   ```

**Pricing:**
- Starts at $20/month (includes compute)
- 256 MB storage on starter

---

## Option 4: Local PostgreSQL 🖥️

**Why:** Full control, no external dependencies  
**Time:** 10-15 minutes

### macOS (via Homebrew):

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb coding_agent

# Your connection string:
POSTGRES_URL=postgresql://$(whoami)@localhost:5432/coding_agent
```

### Windows:

1. Download: https://www.postgresql.org/download/windows/
2. Install PostgreSQL 15
3. During setup, set a password
4. Open pgAdmin or command line
5. Create database: `coding_agent`
6. Connection string:
   ```
   POSTGRES_URL=postgresql://postgres:YOUR-PASSWORD@localhost:5432/coding_agent
   ```

### Linux (Ubuntu/Debian):

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb coding_agent

# Create user (optional)
sudo -u postgres createuser -s $USER

# Connection string:
POSTGRES_URL=postgresql://$USER@localhost:5432/coding_agent
```

### Then:

```bash
# Update .env with your local URL
./UPDATE_DATABASE.sh

# Apply migrations
npm run db:push

# Start app
npm run dev
```

---

## Quick Comparison

| Option | Free Tier | Setup Time | Best For |
|--------|-----------|------------|----------|
| **Neon** | ✅ 3GB | 2 min | Quick start |
| **Supabase** | ✅ 500MB | 3 min | Extra features |
| **Vercel** | ❌ $20/mo | 3 min | Vercel users |
| **Local** | ✅ Unlimited | 10 min | Full control |

---

## After Setup

Once you have your database URL in `.env`:

```bash
# 1. Apply database migrations (creates tables)
npm run db:push

# 2. Start the development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

You should see:
- ✅ No database errors
- ✅ App loads successfully
- ✅ Can create tasks

---

## Verify Setup

Run this to check your connection:

```bash
npm run db:studio
```

This opens Drizzle Studio at http://localhost:4983

You should see 4 tables:
- ✅ `tasks`
- ✅ `templates`
- ✅ `custom_agents`
- ✅ `generated_images`

---

## Troubleshooting

### "connection refused"
- Check database is running
- Verify host and port are correct
- Check firewall settings

### "authentication failed"
- Verify username and password
- Check connection string format
- Try copying string again from provider

### "database does not exist"
- Create the database in your provider
- Or use the default database name

### "SSL error"
- For Neon/Supabase: Add `?sslmode=require` to URL
- Example: `postgresql://user:pass@host/db?sslmode=require`

---

## Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?[options]
```

**Example:**
```
postgresql://myuser:mypass@localhost:5432/mydb
postgresql://alex:secret@db.example.com:5432/production
postgresql://user:pass@ep-abc.neon.tech/neondb?sslmode=require
```

---

## Security Notes

✅ **Your `.env` file is gitignored** - Safe to add real credentials  
✅ **Never commit database credentials** - Always use environment variables  
✅ **Rotate passwords regularly** - Every 90 days recommended  
✅ **Use separate databases** - Dev, staging, and production  

---

## Need Help?

1. Check your provider's documentation
2. Verify connection string format
3. Test connection with a database client (DBeaver, pgAdmin)
4. Check error messages carefully

---

## Ready to Continue?

Once your database is set up:

```bash
npm run db:push
npm run dev
```

Then read: `START_HERE.md` for next steps!

🚀 **Let's go!**
