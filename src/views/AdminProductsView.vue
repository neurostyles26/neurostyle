<template>
  <div class="min-h-screen bg-[#020202] flex flex-col p-6 font-inter relative overflow-hidden">
    <!-- Background Aura -->
    <div class="absolute top-0 left-0 w-full h-[30vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Header -->
    <header class="flex items-center justify-between z-10 mb-10">
      <div class="flex items-center">
        <button @click="router.push('/admin')" class="w-12 h-12 flex items-center justify-center glass-panel rounded-2xl hover:bg-white/10 transition-colors mr-6">
          <LucideChevronLeft class="text-primary" />
        </button>
        <div>
            <h2 class="text-white font-outfit font-bold text-xl tracking-tight">Inventario Maestro</h2>
            <p class="text-primary text-[8px] font-black uppercase tracking-[0.3em]">Matriz de Productos Neurales</p>
        </div>
      </div>
      <button 
        @click="showAddModal = true"
        class="bg-primary text-black font-black px-8 py-4 rounded-2xl flex items-center hover:scale-105 transition-all shadow-xl shadow-primary/20 group relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <LucidePlus class="mr-2" :size="20" />
        <span class="font-outfit uppercase tracking-wider text-sm">Añadir Activo</span>
      </button>
    </header>

    <main class="flex-1 z-10 overflow-y-auto pr-1">
      <div v-if="loading" class="flex flex-col items-center justify-center h-64">
        <div class="relative w-16 h-16 mb-6">
            <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="text-gray-500 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Sincronizando Productos...</p>
      </div>

      <div v-else-if="products.length === 0" class="text-center py-32">
        <div class="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/5">
            <LucidePackage class="text-gray-800" :size="40" />
        </div>
        <h3 class="text-white font-outfit font-bold text-2xl mb-2 tracking-tight">Sin productos registrados</h3>
        <p class="text-gray-500 text-sm max-w-xs mx-auto">Tu catálogo está listo para recibir los mejores productos de grooming.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        <div 
            v-for="product in products" 
            :key="product.id"
            class="group glass-panel rounded-[48px] border-white/5 overflow-hidden transition-all duration-700 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 relative"
        >
          <div class="aspect-square bg-white/5 relative overflow-hidden">
            <img 
              v-if="product.image_url" 
              :src="product.image_url" 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            >
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                <LucideImage class="text-white/10" :size="64" />
            </div>

            <div class="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button @click="deleteProduct(product)" class="w-12 h-12 bg-red-500/10 backdrop-blur-md text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg border border-red-500/20">
                    <LucideTrash2 :size="20" />
                </button>
            </div>

            <div class="absolute bottom-6 left-6">
                <span class="bg-black/80 backdrop-blur-md text-primary text-[9px] font-black uppercase px-4 py-1.5 rounded-full border border-primary/20 tracking-wider shadow-lg">
                    {{ product.category || 'Varios' }}
                </span>
            </div>
            
            <!-- Price floating tag -->
            <div class="absolute bottom-6 right-6 bg-primary text-black font-outfit font-black px-4 py-1.5 rounded-full shadow-xl shadow-primary/20">
                {{ formatPrice(product.price) }}
            </div>
          </div>

          <div class="p-10">
            <h4 class="text-white font-outfit font-bold text-2xl mb-2 tracking-tight group-hover:text-primary transition-colors duration-500">{{ product.name }}</h4>
            <div class="flex items-center justify-between mt-4">
                <div class="flex items-center space-x-2">
                    <div class="flex space-x-0.5">
                        <div v-for="i in 5" :key="i" class="w-1 h-1 rounded-full" :class="i <= (product.stock > 10 ? 5 : 2) ? 'bg-primary' : 'bg-white/10'"></div>
                    </div>
                </div>
                <p class="text-gray-500 text-[10px] font-black uppercase tracking-wider group-hover:text-gray-400 transition-colors">{{ product.stock }} UNIDADES</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Professional Add Modal -->
    <transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-to-class="opacity-0"
    >
        <div v-if="showAddModal" class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-end md:items-center justify-center p-6">
            <div class="w-full max-w-xl glass-panel border-white/10 rounded-[56px] p-10 md:p-16 overflow-y-auto max-h-[90vh] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative animate-fade-in-up">
                <div class="flex items-center justify-between mb-12">
                    <div>
                        <h3 class="text-white text-4xl font-outfit font-black tracking-tighter mb-1 uppercase">Alta de Producto</h3>
                        <p class="text-primary text-[8px] font-black uppercase tracking-[0.2em]">Inventory Integration</p>
                    </div>
                    <button @click="showAddModal = false" class="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-primary transition-all border border-transparent hover:border-primary/20 rounded-2xl bg-white/5">
                        <LucideX :size="24" />
                    </button>
                </div>

                <form @submit.prevent="saveProduct">
                    <div class="space-y-3">
                        <label class="block text-primary text-[9px] font-black uppercase tracking-[0.2em] ml-2">Foto del Producto (Alta Res)</label>
                        <div 
                            class="relative h-48 bg-white/[0.03] border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center transition-all hover:bg-white/5 hover:border-primary/30 overflow-hidden group/upload"
                            @click="$refs.fileInput.click()"
                        >
                            <img v-if="imagePreview" :src="imagePreview" class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover/upload:opacity-70 transition-opacity" />
                            <div class="relative z-10 flex flex-col items-center">
                                <LucideUpload class="text-primary mb-4" :size="32" />
                                <span class="text-white font-outfit font-bold text-sm">{{ imageFile ? imageFile.name : 'Subir Imagen' }}</span>
                                <span class="text-gray-500 text-[8px] uppercase tracking-wider mt-1">PNG, JPG hasta 5MB</span>
                            </div>
                            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange">
                        </div>
                    </div>

                    <div class="space-y-3">
                        <label class="block text-primary text-[9px] font-black uppercase tracking-[0.1em] ml-2">Nombre Comercial</label>
                        <input v-model="form.name" type="text" class="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-6 px-8 text-white focus:outline-none focus:border-primary/50 transition-all font-outfit text-xl font-bold placeholder:text-gray-800" placeholder="Ej: Pomada Gorilla Gold" required>
                    </div>

                    <div class="grid grid-cols-2 gap-8">
                        <div class="space-y-3">
                            <label class="block text-primary text-[9px] font-black uppercase tracking-[0.2em] ml-2">Precio Elite (COP)</label>
                            <input v-model="form.price" type="number" class="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-6 px-8 text-white focus:outline-none focus:border-primary/50 transition-all font-outfit text-xl font-bold placeholder:text-gray-800" placeholder="0.00" required>
                        </div>
                        <div class="space-y-3">
                            <label class="block text-primary text-[9px] font-black uppercase tracking-[0.2em] ml-2">Stock Inicial</label>
                            <input v-model="form.stock" type="number" class="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-6 px-8 text-white focus:outline-none focus:border-primary/50 transition-all font-outfit text-xl font-bold placeholder:text-gray-800" placeholder="10" required>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <label class="block text-primary text-[9px] font-black uppercase tracking-[0.1em] ml-2">Categoría Logística</label>
                        <input v-model="form.category" type="text" class="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-6 px-8 text-white focus:outline-none focus:border-primary/50 transition-all font-outfit text-xl font-bold placeholder:text-gray-800" placeholder="Grooming / Cuidado / Accesorios">
                    </div>

                    <button 
                        type="submit" 
                        :disabled="submitting"
                        class="w-full bg-primary text-black font-black py-7 rounded-3xl flex items-center justify-center text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/30 mt-10 group/btn relative overflow-hidden"
                    >
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        <template v-if="submitting">
                            <div class="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
                        </template>
                        <template v-else>
                            <span class="font-outfit uppercase tracking-wider">REGISTRAR EN MATRIZ</span>
                        </template>
                    </button>
                </form>
            </div>
        </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
    LucideChevronLeft, LucidePlus, LucideTrash2, 
    LucidePackage, LucideImage, LucideX, LucideUpload
} from 'lucide-vue-next'
import { supabase } from '../services/supabase'
import { useNotificationStore } from '../stores/notificationStore'

const router = useRouter()
const notificationStore = useNotificationStore()

const products = ref([])
const loading = ref(true)
const showAddModal = ref(false)
const submitting = ref(false)

// Image Upload State
const fileInput = ref(null)
const imageFile = ref(null)
const imagePreview = ref(null)

const form = ref({
    name: '',
    price: '',
    stock: '',
    category: ''
})

const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        imageFile.value = file
        imagePreview.value = URL.createObjectURL(file)
    }
}

const fetchProducts = async () => {
    loading.value = true
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) throw error
        products.value = data || []
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

const saveProduct = async () => {
    submitting.value = true
    try {
        let imageUrl = null
        
        // Handle Image Upload if file exists
        if (imageFile.value) {
            const fileExt = imageFile.value.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `product-images/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, imageFile.value)

            if (uploadError) throw new Error("Error al subir imagen: " + uploadError.message)

            const { data: urlData } = supabase.storage
                .from('products')
                .getPublicUrl(filePath)

            imageUrl = urlData.publicUrl
        }

        const { data, error } = await supabase
            .from('products')
            .insert([{
                name: form.value.name,
                price: parseFloat(form.value.price),
                stock: parseInt(form.value.stock),
                category: form.value.category || 'Varios',
                image_url: imageUrl
            }])
            .select()
        
        if (error) throw error
        
        products.value.unshift(data[0])
        showAddModal.value = false
        
        // Reset Form
        form.value = { name: '', price: '', stock: '', category: '' }
        imageFile.value = null
        imagePreview.value = null

        notificationStore.notify({
            title: 'MATRIZ ACTUALIZADA',
            message: `${form.value.name} ha sido registrado con éxito.`,
            type: 'success'
        })
    } catch (err) {
        alert("Error al guardar: " + err.message)
    } finally {
        submitting.value = false
    }
}

const deleteProduct = async (prod) => {
    if (!confirm(`¿Estás seguro de eliminar ${prod.name}?`)) return
    
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', prod.id)
        
        if (error) throw error
        products.value = products.value.filter(p => p.id !== prod.id)
        
        notificationStore.notify({
            title: 'ACTIVO ELIMINADO',
            message: 'El producto ha sido removido de la base de datos.',
            type: 'warning'
        })
    } catch (err) {
        alert("Error al eliminar: " + err.message)
    }
}

const formatPrice = (p) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(p)
}

onMounted(fetchProducts)
</script>

<style scoped>
@keyframes fade-in-up {
    0% { transform: translateY(50px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
}

.animate-fade-in-up {
    animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>

