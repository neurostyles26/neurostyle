# Guía de Subida y Despliegue: NeuroStyle PWA

Para que tu aplicación funcione en internet (Producción) con la IA operativa, sigue estos pasos:

## 1. Qué carpeta subir a GitHub
Debes subir el contenido de la carpeta `neurostyle-pwa`.
**IMPORTANTE**: El archivo `.env` **NO** se sube a GitHub por seguridad (ya está configurado en el `.gitignore`).

## 2. Pasos para GitHub (Manual)
1. Crea un repositorio nuevo en GitHub (ej: `neurostyle-ai`).
2. En tu terminal (dentro de `neurostyle-pwa`):
   ```bash
   git init
   git add .
   git commit -m "Versión final produccion"
   git branch -M main
   git remote add origin TU_URL_DE_GITHUB
   git push -u origin main
   ```

## 3. Despliegue en Netlify
1. Entra a [Netlify](https://www.netlify.com/) y conecta tu repositorio de GitHub.
2. **Configuración de Build:**
   - Build Command: `npm run build`
   - Publish directory: `dist`
3. **Variables de Entorno (CRUCIAL):**
   Ve a *Site configuration -> Environment variables* y añade estas tres:
   - `VITE_SUPABASE_URL`: (Tu URL de Supabase)
   - `VITE_SUPABASE_ANON_KEY`: (Tu llave anon de Supabase)
   - `VITE_REPLICATE_API_TOKEN`: (Tu token de API de Replicate)

## 4. Por qué funcionará la IA en Netlify
He creado un archivo `netlify.toml` en la raíz que configura un "Proxy". Esto permite que la aplicación llame a la IA de Replicate sin que el navegador la bloquee (evita el error de CORS).

---
**Nota**: Si decides usar la carpeta completa sin GitHub, simplemente arrastra la carpeta `dist` (después de hacer `npm run build`) a la sección de "Deploys" en Netlify.
