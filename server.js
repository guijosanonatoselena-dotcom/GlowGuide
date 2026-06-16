// 1. Cargar las variables de entorno seguras del archivo .env al inicio
require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Configuración de cabeceras HTTP de escape absoluto contra bloqueos CORS y CSP en el navegador
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    // Desactiva las restricciones del navegador para permitir expresamente la inyección de imágenes remotas
    res.setHeader(
        "Content-Security-Policy", 
        "default-src * 'unsafe-inline' 'unsafe-eval'; img-src * data: blob:; connect-src *;"
    );
    next();
});

// Servir de forma estática los archivos locales base (script.js, style.css)
app.use(express.static(path.join(__dirname)));

// ==========================================
// 2. INTEGRACIÓN DEL BOT DE TELEGRAM
// ==========================================
console.log('🤖 Iniciando conexión con Telegram...');
require('./bot.js'); 

// Enrutador comodín para el funcionamiento de la SPA (Single Page Application)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicialización del servicio en Render / Local
app.listen(PORT, () => {
    console.log(`Servidor de GlowGuide corriendo exitosamente en el puerto ${PORT}`);
});