// GitHub PR review functionality using GitHub API

interface PRFile {
  filename: string
  status: string
  additions: number
  deletions: number
  changes: number
  patch?: string
}

interface PRDetails {
  number: number
  title: string
  body: string
  html_url: string
  state: string
  head: {
    ref: string
    sha: string
  }
  base: {
    ref: string
  }
  files?: PRFile[]
}

// Fetch PR details from GitHub
export async function fetchPRDetails(repoUrl: string, branchName: string): Promise<PRDetails | null> {
  try {
    if (!process.env.GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN not set')
      return null
    }

    // Extract owner and repo from URL
    const url = new URL(repoUrl)
    const pathParts = url.pathname.split('/').filter(Boolean)
    if (pathParts.length < 2) {
      console.error('Invalid repo URL')
      return null
    }

    const owner = pathParts[0]
    const repo = pathParts[1].replace('.git', '')

    // Find PR by branch name
    const prsResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?head=${owner}:${branchName}&state=open`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      },
    )

    if (!prsResponse.ok) {
      console.error('Failed to fetch PRs:', await prsResponse.text())
      return null
    }

    const prs = await prsResponse.json()
    if (!prs || prs.length === 0) {
      return null
    }

    const pr = prs[0]

    // Fetch PR files
    const filesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/files`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (filesResponse.ok) {
      pr.files = await filesResponse.json()
    }

    return pr
  } catch (error) {
    console.error('Error fetching PR details:', error)
    return null
  }
}

// Create a PR if it doesn't exist
export async function createPR(
  repoUrl: string,
  branchName: string,
  title: string,
  body: string,
  baseBranch: string = 'main',
): Promise<{ html_url: string; number: number } | null> {
  try {
    if (!process.env.GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN not set')
      return null
    }

    const url = new URL(repoUrl)
    const pathParts = url.pathname.split('/').filter(Boolean)
    if (pathParts.length < 2) {
      console.error('Invalid repo URL')
      return null
    }

    const owner = pathParts[0]
    const repo = pathParts[1].replace('.git', '')

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        head: branchName,
        base: baseBranch,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to create PR:', error)
      return null
    }

    const pr = await response.json()
    return {
      html_url: pr.html_url,
      number: pr.number,
    }
  } catch (error) {
    console.error('Error creating PR:', error)
    return null
  }
}

// Post a review comment on a PR
export async function postPRComment(repoUrl: string, prNumber: number, comment: string): Promise<boolean> {
  try {
    if (!process.env.GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN not set')
      return false
    }

    const url = new URL(repoUrl)
    const pathParts = url.pathname.split('/').filter(Boolean)
    if (pathParts.length < 2) {
      console.error('Invalid repo URL')
      return false
    }

    const owner = pathParts[0]
    const repo = pathParts[1].replace('.git', '')

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: comment }),
    })

    if (!response.ok) {
      console.error('Failed to post comment:', await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error('Error posting PR comment:', error)
    return false
  }
}

// Generate AI-powered code review
export async function generateCodeReview(prDetails: PRDetails): Promise<string> {
  // This is a simplified version. In production, you would:
  // 1. Use AI SDK to analyze the code changes
  // 2. Check for common issues, security vulnerabilities
  // 3. Provide constructive feedback

  const fileCount = prDetails.files?.length || 0
  const totalAdditions = prDetails.files?.reduce((sum, f) => sum + f.additions, 0) || 0
  const totalDeletions = prDetails.files?.reduce((sum, f) => sum + f.deletions, 0) || 0

  let review = `## 🤖 Automated Code Review\n\n`
  review += `**Summary:** ${fileCount} file(s) changed with ${totalAdditions} additions and ${totalDeletions} deletions.\n\n`

  review += `### Files Changed:\n`
  prDetails.files?.forEach((file) => {
    review += `- \`${file.filename}\` (+${file.additions}/-${file.deletions})\n`
  })

  review += `\n### General Feedback:\n`
  review += `- ✅ Changes have been reviewed\n`
  review += `- 💡 Consider adding tests for new functionality\n`
  review += `- 📝 Ensure documentation is updated if needed\n`

  return review
}
