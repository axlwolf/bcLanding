# Solución de Errores en Vercel

## Problemas Identificados

1. **Error 401 en site.webmanifest**: Los archivos estáticos están siendo bloqueados
2. **Error 500 en /api/allset/templates/update**: Problema con la conexión a Supabase o tabla faltante

## Soluciones Aplicadas

### 1. Configuración de Vercel (vercel.json)

Se agregó un archivo `vercel.json` para:

- Configurar headers correctos para archivos estáticos
- Aumentar el tiempo de ejecución de la función API
- Permitir acceso CORS a los favicons

### 2. Actualización del Middleware

Se actualizó el middleware para:

- Explícitamente permitir rutas públicas
- Mejorar el manejo de archivos estáticos
- Prevenir bloqueos innecesarios

### 3. Mejora en el Manejo de Errores de la API

Se mejoró la API para:

- Verificar variables de entorno antes de ejecutar
- Proporcionar mensajes de error más descriptivos
- Agregar handler OPTIONS para CORS

### 4. Script de Verificación de Supabase

Se creó `scripts/verify-supabase.mjs` para verificar:

- Configuración de variables de entorno
- Conexión a Supabase
- Existencia de la tabla site_config

## Pasos para Resolver

1. **Verificar la conexión a Supabase**:

   ```bash
   node scripts/verify-supabase.mjs
   ```

2. **Si la tabla no existe, ejecutar en Supabase SQL Editor**:

   ```sql
   -- Crear tabla site_config
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
   EXECUTE FUNCTION update_updated_at_column();
   ```

3. **Hacer deploy a Vercel**:

   ```bash
   git add .
   git commit -m "Fix: Resolve 401 and 500 errors in Vercel deployment"
   git push
   ```

4. **Verificar en Vercel**:
   - Asegurarse de que las variables de entorno estén configuradas en Vercel
   - Verificar que el dominio esté correctamente configurado
   - Revisar los logs de funciones en Vercel Dashboard

## Variables de Entorno Requeridas en Vercel

Asegúrate de que estas variables estén configuradas en tu proyecto de Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
ADMIN_USERNAME=tu_usuario_admin
ADMIN_PASSWORD=tu_password_admin
```

## Debugging Adicional

Si los errores persisten:

1. **Revisar logs en Vercel Functions**:
   - Ir a Vercel Dashboard > Functions
   - Buscar errores en `/api/allset/templates/update`

2. **Verificar Network en Supabase**:
   - Asegurar que el proyecto de Supabase esté activo
   - Verificar que no haya restricciones de IP

3. **Limpiar caché de Vercel**:
   - En Vercel Dashboard, ir a Settings > Functions
   - Click en "Purge Cache"
