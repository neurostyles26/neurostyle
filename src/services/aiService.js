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
 * AI Hairstyle Generation using LightX API (via Netlify Proxy)
 */
export const generateHairstyle = async (imageB64, _, hairstylePrompt) => {
    // We use our proxy to avoid CORS and hide the key
    const PROXY_URL = "/api/lightx"

    try {
        // 1. Get public URL via Supabase
        const publicUrl = await uploadImage(imageB64)

        // 2. Request Hairstyle Transformation
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
        if (!hairResponse.ok) {
            throw new Error(hairData.error || hairData.message || "Error al solicitar peinado.")
        }

        const orderId = hairData.body?.orderId
        if (!orderId) throw new Error("No se recibió un Order ID de LightX.")

        console.log("Pedido creado. ID:", orderId);

        // 3. Poll for Status
        let attempts = 0
        while (attempts < 60) {
            attempts++
            console.log(`Verificando estado (intento ${attempts})...`);
            await new Promise(r => setTimeout(r, 2000))

            const statusResponse = await fetch(`${PROXY_URL}?action=status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId })
            })

            const statusData = await statusResponse.json()
            if (!statusResponse.ok) continue;

            const { status, resUrl } = statusData.body || {}

            if (status === "completed" && resUrl) {
                console.log("Simulación completada!");
                return resUrl
            } else if (status === "failed") {
                throw new Error("La IA de LightX falló al procesar el peinado.")
            }
        }

        throw new Error("Tiempo de espera agotado.")
    } catch (error) {
        console.error("AI Service Error:", error)
        throw error
    }
}

export default {
    FACE_SHAPES,
    getHairstyleRecommendations,
    generateHairstyle
}
