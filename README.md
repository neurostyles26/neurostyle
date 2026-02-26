# 💈 NeuroStyle PWA

**Experiencia de Barbería Elite con IA** — Vue 3 + Vite + Supabase + Replicate AI

---

## 🚀 Comandos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea o edita el archivo `.env` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_REPLICATE_API_TOKEN=tu_token_replicate
```

### 3. Ejecutar en modo desarrollo (ver la PWA)
```bash
npm run dev
```
Abre en el navegador: **http://localhost:5173**

> 💡 Para simular móvil: abre DevTools → Toggle Device Toolbar (Ctrl+Shift+M)

### 4. Construir para producción
```bash
npm run build
```

### 5. Vista previa del build de producción
```bash
npm run preview
```
Abre en el navegador: **http://localhost:4173**

---

## 🛠️ Stack

| Tecnología | Uso |
|---|---|
| Vue 3 + Vite | Framework y build |
| Tailwind CSS v4 | Estilos |
| Pinia | Estado global |
| Vue Router | Navegación |
| Supabase | Base de datos y Storage |
| Replicate API | IA generativa de estilos |

---

## 📱 Rutas Principales

| Ruta | Vista |
|---|---|
| `/` | Landing (inicio) |
| `/scan` | Análisis Facial IA |
| `/styles` | Sugerencias de Estilo |
| `/book` | Reservar Cita |
| `/store` | Tienda Grooming |
| `/admin` | Panel Admin Barbero |
| `/admin/products` | Gestión de Productos |
| `/admin/appointments` | Gestión de Citas |

---

## 🗄️ SQL Supabase (ejecutar en SQL Editor)

```sql
-- Tabla de productos
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Storage bucket para imágenes de productos
-- Ve a: Storage > New Bucket > Nombre: "products" > Public: ON
```

---

## 📞 WhatsApp Barbero

Edita `GroomingStoreView.vue` línea 108:
```javascript
const phoneNumber = "57XXXXXXXXXX" // Número colombiano sin +
```
