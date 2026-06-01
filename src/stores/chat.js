import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([
    { 
      role: 'bot', 
      content: '¡Hola! Soy el asistente virtual de Jaime. Estoy aquí para responder tus dudas sobre su perfil profesional. ¿De qué te gustaría hablar hoy? Puedes seleccionar una de las sugerencias o escribir tu propia pregunta.\n\n**¿Qué puedes preguntar por ejemplo?**\n- Mis Habilidades técnicas y stack.\n- Qué Experiencia laboral tengo.\n- Qué Proyectos clave y KPIs he logrado.\n- Mis datos de contacto.\n\n*...Lo que desees preguntar.*' 
    },
  ])

  function addMessage(message) {
    messages.value.push(message)
  }

  return { messages, addMessage }
})
