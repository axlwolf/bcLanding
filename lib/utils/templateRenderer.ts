import { readFile } from 'fs/promises'
import { join } from 'path'
import handlebars from 'handlebars'
import type { EmailTemplateData } from '@/types/email'

// Register any custom helpers
handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this)
})

export async function renderTemplate(
  templatePath: string,
  data: EmailTemplateData
): Promise<string> {
  try {
    // Ensure the template path has the correct format
    let templateFile = templatePath.endsWith('.hbs')
      ? templatePath // Keep as is if it already has .hbs
      : `${templatePath}.hbs` // Add .hbs if not present

    // If the path doesn't include 'emails/' and doesn't start with it, prepend 'emails/'
    if (!templateFile.includes('emails/') && !templateFile.startsWith('emails/')) {
      templateFile = `emails/${templateFile}`
    }

    const fullPath = join(process.cwd(), 'templates', templateFile)
    console.log(`Loading template from: ${fullPath}`)

    const templateContent = await readFile(fullPath, 'utf8')
    const template = handlebars.compile(templateContent)

    // Add common data to all templates
    const templateData: Record<string, string | number | boolean> = {
      ...(Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== null && v !== undefined)
      ) as Record<string, string | number | boolean>),
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Your Site',
      currentYear: new Date().getFullYear(),
      unsubscribeUrl:
        data.unsubscribeUrl ||
        `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(typeof data.to === 'object' ? '' : String(data.to || ''))}`,
    }

    return template(templateData)
  } catch (error) {
    console.error(`Error rendering template ${templatePath}:`, error)
    throw new Error(
      `Failed to render template: ${templatePath}. ${error instanceof Error ? error.message : ''}`
    )
  }
}
