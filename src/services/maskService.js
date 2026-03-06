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
    const top = landmarks[10]
    const leftForehead = landmarks[103]
    const rightForehead = landmarks[332]
    const leftCheek = landmarks[234]
    const rightCheek = landmarks[454]

    ctx.fillStyle = 'white'
    ctx.beginPath()
    
    // Start from left cheek up to top and down to right cheek
    ctx.moveTo(leftCheek.x * width, (leftCheek.y - 0.1) * height)
    ctx.lineTo(leftForehead.x * width, (leftForehead.y - 0.2) * height)
    ctx.lineTo(top.x * width, (top.y - 0.35) * height) // Go way above the head
    ctx.lineTo(rightForehead.x * width, (rightForehead.y - 0.2) * height)
    ctx.lineTo(rightCheek.x * width, (rightCheek.y - 0.1) * height)
    ctx.closePath()
    ctx.fill()

    return canvas.toDataURL('image/png')
}

export default {
    createHairMask
}
