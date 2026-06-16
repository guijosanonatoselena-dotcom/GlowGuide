const TelegramBot = require('node-telegram-bot-api');

// Leer variable de entorno del archivo .env
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TOKEN) {
    console.error('❌ Error Crítico: Falta configurar TELEGRAM_BOT_TOKEN en el archivo .env');
    process.exit(1);
}

// Inicializar el bot en modo Polling (Escucha directa)
const bot = new TelegramBot(TOKEN, { polling: true });
console.log('🚀 Extensión GlowGuide Bot conectada con éxito a Telegram.');

// ==========================================
// BANCO DE DATOS LOCAL
// ==========================================
const TEXTOS = {
    glosario: {
        niacinamida: "🧪 *Niacinamida (Vitamina B3)*\n\n*Tipo:* Seborregulador / Antiinflamatorio.\n*Función:* Controla la producción de grasa, calma rojeces y mejora la función barrera de la piel.",
        hialuronico: "💧 *Ácido Hialurónico*\n\n*Tipo:* Humectante Estructural.\n*Función:* Retiene hasta 1000 veces su peso en agua. Aporta hidratación profunda sin dejar sensación pesada.",
        retinol: "🔄 *Retinol*\n\n*Tipo:* Renovador Celular.\n*Función:* Estimula la producción de colágeno y acelera la renovación de la piel para desvanecer marcas.",
        vitamina_c: "🍊 *Vitamina C*\n\n*Tipo:* Antioxidante Iluminador.\n*Función:* Neutraliza los radicales libres del sol y unifica el tono de la piel opaca.",
        salicilico: "💥 *Ácido Salicílico (BHA)*\n\n*Tipo:* Exfoliante Liposoluble.\n*Función:* Penetra profundamente dentro de los poros para disolver la grasa acumulada y evitar puntos negros."
    }
};

// ==========================================
// COMPONENTES DE INTERFAZ: INLINE KEYBOARDS
// ==========================================
const MENU_PRINCIPAL = {
    inline_keyboard: [
        [{ text: "🧪 Diagnóstico Facial", callback_data: "ir_test" }, { text: "📖 Glosario de Ingredientes", callback_data: "ir_glosario" }],
        [{ text: "🛍️ Productos GlowGuide", callback_data: "ir_productos" }, { text: "✨ Mitos y Realidades", callback_data: "ir_mitos" }],
        [{ text: "💡 Consejos Rápidos", callback_data: "ir_consejos" }, { text: "📞 Contacto", callback_data: "ir_contacto" }],
        [{ text: "❓ Ayuda", callback_data: "ir_ayuda" }]
    ]
};

const TECLADO_TEST = {
    inline_keyboard: [
        [{ text: "Siento brillos en todo el rostro", callback_data: "ans_grasa" }],
        [{ text: "Brillos solo en frente y nariz (Zona T)", callback_data: "ans_mixta" }],
        [{ text: "Siento tirantez, opacidad o descamación", callback_data: "ans_seca" }],
        [{ text: "Tengo rojeces, ardor o se irrita fácil", callback_data: "ans_sensible" }],
        [{ text: "🔙 Volver al Menú", callback_data: "volver_al_menu" }]
    ]
};

const TECLADO_GLOSARIO = {
    inline_keyboard: [
        [{ text: "Niacinamida", callback_data: "ing_niacinamida" }, { text: "Ácido Hialurónico", callback_data: "ing_hialuronico" }],
        [{ text: "Retinol", callback_data: "ing_retinol" }, { text: "Vitamina C", callback_data: "ing_vitamina_c" }],
        [{ text: "Ácido Salicílico", callback_data: "ing_salicilico" }],
        [{ text: "🔙 Volver al Menú", callback_data: "volver_al_menu" }]
    ]
};

const TECLADO_MITOS = {
    inline_keyboard: [
        [{ text: "Mito 1: Piel grasa e hidratación", callback_data: "mito_hidratacion" }],
        [{ text: "Mito 2: Protector solar en invierno", callback_data: "mito_solar" }],
        [{ text: "🔙 Volver al Menú", callback_data: "volver_al_menu" }]
    ]
};

const BOTON_REGRESAR = { inline_keyboard: [[{ text: "🔙 Volver al Menú", callback_data: "volver_al_menu" }]] };

// ==========================================
// CONTROL DE COMANDOS POR TEXTO
// ==========================================
function enviarMenuInicio(chatId, nombre) {
    const saludo = `✨ *¡Hola, ${nombre}! Bienvenido(a) a GlowGuide Bot* ✨\n\nTu asistente experto en Skincare. Desde aquí puedes realizar un diagnóstico express y conocer ingredientes activos.\n\n👇 *Elige una opción del menú:*`;
    bot.sendMessage(chatId, saludo, { parse_mode: 'Markdown', reply_markup: MENU_PRINCIPAL });
}

bot.onText(/\/start/, (msg) => {
    const id = msg.chat.id;
    const nombre = msg.chat.first_name || 'Invitado';
    enviarMenuInicio(id, nombre);
});

bot.onText(/\/ayuda/, (msg) => {
    const txtAyuda = `❓ *Centro de Ayuda GlowGuide*\n\nComandos rápidos por texto:\n/start - Desplegar el menú principal.\n/ayuda - Ver opciones de asistencia.\n/contacto - Información de soporte.`;
    bot.sendMessage(msg.chat.id, txtAyuda, { parse_mode: 'Markdown', reply_markup: BOTON_REGRESAR });
});

bot.onText(/\/contacto/, (msg) => {
    const txtContacto = `📞 *Canales de Contacto Oficiales*\n\n📧 *Email:* soporte@glowguide.com\n💬 Para dudas personalizadas escríbenos a nuestro correo de soporte técnico.`;
    bot.sendMessage(msg.chat.id, txtContacto, { parse_mode: 'Markdown', reply_markup: BOTON_REGRESAR });
});

// ==========================================
// CONTROL DE BOTONES INTERACTIVOS (CALLBACK)
// ==========================================
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const msgId = query.message.message_id;
    const data = query.data;

    bot.answerCallbackQuery(query.id);

    switch (data) {
        case 'volver_al_menu':
            bot.editMessageText("✨ *Menú Principal GlowGuide*\n\nSelecciona el módulo que deseas explorar hoy:", {
                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: MENU_PRINCIPAL
            });
            break;

        case 'ir_test':
            bot.editMessageText("🧪 *Diagnóstico Facial Express*\n\nAnalicemos tu piel. ¿Cómo sientes tu rostro usualmente unas horas después de lavarlo, sin aplicarte ninguna crema?", {
                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: TECLADO_TEST
            });
            break;

        case 'ir_glosario':
            bot.editMessageText("📖 *Glosario Científico de Ingredientes*\n\nSelecciona un activo cosmético para desplegar sus propiedades moleculares y beneficios:", {
                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: TECLADO_GLOSARIO
            });
            break;

        case 'ir_productos':
            const CatalogoText = "🛍️ *Línea Cosmecéutica Recomendada por GlowGuide*\n\n• *Gel Limpiador Purificante* (Ácido Salicílico 2%)\n• *Sérum Hidratante Avanzado* (Ácido Hialurónico Puro)\n• *Crema Reparadora de Barrera* (Niacinamida + Ceramidas)\n• *Protector Solar Fluido Mate FPS 50+*\n\n_Nota: Recuerda que puedes consultar la rutina de aplicación completa e interactuar con el carrito directamente en nuestra plataforma web._";
            bot.editMessageText(CatalogoText, { chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: BOTON_REGRESAR });
            break;

        case 'ir_mitos':
            bot.editMessageText("✨ *Mitos y Realidades del Cuidado de la Piel*\n\nSelecciona una creencia popular para contrastarla con la ciencia cosmética:", {
                chat_id: chatId, message_id: msgId, parse_mode: 'Markdown', reply_markup: TECLADO_MITOS
            });
            break;

        case 'ir_consejos':
            const consejosArray = [
                "🧼 *Consejo Rápido:* Lava tu rostro únicamente con agua templada o fría. El agua caliente debilita la barrera natural de la piel.",
                "🧴 *Consejo Rápido:* El orden correcto de tu rutina es de la textura más líquida a la más densa (Tónico -> Sérum -> Crema).",
                "☀️ *Consejo Rápido:* Aplica la regla de los dos dedos para usar la cantidad exacta de protector solar que tu rostro necesita."
            ];
            const consejoElegido = consejosArray[Math.floor(Math.random() * consejosArray.length)];
            bot.sendMessage(chatId, consejoElegido, { parse_mode: 'Markdown' });
            break;

        case 'ir_contacto':
            bot.sendMessage(chatId, `📞 *Contacto Oficial*\n\n📧 Email: soporte@glowguide.com\n\n_¡Estamos para servirte!_`, { parse_mode: 'Markdown' });
            break;

        case 'ir_ayuda':
            bot.sendMessage(chatId, `❓ *Guía de Navegación*\n\n• Si el bot no responde, envía el comando /start.\n• Puedes presionar cualquier botón para cambiar de sección al instante.`, { parse_mode: 'Markdown' });
            break;

        // MANEJO DE MITOS
        case 'mito_hidratacion':
            bot.sendMessage(chatId, "❌ *Mito:* Las pieles grasas no ocupan crema hidratante.\n\n🔬 *Realidad:* Totalmente falso. La piel grasa sufre exceso de sebo (aceite), pero puede carecer de agua. Si no la hidratas, producirá más grasa para compensar.", { parse_mode: 'Markdown' });
            break;

        case 'mito_solar':
            bot.sendMessage(chatId, "❌ *Mito:* Si está nublado o es invierno, no hace falta usar protector solar.\n\n🔬 *Realidad:* Falso. Los rayos UVA atraviesan nubes y cristales de ventanas los 365 días del año.", { parse_mode: 'Markdown' });
            break;

        // LÓGICA DE RESPUESTAS DEL QUIZ
        case 'ans_grasa':
        case 'ans_mixta':
        case 'ans_seca':
        case 'ans_sensible':
            const tipoDetectado = data.replace('ans_', '');
            bot.sendMessage(chatId, `🎉 *¡Diagnóstico Concluido!*\n\nTu biotipo cutáneo determinado es: *PIEL ${tipoDetectado.toUpperCase()}*.\n\nTe sugerimos revisar el Glosario de Activos para conocer qué ingredientes tratarán mejor tu tipo de piel.`, { parse_mode: 'Markdown', reply_markup: BOTON_REGRESAR });
            break;

        // LÓGICA DEL GLOSARIO
        case 'ing_niacinamida':
            bot.sendMessage(chatId, TEXTOS.glosario.niacinamida, { parse_mode: 'Markdown' });
            break;
        case 'ing_hialuronico':
            bot.sendMessage(chatId, TEXTOS.glosario.hialuronico, { parse_mode: 'Markdown' });
            break;
        case 'ing_retinol':
            bot.sendMessage(chatId, TEXTOS.glosario.retinol, { parse_mode: 'Markdown' });
            break;
        case 'ing_vitamina_c':
            bot.sendMessage(chatId, TEXTOS.glosario.vitamina_c, { parse_mode: 'Markdown' });
            break;
        case 'ing_salicilico':
            bot.sendMessage(chatId, TEXTOS.glosario.salicilico, { parse_mode: 'Markdown' });
            break;
    }
});