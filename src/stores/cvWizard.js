import { defineStore } from 'pinia'

export const useCVWizardStore = defineStore('cvWizard', {
  state: () => ({
    extractedData: null,
    pendingProyectos: [],
    pendingExperiencias: [],
    pendingEstudios: [],
    datosContacto: null,
  }),
  actions: {
    setExtractedData(data) {
      this.extractedData = data
      this.pendingProyectos = data.proyectos || []
      this.pendingExperiencias = data.experiencias || []
      this.pendingEstudios = data.estudios || []
      this.datosContacto = data.datos_contacto || null
    },
    removeProyecto(index) {
      this.pendingProyectos.splice(index, 1)
    },
    removeExperiencia(index) {
      this.pendingExperiencias.splice(index, 1)
    },
    removeEstudio(index) {
      this.pendingEstudios.splice(index, 1)
    },
    clearContacto() {
      this.datosContacto = null
    },
    clearAll() {
      this.extractedData = null
      this.pendingProyectos = []
      this.pendingExperiencias = []
      this.pendingEstudios = []
      this.datosContacto = null
    }
  },
  getters: {
    hasPendingItems: (state) => {
      return state.pendingProyectos.length > 0 || 
             state.pendingExperiencias.length > 0 || 
             state.pendingEstudios.length > 0 || 
             state.datosContacto !== null
    },
    totalPending: (state) => {
      return state.pendingProyectos.length + 
             state.pendingExperiencias.length + 
             state.pendingEstudios.length + 
             (state.datosContacto ? 1 : 0)
    }
  }
})
