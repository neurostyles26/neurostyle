/**
 * Hairstyle Overlay Service
 * Uses MediaPipe landmarks to precisely position and scale hairstyle images.
 */

export const applyHairstyleOverlay = async (userImageBase64, landmarks, hairstyleImageUrl) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const userImg = new Image()
        const hairImg = new Image()

        userImg.onload = () => {
            canvas.width = userImg.width
            canvas.height = userImg.height

            hairImg.onload = () => {
                // 1. Draw base user image
                ctx.drawImage(userImg, 0, 0)

                // 2. Calculate Overlay Metrics
                // We use MediaPipe landmarks (normalized 0-1)
                const w = canvas.width
                const h = canvas.height

                // Key landmarks:
                // 10: Forehead Top Center
                // 234: Left Cheekbone
                // 454: Right Cheekbone
                // 33: Left Eye
                // 263: Right Eye
                // 152: Chin Bottom

                const forehead = landmarks[10]
                const leftCheek = landmarks[234]
                const rightCheek = landmarks[454]
                const leftEye = landmarks[33]
                const rightEye = landmarks[263]

                // Calculate Width (distance between cheekbones * factor)
                const faceWidth = Math.sqrt(
                    Math.pow((rightCheek.x - leftCheek.x) * w, 2) +
                    Math.pow((rightCheek.y - leftCheek.y) * h, 2)
                )

                // Hairstyle should be wider than the face
                const overlayWidth = faceWidth * 1.5
                const overlayHeight = (overlayWidth * hairImg.height) / hairImg.width

                // Calculate Rotation (angle between eyes)
                const dy = (rightEye.y - leftEye.y) * h
                const dx = (rightEye.x - leftEye.x) * w
                const angle = Math.atan2(dy, dx)

                // Calculate Center Position
                // Anchor to forehead but shifted up slightly
                const centerX = forehead.x * w
                const centerY = (forehead.y * h) - (overlayHeight * 0.1) // Adjust offset based on forehead

                // 3. Draw Overlay
                ctx.save()
                ctx.translate(centerX, centerY)
                ctx.rotate(angle)

                // Optional: Basic White-to-Alpha if background isn't transparent
                // In a production environment, use pre-processed transparent PNGs
                // For now, we use the image as-is or apply a simple blend
                ctx.globalCompositeOperation = 'multiply' // Blend dark hair on face
                // ctx.globalAlpha = 0.9 // Subtle transparency

                // Draw centered
                ctx.drawImage(
                    hairImg,
                    -overlayWidth / 2,
                    -overlayHeight * 0.4, // Shift up further to cover top of head
                    overlayWidth,
                    overlayHeight
                )

                ctx.restore()

                resolve(canvas.toDataURL('image/jpeg', 0.9))
            }

            hairImg.onerror = reject
            hairImg.crossOrigin = "anonymous"
            hairImg.src = hairstyleImageUrl
        }

        userImg.onerror = reject
        userImg.src = userImageBase64
    })
}

export default {
    applyHairstyleOverlay
}
