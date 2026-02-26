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
        { name: 'Classic Fade', description: "Equilibrio perfecto para rostros ovalados." },
        { name: 'Pompadour', description: "Volumen superior que resalta tus facciones." },
        { name: 'Buzz Cut', description: "Un look limpio y masculino." }
    ],
    [FACE_SHAPES.ROUND]: [
        { name: 'High Skin Fade', description: "Añade estructura a los bordes suavizados." },
        { name: 'Undercut', description: "Reduce el ancho visual de los lados." },
        { name: 'Faux Hawk', description: "Crea altura para alargar el rostro." }
    ],
    [FACE_SHAPES.SQUARE]: [
        { name: 'Side Part', description: "Suaviza los rasgos angulares de la mandíbula." },
        { name: 'Crew Cut', description: "Mantiene la proporción ideal para rostros cuadrados." },
        { name: 'Textured Crop', description: "Añade movimiento y textura moderna." }
    ],
    [FACE_SHAPES.LONG]: [
        { name: 'Side Swept', description: "Reduce visualmente la longitud del rostro." },
        { name: 'Taper Fade', description: "Mantiene un perfil equilibrado y profesional." },
        { name: 'Slicked Back', description: "Elegancia clásica con un toque de volumen lateral." }
    ],
}

export const getHairstyleRecommendations = (faceShape) => {
    return HAIRSTYLE_RECOMMENDATIONS[faceShape] || HAIRSTYLE_RECOMMENDATIONS[FACE_SHAPES.OVAL]
}

export const uploadToSupabase = async (blob) => {
    try {
        const fileName = `hairstyle_${Date.now()}.jpg`
        const filePath = `uploads/${fileName}`

        const { data, error } = await supabase.storage
            .from('hairstyles')
            .upload(filePath, blob, {
                contentType: 'image/jpeg'
            })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from('hairstyles')
            .getPublicUrl(filePath)

        return publicUrl
    } catch (error) {
        console.error("CRITICAL: Supabase Upload Failed:", error)
        throw new Error(`Error de subida a Supabase: ${error.message || 'Verifica que el bucket "hairstyles" exista y sea público.'}`)
    }
}

export const generateHairstyle = async (imageBlob, hairstyleName) => {
    try {
        const imageUrl = await uploadToSupabase(imageBlob)
        const REPLICATE_API_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN

        if (!REPLICATE_API_TOKEN) {
            console.error("AI Service Error: VITE_REPLICATE_API_TOKEN is not defined.")
            throw new Error("La API Key de Replicate no está configurada en el servidor. Por favor, reinicia el servidor 'npm run dev'.")
        }

        const prompt = `realistic 8k high quality photo, same man as in the picture but with a ${hairstyleName} haircut, cinematic lighting, sharp details, master barber work, maintaining identical facial features and skin tone, professional portrait`

        const response = await fetch("/replicate-api/v1/predictions", {
            method: "POST",
            headers: {
                "Authorization": `Token ${REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                version: "a10f97a55700da5105ca23d493f02f0503f7a77b8cf9610996992e9517c569f1",
                input: {
                    prompt: prompt,
                    image: imageUrl,
                    negative_prompt: "bad quality, blurry, distorted face, different person, cartoon, anime, low resolution, extra fingers, ugly, messy hair",
                    num_inference_steps: 50,
                    guidance_scale: 9,
                    prompt_strength: 0.65
                },
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Replicate API Error Response:", errorText)
            throw new Error(`Error de Replicate (${response.status}): ${errorText}`)
        }

        let prediction = await response.json()
        console.log("Replicate Prediction Started:", prediction)

        if (prediction.error || prediction.detail) {
            throw new Error(prediction.error || prediction.detail)
        }

        if (!prediction.urls || !prediction.urls.get) {
            console.error("Incomplete prediction object:", prediction)
            throw new Error("Respuesta incompleta de la IA. Verifica tu API Token.")
        }

        // Polling for web
        const pollUrl = prediction.urls.get
        let attempts = 0
        while (prediction.status !== "succeeded" && prediction.status !== "failed") {
            attempts++
            if (attempts > 60) throw new Error("Timeout waiting for generation")
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Ensure pollUrl also uses proxy
            const proxiedPollUrl = pollUrl.replace('https://api.replicate.com', '/replicate-api')

            const pollResponse = await fetch(proxiedPollUrl, {
                headers: {
                    "Authorization": `Token ${REPLICATE_API_TOKEN}`,
                },
            })
            prediction = await pollResponse.json()
        }

        if (prediction.status === "succeeded") {
            return typeof prediction.output === 'string' ? prediction.output : prediction.output[0]
        } else {
            throw new Error("Generation failed: " + (prediction.error || "Unknown error"))
        }
    } catch (error) {
        console.error("CRITICAL: AI Generation Error:", error)
        throw error
    }
}

export default {
    FACE_SHAPES,
    getHairstyleRecommendations,
    generateHairstyle,
    uploadToSupabase
}
