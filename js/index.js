const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbxK54TleimC6pNwW5qugAnym4qWNhOHitSU0TPda_9pG7PN7F1d5h_QNbb3X3HteV57/exec"; 
let intervaloChat; 

document.addEventListener('DOMContentLoaded', () => {
    const secret = "MTMwNzIwMjU="; 
    const loginBtn = document.getElementById('login-btn');
    const passInput = document.getElementById('password-input');
    const overlay = document.getElementById('login-overlay');
    const content = document.getElementById('protected-content');
    const errorMsg = document.getElementById('error-msg');

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

    passInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') loginBtn.click(); });

    function iniciarCorazonPagina() {
        // --- LÓGICA DEL CONTADOR ---
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

        // --- LÓGICA DE INTERACCIÓN FOTO ---
        const btnHug = document.getElementById('btn-hug');
        const hugAnim = document.getElementById('hug-animation');
        btnHug.addEventListener('click', () => {
            btnHug.classList.add('hidden');
            hugAnim.classList.add('revelado');
            for (let i = 0; i < 35; i++) { setTimeout(crearPetalo, i * 100); }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('show'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal-card').forEach(c => observer.observe(c));

        // --- LÓGICA DE FRASES (SIN REPETICIÓN) ---
        const frasesOriginales = [
            "Eres una persona maravillosa, nunca lo olvides",
            "Me encantó conocerte",
            "Tu presencia es el regalo mas grande que cualquiera podría recibir",
            "Mereces todo lo bueno",
            "Sigue brillando",
            "Eres mi lugar favorito",
            "No hay distancia que pueda con lo que siento por ti",
            "Eres mucho más valiente y fuerte de lo que crees",
            "Simplemente gracias por estar conmigo 🩷"
        ];

        let frasesDisponibles = [...frasesOriginales];

        const quoteElement = document.getElementById('random-quote');
        const quoteBtn = document.getElementById('new-quote-btn');

        quoteBtn.addEventListener('click', () => {
            if (frasesDisponibles.length === 0) {
                frasesDisponibles = [...frasesOriginales];
            }

            const randomIndex = Math.floor(Math.random() * frasesDisponibles.length);
            const nuevaFrase = frasesDisponibles[randomIndex];
            frasesDisponibles.splice(randomIndex, 1);

            quoteElement.style.opacity = '0';
            setTimeout(() => { 
                quoteElement.innerText = nuevaFrase; 
                quoteElement.style.opacity = '1'; 
            }, 300);
        });

        // --- LÓGICA DE CHAT AUTOMÁTICO (ADAPTADO SAMSUNG/CHROME) ---
        const showChatBtn = document.getElementById('show-chat-btn');
        const chatContainer = document.getElementById('chat-container');
        const chatForm = document.getElementById('chat-form');
        const chatHistory = document.getElementById('chat-history');

        async function cargarMensajes() {
            try {
                const res = await fetch(URL_APPS_SCRIPT);
                const datos = await res.json();
                chatHistory.innerHTML = ""; 
                for(let i = 1; i < datos.length; i++) {
                    const bubble = document.createElement('div');
                    bubble.className = (datos[i][0] === "Admin") ? "chat-bubble admin-reply" : "chat-bubble user-bubble";
                    bubble.innerHTML = `<p>${datos[i][1]}</p>`;
                    chatHistory.appendChild(bubble);
                }
                chatHistory.scrollTop = chatHistory.scrollHeight;
            } catch (e) { console.log("Buscando mensajes..."); }
        }

        showChatBtn.addEventListener('click', () => {
            if (chatContainer.classList.contains('hidden')) {
                // ACCIÓN AL ABRIR
                chatContainer.classList.remove('hidden');
                showChatBtn.innerText = "Cerrar chat";
                cargarMensajes();
                // Limpiar cualquier intervalo fantasma antes de iniciar
                if(intervaloChat) clearInterval(intervaloChat);
                intervaloChat = setInterval(cargarMensajes, 3000);
            } else {
                // ACCIÓN AL CERRAR (LIMPIEZA)
                chatContainer.classList.add('hidden');
                showChatBtn.innerText = "Escríbeme si me necesitas";
                clearInterval(intervaloChat);
                // Limpieza profunda compatible con todos los navegadores
                chatHistory.innerHTML = ""; 
            }
        });

        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const msgInput = document.getElementById('user-msg');
            const msg = msgInput.value.trim();
            if(!msg) return;
            try {
                await fetch(URL_APPS_SCRIPT, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify({ remitente: "Valentina", mensaje: msg })
                });
                msgInput.value = "";
                cargarMensajes();
            } catch (e) { alert("Error al enviar mensaje"); }
        });
    }

    function crearPetalo() {
        const p = document.createElement('div');
        p.className = 'petalo'; p.innerText = '🌸';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 5000);
    }
});
