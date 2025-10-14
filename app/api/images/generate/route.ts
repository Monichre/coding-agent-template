import { NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { generatedImages } from '@/lib/db/schema'
import { generateId } from '@/lib/utils/id'
import { eq, desc } from 'drizzle-orm'

// POST - Generate an image
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, taskId, provider = 'openai', model } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Generate image based on provider
    let imageUrl: string
    let usedModel: string
    let metadata: Record<string, any> = {}

    switch (provider) {
      case 'openai':
        // OpenAI DALL-E 3
        if (!process.env.OPENAI_API_KEY) {
          return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
        }

        const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: model || 'dall-e-3',
            prompt,
            n: 1,
            size: '1024x1024',
            quality: 'standard',
          }),
        })

        if (!openaiResponse.ok) {
          const error = await openaiResponse.json()
          console.error('OpenAI error:', error)
          return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
        }

        const openaiData = await openaiResponse.json()
        imageUrl = openaiData.data[0].url
        usedModel = model || 'dall-e-3'
        metadata = {
          revised_prompt: openaiData.data[0].revised_prompt,
          size: '1024x1024',
        }
        break

      case 'stability-ai':
        // Stability AI (Stable Diffusion)
        if (!process.env.STABILITY_API_KEY) {
          return NextResponse.json({ error: 'Stability AI API key not configured' }, { status: 500 })
        }

        const stabilityResponse = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
            Accept: 'application/json',
          },
          body: JSON.stringify({
            prompt,
            output_format: 'png',
          }),
        })

        if (!stabilityResponse.ok) {
          const error = await stabilityResponse.json()
          console.error('Stability AI error:', error)
          return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
        }

        const stabilityData = await stabilityResponse.json()
        imageUrl = stabilityData.image
        usedModel = model || 'stable-diffusion-xl'
        metadata = { seed: stabilityData.seed }
        break

      case 'replicate':
        // Replicate (various models)
        if (!process.env.REPLICATE_API_TOKEN) {
          return NextResponse.json({ error: 'Replicate API token not configured' }, { status: 500 })
        }

        const replicateModel = model || 'stability-ai/sdxl:latest'

        const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version: replicateModel,
            input: { prompt },
          }),
        })

        if (!replicateResponse.ok) {
          const error = await replicateResponse.json()
          console.error('Replicate error:', error)
          return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
        }

        const replicateData = await replicateResponse.json()

        // Wait for the prediction to complete (simplified - in production, use webhooks)
        let prediction = replicateData
        while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          const statusResponse = await fetch(prediction.urls.get, {
            headers: {
              Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            },
          })
          prediction = await statusResponse.json()
        }

        if (prediction.status === 'failed') {
          return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
        }

        imageUrl = prediction.output[0]
        usedModel = replicateModel
        metadata = { prediction_id: prediction.id }
        break

      default:
        return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    // Save generated image to database
    const [savedImage] = await db
      .insert(generatedImages)
      .values({
        id: generateId(),
        taskId: taskId || null,
        prompt,
        imageUrl,
        model: usedModel,
        provider,
        metadata,
      })
      .returning()

    return NextResponse.json({ image: savedImage })
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}

// GET - Get generated images (optionally filtered by taskId)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    let images
    if (taskId) {
      images = await db.select().from(generatedImages).where(eq(generatedImages.taskId, taskId))
    } else {
      images = await db.select().from(generatedImages).orderBy(desc(generatedImages.createdAt)).limit(50)
    }

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}
