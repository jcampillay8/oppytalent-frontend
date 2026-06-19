<template>
  <div class="relative w-full h-full bg-[#050505] overflow-hidden">
    <!-- Capa Aurora animada -->
    <div class="absolute inset-[-50%] opacity-60 mix-blend-screen pointer-events-none aurora-animate filter blur-[80px]">
      <div class="absolute top-0 right-0 w-[50%] h-[50%] bg-[#3b82f6] rounded-full mix-blend-screen filter blur-[100px] opacity-25 animate-blob"></div>
      <div class="absolute top-[20%] left-0 w-[40%] h-[50%] bg-[#10b981] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-0 left-[20%] w-[50%] h-[50%] bg-[#0891b2] rounded-full mix-blend-screen filter blur-[100px] opacity-25 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Ruido / Textura sutil para darle un toque más analógico y premium -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] mix-blend-overlay"></div>

    <!-- Contenido -->
    <div class="relative z-10 w-full h-full">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
// Componente de fondo estilo "Aurora" basado en Tailwind y CSS animado.
</script>

<style scoped>
.aurora-animate {
  animation: rotate 30s linear infinite;
  transform-origin: center center;
}

@keyframes rotate {
  from {
    transform: rotate(0deg) scale(1.2);
  }
  to {
    transform: rotate(360deg) scale(1.2);
  }
}

.animate-blob {
  animation: blob 10s infinite alternate;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
</style>
