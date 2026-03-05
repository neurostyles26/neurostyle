import { defineStore } from 'pinia'

export const useScanStore = defineStore('scan', {
    state: () => ({
        capturedImage: null,
        faceShape: null,
        gender: 'Caballero',
        analysisComplete: false,
        landmarks: null
    }),
    actions: {
        setCapturedImage(image) {
            this.capturedImage = image
        },
        setLandmarks(landmarks) {
            this.landmarks = landmarks
        },
        setScanResult(shape, gender) {
            this.faceShape = shape
            this.gender = gender
            this.analysisComplete = true
        },
        resetScan() {
            this.capturedImage = null
            this.faceShape = null
            this.landmarks = null
            this.analysisComplete = false
        }
    }
})
