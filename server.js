const express = require('express');
const path = require('path');
const app = express();

// Configuración del puerto dinámico requerido por Render
const PORT = process.env.PORT || 3000;

// Servir de forma automática todos los archivos estáticos (style.css, script.js, imágenes)
// Esto asume que tus archivos están en la raíz del proyecto al igual que este servidor.
app.use(express.static(path.join(__dirname)));

// Ruta principal para servir el index.html de GlowGuide
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicialización del servicio
app.listen(PORT, () => {
    console.log(`Servidor de GlowGuide corriendo exitosamente en el puerto ${PORT}`);
});