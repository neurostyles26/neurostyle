// Netlify Serverless Function: Replicate API Proxy
export const handler = async (event) => {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

    if (!REPLICATE_API_TOKEN) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "REPLICATE_API_TOKEN not configured in Netlify." })
        }
    }

    // Handle CORS preflight
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            }
        }
    }

    try {
        const action = event.queryStringParameters?.action
        const predictionId = event.queryStringParameters?.id

        let url, method, body

        if (action === "poll" && predictionId) {
            url = `https://api.replicate.com/v1/predictions/${predictionId}`
            method = "GET"
            body = null
        } else {
            url = "https://api.replicate.com/v1/predictions"
            method = "POST"
            body = event.body
        }

        const response = await fetch(url, {
            method,
            headers: {
                "Authorization": `Token ${REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            ...(body ? { body } : {})
        })

        const responseBody = await response.text()

        return {
            statusCode: response.status,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: responseBody
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        }
    }
}
