/**
 * GlowGuide - Core Engine del Sistema de Análisis Dérmico
 * Desarrollado con modularidad limpia para entornos académicos rígidos.
 */

// --- BASE DE DATOS DE CONOCIMIENTO (ESTÁTICA) ---
const SKIN_QUIZ = [
    {
        id: 1,
        question: "¿Cómo se comporta la piel superficial un par de horas después de la higiene facial sin usar cosméticos?",
        options: [
            { text: "Muestra un relieve equilibrado con brillos notables localizados en la zona T (frente, nariz).", points: { mixta: 3, grasa: 1 } },
            { text: "Aparece una consistencia untuosa generalizada, tacto oleoso y brillos en todo el rostro.", points: { grasa: 3 } },
            { text: "Manifiesta tirantez evidente, opacidad y áreas propensas a la descamación fina.", points: { seca: 3 } },
            { text: "Presenta eritemas localizados (rojeces), sensación de picor o reactividad inmediata.", points: { sensible: 3, seca: 1 } }
        ]
    },
    {
        id: 2,
        question: "¿Cuál es el nivel de incidencia de poros dilatados e imperfecciones comedogénicas?",
        options: [
            { text: "Presencia recurrente de comedones inflamatorios difusos por todo el tejido.", points: { grasa: 3 } },
            { text: "Poros dilatados perceptibles únicamente en la región centrofacial (frente y nariz).", points: { mixta: 3 } },
            { text: "Poros cerrados, textura fina, sin brotes sebáceos visibles.", points: { seca: 3, sensible: 1 } },
            { text: "Brotes mínimos, pero reactividad severa (inflamación) al aplicar fórmulas estándar.", points: { sensible: 3 } }
        ]
    },
    {
        id: 3,
        question: "¿Cuál es la respuesta de su barrera epidérmica ante factores de estrés térmico o uso de fragancias?",
        options: [
            { text: "Tolerancia óptima; no se aprecian alteraciones homeostáticas.", points: { grasa: 2, mixta: 2 } },
            { text: "Deshidratación acelarada que obliga a reponer lípidos en crema.", points: { seca: 3 } },
            { text: "Pérdida inmediata de la función barrera, enrojecimiento difuso y escozor.", points: { sensible: 4 } }
        ]
    }
];

const PROFILES_MATRIX = {
    grasa: {
        title: "Piel Grasa (Hiperseborrea Epidérmica)",
        description: "Se caracteriza por una hiperactividad de las glándulas sebáceas. Presenta un estrato córneo engrosado, poros pilosebáceos visibles y tendencia a lesiones acnéicas. Posee una alta protección natural frente al envejecimiento extrínseco.",
        guidelines: ["Utilizar syndets o geles limpiadores seboreguladores.", "Introducir hidroxiácidos para evitar la retención querolítica dentro del poro.", "No prescindir de la hidratación; priorizar vehículos fluidos con base acuosa."],
        metrics: { hydration: 55, sensitivity: 35, sebum: 95 },
        ingredients: ["Ácido salicílico", "Niacinamida", "Centella Asiática"],
        morning: ["Limpiador purificante en gel", "Sérum seborregulador de Niacinamida 5%", "Fluido hidratante libre de aceites", "Protector solar fluido tacto seco FPS 50+"],
        night: ["Doble limpieza (Aceite emulsionable + Gel acuoso)", "Solución de Ácido Salicílico al 2% (2 noches alternas)", "Gel crema reparador ligero"]
    },
    seca: {
        title: "Piel Seca (Alipídica)",
        description: "Presentas un déficit cuantitativo de lípidos estructurales en la barrera córnea. Esto compromete la retención de agua transepidérmica, derivando en un tejido con tendencia a líneas finas, opacidad y descamación.",
        guidelines: ["Evitar agentes tensioactivos agresivos o limpiadores espumosos.", "Aportar fórmulas ricas en ácidos grasos y ceramidas para sellar la barrera.", "Aplicar humectantes sobre el tejido ligeramente húmedo."],
        metrics: { hydration: 25, sensitivity: 45, sebum: 15 },
        ingredients: ["Ácido hialurónico", "Ceramidas", "Péptidos"],
        morning: ["Emulsión limpiadora libre de espuma", "Sérum hidratante de Ácido Hialurónico", "Crema rica lipídica con Ceramidas", "Protector solar nutritivo FPS 50+"],
        night: ["Bálsamo limpiador suave", "Sérum intensivo reparador", "Crema oclusiva protectora de noche"]
    },
    mixta: {
        title: "Piel Mixta (Heterogeneidad Cutánea)",
        description: "Manifiesta una distribución topográfica irregular de las glándulas sebáceas. Coexiste una actividad lipídica elevada en la zona T con áreas normales o deshidratadas en las regiones periféricas (mejillas).",
        guidelines: ["Establecer un equilibrio de texturas según la zona facial.", "Utilizar activos versátiles que modulen el sebo sin deshidratar.", "Realizar limpieza meticulosa en la zona central."],
        metrics: { hydration: 65, sensitivity: 40, sebum: 60 },
        ingredients: ["Niacinamida", "Ácido hialurónico", "Vitamina C"],
        morning: ["Limpiador equilibrante", "Sérum antioxidante de Vitamina C", "Loción ligera hidratante", "Protector solar fluido universal"],
        night: ["Limpiador facial suave", "Sérum microexfoliante o regulador", "Crema-gel de balance lipídico"]
    },
    sensible: {
        title: "Piel Sensible (Barrera Cutánea Incompetente)",
        description: "Presenta una alteración en la función barrera junto con una hiperexcitabilidad neurosensorial. Reacciona de forma exacerbada a estímulos que en pieles normales no desencadenan respuestas.",
        guidelines: ["Suprimir el uso de perfumes, alcoholes desnaturalizados y aceites esenciales.", "Limitar el número de activos concurrentes en la rutina (minimalismo).", "Priorizar agentes calmantes y reepitelizantes."],
        metrics: { hydration: 45, sensitivity: 90, sebum: 35 },
        ingredients: ["Centella Asiática", "Ceramidas", "Ácido hialurónico"],
        morning: ["Higiene con agua templada o limpiador syndet calmante", "Sérum isotónico de Centella Asiática", "Crema barrera reparadora neuro-calmante", "Protector solar 100% mineral sin perfume"],
        night: ["Limpiador ultra-suave fisiológico", "Crema hidratante reparadora rica en lípidos estructurales"]
    }
};

const GLOSSARY_DB = [
    { name: "Niacinamida", cat: "Vitamina B3 / Antioxidante", desc: "Refuerza la síntesis de ceramidas endógenas, reduce la transferencia de melanosomas mitigando manchas, calma la inflamación y regula la secreción sebácea de forma segura.", target: "Grasa, Mixta, Sensible" },
    { name: "Ácido hialurónico", cat: "Polisacárido Humectante", desc: "Macromolécula capaz de retener agua en el espacio extracelular. Aumenta la turgencia cutánea y optimiza los niveles de hidratación sin aportar carga lipídica.", target: "Todos los biotipos cutáneos" },
    { name: "Retinol", cat: "Retinoide / Renovador", desc: "Estimula la renovación del queratinocito y aumenta la producción de colágeno dérmico. Trata eficazmente el crono y fotoenvejecimiento, mejorando la textura general.", target: "Seca, Mixta, Grasa (Introducción progresiva)" },
    { name: "Vitamina C", cat: "Ácido Ascórbico / Antioxidante", desc: "Neutraliza las especies reactivas de oxígeno provocadas por la radiación UV. Interviene en la síntesis de colágeno y ejerce una acción aclarante en hiperpigmentaciones.", target: "Todos los biotipos cutáneos" },
    { name: "Ceramidas", cat: "Lípidos Intercelulares", desc: "Esenciales para el mantenimiento de la cohesión del estrato córneo. Restauran la barrera lipídica dañada, evitando la pérdida de agua transepidérmica (TEWL).", target: "Seca, Sensible, Con función barrera alterada" },
    { name: "Ácido salicílico", cat: "Beta-Hidroxiácido (BHA)", desc: "Exfoliante químico de naturaleza liposoluble. Penetra de forma selectiva en los poros obstruidos, realizando una limpieza profunda de detritos y sebo acumulado.", target: "Grasa, Mixta, Con tendencia al acné" },
    { name: "Péptidos", cat: "Fracciones de Aminoácidos", desc: "Cadenas peptídicas que actúan como mensajeros de señalización celular. Indican a los fibroblastos que sinteticen nuevas fibras elásticas y colágeno.", target: "Seca, Madura" },
    { name: "Centella Asiática", cat: "Extracto Botánico Fitoterapéutico", desc: "Rica en madecasósidos. Posee propiedades analgésicas, antiinflamatorias y reparadoras celulares. Acelera los procesos de cicatrización cutánea.", target: "Sensible, Irritada, Con imperfecciones" }
];

const MYTHS_ACCORDION = [
    { mito: "Las pieles grasas no requieren hidratación externa.", realidad: "Falso. La seborrea hace alusión a un exceso de lípidos (aceite), mientras que la deshidratación implica una deficiencia de agua. Una piel grasa deshidratada puede experimentar un efecto rebote, secretando más sebo para compensar la falta de agua superficial." },
    { mito: "El uso de protector solar se limita a la exposición solar directa de verano.", realidad: "Falso. La radiación UVA (responsable del fotoenvejecimiento y daño celular profundo) es constante a lo largo de todo el año y penetra a través de nubosidades pesadas y cristales de ventanas comunes." },
    { mito: "Los cosméticos formulados con ingredientes naturales son intrínsecamente más seguros.", realidad: "Falso. Los extractos naturales puros contienen compuestos químicos complejos y no aislados que aumentan significativamente el índice de dermatitis de contacto alérgica en comparación con moléculas purificadas en laboratorio." }
];

const DAILY_ALERTS = [
    "La dosis estándar de protector solar facial equivale a la longitud de dos dedos de la mano.",
    "Realice la limpieza facial con agua a temperatura templada; el agua excesivamente caliente altera los lípidos de la barrera.",
    "El orden de aplicación de los cosméticos se rige por su densidad: vaya siempre de las texturas más acuosas a las más densas.",
    "Evite secar el rostro frotando la toalla; realice ligeras presiones para no generar micro-fricciones mecánicas."
];

// --- APP STATE ---
let currentStep = 0;
let scoreAccumulator = { grasa: 0, seca: 0, mixta: 0, sensible: 0 };

// --- DOM INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    renderTip();
    renderQuiz();
    renderGlossary();
    renderMitos();
    checkSavedAnalysis();
    setupCoreEvents();
}

// --- CONSEJO DIARIO ---
function renderTip() {
    const randomTip = DAILY_ALERTS[Math.floor(Math.random() * DAILY_ALERTS.length)];
    const el = document.getElementById('hero-tip-text');
    if(el) el.innerText = randomTip;
}

// --- DESARROLLO DEL CUESTIONARIO CON PASOS EXPLÍCITOS ---
function renderQuiz() {
    const quizBody = document.getElementById('quiz-body');
    const counterEl = document.getElementById('quiz-counter');
    const percentageEl = document.getElementById('quiz-percentage');
    if (!quizBody) return;

    if (currentStep >= SKIN_QUIZ.length) {
        processAnalysisScores();
        return;
    }

    const currentQuiz = SKIN_QUIZ[currentStep];
    const totalQuestions = SKIN_QUIZ.length;
    
    // 3. Actualización de Indicadores de Progreso Numéricos
    const calculatedPercentage = Math.round((currentStep / totalQuestions) * 100);
    if(counterEl) counterEl.innerText = `Pregunta ${currentStep + 1} de ${totalQuestions}`;
    if(percentageEl) percentageEl.innerText = `${calculatedPercentage}%`;
    document.getElementById('quiz-progress').style.width = `${calculatedPercentage}%`;

    let contentHtml = `<p class="question-text">${currentQuiz.question}</p><div class="options-stack">`;
    currentQuiz.options.forEach((option, index) => {
        contentHtml += `<button class="option-row" onclick="captureStepAnswer(${index})">${option.text}</button>`;
    });
    contentHtml += `</div>`;
    quizBody.innerHTML = contentHtml;
}

window.captureStepAnswer = function(optionIdx) {
    const selectedPoints = SKIN_QUIZ[currentStep].options[optionIdx].points;
    for (let skinType in selectedPoints) {
        scoreAccumulator[skinType] += selectedPoints[skinType];
    }
    currentStep++;
    renderQuiz();
};

// --- PROCESAMIENTO MATRICIAL ---
function processAnalysisScores() {
    document.getElementById('quiz-progress').style.width = "100%";
    if(document.getElementById('quiz-percentage')) document.getElementById('quiz-percentage').innerText = "100%";
    
    let assignedBiotypography = "mixta";
    let maximumValue = -1;

    for (let profileKey in scoreAccumulator) {
        if (scoreAccumulator[profileKey] > maximumValue) {
            maximumValue = scoreAccumulator[profileKey];
            assignedBiotypography = profileKey;
        }
    }

    executeDashboardDisplay(assignedBiotypography);
    localStorage.setItem('gg_clinical_profile', assignedBiotypography);
}

// --- DESPLIEGUE DEL TABLERO DE RESULTADOS ---
function executeDashboardDisplay(type) {
    const profile = PROFILES_MATRIX[type];
    const resultsSec = document.getElementById('results-section');
    if (!profile || !resultsSec) return;

    document.getElementById('result-title').innerText = profile.title;
    document.getElementById('result-description').innerText = profile.description;

    // Reglas Clínicas
    const guidelinesList = document.getElementById('result-guidelines-list');
    guidelinesList.innerHTML = "";
    profile.guidelines.forEach(guide => {
        guidelinesList.innerHTML += `<li>${guide}</li>`;
    });

    // Métricas de Superficie
    document.getElementById('txt-hydration').innerText = `${profile.metrics.hydration}%`;
    document.getElementById('txt-sensitivity').innerText = `${profile.metrics.sensitivity}%`;
    document.getElementById('txt-sebum').innerText = `${profile.metrics.sebum}%`;

    setTimeout(() => {
        document.getElementById('bar-hydration').style.width = `${profile.metrics.hydration}%`;
        document.getElementById('bar-sensitivity').style.width = `${profile.metrics.sensitivity}%`;
        document.getElementById('bar-sebum').style.width = `${profile.metrics.sebum}%`;
    }, 100);

    // Rutinas Paralelas
    const morningOl = document.getElementById('routine-morning-steps');
    const nightOl = document.getElementById('routine-night-steps');
    morningOl.innerHTML = "";
    nightOl.innerHTML = "";
    profile.morning.forEach(step => morningOl.innerHTML += `<li>${step}</li>`);
    profile.night.forEach(step => nightOl.innerHTML += `<li>${step}</li>`);

    // Chips
    const chipsBox = document.getElementById('target-ingredients-chips');
    chipsBox.innerHTML = "";
    profile.ingredients.forEach(ing => {
        chipsBox.innerHTML += `<span class="chip">${ing}</span>`;
    });

    resultsSec.classList.remove('hidden');
    resultsSec.scrollIntoView({ behavior: 'smooth' });
}

// --- PERSISTENCIA LOCAL (LOCALSTORAGE) ---
function checkSavedAnalysis() {
    const record = localStorage.getItem('gg_clinical_profile');
    const banner = document.getElementById('history-banner');
    if (record && PROFILES_MATRIX[record] && banner) {
        banner.classList.remove('hidden');
        document.getElementById('history-skin-name').innerText = PROFILES_MATRIX[record].title;
        
        document.getElementById('history-load-btn').addEventListener('click', () => {
            executeDashboardDisplay(record);
        });
    }
}

// --- EVENTOS GENERALES ---
function setupCoreEvents() {
    // Reiniciar Cuestionario
    document.getElementById('reset-test-btn').addEventListener('click', () => {
        currentStep = 0;
        scoreAccumulator = { grasa: 0, seca: 0, mixta: 0, sensible: 0 };
        document.getElementById('results-section').classList.add('hidden');
        renderQuiz();
        document.getElementById('test').scrollIntoView({ behavior: 'smooth' });
    });

    // Enlaces de navegación con scroll controlado
    const bindScroll = (triggerId, targetId) => {
        const trigger = document.getElementById(triggerId);
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
            });
        }
    };
    bindScroll('hero-start-btn', 'test');
    bindScroll('nav-test-trigger', 'test');

    // Menú Hamburguesa para Móviles
    const burger = document.getElementById('burger-menu');
    const navMenu = document.getElementById('nav-menu');
    if(burger && navMenu) {
        burger.addEventListener('click', () => {
            navMenu.style.display = (navMenu.style.display === 'flex') ? 'none' : 'flex';
        });
    }
}

// --- CONSTRUCCIÓN DEL GLOSARIO ---
function renderGlossary() {
    const grid = document.getElementById('glosario-grid');
    if (!grid) return;

    grid.innerHTML = "";
    GLOSSARY_DB.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'glosario-card';
        card.innerHTML = `
            <span class="card-tag">${item.cat}</span>
            <h3>${item.name}</h3>
            <p>${item.desc.substring(0, 75)}...</p>
        `;
        card.addEventListener('click', () => triggerModal(index));
        grid.appendChild(card);
    });
}

// MODAL DE ACTIVOS
const modalElement = document.getElementById('ingredient-modal');
function triggerModal(index) {
    const item = GLOSSARY_DB[index];
    if (!modalElement || !item) return;

    document.getElementById('modal-title').innerText = item.name;
    document.getElementById('modal-category').innerText = item.cat;
    document.getElementById('modal-description').innerText = item.desc;
    document.getElementById('modal-target-skin').innerText = item.target;

    modalElement.classList.add('active');
}

document.getElementById('modal-close-btn').addEventListener('click', () => {
    modalElement.classList.remove('active');
});
window.addEventListener('click', (e) => {
    if (e.target === modalElement) modalElement.classList.remove('active');
});

// --- CONSTRUCCIÓN DEL ACORDEÓN DE MITOS ---
function renderMitos() {
    const container = document.getElementById('mitos-accordion');
    if (!container) return;

    container.innerHTML = "";
    MYTHS_ACCORDION.forEach((item) => {
        const accItem = document.createElement('div');
        accItem.className = 'accordion-item';
        
        accItem.innerHTML = `
            <button class="accordion-header">
                <span>Mito: "${item.mito}"</span>
                <span class="accordion-icon">+</span>
            </button>
            <div class="accordion-content">
                <div class="accordion-body">
                    <span class="evidence-label">Evidencia Científica</span>
                    <p>${item.realidad}</p>
                </div>
            </div>
        `;

        const headerBtn = accItem.querySelector('.accordion-header');
        headerBtn.addEventListener('click', () => {
            const isActive = accItem.classList.contains('active');
            
            document.querySelectorAll('.accordion-item').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.accordion-content').style.maxHeight = null;
            });

            if (!isActive) {
                accItem.classList.add('active');
                const content = accItem.querySelector('.accordion-content');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });

        container.appendChild(accItem);
    });
}