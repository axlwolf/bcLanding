// Hybrid approach: Server gets template from Supabase, Client can override with localStorage
import { getSiteConfigFromSupabase } from '../lib/config' // Ensure this path is correct
import ClientTemplateWrapper from './ClientTemplateWrapper'
import Main from './Main'
import Main2 from './Main2'
import Main3 from './Main3'
import Main4 from './Main4'
import Main5 from './Main5'
import Main6 from './Main6'

export const dynamic = 'force-dynamic' // Recommended for pages with dynamic data
export const revalidate = 0 // No caching or revalidate as needed

export default async function HomePage() { // Renamed to HomePage for clarity
  // Server-side: Get template from Supabase (always reliable)
  const config = await getSiteConfigFromSupabase()
  // Default to 'Main' if activeTemplate is not found or is null/undefined
  const serverTemplate = config?.activeTemplate || 'Main'

  console.log('[SERVER] Rendering HomePage with serverTemplate from Supabase:', serverTemplate)

  // These Main* components are now async Server Components.
  // They fetch their own data. We are simply passing their rendered output (as ReactNode)
  // to the ClientTemplateWrapper.
  const components = {
    Main: <Main />,
    Main2: <Main2 />,
    Main3: <Main3 />,
    Main4: <Main4 />,
    Main5: <Main5 />,
    Main6: <Main6 />,
  }

  const defaultComponent = <Main />; // Define a default component instance

  // Pass server template and components map to client wrapper
  return (
    <ClientTemplateWrapper
      serverTemplate={serverTemplate}
      components={components}
      defaultComponent={defaultComponent}
    />
  )
}
