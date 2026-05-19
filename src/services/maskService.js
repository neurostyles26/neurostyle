/**
 * NeuroStyle Mask Service
 * Generates an inpainting mask for the hair region using MediaPipe landmarks.
 */
export const createHairMask = (landmarks, width, height) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    // Clear with black (no-impact region)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)

    // We want to mask the upper head area where hair usually is
    // Key landmarks for hair/forehead area:
    // 10: TOP
    // 103, 332: Left/Right forehead
    // 234, 454: Left/Right cheekbones
    
    // Simple heuristic: Create a polygon covering the upper part of the face and above
    // 10: Top of forehead
    // 103, 332: Forehead corners
    // 234, 454: Near ears/cheekbones
    // 151: Forehead center
    // 10: Top center
    // 67, 297: Forehead hairline
    // 21, 251: Temples

    ctx.fillStyle = 'white'
    ctx.beginPath()
    
    // Start from left ear area
    ctx.moveTo(landmarks[234].x * width, landmarks[234].y * height)
    
    // Up to left temple
    ctx.lineTo(landmarks[21].x * width, landmarks[21].y * height)
    
    // Along hairline
    ctx.lineTo(landmarks[67].x * width, landmarks[67].y * height)
    ctx.lineTo(landmarks[10].x * width, (landmarks[10].y - 0.05) * height)
    ctx.lineTo(landmarks[297].x * width, landmarks[297].y * height)
    
    // To right temple
    ctx.lineTo(landmarks[251].x * width, landmarks[251].y * height)
    
    // Down to right ear area
    ctx.lineTo(landmarks[454].x * width, landmarks[454].y * height)
    
    // Create the "top" of the hair volume (above the head)
    ctx.lineTo(landmarks[454].x * width, (landmarks[454].y - 0.4) * height)
    ctx.lineTo(landmarks[10].x * width, (landmarks[10].y - 0.5) * height)
    ctx.lineTo(landmarks[234].x * width, (landmarks[234].y - 0.4) * height)
    
    ctx.closePath()
    ctx.fill()

    // Add some blur to the mask for smoother blending
    ctx.filter = 'blur(15px)'
    ctx.drawImage(canvas, 0, 0)

    return canvas.toDataURL('image/png')
}

export default {
    createHairMask
}
