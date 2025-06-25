import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Función simple para cargar variables de entorno desde .env.local
function loadEnvFile() {
  try {
    const envPath = resolve(__dirname, '../.env.local')
    const envFile = readFileSync(envPath, 'utf8')
    const lines = envFile.split('\n')
    
    lines.forEach(line => {
      // Ignorar líneas vacías y comentarios
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim()
          process.env[key.trim()] = value
        }
      }
    })
  } catch (error) {
    console.error('Error al leer el archivo .env.local:', error.message)
    process.exit(1)
  }
}

// Cargar variables de entorno
loadEnvFile()

// Función para verificar la conexión a Supabase
async function verifySupabaseConnection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('=== Verificando Configuración de Supabase ===')
  console.log('URL:', supabaseUrl ? '✓ Configurada' : '✗ No configurada')
  console.log('Anon Key:', supabaseAnonKey ? '✓ Configurada (primeros 20 chars: ' + supabaseAnonKey.substring(0, 20) + '...)' : '✗ No configurada')

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('\n❌ Error: Variables de entorno de Supabase no configuradas')
    console.log('\n📝 Asegúrate de que en el archivo .env.local estén definidas:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase')
    console.log('\nValores actuales leídos:')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || '(no definida)')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '(definida)' : '(no definida)')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    // Verificar conexión
    console.log('\n=== Verificando Conexión ===')
    console.log('Conectando a:', supabaseUrl)
    
    const { data: tables, error: tablesError } = await supabase
      .from('site_config')
      .select('*')
      .limit(1)

    if (tablesError) {
      if (tablesError.message.includes('does not exist')) {
        console.error('\n❌ La tabla "site_config" no existe en Supabase')
        console.log('\n📝 Pasos para crear la tabla:')
        console.log('\n1. Ve a tu proyecto en Supabase: ' + supabaseUrl)
        console.log('2. Ve al SQL Editor (icono de terminal en el menú lateral)')
        console.log('3. Crea una nueva consulta')
        console.log('4. Pega y ejecuta el siguiente código SQL:\n')
        console.log(`-- Crear tabla site_config
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insertar configuración inicial
INSERT INTO site_config (key, value) 
VALUES (
  'site_config',
  '{
    "activeTemplate": "Main",
    "availableTemplates": [
      {
        "id": "Main",
        "name": "Default Template",
        "description": "The default layout with standard spacing and container widths"
      },
      {
        "id": "Main2",
        "name": "Alternative Template",
        "description": "Alternative layout option"
      }
    ]
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- Crear trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_config_updated_at 
BEFORE UPDATE ON site_config 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();`)
        
        console.log('\n5. Después de ejecutar el SQL, vuelve a correr este script para verificar')
      } else {
        console.error('\n❌ Error al conectar con Supabase:', tablesError.message)
        console.log('\n🔍 Posibles causas:')
        console.log('- Las credenciales de Supabase podrían ser incorrectas')
        console.log('- El proyecto de Supabase podría estar pausado')
        console.log('- Podría haber un problema de red')
        console.log('\n📝 Verifica en tu dashboard de Supabase:')
        console.log('1. Que el proyecto esté activo')
        console.log('2. Que las credenciales sean correctas (Settings > API)')
      }
      return
    }

    console.log('✓ Conexión exitosa a Supabase')
    console.log('✓ Tabla site_config encontrada')
    
    if (tables && tables.length > 0) {
      console.log('\n=== Configuración Actual ===')
      console.log(JSON.stringify(tables[0], null, 2))
      console.log('\n✅ Todo está configurado correctamente!')
    } else {
      console.log('\n⚠️  La tabla existe pero no hay datos')
      console.log('\n📝 Ejecuta el SQL de inserción proporcionado arriba para agregar la configuración inicial')
    }

  } catch (error) {
    console.error('\n❌ Error general:', error)
    console.log('\n🔍 Detalles del error:')
    console.log(error.message || 'Error desconocido')
  }
}

// Ejecutar verificación
verifySupabaseConnection()
