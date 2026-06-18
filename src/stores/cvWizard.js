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
    moveItem(fromType, fromIndex, toType) {
      if (fromType === toType) return;
      
      let item;
      if (fromType === 'proyecto') {
        item = this.pendingProyectos.splice(fromIndex, 1)[0];
      } else if (fromType === 'experiencia') {
        item = this.pendingExperiencias.splice(fromIndex, 1)[0];
      } else if (fromType === 'estudio') {
        item = this.pendingEstudios.splice(fromIndex, 1)[0];
      }
      
      if (!item) return;

      if (toType === 'proyecto') {
        this.pendingProyectos.push(item);
      } else if (toType === 'experiencia') {
        this.pendingExperiencias.push(item);
      } else if (toType === 'estudio') {
        this.pendingEstudios.push(item);
      }
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
