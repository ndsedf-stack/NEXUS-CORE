// NEON FIT - PREMIUM EFFECTS
// Ajoute des effets visuels sans casser la logique existante

document.addEventListener('DOMContentLoaded', function() {
  
  // 1. HERO HEADER IMMERSIF (si h1 existe)
  const mainTitle = document.querySelector('h1');
  if (mainTitle && !document.querySelector('.hero-header')) {
    const heroDiv = document.createElement('div');
    heroDiv.className = 'hero-header';
    heroDiv.innerHTML = `
      <div class="hero-background">
        <div class="hero-gradient"></div>
      </div>
      <div class="hero-content">
        ${mainTitle.outerHTML}
      </div>
    `;
    
    // Ajouter style inline
    heroDiv.style.cssText = `
      position: relative;
      height: 40vh;
      overflow: hidden;
      margin: -2rem -2rem 2rem -2rem;
    `;
    
    mainTitle.parentNode.replaceChild(heroDiv, mainTitle);
  }
  
  // 2. ANIMATION DES CARDS AU SCROLL
  const cards = document.querySelectorAll('.card, .exercise-card, [class*="card"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, { threshold: 0.1 });
  
  cards.forEach(card => observer.observe(card));
  
  // 3. PARTICLE EFFECT SUR BOUTONS PRINCIPAUX
  const primaryBtns = document.querySelectorAll('.btn-primary, button[class*="deploy"]');
  primaryBtns.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      createParticles(this);
    });
  });
  
  function createParticles(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #22d3ee;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        left: ${rect.left + Math.random() * rect.width}px;
        top: ${rect.top + Math.random() * rect.height}px;
        animation: particle-float 1s ease-out forwards;
      `;
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1000);
    }
  }
  
  // Ajouter keyframes pour particles
  if (!document.querySelector('#particle-keyframes')) {
    const style = document.createElement('style');
    style.id = 'particle-keyframes';
    style.textContent = `
      @keyframes particle-float {
        to {
          transform: translateY(-50px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  console.log('✅ Premium effects loaded');
});
