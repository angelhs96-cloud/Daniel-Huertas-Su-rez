// javascript/script.js

// ─────────────────────────────────
//  CONFIGURACIÓN  ← fácil de editar
// ─────────────────────────────────
let velocidad    = 3;      // qué tan rápido cae la bola
let paletaAncho  = 100;    // ancho de la paleta
let colorBola    = '#ef4444';  // color de la bola
let colorPaleta  = '#3b82f6';  // color de la paleta

// ─────────────────────────────────
//  VARIABLES DEL JUEGO
// ─────────────────────────────────
let puntaje = 0;
let vidas   = 3;
let jugando = false;

// Posición de la bola
let bolaX = 200;
let bolaY = 30;
let bolaRadio = 15;

// Posición de la paleta
let paletaX = 150;
let paletaY = 460;
let paletaAlto = 12;

// ─────────────────────────────────
//  REFERENCIAS AL DOM
// ─────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');

// ─────────────────────────────────
//  MOVER PALETA CON EL MOUSE
// ─────────────────────────────────
canvas.addEventListener('mousemove', function(e) {
    let rect = canvas.getBoundingClientRect();
    paletaX  = e.clientX - rect.left - paletaAncho / 2;

    // Que no salga del canvas
    if (paletaX < 0) paletaX = 0;
    if (paletaX > 400 - paletaAncho) paletaX = 400 - paletaAncho;
});

// ─────────────────────────────────
//  BOTÓN JUGAR
// ─────────────────────────────────
document.getElementById('btnJugar').addEventListener('click', function() {
    puntaje  = 0;
    vidas    = 3;
    bolaX    = Math.random() * 360 + 20;
    bolaY    = 30;
    velocidad = 3;
    jugando  = true;
    document.getElementById('pantalla').style.display = 'none';
    document.getElementById('puntaje').textContent = 0;
    document.getElementById('vidas').textContent   = '❤️❤️❤️';
    bucle();
});

// ─────────────────────────────────
//  BUCLE PRINCIPAL
// ─────────────────────────────────
function bucle() {
    if (!jugando) return;

    // 1. Limpiar el canvas
    ctx.clearRect(0, 0, 400, 500);

    // 2. Dibujar fondo
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 400, 500);

    // 3. Dibujar paleta
    ctx.fillStyle = colorPaleta;
    ctx.fillRect(paletaX, paletaY, paletaAncho, paletaAlto);

    // 4. Dibujar bola
    ctx.fillStyle = colorBola;
    ctx.beginPath();
    ctx.arc(bolaX, bolaY, bolaRadio, 0, Math.PI * 2);
    ctx.fill();

    // 5. Mover la bola hacia abajo
    bolaY = bolaY + velocidad;

    // 6. Revisar si atrapó la bola
    if (
        bolaY + bolaRadio >= paletaY &&
        bolaX >= paletaX &&
        bolaX <= paletaX + paletaAncho
    ) {
        puntaje++;
        velocidad = velocidad + 0.3;   // cada punto va más rápido
        bolaX = Math.random() * 360 + 20;
        bolaY = 30;
        document.getElementById('puntaje').textContent = puntaje;
    }

    // 7. Revisar si la bola llegó al suelo sin ser atrapada
    if (bolaY - bolaRadio > 500) {
        vidas--;
        bolaX = Math.random() * 360 + 20;
        bolaY = 30;

        // Actualizar corazones
        let corazones = '';
        for (let i = 0; i < vidas; i++) corazones += '❤️';
        document.getElementById('vidas').textContent = corazones;

        // Sin vidas → Game Over
        if (vidas <= 0) {
            jugando = false;
            document.getElementById('overlay-titulo').textContent = 'GAME OVER';
            document.getElementById('overlay-texto').textContent  = 'Puntaje: ' + puntaje;
            document.getElementById('btnJugar').textContent       = 'REINTENTAR';
            document.getElementById('pantalla').style.display     = 'flex';
            return;
        }
    }

    // 8. Pedir el siguiente fotograma
    requestAnimationFrame(bucle);
}