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
        console.log("Image uploaded to Supabase:", imageUrl)

        const prompt = `realistic 8k high quality photo, same person as in the picture but with a ${hairstyleName} haircut, cinematic lighting, sharp details, master barber work, maintaining identical facial features and skin tone, professional portrait`

        // Use the Netlify serverless function proxy (works in both dev and production)
        const response = await fetch("/api/replicate?action=create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // stability-ai/sdxl model
                version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
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

        // Poll for completion using the serverless function
        const predictionId = prediction.id
        if (!predictionId) {
            console.error("Missing prediction ID:", prediction)
            throw new Error("Respuesta incompleta de la IA. No se recibió ID de predicción.")
        }

        let attempts = 0
        while (prediction.status !== "succeeded" && prediction.status !== "failed" && prediction.status !== "canceled") {
            attempts++
            if (attempts > 90) throw new Error("Timeout: La generación tardó demasiado.")
            await new Promise(resolve => setTimeout(resolve, 2000))

            const pollResponse = await fetch(`/api/replicate?action=poll&id=${predictionId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })

            if (!pollResponse.ok) {
                console.warn(`Poll attempt ${attempts} failed with status ${pollResponse.status}`)
                continue
            }

            prediction = await pollResponse.json()
            console.log(`Poll ${attempts}: status=${prediction.status}`)
        }

        if (prediction.status === "succeeded") {
            const output = prediction.output
            if (Array.isArray(output)) return output[output.length - 1]
            return output
        } else {
            throw new Error("Generación fallida: " + (prediction.error || prediction.status || "Error desconocido"))
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
