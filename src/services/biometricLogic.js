/**
 * NeuroStyle Biometric Logic
 * Mathematically determines face shape based on 468 MediaPipe landmarks.
 */

// Key Landmark Indices for MediaPipe FaceMesh
const MESH = {
    TOP: 10,
    CHIN: 152,
    LEFT_CHEEK: 234,
    RIGHT_CHEEK: 454,
    LEFT_JAW: 172,
    RIGHT_JAW: 397,
    LEFT_FOREHEAD: 103,
    RIGHT_FOREHEAD: 332,
    LEFT_EYE: 33,
    RIGHT_EYE: 263,
    NOSE_TIP: 1,
    MOUTH_LEFT: 61,
    MOUTH_RIGHT: 291
}

/**
 * Calculates Euclidean distance between two 3D landmarks
 */
const getDistance = (p1, p2) => {
    return Math.sqrt(
        Math.pow(p2.x - p1.x, 2) +
        Math.pow(p2.y - p1.y, 2) +
        Math.pow(p2.z - p1.z, 2)
    )
}

/**
 * Calculates the angle between three points (B is vertex)
 */
const getAngle = (A, B, C) => {
    const AB = getDistance(A, B)
    const BC = getDistance(B, C)
    const AC = getDistance(A, C)
    return Math.acos((AB * AB + BC * BC - AC * AC) / (2 * AB * BC)) * (180 / Math.PI)
}

export const calculateFaceMetrics = (landmarks) => {
    const l = landmarks

    // Widths
    const faceWidth = getDistance(l[MESH.LEFT_CHEEK], l[MESH.RIGHT_CHEEK])
    const foreheadWidth = getDistance(l[MESH.LEFT_FOREHEAD], l[MESH.RIGHT_FOREHEAD])
    const jawWidth = getDistance(l[MESH.LEFT_JAW], l[MESH.RIGHT_JAW])
    const faceHeight = getDistance(l[MESH.TOP], l[MESH.CHIN])

    // Specific features
    const eyeDistance = getDistance(l[MESH.LEFT_EYE], l[MESH.RIGHT_EYE])
    const mouthWidth = getDistance(l[MESH.MOUTH_LEFT], l[MESH.MOUTH_RIGHT])

    // Jaw Sharpness (Angle at chin between jaw points)
    const chinAngle = getAngle(l[MESH.LEFT_JAW], l[MESH.CHIN], l[MESH.RIGHT_JAW])

    // Ratios
    const heightWidthRatio = faceHeight / faceWidth
    const foreheadJawRatio = foreheadWidth / jawWidth

    return {
        faceWidth,
        foreheadWidth,
        jawWidth,
        faceHeight,
        eyeDistance,
        mouthWidth,
        chinAngle,
        heightWidthRatio,
        foreheadJawRatio
    }
}

export const determineFaceShape = (metrics) => {
    const { heightWidthRatio, chinAngle, foreheadJawRatio, faceWidth, jawWidth } = metrics

    let scores = {
        Ovalado: 0,
        Redondo: 0,
        Cuadrado: 0,
        Alargado: 0,
        Diamante: 0,
        Corazón: 0
    }

    // 1. Height-to-Width Ratio Logic
    if (heightWidthRatio > 1.5) scores.Alargado += 5
    else if (heightWidthRatio > 1.3) scores.Ovalado += 5
    else if (heightWidthRatio > 1.1) scores.Redondo += 3
    else scores.Cuadrado += 4

    // 2. Jaw & Chin Logic
    if (chinAngle < 100) {
        scores.Diamante += 3
        scores.Corazón += 2
    } else if (chinAngle > 125) {
        scores.Cuadrado += 3
        scores.Redondo += 2
    }

    // 3. Forehead vs Jaw
    if (foreheadJawRatio > 1.2) scores.Corazón += 4
    if (Math.abs(1 - foreheadJawRatio) < 0.1) scores.Cuadrado += 2

    // 4. Narrowing Detection
    if (faceWidth > jawWidth * 1.3) {
        scores.Diamante += 2
        scores.Ovalado += 1
    }

    // Find the winner
    const winner = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0]

    // Calculate pseudo-confidence (0.0 to 1.0)
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
    const confidence = scores[winner] / totalScore

    return {
        shape: winner,
        confidence: parseFloat(confidence.toFixed(2)),
        metrics: {
            ratio: heightWidthRatio.toFixed(2),
            angle: chinAngle.toFixed(1),
            balance: foreheadJawRatio.toFixed(2)
        }
    }
}

export const validateScanQuality = (landmarks, metrics) => {
    const l = landmarks

    // 1. Head Tilt (horizontal)
    const eyeLevelDiff = Math.abs(l[MESH.LEFT_EYE].y - l[MESH.RIGHT_EYE].y)
    const tilted = eyeLevelDiff > 0.05 // Normalized coordinates

    // 2. Centering (normalized 0-1)
    const nose = l[MESH.NOSE_TIP]
    const centered = nose.x > 0.4 && nose.x < 0.6 && nose.y > 0.3 && nose.y < 0.7

    // 3. Distance (Height coverage)
    const tooClose = metrics.faceHeight > 0.8
    const tooFar = metrics.faceHeight < 0.3

    let quality = 100
    if (tilted) quality -= 30
    if (!centered) quality -= 40
    if (tooClose || tooFar) quality -= 20

    return {
        score: Math.max(0, quality),
        tilted,
        centered,
        distance: tooClose ? 'TOO_CLOSE' : (tooFar ? 'TOO_FAR' : 'OK')
    }
}

export default {
    calculateFaceMetrics,
    determineFaceShape,
    validateScanQuality
}
