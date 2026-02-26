import { defineStore } from 'pinia'

export const useScanStore = defineStore('scan', {
    state: () => ({
        capturedImage: null,
        faceShape: null,
        gender: 'Caballero',
        analysisComplete: false
    }),
    actions: {
        setCapturedImage(image) {
            this.capturedImage = image
        },
        setScanResult(shape, gender) {
            this.faceShape = shape
            this.gender = gender
            this.analysisComplete = true
        },
        resetScan() {
            this.capturedImage = null
            this.faceShape = null
            this.analysisComplete = false
        }
    }
})
