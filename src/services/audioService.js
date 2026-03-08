/**
 * Professional Audio Service for NeuroStyle
 * Handles UI sound effects and notifications.
 */

// Use professional sounds from a CDN as defaults
const SOUNDS = {
    WELCOME: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Soft ambient reveal
    NOTIFICATION: 'https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3', // Tech chime
    SUCCESS: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Positive feedback
    ALERT: 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3' // Urgent alert
}

class AudioService {
    constructor() {
        this.enabled = true
        this.context = null
        this.buffers = {}
    }

    /**
     * Initialize Audio Context on first user interaction
     */
    async init() {
        if (this.context) return

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)()
            console.log('Audio Context Initialized')
        } catch (e) {
            console.warn('Web Audio API not supported', e)
            this.enabled = false
        }
    }

    async play(soundName) {
        if (!this.enabled) return

        try {
            if (!this.context) await this.init()

            const audio = new Audio(SOUNDS[soundName] || SOUNDS.NOTIFICATION)
            audio.volume = 0.5
            await audio.play()
        } catch (e) {
            console.warn(`Failed to play sound: ${soundName}`, e)
        }
    }

    async playWelcome() {
        await this.play('WELCOME')
    }

    async playNotification() {
        await this.play('NOTIFICATION')
    }

    async playSuccess() {
        await this.play('SUCCESS')
    }

    async playAlert() {
        await this.play('ALERT')
    }
}

export const audioService = new AudioService()
export default audioService
