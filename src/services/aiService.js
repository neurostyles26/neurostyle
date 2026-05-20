import { supabase } from './supabase'

export const FACE_SHAPES = {
    OVAL: 'Ovalado',
    ROUND: 'Redondo',
    SQUARE: 'Cuadrado',
    DIAMOND: 'Diamante',
    TRIANGLE: 'Triángulo',
    HEART: 'Corazón',
    LONG: 'Alargado'
}

/**
 * Detect face shape based on MediaPipe landmarks
 * @param {Array} landmarks - 478 MediaPipe face landmarks
 */
export const detectFaceShape = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return FACE_SHAPES.OVAL

    // Key points indices:
    // 10: Top of forehead
    // 152: Bottom of chin
    // 234: Leftmost cheek
    // 454: Rightmost cheek
    // 103: Left forehead
    // 332: Right forehead
    // 58: Left jaw
    // 288: Right jaw

    const getDistance = (p1, p2) => {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
    }

    const faceHeight = getDistance(landmarks[10], landmarks[152])
    const faceWidth = getDistance(landmarks[234], landmarks[454])
    const foreheadWidth = getDistance(landmarks[103], landmarks[332])
    const jawWidth = getDistance(landmarks[58], landmarks[288])

    const ratio = faceHeight / faceWidth

    console.log(`Face Analysis - Ratio: ${ratio.toFixed(2)}, H: ${faceHeight.toFixed(2)}, W: ${faceWidth.toFixed(2)}`)

    // Simple heuristic detection logic
    if (ratio > 1.45) return FACE_SHAPES.LONG
    if (ratio > 1.25) {
        if (foreheadWidth > jawWidth * 1.1) return FACE_SHAPES.HEART
        return FACE_SHAPES.OVAL
    }
    if (ratio < 1.1) return FACE_SHAPES.ROUND

    // Default to Square if width is similar to height but not round
    if (jawWidth > foreheadWidth * 0.95) return FACE_SHAPES.SQUARE

    return FACE_SHAPES.OVAL
}

/**
 * Obtiene recomendaciones de peinado desde la base de datos de Supabase.
 * Filtra por forma de rostro, género y tenant actual.
 */
export const getHairstyleRecommendations = async (faceShape, gender = 'Caballero') => {
    try {
        const { data, error } = await supabase
            .from('catalog')
            .select('*')
            .eq('gender', gender)
            .eq('is_active', true)
            .contains('face_shapes', [faceShape])
            .order('match_score', { ascending: false })

        if (error) throw error
        
        // Mapear para mantener compatibilidad con el frontend
        return data.map(item => ({
            id: item.id,
            name: item.name,
            desc: item.description,
            gender: item.gender,
            faceShapes: item.face_shapes,
            maintenance: item.maintenance_level,
            matchScore: item.match_score,
            overlayImage: item.overlay_image_url
        }))
    } catch (e) {
        console.error("Error al obtener recomendaciones de DB:", e)
        return []
    }
}

/**
 * Registra un evento de analítica para el Tenant actual.
 */
export const trackAnalyticsEvent = async (tenantId, eventType, styleId = null, metadata = {}) => {
    if (!tenantId) return
    try {
        await supabase.from('analytics_events').insert([{
            tenant_id: tenantId,
            event_type: eventType,
            style_id: styleId,
            metadata: metadata
        }])
    } catch (e) {
        console.error("Error tracking analytics:", e)
    }
}

/**
 * Registra una imagen para borrado automático (Privacy TTL).
 */
export const registerTemporaryAsset = async (tenantId, storagePath, type = 'raw_photo') => {
    if (!tenantId) return
    try {
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutos
        await supabase.from('temporary_assets').insert([{
            tenant_id: tenantId,
            storage_path: storagePath,
            expires_at: expiresAt,
            asset_type: type
        }])
    } catch (e) {
        console.error("Error registering temporary asset:", e)
    }
}

/**
 * Verifica y descuenta créditos de IA para el Tenant.
 */
export const checkAndDeductCredits = async (tenantId) => {
    if (!tenantId) return { allowed: true } // Para usuarios libres sin tenant (vía Landing)

    try {
        // 1. Obtener créditos usados vs límite del plan
        const { data: tenant, error } = await supabase
            .from('tenants')
            .select('ai_credits_used, plans(ai_credits_limit)')
            .eq('id', tenantId)
            .single()

        if (error) throw error

        const used = tenant.ai_credits_used || 0
        const limit = tenant.plans?.ai_credits_limit || 0

        if (used >= limit) {
            return { allowed: false, message: "Límite de créditos IA alcanzado. Por favor, sube de nivel tu plan." }
        }

        // 2. Descontar 1 crédito (Incremental)
        await supabase.rpc('increment_ai_credits', { tenant_uuid: tenantId })
        
        return { allowed: true }
    } catch (e) {
        console.error("Error checking credits:", e)
        return { allowed: true } // Fallback permissive
    }
}

/**
 * Upload image to Supabase to get a public URL for LightX
 */
export const uploadImage = async (imageB64, tenantId = null) => {
    try {
        console.log("Iniciando carga a Supabase...");
        const response = await fetch(imageB64)
        if (!response.ok) throw new Error("Error al convertir imagen base64")
        const blob = await response.blob()

        const fileName = `input_${Date.now()}.jpg`
        const filePath = `scans/${fileName}`

        console.log("Subiendo archivo a bucket 'hairstyles'...");
        const { data, error } = await supabase.storage
            .from('hairstyles')
            .upload(filePath, blob, { contentType: 'image/jpeg' })

        if (error) {
            console.error("Error detallado de Supabase Storage:", error);
            throw new Error(`Supabase Error: ${error.message}`);
        }

        // Registrar para auto-limpieza (Privacidad)
        if (tenantId) {
            await registerTemporaryAsset(tenantId, filePath)
        }

        const { data: { publicUrl } } = supabase.storage
            .from('hairstyles')
            .getPublicUrl(filePath)

        return publicUrl
    } catch (error) {
        console.error("Excepción en uploadImage:", error)
        throw error
    }
}

/**
 * AI Hairstyle Generation using Replicate (SDXL Inpainting)
 * This is our highest quality method.
 */
export const generateHairstyleReplicate = async (imageB64, maskB64, hairstylePrompt) => {
    const PROXY_URL = "/api/replicate"
    
    try {
        // SDXL Inpainting on Replicate
        const response = await fetch(PROXY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                version: "31e3518299946891047648312e51921f00843236e78fc79a4561ec908e586c07", // lucataco/stable-diffusion-xl-inpainting
                input: {
                    image: imageB64,
                    mask: maskB64,
                    prompt: `professional studio portrait, same person with a ${hairstylePrompt}, high precision barber cut, sharp fade, highly detailed hair texture, 8k resolution, photorealistic, cinematic lighting`,
                    negative_prompt: "deformed, distorted, unnatural hair, bad anatomy, cartoon, drawing, painting, blurry, extra fingers",
                    num_inference_steps: 30,
                    guidance_scale: 7.5,
                    strength: 0.9
                }
            })
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Replicate failed to start")

        const predictionId = data.id
        
        // Polling for results
        let attempts = 0
        while (attempts < 60) {
            attempts++
            await new Promise(r => setTimeout(r, 2000))
            
            const pollResponse = await fetch(`${PROXY_URL}?action=poll&id=${predictionId}`)
            const pollData = await pollResponse.json()
            
            if (pollData.status === "succeeded") {
                return Array.isArray(pollData.output) ? pollData.output[0] : pollData.output
            }
            if (pollData.status === "failed") throw new Error("Replicate generation failed")
        }
        throw new Error("Replicate timeout")
    } catch (error) {
        console.error("Replicate Service Error:", error)
        throw error
    }
}

/**
 * AI Hairstyle Generation using HuggingFace Inference API
 * Model: stabilityai/stable-diffusion-2-inpainting
 */
export const generateHairstyleHF = async (imageB64, maskB64, hairstylePrompt) => {
    const HF_TOKEN = import.meta.env.VITE_HUGGING_FACE_TOKEN

    if (!HF_TOKEN || !HF_TOKEN.startsWith('hf_')) {
        console.warn("Token de Hugging Face no válido o ausente (debe empezar con hf_). Usando LightX como respaldo...");
        return null; // Signals to try LightX
    }

    try {
        const imageBlob = await fetch(imageB64).then(r => r.blob())
        const maskBlob = await fetch(maskB64).then(r => r.blob())

        // Enhanced prompt for SDXL Inpainting to ensure realism
        const fullPrompt = `high-end professional barber photo of the same person with a ${hairstylePrompt}, photorealistic, 8k uhd, highly detailed hair texture, sharp focus, cinematic lighting, masterpiece, perfectly blended with skin, natural hairline, realistic shadows`
        const negativePrompt = "cartoon, anime, 3d render, illustration, painting, blurry, low quality, distorted face, extra limbs, unrealistic hair, plastic texture"

        const response = await fetch(
            "https://api-inference.huggingface.co/models/diffusers/stable-diffusion-xl-1.0-inpainting-0.1",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: {
                        image: await blobToBase64(imageBlob),
                        mask: await blobToBase64(maskBlob),
                        prompt: fullPrompt,
                        negative_prompt: negativePrompt
                    },
                    parameters: {
                        num_inference_steps: 40,
                        guidance_scale: 8.5,
                        strength: 0.95
                    }
                })
            }
        )

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`HF API Error: ${error.error || response.statusText}`)
        }

        const resultBlob = await response.blob()
        return URL.createObjectURL(resultBlob)
    } catch (error) {
        console.error("HuggingFace Generation Failed:", error)
        throw error
    }
}

const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

/**
 * Main AI Hairstyle Generation Entry Point
 */
export const generateHairstyle = async (imageB64, maskB64, selectedStyle, tenantId = null) => {
    // 1. Verificar Créditos SaaS
    const creditCheck = await checkAndDeductCredits(tenantId)
    if (!creditCheck.allowed) {
        throw new Error(creditCheck.message)
    }

    const hairstylePrompt = `${selectedStyle.name}: ${selectedStyle.desc}`

    // 2. Try Replicate first (Superior quality)
    try {
        const result = await generateHairstyleReplicate(imageB64, maskB64, hairstylePrompt)
        if (result) {
            await trackAnalyticsEvent(tenantId, 'ai_render_success', selectedStyle.id, { provider: 'replicate' })
            return result
        }
    } catch (e) {
        console.warn("Replicate falló, intentando Hugging Face...", e)
    }

    // 3. Try Hugging Face
    try {
        const hfResult = await generateHairstyleHF(imageB64, maskB64, hairstylePrompt)
        if (hfResult) {
            await trackAnalyticsEvent(tenantId, 'ai_render_success', selectedStyle.id, { provider: 'huggingface' })
            return hfResult
        }
    } catch (e) {
        console.warn("Hugging Face falló, intentando LightX...", e)
    }

    // 4. Fallback to LightX proxy
    const PROXY_URL = "/api/lightx"
    try {
        const publicUrl = await uploadImage(imageB64, tenantId)
        console.log("Solicitando peinado (via Proxy)...");
        const hairResponse = await fetch(`${PROXY_URL}?action=hairstyle`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                imageUrl: publicUrl,
                textPrompt: hairstylePrompt
            })
        })

        const hairData = await hairResponse.json()
        if (!hairResponse.ok) throw new Error(hairData.error || hairData.message || "Error al solicitar peinado.")

        const orderId = hairData.body?.orderId
        if (!orderId) throw new Error("No se recibió un Order ID de LightX.")

        let attempts = 0
        while (attempts < 60) {
            attempts++
            await new Promise(r => setTimeout(r, 2000))
            const statusResponse = await fetch(`${PROXY_URL}?action=status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId })
            })
            const statusData = await statusResponse.json()
            if (!statusResponse.ok) continue
            const { status, resUrl } = statusData.body || {}
            if (status === "completed" && resUrl) {
                await trackAnalyticsEvent(tenantId, 'ai_render_success', selectedStyle.id, { provider: 'lightx' })
                return resUrl
            }
            if (status === "failed") throw new Error("La IA de LightX falló.")
        }
        throw new Error("Tiempo de espera agotado.")
    } catch (error) {
        console.error("AI Service Error:", error)
        await trackAnalyticsEvent(tenantId, 'ai_render_failed', selectedStyle.id, { error: error.message })
        throw error
    }
}

export default {
    FACE_SHAPES,
    detectFaceShape,
    getHairstyleRecommendations,
    generateHairstyle
}

