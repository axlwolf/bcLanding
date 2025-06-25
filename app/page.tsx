// Hybrid approach: Server gets template from Supabase, Client can override with localStorage
import { getSiteConfigFromSupabase } from '../lib/config'
import ClientTemplateWrapper from './ClientTemplateWrapper'

export default async function Page() {
  // Server-side: Get template from Supabase (always reliable)
  const config = await getSiteConfigFromSupabase()
  const serverTemplate = config.activeTemplate

  console.log('[SERVER] Template from Supabase:', serverTemplate)

  // Pass server template to client wrapper
  // Client will check localStorage and can override if needed
  return <ClientTemplateWrapper serverTemplate={serverTemplate} />
}
