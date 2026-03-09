document.addEventListener('DOMContentLoaded', () => {
  
    const secret = "MTMwNzIwMjU="; 
    
    const loginBtn = document.getElementById('login-btn');
    const passInput = document.getElementById('password-input');
    const overlay = document.getElementById('login-overlay');
    const content = document.getElementById('protected-content');
    const errorMsg = document.getElementById('error-msg');

    // Lógica de acceso con camuflaje
    loginBtn.addEventListener('click', () => {
        if (btoa(passInput.value) === secret) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                content.classList.remove('hidden-protected');
                iniciarCorazonPagina();
            }, 600);
        } else {
            errorMsg.classList.remove('hidden');
            passInput.value = "";
            passInput.focus();
        }
    });

    // Soporte para tecla Enter
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginBtn.click();
    });

    function iniciarCorazonPagina() {
        // 1. Lógica del Contador
        const startDate = new Date('2025-07-13T00:00:00').getTime();
        
        function updateTimer() {
            const now = new Date().getTime();
            const diff = now - startDate;
            
            document.getElementById('days').innerText = Math.floor(diff / 86400000);
            document.getElementById('hours').innerText = Math.floor((diff % 86400000) / 3600000);
            document.getElementById('minutes').innerText = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;
        }
        
        setInterval(updateTimer, 1000);
        updateTimer();

        // 2. Lógica de Revelar Imagen y Pétalos
        const btnHug = document.getElementById('btn-hug');
        const hugAnim = document.getElementById('hug-animation');

        btnHug.addEventListener('click', () => {
            btnHug.classList.add('hidden');
            hugAnim.classList.add('revelado');
            for (let i = 0; i < 35; i++) {
                setTimeout(crearPetalo, i * 100);
            }
        });

        // 3. Observador para revelar la Promesa al hacer scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if(e.isIntersecting) e.target.classList.add('show');
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal-card').forEach(c => observer.observe(c));
    }

    function crearPetalo() {
        const p = document.createElement('div');
        p.className = 'petalo';
        p.innerText = '🌸';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 3 + 2) + 's';
        p.style.fontSize = (Math.random() * 10 + 15) + 'px';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 5000);
    }
});
