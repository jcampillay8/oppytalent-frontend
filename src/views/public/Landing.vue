<template>
  <div class="landing-container">
    <div class="background-effects">
      <div class="glow-sphere sphere-1"></div>
      <div class="glow-sphere sphere-2"></div>
    </div>
    
    <header class="landing-header">
      <div class="logo">Oppy<span>Talent</span></div>
      <div class="header-actions">
        <router-link to="/login" class="btn-ghost">Iniciar Sesión</router-link>
        <router-link to="/register" class="btn-glow">Registrarse</router-link>
      </div>
    </header>

    <main class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Impulsa tu <span class="text-gradient">Potencial</span><br />
          al Siguiente Nivel
        </h1>
        <p class="hero-subtitle">
          La plataforma definitiva para conectar talento extraordinario con oportunidades de clase mundial.
          Únete a la red donde las habilidades se encuentran con la innovación.
        </p>
        <div class="hero-cta">
          <router-link to="/register" class="btn-glow large">Comenzar Ahora</router-link>
          <router-link to="/portafolio" class="btn-glass large">Explorar Portafolio</router-link>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="glass-card mockup-card">
          <div class="mockup-header">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
          </div>
          <div class="mockup-body">
            <div class="placeholder-chart"></div>
            <div class="placeholder-lines">
              <div class="line w-full"></div>
              <div class="line w-3/4"></div>
              <div class="line w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.landing-container {
  min-height: 100vh;
  background-color: #09090b; /* Zinc 950 */
  color: #fafafa;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.background-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.glow-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.sphere-1 {
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(30,58,138,0) 70%);
}

.sphere-2 {
  bottom: -20%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(76,29,149,0) 70%);
}

.landing-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 4rem;
  background: rgba(9, 9, 11, 0.4);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.logo span {
  color: #3b82f6; /* Blue 500 */
}

.header-actions {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.btn-ghost {
  color: #a1a1aa; /* Zinc 400 */
  font-weight: 500;
  transition: color 0.2s ease;
}

.btn-ghost:hover {
  color: #fafafa;
}

.btn-glow {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  padding: 0.6rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
  text-decoration: none;
}

.btn-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
  text-decoration: none;
}

.hero-section {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 4rem;
  gap: 4rem;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
}

.text-gradient {
  background: linear-gradient(to right, #60a5fa, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #a1a1aa;
  line-height: 1.6;
  margin-bottom: 3rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
}

.btn-glow.large {
  padding: 0.8rem 2rem;
  font-size: 1.125rem;
}

.btn-glass {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  text-decoration: none;
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.mockup-card {
  width: 100%;
  max-width: 500px;
  height: 350px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transform: perspective(1000px) rotateY(-15deg) rotateX(5deg);
  transition: transform 0.5s ease;
}

.mockup-card:hover {
  transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
}

.mockup-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #10b981; }

.mockup-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.placeholder-chart {
  height: 120px;
  background: linear-gradient(180deg, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0) 100%);
  border-bottom: 2px solid #3b82f6;
  border-radius: 8px 8px 0 0;
  position: relative;
}

.placeholder-lines {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.line {
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.w-full { width: 100%; }
.w-3\/4 { width: 75%; }
.w-1\/2 { width: 50%; }

@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    padding: 2rem;
    text-align: center;
  }
  .hero-cta {
    justify-content: center;
  }
  .mockup-card {
    transform: none;
  }
  .mockup-card:hover {
    transform: none;
  }
}
</style>
