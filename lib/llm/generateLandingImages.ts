import { llmImageService } from './imageService'
import fs from 'fs/promises'
import path from 'path'

function isRecord(o: unknown): o is Record<string, unknown> {
  return typeof o === 'object' && o !== null && !Array.isArray(o)
}

/**
 * Recursively generate images for all imagePrompt fields in the landing content object.
 * Each generated image is saved to public/static/images and the image field is updated with the file path.
 * @param obj The landing content object (mutated in place)
 * @param prefix The property path for unique naming (e.g. 'hero', 'services-0')
 */
export async function generateImagesForLandingContent(obj: unknown, prefix = 'landing') {
  if (Array.isArray(obj)) {
    await Promise.all(
      obj.map((item, idx) => generateImagesForLandingContent(item, `${prefix}-${idx}`))
    )
  } else if (isRecord(obj)) {
    if (typeof obj.imagePrompt === 'string') {
      const fileName = `${prefix}.png`
      const filePath = path.join(process.cwd(), 'public/static/images', fileName)
      try {
        // Only generate if image is missing or placeholder
        if (!('image' in obj) || obj.image === '/placeholder.jpg') {
          const imageResp = await llmImageService.generateImage({
            prompt: obj.imagePrompt,
            aspectRatio: '16:9',
          })
          if (imageResp?.success && imageResp.image_data) {
            const base64 = imageResp.image_data.replace(/^data:image\/\w+;base64,/, '')
            await fs.writeFile(filePath, Buffer.from(base64, 'base64'))
            obj.image = `/static/images/${fileName}`
            console.log(`Generated and saved image: ${obj.image}`)
          } else {
            console.warn(`Image generation failed for prompt: ${obj.imagePrompt}`)
            obj.image = `/static/images/${fileName}` // Force update anyway
          }
        } else {
          obj.image = `/static/images/${fileName}` // Force update for consistency
        }
      } catch (err) {
        console.error(`Error generating image for ${fileName}:`, err)
        obj.image = `/static/images/${fileName}` // Still update field
      }
    }
    await Promise.all(
      Object.entries(obj).map(([key, value]) =>
        generateImagesForLandingContent(value, `${prefix}-${key}`)
      )
    )
  }
}

/**
 * Recursively update all image fields in the object to match the filename convention (/static/images/[prefix].png)
 */
export function updateImageFieldsWithFilenames(obj: unknown, prefix = 'landing') {
  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => updateImageFieldsWithFilenames(item, `${prefix}-${idx}`))
  } else if (isRecord(obj)) {
    if (typeof obj.imagePrompt === 'string' && 'image' in obj) {
      obj.image = `/static/images/${prefix}.png`
    }
    Object.entries(obj).forEach(([key, value]) => {
      updateImageFieldsWithFilenames(value, `${prefix}-${key}`)
    })
  }
}
