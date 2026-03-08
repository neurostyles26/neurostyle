import { supabase } from './supabase'
import { useNotificationStore } from '../stores/notificationStore'
import { audioService } from './audioService'

class RealtimeNotificationService {
    constructor() {
        this.subscription = null
    }

    init() {
        const notificationStore = useNotificationStore()

        console.log('Initializing Realtime Notification Service...')

        // Request browser notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission()
        }

        const showExternalNotification = (title, body) => {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, {
                    body: body,
                    icon: '/pwa-192x192.png'
                })
            }
        }

        // 1. Listen for new appointments (Admin View)
        supabase
            .channel('admin-appointments')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'appointments' },
                (payload) => {
                    console.log('New Appointment Received:', payload)

                    const title = 'Nueva Cita Agendada'
                    const message = `${payload.new.client_name} ha reservado para las ${payload.new.time}.`

                    notificationStore.notify({
                        title: title,
                        message: message,
                        type: 'info',
                        duration: 8000
                    })

                    showExternalNotification(title, message)
                    audioService.playNotification()
                }
            )
            .subscribe()

        // 2. Listen for status changes (Client View)
        supabase
            .channel('client-updates')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'appointments' },
                (payload) => {
                    const { status, client_name } = payload.new
                    const oldStatus = payload.old.status

                    if (status !== oldStatus) {
                        console.log('Appointment Status Changed:', payload)

                        let type = 'info'
                        let message = `Tu cita ha sido actualizada a: ${status}`

                        if (status === 'Confirmed') type = 'success'
                        if (status === 'Cancelled') type = 'error'

                        const title = 'Actualización de Turno'
                        notificationStore.notify({
                            title: title,
                            message: message,
                            type: type,
                            duration: 10000
                        })

                        showExternalNotification(title, message)
                        audioService.playNotification()
                    }
                }
            )
            .subscribe()

        // 3. Listen for new products (All Users)
        supabase
            .channel('store-updates')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'products' },
                (payload) => {
                    console.log('New Product Released:', payload)

                    const title = '¡Nueva Tendencia!'
                    const message = `Hemos añadido un nuevo producto: ${payload.new.name}`

                    notificationStore.notify({
                        title: title,
                        message: message,
                        type: 'success',
                        duration: 8000
                    })

                    showExternalNotification(title, message)
                    audioService.playSuccess()
                }
            )
            .subscribe()
    }

    stop() {
        if (this.subscription) {
            supabase.removeChannel(this.subscription)
        }
    }
}

export const realtimeNotificationService = new RealtimeNotificationService()
export default realtimeNotificationService
