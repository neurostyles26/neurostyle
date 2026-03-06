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

const HAIRSTYLE_RECOMMENDATIONS = {
    [FACE_SHAPES.OVAL]: [
        { name: 'Classic Fade', prompt: "classic fade haircut, clean sides, textured top" },
        { name: 'Pompadour', prompt: "pompadour hairstyle, high volume top, tapered sides" },
        { name: 'Buzz Cut', prompt: "military buzz cut, very short hair, uniform length" }
    ],
    [FACE_SHAPES.ROUND]: [
        { name: 'High Skin Fade', prompt: "high skin fade haircut, sharp edges, voluminous top" },
        { name: 'Undercut', prompt: "slicked back undercut, shaved sides, long top" },
        { name: 'Faux Hawk', prompt: "faux hawk hairstyle, spiky center, short sides" }
    ],
    // Defaulting others for now
    'default': [
        { name: 'Crew Cut', prompt: "classic crew cut, short and neat" },
        { name: 'Side Part', prompt: "gentleman side part haircut, polished look" }
    ]
}

export const getHairstyleRecommendations = (faceShape) => {
    return HAIRSTYLE_RECOMMENDATIONS[faceShape] || HAIRSTYLE_RECOMMENDATIONS['default']
}

/**
 * Upload image to Supabase to get a public URL for LightX
 */
export const uploadImage = async (imageB64) => {
    try {
        const response = await fetch(imageB64)
        const blob = await response.blob()
        const fileName = `input_${Date.now()}.jpg`
        const filePath = `scans/${fileName}`

        const { data, error } = await supabase.storage
            .from('hairstyles') // Ensure this bucket exists and is public
            .upload(filePath, blob, { contentType: 'image/jpeg' })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from('hairstyles')
            .getPublicUrl(filePath)

        return publicUrl
    } catch (error) {
        console.error("Supabase Upload Error:", error)
        throw new Error("No se pudo subir la imagen para procesar.")
    }
}

/**
 * AI Hairstyle Generation using LightX API
 */
export const generateHairstyle = async (imageB64, _, hairstylePrompt) => {
    const LIGHTX_KEY = import.meta.env.VITE_HUGGING_FACE_TOKEN // Reusing the env var for now
    const BASE_URL = "https://api.lightxeditor.com/external/api/v1"

    try {
        // 1. Get public URL via Supabase
        const publicUrl = await uploadImage(imageB64)

        // 2. Request Hairstyle Transformation
        const hairResponse = await fetch(`${BASE_URL}/hairstyle`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": LIGHTX_KEY
            },
            body: JSON.stringify({
                imageUrl: publicUrl,
                textPrompt: hairstylePrompt
            })
        })

        if (!hairResponse.ok) {
            const err = await hairResponse.json()
            throw new Error(err.message || "Error al solicitar el peinado.")
        }

        const hairData = await hairResponse.json()
        const orderId = hairData.body?.orderId

        if (!orderId) throw new Error("No se recibió un Order ID de LightX.")

        // 3. Poll for Status
        let attempts = 0
        while (attempts < 60) {
            attempts++
            await new Promise(r => setTimeout(r, 2000))

            const statusResponse = await fetch(`${BASE_URL}/order-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": LIGHTX_KEY
                },
                body: JSON.stringify({ orderId })
            })

            const statusData = await statusResponse.json()
            const { status, resUrl } = statusData.body || {}

            if (status === "completed" && resUrl) {
                return resUrl
            } else if (status === "failed") {
                throw new Error("La generación del peinado falló en LightX.")
            }
        }

        throw new Error("Tiempo de espera agotado para la generación.")
    } catch (error) {
        console.error("LightX API Error:", error)
        throw error
    }
}

export default {
    FACE_SHAPES,
    getHairstyleRecommendations,
    generateHairstyle
}
