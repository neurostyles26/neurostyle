// Netlify Serverless Function: LightX API Proxy
export const handler = async (event) => {
    const LIGHTX_API_KEY = process.env.VITE_HUGGING_FACE_TOKEN

    console.log("LightX Proxy - Method:", event.httpMethod);
    console.log("Key Configured?", !!LIGHTX_API_KEY);

    if (!LIGHTX_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "VITE_HUGGING_FACE_TOKEN no configurado en Netlify." })
        }
    }

    // Handle CORS preflight
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, x-api-key",
            }
        }
    }

    try {
        const action = event.queryStringParameters?.action // 'hairstyle' or 'status'
        const url = action === 'status'
            ? "https://api.lightxeditor.com/external/api/v1/order-status"
            : "https://api.lightxeditor.com/external/api/v1/hairstyle";

        console.log(`Proxying to LightX: ${url}`);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": LIGHTX_API_KEY
            },
            body: event.body
        })

        const data = await response.json()

        return {
            statusCode: response.status,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data)
        }
    } catch (error) {
        console.error("Proxy Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        }
    }
}
