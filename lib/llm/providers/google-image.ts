import { LLMImageProvider, LLMImageResponse } from '../types'
import { GoogleGenAI } from '@google/genai'

function getErrorMessage(e: unknown): string {
  if (
    e &&
    typeof e === 'object' &&
    'message' in e &&
    typeof (e as { message: unknown }).message === 'string'
  ) {
    return (e as { message: string }).message
  }
  if (typeof e === 'string') return e
  return 'Unknown error'
}

interface ImagenGenerateImagesResponse {
  generatedImages: Array<{
    image?: { imageBytes?: string }
  }>
}

type GeminiContent =
  | string
  | Array<{ text: string } | { inlineData: { mimeType: string; data: string } }>
interface GeminiCandidateContent {
  parts?: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>
}
interface GeminiCandidate {
  content?: GeminiCandidateContent
}
interface GeminiResponse {
  candidates?: GeminiCandidate[]
}

export class GoogleImageProvider implements LLMImageProvider {
  private client: GoogleGenAI
  private model: string

  constructor(apiKey: string, model: string = 'imagen-3.0-generate-002') {
    this.client = new GoogleGenAI({ apiKey })
    this.model = model
  }

  /**
   * Generate images using Imagen 3. Only supports Imagen for now.
   * @param prompt - The text prompt for the image
   * @param model - Imagen model name (default: imagen-3.0-generate-002)
   * @param aspectRatio - Aspect ratio ("1:1", "3:4", "4:3", "9:16", "16:9")
   * @param opts - { numberOfImages, personGeneration }
   */
  async generateImage(
    prompt: string,
    model?: string,
    aspectRatio?: string,
    opts?: Record<string, unknown>
  ): Promise<LLMImageResponse> {
    const modelName = (model || this.model || '').toLowerCase()
    if (!prompt) {
      return { success: false, error: 'Prompt is required.' }
    }
    // Imagen 3 branch
    if (modelName.includes('imagen')) {
      const config: Record<string, unknown> = {}
      config.numberOfImages = opts?.numberOfImages ?? 1 // Default to 1 image
      if (aspectRatio) config.aspectRatio = aspectRatio
      config.personGeneration = opts?.personGeneration ?? 'allow_adult'
      try {
        // Type-safe call for generateImages
        const models = this.client.models as {
          generateImages?: (args: {
            model: string
            prompt: string
            config: Record<string, unknown>
          }) => Promise<ImagenGenerateImagesResponse>
        }
        if (!models.generateImages) {
          return {
            success: false,
            error: 'generateImages method not available on GoogleGenAI.models.',
          }
        }
        const response = await models.generateImages({
          model: modelName,
          prompt,
          config,
        })
        const images = response.generatedImages
        if (!images || !Array.isArray(images) || images.length === 0) {
          return { success: false, error: 'No images returned from Imagen 3.' }
        }
        const generatedImage = images[0]
        const imgBytes = generatedImage?.image?.imageBytes
        if (!imgBytes) {
          return { success: false, error: 'No valid image data in Imagen 3 response.' }
        }
        return {
          success: true,
          image_data: imgBytes, // Already base64
          mime_type: 'image/png',
          model: modelName,
        }
      } catch (e: unknown) {
        return {
          success: false,
          error: getErrorMessage(e),
          model: modelName,
        }
      }
    }
    // Gemini Flash branch (text-to-image or image editing)
    if (modelName.includes('gemini')) {
      // If opts.editImageBase64 is provided, do image editing per Google SDK docs
      let contents: GeminiContent
      if (opts?.editImageBase64) {
        contents = [
          { text: prompt },
          {
            inlineData: {
              mimeType:
                typeof opts.editImageMimeType === 'string' ? opts.editImageMimeType : 'image/png',
              data: typeof opts.editImageBase64 === 'string' ? opts.editImageBase64 : '',
            },
          },
        ]
      } else {
        // Text-to-image
        contents = prompt
      }
      // Only allow valid config keys from opts
      const allowedConfigKeys = [
        'responseModalities',
        'editImageBase64',
        'editImageMimeType',
        'numberOfImages',
        'personGeneration',
        'aspectRatio',
      ]
      const filteredOpts: Record<string, unknown> = {}
      if (opts) {
        for (const key of Object.keys(opts)) {
          if (allowedConfigKeys.includes(key)) {
            filteredOpts[key] = opts[key]
          }
        }
      }
      const config: Record<string, unknown> = {
        responseModalities: ['TEXT', 'IMAGE'],
        ...filteredOpts,
      }
      try {
        const response = await this.client.models.generateContent({
          model: modelName,
          contents,
          config,
        })
        // Type guard for GeminiResponse
        const candidates =
          response &&
          typeof response === 'object' &&
          'candidates' in response &&
          Array.isArray((response as GeminiResponse).candidates)
            ? (response as GeminiResponse).candidates
            : undefined
        if (!candidates || candidates.length === 0) {
          return { success: false, error: 'No candidates in Gemini response.' }
        }
        const candidate = candidates[0]
        const content =
          candidate && typeof candidate === 'object' && 'content' in candidate
            ? candidate.content
            : undefined
        if (!content || !content.parts || !Array.isArray(content.parts)) {
          return { success: false, error: 'No parts in Gemini content.' }
        }
        let imageData: string | undefined
        let textResponse = ''
        for (const part of content.parts) {
          if (part.text) textResponse += part.text
          if (part.inlineData && part.inlineData.data) imageData = part.inlineData.data
        }
        if (!imageData) {
          return {
            success: false,
            error: 'No image was generated by Gemini.',
            text_response: textResponse,
            model: modelName,
          }
        }
        return {
          success: true,
          image_data: imageData,
          mime_type: 'image/png',
          text_response: textResponse,
          model: modelName,
        }
      } catch (e: unknown) {
        return {
          success: false,
          error: getErrorMessage(e),
          model: modelName,
        }
      }
    }
    // If model is not supported
    return {
      success: false,
      error:
        'Model not supported. Use imagen-3.0-generate-002 or gemini-2.0-flash-preview-image-generation.',
    }
  }
}
