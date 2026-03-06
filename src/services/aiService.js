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
 * AI Hairstyle Generation using LightX API
 */
export const generateHairstyle = async (imageB64, _, hairstylePrompt) => {
    const LIGHTX_KEY = import.meta.env.VITE_HUGGING_FACE_TOKEN
    const BASE_URL = "https://api.lightxeditor.com/external/api/v1"

    if (!LIGHTX_KEY) throw new Error("API Key de LightX no configurada en VITE_HUGGING_FACE_TOKEN")

    try {
        // 1. Get public URL via Supabase
        const publicUrl = await uploadImage(imageB64)

        // 2. Request Hairstyle Transformation
        console.log("Solicitando peinado a LightX API...");
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
            console.error("Error de LightX API (Hairstyle):", err);
            throw new Error(err.message || "Error al solicitar el peinado a LightX.")
        }

        const hairData = await hairResponse.json()
        const orderId = hairData.body?.orderId

        if (!orderId) {
            console.error("Respuesta inesperada de LightX:", hairData);
            throw new Error("No se recibió un Order ID de LightX.")
        }

        console.log("Pedido creado. Order ID:", orderId);

        // 3. Poll for Status
        let attempts = 0
        while (attempts < 60) {
            attempts++
            console.log(`Verificando estado (intento ${attempts})...`);
            await new Promise(r => setTimeout(r, 2000))

            const statusResponse = await fetch(`${BASE_URL}/order-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": LIGHTX_KEY
                },
                body: JSON.stringify({ orderId })
            })

            if (!statusResponse.ok) {
                console.warn("Fallo temporal al consultar estado. Reintentando...");
                continue;
            }

            const statusData = await statusResponse.json()
            const { status, resUrl } = statusData.body || {}

            if (status === "completed" && resUrl) {
                console.log("Simulación completada con éxito:", resUrl);
                return resUrl
            } else if (status === "failed") {
                console.error("LightX informó un fallo en el pedido.");
                throw new Error("La generación del peinado falló en los servidores de LightX.")
            }
        }

        throw new Error("Tiempo de espera agotado. La IA está tardando demasiado.")
    } catch (error) {
        console.error("Error general en generateHairstyle:", error)
        throw error
    }
}

export default {
    FACE_SHAPES,
    getHairstyleRecommendations,
    generateHairstyle
}
