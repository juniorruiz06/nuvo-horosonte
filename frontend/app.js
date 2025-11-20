const API_URL = "http://localhost:8000";
let searchHistory = [];
let allBuyers = [];
let allPrices = {};

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log("🏔️ MINERAL-AGENT Frontend Inicializando...");
    checkBackendStatus();
    loadDashboard();
    setupEventListeners();
    loadBuyers();
    refreshPrices();
});

// ==================== FUNCIONES GENERALES ====================
function showTab(tabName) {
    // Ocultar todas las tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostrar la tab seleccionada
    document.getElementById(tabName).classList.add('active');

    // Actualizar sidebar
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.closest('a').classList.add('active');
}

function checkBackendStatus() {
    fetch(`${API_URL}/health`)
        .then(res => res.json())
        .then(data => {
            updateStatusIndicator(true);
            console.log("✅ Backend conectado");
        })
        .catch(err => {
            updateStatusIndicator(false);
            console.error("❌ Backend no disponible:", err);
            showToast("Backend no disponible", "error");
        });
}

function updateStatusIndicator(connected) {
    const statusText = document.getElementById('status-text');
    const statusIndicator = document.querySelector('.status-indicator');

    if (connected) {
        statusText.textContent = "Conectado";
        statusIndicator.style.background = '#27ae60';
    } else {
        statusText.textContent = "Desconectado";
        statusIndicator.style.background = '#e74c3c';
    }
}

function setupEventListeners() {
    document.getElementById('budget-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        generateBudget();
    });

    document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            sendChatMessage();
        }
    });
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    try {
        // Obtener compradores
        const buyersRes = await fetch(`${API_URL}/buyers/verified/list`);
        const buyers = await buyersRes.json();
        document.getElementById('total-buyers').textContent = buyers.length;

        // Obtener cotizaciones
        const pricesRes = await fetch(`${API_URL}/prices/latest`);
        const pricesData = await pricesRes.json();

        if (pricesData.data) {
            Object.entries(pricesData.data).forEach(([key, value]) => {
                if (key === 'oro') {
                    document.getElementById('gold-price').textContent = `$${value.price.toFixed(2)}`;
                } else if (key === 'plata') {
                    document.getElementById('silver-price').textContent = `$${value.price.toFixed(2)}`;
                } else if (key === 'cobre') {
                    document.getElementById('copper-price').textContent = `$${value.price.toFixed(2)}`;
                }
            });
        }

        document.getElementById('last-update').textContent = new Date().toLocaleTimeString('es-PE');
    } catch (error) {
        console.error("Error cargando dashboard:", error);
    }
}

// ==================== BÚSQUEDA DE COMPRADORES ====================
async function searchBuyers() {
    const mineralSelect = document.getElementById('mineral-select').value;
    const city = document.getElementById('city-input').value;
    const state = document.getElementById('state-input').value;

    if (!mineralSelect) {
        showToast("Por favor selecciona un mineral", "warning");
        return;
    }

    const loadingDiv = document.getElementById('search-loading');
    const resultsDiv = document.getElementById('search-results');

    loadingDiv.classList.remove('hidden');
    resultsDiv.classList.remove('visible');

    try {
        // Simular búsqueda (en producción sería una API real)
        const response = await fetch(
            `${API_URL}/buyers/?skip=0&limit=20`
        );

        const buyers = await response.json();

        loadingDiv.classList.add('hidden');

        if (buyers.length > 0) {
            let resultsHTML = `<h2>🎯 Se encontraron ${buyers.length} compradores</h2>`;
            resultsHTML += '<div class="buyers-grid">';

            buyers.forEach(buyer => {
                resultsHTML += createBuyerCard(buyer);
            });

            resultsHTML += '</div>';
            resultsDiv.innerHTML = resultsHTML;
            resultsDiv.classList.add('visible');

            // Agregar a historial
            addToSearchHistory(`${mineralSelect} en ${city}, ${state}`);
            showToast(`Se encontraron ${buyers.length} compradores`, "success");
        } else {
            resultsDiv.innerHTML = '<p class="empty-state">No se encontraron compradores</p>';
            resultsDiv.classList.add('visible');
        }
    } catch (error) {
        console.error("Error buscando compradores:", error);
        loadingDiv.classList.add('hidden');
        showToast("Error al buscar compradores", "error");
    }
}

function createBuyerCard(buyer) {
    const statusClass = buyer.status || 'pending';
    const statusText = {
        'verified': 'Verificado ✅',
        'pending': 'Pendiente ⏳',
        'informal': 'Informal ⚠️',
        'suspicious': 'Sospechoso 🚫'
    }[statusClass] || 'Desconocido';

    return `
        <div class="buyer-card">
            <h3>${buyer.name}</h3>
            <div class="ruc">RUC: ${buyer.ruc}</div>
            <div class="classification">${buyer.classification}</div>
            <div class="status ${statusClass}">${statusText}</div>
            
            <div class="buyer-info">
                <i class="fas fa-map-marker-alt"></i>
                <span>${buyer.address}</span>
            </div>
            
            <div class="buyer-info">
                <i class="fas fa-phone"></i>
                <span>${buyer.phone}</span>
            </div>
            
            <div class="buyer-info">
                <i class="fas fa-envelope"></i>
                <span>${buyer.email}</span>
            </div>
            
            ${buyer.website ? `
                <div class="buyer-info">
                    <i class="fas fa-globe"></i>
                    <span><a href="${buyer.website}" target="_blank">Visitar sitio</a></span>
                </div>
            ` : ''}
            
            <div class="buyer-actions">
                <button class="btn btn-primary" onclick="contactBuyer('${buyer.ruc}', 'email')">
                    <i class="fas fa-envelope"></i> Email
                </button>
                <button class="btn btn-outline" onclick="contactBuyer('${buyer.ruc}', 'whatsapp')">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
            </div>
        </div>
    `;
}

function addToSearchHistory(search) {
    searchHistory.unshift(search);
    if (searchHistory.length > 5) searchHistory.pop();

    const recentSearches = document.getElementById('recent-searches');
    let html = '';
    searchHistory.forEach(search => {
        html += `<p>🔍 ${search}</p>`;
    });
    recentSearches.innerHTML = html || '<p class="empty-state">No hay búsquedas recientes</p>';
}

// ==================== GESTIÓN DE COMPRADORES ====================
async function loadBuyers() {
    try {
        const response = await fetch(`${API_URL}/buyers/?skip=0&limit=50`);
        allBuyers = await response.json();

        const buyersList = document.getElementById('buyers-list');
        if (allBuyers.length > 0) {
            let html = '<div class="buyers-grid">';
            allBuyers.forEach(buyer => {
                html += createBuyerCard(buyer);
            });
            html += '</div>';
            buyersList.innerHTML = html;
        } else {
            buyersList.innerHTML = '<p class="empty-state">No hay compradores registrados</p>';
        }

        // Llenar selector de compradores
        populateBuyerSelect();
    } catch (error) {
        console.error("Error cargando compradores:", error);
        showToast("Error al cargar compradores", "error");
    }
}

function filterBuyers() {
    const searchTerm = document.getElementById('buyer-search').value.toLowerCase();
    const cards = document.querySelectorAll('.buyer-card');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
}

function populateBuyerSelect() {
    const select = document.getElementById('budget-buyer');
    if (!select) return;

    select.innerHTML = '<option value="">-- Seleccionar --</option>';
    allBuyers.forEach(buyer => {
        const option = document.createElement('option');
        option.value = buyer.id;
        option.textContent = `${buyer.name} (${buyer.ruc})`;
        select.appendChild(option);
    });
}

// ==================== COTIZACIONES ====================
async function refreshPrices() {
    try {
        const response = await fetch(`${API_URL}/prices/latest`);
        const data = await response.json();

        const pricesContainer = document.getElementById('prices-container');

        if (data.data) {
            allPrices = data.data;
            let html = '';

            Object.entries(data.data).forEach(([key, value]) => {
                const mineralNames = {
                    'oro': '🟡 Oro',
                    'plata': '⚪ Plata',
                    'cobre': '🟠 Cobre',
                    'usd_pen': '💵 USD/PEN'
                };

                html += `
                    <div class="price-card">
                        <h3>${mineralNames[key] || key}</h3>
                        <div class="price-value">$${value.price.toFixed(2)}</div>
                        <div class="price-unit">${value.unit || 'USD'}</div>
                        <small>Fuente: ${value.source || 'N/A'}</small>
                    </div>
                `;
            });

            pricesContainer.innerHTML = html;
            showToast("Cotizaciones actualizadas", "success");
        }
    } catch (error) {
        console.error("Error obteniendo cotizaciones:", error);
        showToast("Error al obtener cotizaciones", "error");
    }
}

// ==================== PRESUPUESTOS ====================
async function generateBudget() {
    const buyerId = document.getElementById('budget-buyer').value;
    const mineral = document.getElementById('budget-mineral').value;
    const quantity = parseFloat(document.getElementById('budget-quantity').value);
    const law = parseFloat(document.getElementById('budget-law').value);
    const recovery = parseFloat(document.getElementById('budget-recovery').value);
    const freight = parseFloat(document.getElementById('budget-freight').value);
    const discount = parseFloat(document.getElementById('budget-discount').value);
    const tax = parseFloat(document.getElementById('budget-tax').value);

    if (!buyerId || !mineral || !quantity || !law) {
        showToast("Por favor completa todos los campos", "warning");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/budgets/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                buyer_id: parseInt(buyerId),
                mineral_type: mineral,
                quantity_kg: quantity,
                law_percentage: law,
                recovery_percentage: recovery,
                freight_cost_pen: freight,
                discounts_percentage: discount,
                taxes_percentage: tax
            })
        });

        const budget = await response.json();

        if (response.ok) {
            displayBudgetResult(budget);
            showToast("Presupuesto generado correctamente", "success");
        } else {
            showToast("Error al generar presupuesto", "error");
        }
    } catch (error) {
        console.error("Error generando presupuesto:", error);
        showToast("Error al generar presupuesto", "error");
    }
}

function displayBudgetResult(budget) {
    const resultDiv = document.getElementById('budget-result');
    const details = budget.details || {};

    let html = `
        <div class="budget-summary">
            <h2>📋 Presupuesto Generado</h2>
            
            <div class="budget-row">
                <span>Mineral:</span>
                <strong>${budget.mineral_type}</strong>
            </div>
            
            <div class="budget-row">
                <span>Cantidad:</span>
                <strong>${budget.quantity_kg} kg</strong>
            </div>
            
            <div class="budget-row">
                <span>% Ley:</span>
                <strong>${budget.law_percentage}%</strong>
            </div>
            
            <div class="budget-row">
                <span>Kg Utilizables:</span>
                <strong>${details.usable_kg?.toFixed(4)} kg</strong>
            </div>
            
            <div class="budget-row">
                <span>Precio Unitario:</span>
                <strong>$${budget.metal_price_usd_oz?.toFixed(2)} USD/oz</strong>
            </div>
            
            <div class="budget-row">
                <span>Tasa USD/PEN:</span>
                <strong>${budget.fx_rate?.toFixed(2)}</strong>
            </div>
            
            <div class="budget-row highlight">
                <span>💰 MONTO TOTAL:</span>
                <strong style="font-size: 1.5rem;">S/ ${details.final_amount?.toFixed(2)}</strong>
            </div>
            
            <div class="budget-row">
                <span>Monto antes de impuestos:</span>
                <strong>S/ ${details.net_before_tax?.toFixed(2)}</strong>
            </div>
            
            <div class="budget-row">
                <span>Impuestos (${budget.taxes_percentage}%):</span>
                <strong>S/ ${details.taxes?.toFixed(2)}</strong>
            </div>
            
            <div style="margin-top: 1.5rem; text-align: center;">
                <button class="btn btn-outline" onclick="downloadBudget('${JSON.stringify(budget).replace(/"/g, '&quot;')}')">
                    <i class="fas fa-download"></i> Descargar PDF
                </button>
                <button class="btn btn-outline" onclick="shareBudget('${JSON.stringify(budget).replace(/"/g, '&quot;')}')">
                    <i class="fas fa-share"></i> Compartir
                </button>
            </div>
        </div>
    `;

    resultDiv.innerHTML = html;
    resultDiv.classList.add('visible');
}

function downloadBudget(budgetData) {
    showToast("Descarga de PDF en desarrollo", "info");
}

function shareBudget(budgetData) {
    showToast("Función de compartir en desarrollo", "info");
}

// ==================== CHAT IA ====================
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Mostrar mensaje del usuario
    addChatMessage(message, 'user');
    input.value = '';

    try {
        const response = await fetch(`${API_URL}/chat/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                context: "Soy un vendedor de minerales en Trujillo, Perú"
            })
        });

        const data = await response.json();
        addChatMessage(data.response, 'bot');
    } catch (error) {
        console.error("Error enviando mensaje:", error);
        addChatMessage("Error al conectar con IA", 'bot');
    }
}

function addChatMessage(message, sender = 'bot') {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${escapeHtml(message)}</p>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function askAI(question) {
    document.getElementById('chat-input').value = question;
    sendChatMessage();
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ==================== CONTACTO ====================
function contactBuyer(ruc, method) {
    const buyer = allBuyers.find(b => b.ruc === ruc);
    if (!buyer) return;

    if (method === 'email') {
        window.location.href = `mailto:${buyer.email}`;
    } else if (method === 'whatsapp') {
        const message = `Hola ${buyer.name}, soy vendedor de minerales y me gustaría conversar sobre una posible negociación.`;
        window.location.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
    }
}

// ==================== MODAL ====================
function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        closeModal();
    }
});
