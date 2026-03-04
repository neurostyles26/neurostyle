import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: LandingView
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: () => import('../views/AdminDashboardView.vue'),
        meta: { requiresAuth: true, isAdmin: true }
    },
    {
        path: '/scan',
        name: 'FaceAnalysis',
        component: () => import('../views/FaceAnalysisView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/book',
        name: 'BookAppointment',
        component: () => import('../views/BookAppointmentView.vue')
    },
    {
        path: '/admin/products',
        name: 'AdminProducts',
        component: () => import('../views/AdminProductsView.vue'),
        meta: { requiresAuth: true, isAdmin: true }
    },
    {
        path: '/admin/appointments',
        name: 'AdminAppointments',
        component: () => import('../views/AdminAppointmentsView.vue'),
        meta: { requiresAuth: true, isAdmin: true }
    },
    {
        path: '/admin/settings',
        name: 'AdminSettings',
        component: () => import('../views/AdminSettingsView.vue'),
        meta: { requiresAuth: true, isAdmin: true }
    },
    {
        path: '/styles',
        name: 'StyleSuggestions',
        component: () => import('../views/StyleSuggestionsView.vue')
    },
    {
        path: '/store',
        name: 'GroomingStore',
        component: () => import('../views/GroomingStoreView.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/AboutView.vue')
    },
    {
        path: '/support',
        name: 'Support',
        component: () => import('../views/SupportView.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
    // We will implement auth check once Supabase is fully wired
    next()
})

export default router
