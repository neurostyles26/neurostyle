import { supabase } from './supabase'
import { haircutCatalog } from '../data/haircutCatalog'

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

export const getHairstyleRecommendations = (faceShape, gender = 'Caballero') => {
    // Filter from catalog
    return haircutCatalog.filter(style =>
        style.faceShapes.includes(faceShape) &&
        (style.gender === gender || !gender)
    ).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
}

/**
 * Upload image to Supabase to get a public URL for LightX
 */
export const uploadImage = async (imageB64) => {
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
            throw new Error(`Supabase Error: ${error.message}. ¿Creaste el bucket 'hairstyles' y lo pusiste público?`);
        }

        const { data: { publicUrl } } = supabase.storage
            .from('hairstyles')
            .getPublicUrl(filePath)

        console.log("Imagen subida con éxito. URL pública:", publicUrl);
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

        // Combine prompts according to user template
        const fullPrompt = `portrait photo of the same person with a ${hairstylePrompt}, professional barber haircut, ultra realistic, photorealistic, preserve facial identity, replace hair only`
        const negativePrompt = "distorted face, blurry, unrealistic skin, extra eyes, bad anatomy"

        // For HF Inpainting, we often send a combined payload or specific headers
        // This implementation follows the standard HF Inference API pattern
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-inpainting",
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
export const generateHairstyle = async (imageB64, maskB64, hairstylePrompt) => {
    // 1. Try Replicate first (Superior quality)
    try {
        return await generateHairstyleReplicate(imageB64, maskB64, hairstylePrompt)
    } catch (e) {
        console.warn("Replicate falló, intentando Hugging Face...", e)
    }

    // 2. Try Hugging Face
    try {
        const hfResult = await generateHairstyleHF(imageB64, maskB64, hairstylePrompt)
        if (hfResult) return hfResult
    } catch (e) {
        console.warn("Hugging Face falló, intentando LightX...", e)
    }

    // 2. Fallback to LightX proxy (which we have working with the provided key)
    const PROXY_URL = "/api/lightx"
    try {
        // ... (existing LightX logic)
        const publicUrl = await uploadImage(imageB64)
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
            if (status === "completed" && resUrl) return resUrl
            if (status === "failed") throw new Error("La IA de LightX falló.")
        }
        throw new Error("Tiempo de espera agotado.")
    } catch (error) {
        console.error("AI Service Error:", error)
        throw error
    }
}

export default {
    FACE_SHAPES,
    detectFaceShape,
    getHairstyleRecommendations,
    generateHairstyle
}

