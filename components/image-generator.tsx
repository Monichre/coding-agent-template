'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Image as ImageIcon, Download } from 'lucide-react'
import { GeneratedImage } from '@/lib/db/schema'

interface ImageGeneratorProps {
  taskId?: string
  onImageGenerated?: (image: GeneratedImage) => void
}

const IMAGE_PROVIDERS = [
  { value: 'openai', label: 'DALL-E 3 (OpenAI)', models: ['dall-e-3', 'dall-e-2'] },
  { value: 'stability-ai', label: 'Stable Diffusion (Stability AI)', models: ['stable-diffusion-xl'] },
  { value: 'replicate', label: 'Replicate', models: ['sdxl'] },
]

export function ImageGenerator({ taskId, onImageGenerated }: ImageGeneratorProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [provider, setProvider] = useState('openai')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an image prompt')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          provider,
          taskId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedImage(data.image)
        toast.success('Image generated successfully!')
        if (onImageGenerated) {
          onImageGenerated(data.image)
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to generate image')
      }
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedImage) return

    try {
      const response = await fetch(generatedImage.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `generated-image-${generatedImage.id}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Image downloaded!')
    } catch (error) {
      console.error('Error downloading image:', error)
      toast.error('Failed to download image')
    }
  }

  const handleReset = () => {
    setGeneratedImage(null)
    setPrompt('')
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ImageIcon className="h-4 w-4 mr-2" />
          Generate Image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Image Generation</DialogTitle>
          <DialogDescription>
            Generate images using AI. Perfect for mockups, designs, or visual content.
          </DialogDescription>
        </DialogHeader>

        {!generatedImage ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image-prompt">Image Prompt</Label>
              <Input
                id="image-prompt"
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
              />
              <p className="text-xs text-muted-foreground">Be specific and descriptive for best results</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select value={provider} onValueChange={setProvider} disabled={isGenerating}>
                <SelectTrigger id="provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_PROVIDERS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {provider === 'openai' && 'Best for photorealistic and artistic images'}
                {provider === 'stability-ai' && 'Great for creative and stylized artwork'}
                {provider === 'replicate' && 'Access to various community models'}
              </p>
            </div>

            <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="relative rounded-lg overflow-hidden border">
              <img src={generatedImage.imageUrl} alt={generatedImage.prompt} className="w-full h-auto" />
            </div>

            <div className="space-y-2">
              <Label>Prompt</Label>
              <p className="text-sm text-muted-foreground">{generatedImage.prompt}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Provider</Label>
                <p className="text-sm capitalize">{generatedImage.provider}</p>
              </div>
              <div>
                <Label className="text-xs">Model</Label>
                <p className="text-sm">{generatedImage.model}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Generate Another
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
