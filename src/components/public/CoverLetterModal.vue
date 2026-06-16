<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">&times;</button>
      
      <h2 class="modal-title">Ingresa URL Match Trabajo</h2>
      <p class="modal-desc">
        Pega la URL de la oferta laboral (LinkedIn, Trabajando, etc.) o copia y pega los requisitos. La IA redactará una carta indicando por qué este perfil tiene un Match perfecto para el cargo.
      </p>

      <form @submit.prevent="generateLetter" v-if="!generatedLetter">
        <div class="form-group">
          <input 
            v-model="form.job_description" 
            required 
            placeholder="Pega aquí el enlace de la oferta laboral (LinkedIn, Computrabajo, etc.)..." 
            class="input"
            style="font-size: 1.1rem; padding: 1rem;"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary w-full" :disabled="loading" style="font-size: 1.1rem; padding: 1rem;">
            <span v-if="loading" class="spinner"></span>
            <span v-else>✨ Cargar Oferta y Generar Match</span>
          </button>
        </div>
      </form>

      <div v-else class="result-container">
        <div class="letter-actions">
          <button class="btn btn-secondary" @click="downloadPDF">📄 Descargar PDF</button>
          <button class="btn btn-primary" @click="sendEmail" :disabled="sendingEmail">
            <span v-if="sendingEmail" class="spinner"></span>
            <span v-else>✉️ Enviar por Email</span>
          </button>
          <button class="btn btn-outline" @click="generatedLetter = null">Volver</button>
        </div>
        
        <div class="letter-preview" ref="letterContent">
          <div v-html="formattedLetter"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { api } from '../../services/api'
import { marked } from 'marked'
import html2pdf from 'html2pdf.js'

const props = defineProps({
  username: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const form = reactive({
  job_title: 'Oferta desde URL',
  company_name: '',
  job_description: '',
  recruiter_email: '',
  generated_by: 'visitor'
})

const loading = ref(false)
const sendingEmail = ref(false)
const generatedLetter = ref(null)
const generatedLetterId = ref(null)
const letterContent = ref(null)

const formattedLetter = computed(() => {
  if (!generatedLetter.value) return ''
  return marked(generatedLetter.value)
})

const generateLetter = async () => {
  try {
    loading.value = true
    const response = await api.generateCoverLetter(props.username, form)
    generatedLetter.value = response.generated_letter
    generatedLetterId.value = response.id
  } catch (error) {
    if (error.response && error.response.status === 402) {
      alert("El talento ha agotado sus créditos de IA gratuitos.")
    } else {
      console.error(error)
      if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail)
      } else {
        alert("Hubo un error al generar la carta. Inténtalo de nuevo.")
      }
    }
  } finally {
    loading.value = false
  }
}

const downloadPDF = () => {
  const element = letterContent.value
  const opt = {
    margin:       1,
    filename:     `Cover_Letter_${form.job_title}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  }
  
  html2pdf().set(opt).from(element).save()
}

const sendEmail = async () => {
  if (!form.recruiter_email) {
    const email = prompt("Por favor ingresa tu correo electrónico para enviarte la carta:")
    if (!email) return
    form.recruiter_email = email
  }

  try {
    sendingEmail.value = true
    
    // Generate base64 PDF
    const element = letterContent.value
    const opt = {
      margin:       1,
      filename:     `Cover_Letter_${form.job_title}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    
    const pdfBase64DataUri = await html2pdf().set(opt).from(element).outputPdf('datauristring')
    const pdfBase64 = pdfBase64DataUri.split(',')[1]

    await api.sendCoverLetterEmail(generatedLetterId.value, {
      email: form.recruiter_email,
      pdf_base64: pdfBase64
    })
    alert("¡La carta (con PDF adjunto) ha sido enviada a tu correo exitosamente!")
  } catch (error) {
    console.error(error)
    alert("Hubo un error al enviar el correo. Por favor intenta descargarla como PDF.")
  } finally {
    sendingEmail.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 2rem;
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-gray-900);
}

.modal-desc {
  font-size: 0.9rem;
  color: var(--color-gray-500);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-gray-700);
}

.input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-gray-900);
  font-size: 0.95rem;
}

.textarea {
  resize: vertical;
}

.w-full {
  width: 100%;
}

.result-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.letter-actions {
  display: flex;
  gap: 1rem;
}

.letter-preview {
  background: #ffffff;
  color: #000000;
  padding: 2rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  font-family: 'Times New Roman', Times, serif;
  line-height: 1.6;
  font-size: 1rem;
  min-height: 400px;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
