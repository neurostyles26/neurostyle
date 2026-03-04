import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref([])

    /**
     * Add a new notification
     * @param {Object} notification { title, message, type: 'info'|'success'|'warning'|'error', duration: 5000 }
     */
    const notify = ({ title, message, type = 'info', duration = 5000 }) => {
        const id = Date.now() + Math.random()
        const newNotification = { id, title, message, type, duration }

        notifications.value.push(newNotification)

        if (duration > 0) {
            setTimeout(() => {
                remove(id)
            }, duration)
        }

        return id
    }

    const remove = (id) => {
        notifications.value = notifications.value.filter(n => n.id !== id)
    }

    return {
        notifications,
        notify,
        remove
    }
})
