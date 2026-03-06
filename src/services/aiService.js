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
 * AI Hairstyle Generation using HuggingFace Inference API
 */
export const generateHairstyle = async (imageB64, maskB64, hairstylePrompt) => {
    const HF_TOKEN = import.meta.env.VITE_HUGGING_FACE_TOKEN

    if (!HF_TOKEN) {
        throw new Error("VITE_HUGGING_FACE_TOKEN no configurado en .env")
    }

    try {
        // Convert base64 to Blob for sending
        const imageBlob = await fetch(imageB64).then(r => r.blob())
        const maskBlob = await fetch(maskB64).then(r => r.blob())

        const formData = new FormData()
        formData.append("image", imageBlob)
        formData.append("mask", maskBlob)
        formData.append("prompt", `portrait photo of the same person with a ${hairstylePrompt}, professional barber haircut, ultra realistic, photorealistic, preserve facial identity, replace hair only`)
        formData.append("negative_prompt", "distorted face, blurry, unrealistic skin, extra eyes, bad anatomy, different person face")

        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-inpainting",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_TOKEN}`
                },
                body: formData
            }
        )

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`HF API Error: ${error.error || response.statusText}`)
        }

        const resultBlob = await response.blob()
        return URL.createObjectURL(resultBlob)
    } catch (error) {
        console.error("AI Generation Failed:", error)
        throw error
    }
}

export default {
    FACE_SHAPES,
    getHairstyleRecommendations,
    generateHairstyle
}
