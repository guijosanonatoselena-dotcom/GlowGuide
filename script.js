/**
 * GlowGuide - Core Engine del Sistema de Análisis Dérmico
 */

// --- BASE DE DATOS DE CONOCIMIENTO ---
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
            { text: "Presencia recurrentes de comedones inflamatorios difusos por todo el tejido.", points: { grasa: 3 } },
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
            { text: "Deshidratación acelerada que obliga a reponer lípidos en crema.", points: { seca: 3 } },
            { text: "Pérdida inmediata de la función barrera, enrojecimiento difuso y escozor.", points: { sensible: 4 } }
        ]
    }
];

const PROFILES_MATRIX = {
    grasa: {
        title: "Piel Grasa (Hiperseborrea Epidérmica)",
        description: "Se caracteriza por una hiperactividad de las glándulas sebáceas. Presenta un estrato córneo engrosado, poros pilosebáceos visibles y tendencia a lesiones acnéicas.",
        guidelines: ["Utilizar syndets o geles limpiadores seboreguladores.", "Introducir hidroxiácidos para evitar la retención querolítica dentro del poro.", "No prescindir de la hidratación; priorizar vehículos fluidos con base acuosa."],
        metrics: { hydration: 55, sensitivity: 35, sebum: 95 },
        ingredients: ["Ácido salicílico", "Niacinamida", "Centella Asiática"],
        morning: ["Limpiador purificante en gel", "Sérum seborregulador de Niacinamida 5%", "Fluido hidratante libre de aceites", "Protector solar fluido tacto seco FPS 50+"],
        night: ["Doble limpieza (Aceite emulsionable + Gel acuoso)", "Solución de Ácido Salicílico al 2% (2 noches alternas)", "Gel crema reparador ligero"]
    },
    seca: {
        title: "Piel Seca (Alipídica)",
        description: "Presentas un déficit cuantitativo de lípidos estructurales en la barrera córnea. Esto compromete la retención de agua transepidérmica, derivando en un tejido con tendencia a líneas finas.",
        guidelines: ["Evitar agentes tensioactivos agresivos o limpiadores espumosos.", "Aportar fórmulas ricas en ácidos grasos y ceramidas para sellar la barrera.", "Aplicar humectantes sobre el tejido ligeramente húmedo."],
        metrics: { hydration: 25, sensitivity: 45, sebum: 15 },
        ingredients: ["Ácido hialurónico", "Ceramidas", "Péptidos"],
        morning: ["Emulsión limpiadora libre de espuma", "Sérum hidratante de Ácido Hialurónico", "Crema rica lipídica con Ceramidas", "Protector solar nutritivo FPS 50+"],
        night: ["Bálsamo limpiador suave", "Sérum intensivo reparador", "Crema oclusiva protectora de noche"]
    },
    mixta: {
        title: "Piel Mixta (Heterogeneidad Cutánea)",
        description: "Manifiesta una distribución topográfica irregular de las glándulas sebáceas. Coexiste una actividad lipídica elevada en la zona T con áreas normales o deshidratadas en las regiones periféricas.",
        guidelines: ["Establecer un equilibrio de texturas según la zona facial.", "Utilizar activos versátiles que modulen el sebo sin deshidratar.", "Realizar limpieza meticulosa en la zona central."],
        metrics: { hydration: 65, sensitivity: 40, sebum: 60 },
        ingredients: ["Niacinamida", "Ácido hialurónico", "Vitamina C"],
        morning: ["Limpiador equilibrante", "Sérum antioxidante de Vitamina C", "Loción ligera hidratante", "Protector solar fluido universal"],
        night: ["Limpiador facial suave", "Sérum microexfoliante o regulador", "Crema-gel de balance lipídico"]
    },
    sensible: {
        title: "Piel Sensible (Barrera Cutánea Incompetente)",
        description: "Presenta una alteración en la función barrera junto con una hiperexcitabilidad neurosensorial. Reacciona de forma exacerbada a estímulos estándar.",
        guidelines: ["Suprimir el uso de perfumes, alcoholes desnaturalizados y aceites esenciales.", "Limitar el número de activos concurrentes en la rutina (minimalismo).", "Priorizar agentes calmantes y reepitelizantes."],
        metrics: { hydration: 45, sensitivity: 90, sebum: 35 },
        ingredients: ["Centella Asiática", "Ceramidas", "Ácido hialurónico"],
        morning: ["Higiene con agua templada o limpiador syndet calmante", "Sérum isotónico de Centella Asiática", "Crema barrera reparadora neuro-calmante", "Protector solar 100% mineral sin perfume"],
        night: ["Limpiador ultra-suave fisiológico", "Crema hidratante reparadora rica en lípidos estructurales"]
    }
};

const GLOSSARY_DB = [
    { name: "Niacinamida", cat: "Vitamina B3 / Antioxidante", desc: "Refuerza la síntesis de ceramidas endógenas, reduce la transferencia de melanosomas mitigando manchas, calma la inflamación y regula la secreción sebácea.", target: "Grasa, Mixta, Sensible" },
    { name: "Ácido hialurónico", cat: "Polisacárido Humectante", desc: "Macromolécula capaz de retener agua en el espacio extracelular. Aumenta la turgencia cutánea sin aportar carga lipídica.", target: "Todos los biotipos cutáneos" },
    { name: "Retinol", cat: "Retinoide / Renovador", desc: "Estimula la renovación del queratinocito y aumenta la producción de colágeno dérmico. Trata eficazmente el crono y fotoenvejecimiento.", target: "Seca, Mixta, Grasa" },
    { name: "Vitamina C", cat: "Ácido Ascórbico / Antioxidante", desc: "Neutraliza las especies reactivas de oxígeno provocadas por la radiación UV e interviene en la síntesis de colágeno.", target: "Todos los biotipos cutáneos" },
    { name: "Ceramidas", cat: "Lípidos Intercelulares", desc: "Esenciales para el mantenimiento de la cohesión del estrato córneo. Restauran la barrera lipídica dañada.", target: "Seca, Sensible" },
    { name: "Ácido salicílico", cat: "Beta-Hidroxiácido (BHA)", desc: "Exfoliante químico de naturaleza liposoluble. Penetra de forma selectiva en los poros obstruidos, realizando una limpieza profunda.", target: "Grasa, Mixta" }
];

const MYTHS_ACCORDION = [
    { mito: "Las pieles grasas no requieren hidratación externa.", realidad: "Falso. La seborrea hace alusión a un exceso de lípidos (aceite), mientras que la deshidratación implica una deficiencia de agua." },
    { mito: "El uso de protector solar se limita a la exposición solar directa de verano.", realidad: "Falso. La radiación UVA es constante a lo largo de todo el año y penetra a través de nubosidades y cristales." }
];

// --- NUEVA DATA DE PRODUCTOS (FASE 1) ---
const PRODUCTS_DB = [
    { id: 1, name: "Gel Limpiador Purificante Seboregulador", brand: "DermaLab", cat: "Limpiadores", price: "$420.00", skin: "Grasa, Mixta", ingredients: "Ácido Salicílico 2%, Zinc PCA", benefits: "Controla el exceso de sebo y desobstruye los poros sin resecar la barrera.", rating: 5, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600" },
    { id: 2, name: "Sérum Renovador Retinol Clínico 0.3%", brand: "SkinScience", cat: "Sérums", price: "$680.00", skin: "Seca, Mixta, Grasa", ingredients: "Retinol Puro 0.3%, Vitamina E", benefits: "Acelera la renovación celular y disminuye visiblemente las líneas de expresión.", rating: 4, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600" },
    { id: 3, name: "Crema Barrera Nutritiva Intensa", brand: "BioticSkin", cat: "Hidratantes", price: "$510.00", skin: "Seca, Sensible", ingredients: "Ceramidas NP, AP, EOP, Ácido Hialurónico", benefits: "Restaura instantáneamente los lípidos estructurales y calma la tirantez.", rating: 5, imgagen: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop" },
    { id: 4, name: "Fluido Solar Invisible Advanced FPS 50+", brand: "UV-Block", cat: "Protectores solares", price: "$490.00", skin: "Todos los biotipos", ingredients: "Filtros Orgánicos estables, Niacinamida 2%", benefits: "Protección de amplio espectro contra radiación UV con acabado mate sedoso.", rating: 5, img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600" },
    { id: 5, name: "Tónico Exfoliante Queratolítico Químico", brand: "AlphaLabs", cat: "Exfoliantes", price: "$460.00", skin: "Grasa, Mixta", ingredients: "Ácido Glicólico 7%, Ácido Salicílico", benefits: "Remueve queratinocitos muertos homogenizando la textura general.", rating: 4, img: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600" },
    { id: 6, name: "Emulsión Limpiadora Fisiológica Calmante", brand: "CalmDerm", cat: "Limpiadores", price: "$390.00", skin: "Seca, Sensible", ingredients: "Pantenol, Glicerina Pura", benefits: "Limpia impurezas con suavidad extrema respetando el pH cutáneo.", rating: 5, img: "https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?q=80&w=600" },
    { id: 7, name: "Sérum Iluminador Antioxidante C-Boost", brand: "SkinScience", cat: "Sérums", price: "$640.00", skin: "Todos los biotipos", ingredients: "Vitamina C Estabilizada 10%, Ácido Ferúlico", benefits: "Neutraliza los radicales libres y devuelve la luminosidad perdida.", rating: 4, img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600" },
    { id: 8, name: "Gel Crema Hidratante de Hidratación Profunda", brand: "AquaDerm", cat: "Hidratantes", price: "$450.00", skin: "Grasa, Mixta, Sensible", ingredients: "Ácido Hialurónico de varios pesos, Centella Asiática", benefits: "Retiene agua celular sin aportar sensación de pesadez ni oclusión.", rating: 5, img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600" }
];

const DAILY_ALERTS = [
    "La dosis estándar de protector solar facial equivale a la longitud de dos dedos.",
    "El orden de aplicación de los cosméticos se rige por su densidad: de más acuoso a más denso."
];

// --- APP STATE & NAVIGATION ---
let currentStep = 0;
let scoreAccumulator = { grasa: 0, seca: 0, mixta: 0, sensible: 0 };
let activeSectionId = "hero";

function navigateTo(targetSectionId) {
    if (activeSectionId === targetSectionId) return;

    const currentSection = document.getElementById(activeSectionId);
    const nextSection = document.getElementById(targetSectionId);

    if (!currentSection || !nextSection) return;

    currentSection.classList.remove('view-active');

    setTimeout(() => {
        currentSection.classList.add('hidden');
        nextSection.classList.remove('hidden');
        
        setTimeout(() => {
            nextSection.classList.add('view-active');
            window.scrollTo(0, 0);
        }, 20);

        activeSectionId = targetSectionId;
    }, 350);
}

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    renderTip();
    renderQuiz();
    renderProducts();
    renderGlossary();
    renderMitos();
    checkSavedAnalysis();
    setupCoreEvents();
}

function renderTip() {
    const randomTip = DAILY_ALERTS[Math.floor(Math.random() * DAILY_ALERTS.length)];
    const el = document.getElementById('hero-tip-text');
    if(el) el.innerText = randomTip;
}

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

function processAnalysisScores() {
    let assignedBiotypography = "mixta";
    let maximumValue = -1;

    for (let profileKey in scoreAccumulator) {
        if (scoreAccumulator[profileKey] > maximumValue) {
            maximumValue = scoreAccumulator[profileKey];
            assignedBiotypography = profileKey;
        }
    }

    localStorage.setItem('gg_clinical_profile', assignedBiotypography);
    executeDashboardDisplay(assignedBiotypography);
}

function executeDashboardDisplay(type) {
    const profile = PROFILES_MATRIX[type];
    if (!profile) return;

    document.getElementById('result-title').innerText = profile.title;
    document.getElementById('result-description').innerText = profile.description;

    const guidelinesList = document.getElementById('result-guidelines-list');
    guidelinesList.innerHTML = "";
    profile.guidelines.forEach(guide => {
        guidelinesList.innerHTML += `<li>${guide}</li>`;
    });

    document.getElementById('txt-hydration').innerText = `${profile.metrics.hydration}%`;
    document.getElementById('txt-sensitivity').innerText = `${profile.metrics.sensitivity}%`;
    document.getElementById('txt-sebum').innerText = `${profile.metrics.sebum}%`;

    setTimeout(() => {
        document.getElementById('bar-hydration').style.width = `${profile.metrics.hydration}%`;
        document.getElementById('bar-sensitivity').style.width = `${profile.metrics.sensitivity}%`;
        document.getElementById('bar-sebum').style.width = `${profile.metrics.sebum}%`;
    }, 100);

    const morningOl = document.getElementById('routine-morning-steps');
    const nightOl = document.getElementById('routine-night-steps');
    morningOl.innerHTML = "";
    nightOl.innerHTML = "";
    profile.morning.forEach(step => morningOl.innerHTML += `<li>${step}</li>`);
    profile.night.forEach(step => nightOl.innerHTML += `<li>${step}</li>`);

    const chipsBox = document.getElementById('target-ingredients-chips');
    chipsBox.innerHTML = "";
    profile.ingredients.forEach(ing => {
        chipsBox.innerHTML += `<span class="chip">${ing}</span>`;
    });

    navigateTo('results-section');
}

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

// --- RENDERIZADO DE PRODUCTOS RECOMENDADOS ---
function renderProducts() {
    const grid = document.getElementById('productos-grid');
    if (!grid) return;

    grid.innerHTML = "";
    PRODUCTS_DB.forEach((prod, index) => {
        const stars = "★".repeat(prod.rating) + "☆".repeat(5 - prod.rating);
        const card = document.createElement('div');
        card.className = 'producto-card';
        card.innerHTML = `
            <div class="producto-img-box">
                <img src="${prod.img}" alt="${prod.name}" class="producto-img">
                <span class="producto-cat-badge">${prod.cat}</span>
            </div>
            <div class="producto-info">
                <span class="producto-brand">${prod.brand}</span>
                <h3 class="producto-title">${prod.name}</h3>
                <div class="producto-rating">${stars}</div>
                <p class="producto-desc-short">${prod.benefits.substring(0, 60)}...</p>
                <div class="producto-meta-specs">
                    <span><strong>Recomendado:</strong> ${prod.skin}</span>
                </div>
                <div class="producto-price-row">
                    <span class="producto-price">${prod.price}</span>
                </div>
                <div class="producto-actions">
                    <button class="btn btn-secondary btn-xs" onclick="triggerProductModal(${index})">Ver detalles</button>
                    <button class="btn btn-outline-fav" title="Agregar a Favoritos">♥</button>
                </div>
                <button class="btn btn-dark btn-sm producto-btn-cart" style="width: 100%; margin-top: 10px;">Agregar al Carrito</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// MODAL PARA MOSTRAR DETALLES DE PRODUCTO
const prodModalElement = document.getElementById('product-modal');
window.triggerProductModal = function(index) {
    const prod = PRODUCTS_DB[index];
    if (!prodModalElement || !prod) return;

    document.getElementById('p-modal-title').innerText = prod.name;
    document.getElementById('p-modal-brand').innerText = prod.brand;
    document.getElementById('p-modal-category').innerText = prod.cat;
    document.getElementById('p-modal-ingredients').innerText = prod.ingredients;
    document.getElementById('p-modal-benefits').innerText = prod.benefits;
    document.getElementById('p-modal-skin').innerText = prod.skin;

    prodModalElement.classList.add('active');
};

if(document.getElementById('product-modal-close-btn')) {
    document.getElementById('product-modal-close-btn').addEventListener('click', () => {
        prodModalElement.classList.remove('active');
    });
}

function setupCoreEvents() {
    // 1. EVENTO BOTÓN EXPLORAR ACTIVOS (Prioridad Absoluta)
    const exploreBtn = document.getElementById('hero-explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigateTo('glosario');
        });
    }

    // 2. BOTÓN COMENZAR DIAGNÓSTICO
    const startBtn = document.getElementById('hero-start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('test');
        });
    }

    // Manejo de clicks en el Navbar SPA
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        const links = navMenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                if (document.getElementById(targetId)) {
                    navigateTo(targetId);
                }
                if (navMenu.classList.contains('mobile-active')) {
                    navMenu.classList.remove('mobile-active');
                }
            });
        });
    }

    // Reiniciar Cuestionario
    const resetBtn = document.getElementById('reset-test-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentStep = 0;
            scoreAccumulator = { grasa: 0, seca: 0, mixta: 0, sensible: 0 };
            document.getElementById('results-section').classList.add('hidden');
            document.getElementById('results-section').classList.remove('view-active');
            renderQuiz();
            navigateTo('test');
        });
    }

    const burger = document.getElementById('burger-menu');
    if (burger && navMenu) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('mobile-active');
        });
    }
}

// --- GLOSARIO & MITOS ---
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

if(document.getElementById('modal-close-btn')) {
    document.getElementById('modal-close-btn').addEventListener('click', () => {
        modalElement.classList.remove('active');
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modalElement) modalElement.classList.remove('active');
    if (e.target === prodModalElement) prodModalElement.classList.remove('active');
});

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