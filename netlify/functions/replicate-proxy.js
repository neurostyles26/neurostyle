// Netlify Serverless Function: Replicate API Proxy
// This function securely proxies requests to Replicate's API,
// keeping the API token server-side and hidden from the client.

export default async (req) => {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

    if (!REPLICATE_API_TOKEN) {
        return new Response(JSON.stringify({ error: "REPLICATE_API_TOKEN not configured in Netlify environment variables." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            }
        })
    }

    try {
        const url = new URL(req.url)
        const action = url.searchParams.get("action") // "create" or "poll"
        const predictionId = url.searchParams.get("id")

        let replicateUrl, method, body

        if (action === "poll" && predictionId) {
            // Poll for prediction status
            replicateUrl = `https://api.replicate.com/v1/predictions/${predictionId}`
            method = "GET"
            body = null
        } else {
            // Create new prediction
            replicateUrl = "https://api.replicate.com/v1/predictions"
            method = "POST"
            body = await req.text()
        }

        const replicateResponse = await fetch(replicateUrl, {
            method,
            headers: {
                "Authorization": `Bearer ${REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
                "Prefer": "wait"
            },
            ...(body ? { body } : {})
        })

        const data = await replicateResponse.text()

        return new Response(data, {
            status: replicateResponse.status,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
    } catch (error) {
        console.error("Replicate Proxy Error:", error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}

export const config = {
    path: "/api/replicate"
}
