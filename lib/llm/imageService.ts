import { LLMImageProvider, LLMImageResponse } from './types'
import { GoogleImageProvider } from './providers/google-image'

export class LLMImageService {
  private provider: LLMImageProvider

  constructor() {
    const providerType = process.env.LLM_IMAGE_PROVIDER || 'google'
    const apiKey = process.env.LLM_IMAGE_API_KEY || 'API_KEY_NOT_SET'
    const model = process.env.LLM_IMAGE_MODEL || 'gemini-1.5-flash'

    if (!apiKey) throw new Error('LLM_IMAGE_API_KEY is required')

    switch (providerType.toLowerCase()) {
      case 'google':
        this.provider = new GoogleImageProvider(apiKey, model)
        break
      default:
        throw new Error(`Unsupported LLM image provider: ${providerType}`)
    }
  }

  async generateImage({
    prompt,
    model,
    aspectRatio,
    opts,
  }: {
    prompt: string
    model?: string
    aspectRatio?: string
    opts?: Record<string, unknown>
  }): Promise<LLMImageResponse> {
    return this.provider.generateImage(prompt, model, aspectRatio, opts)
  }
}

export const llmImageService = new LLMImageService()
