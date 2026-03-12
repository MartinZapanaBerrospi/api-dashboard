// Configuración Global de Chart.js para que coincida con el tema oscuro
Chart.defaults.color = '#94a3b8';           // Texto Muted
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.borderColor = 'rgba(51, 65, 85, 0.5)'; // Color de las líneas de grid

// Variables globales para las instancias de los gráficos
let revenueChart, categoryChart, acquisitionChart;

// Función para generar números aleatorios (simulando datos del API)
function getRandomData(length, min, max) {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// Datos para la simulación de la Tabla
const clients = ['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella', 'Stark Ind', 'Wayne Ent', 'Massive Dyn', 'Cyberdyne', 'Oscorp'];
const services = ['Consultoría Cloud', 'Soporte Premium', 'Licencia Enterprise', 'Auditoría SEO', 'Desarrollo Web', 'Integración API', 'Campaña Ads'];

// Variables base para simular consistencia de datos entre filtros temporales
let baseDailyRevenue = 0;
let baseDailyCustomers = 0;
let baseConversionRate = 0;

document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    
    // Generar bases iniciales y poblar al inicio
    fetchNewData();

    // Eventos de controles secundarios
    document.getElementById('refresh-data-btn').addEventListener('click', () => {
        alert('🔄 Conectando al servidor... Refrescando base de datos simulada.');
        fetchNewData();
    });
    
    document.getElementById('date-range').addEventListener('change', () => {
        // Al cambiar de fecha, solo rescalamos la info existente
        updateAnalytics();
    });

    document.getElementById('export-btn').addEventListener('click', exportToCSV);
});

// Función para simular "Traer nueva Data"
function fetchNewData() {
    baseDailyRevenue = ~~(Math.random() * 500) + 1500; // Media de $1500-$2000 al dia
    baseDailyCustomers = ~~(Math.random() * 10) + 20;  // Media de 20-30 clientes al dia
    baseConversionRate = Math.random() * (6.5 - 2.5) + 2.5; // Tasa base estructural entre 2.5% y 6.5%
    updateAnalytics();
}

function initCharts() {
    // -----------------------------------------------------------
    // 1. Gráfico Principal (Línea) - Evolución Mensual
    // -----------------------------------------------------------
    const revCtx = document.getElementById('revenueChart').getContext('2d');
    
    // Gradiente para el área del gráfico
    const gradientFill = revCtx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(59, 130, 246, 0.4)'); // Azul Top
    gradientFill.addColorStop(1, 'rgba(59, 130, 246, 0)');   // Transparente Bot

    revenueChart = new Chart(revCtx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Ingresos ($)',
                data: [12000, 19000, 15000, 22000, 29000, 25000, 32000, 35000, 31000, 38000, 42000, 45000],
                borderColor: '#3b82f6',     // Primary
                backgroundColor: gradientFill,
                borderWidth: 3,
                tension: 0.4,               // Curvatura suave
                fill: true,
                pointBackgroundColor: '#1e293b',
                pointBorderColor: '#3b82f6',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#f8fafc',
                    padding: 10,
                    borderColor: '#334155',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return '$ ' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(51, 65, 85, 0.5)' },
                    ticks: { callback: (val) => '$' + (val/1000) + 'k' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });

    // -----------------------------------------------------------
    // 2. Gráfico Donut - Ventas por Categoría
    // -----------------------------------------------------------
    const catCtx = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(catCtx, {
        type: 'doughnut',
        data: {
            labels: ['Software', 'Hardware', 'Servicios', 'Otros'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#3b82f6', // Azul
                    '#8b5cf6', // Morado
                    '#10b981', // Verde
                    '#64748b'  // Gris
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    callbacks: {
                        label: function(context) {
                            return ` ${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    });

    // -----------------------------------------------------------
    // 3. Gráfico de Barras - Adquisición de Usuarios
    // -----------------------------------------------------------
    const acqCtx = document.getElementById('acquisitionChart').getContext('2d');
    acquisitionChart = new Chart(acqCtx, {
        type: 'bar',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Nuevos Usuarios',
                data: [120, 150, 100, 220, 180, 280, 250],
                backgroundColor: '#8b5cf6',
                borderRadius: 4,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(51, 65, 85, 0.5)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function updateAnalytics() {
    // Leer el selector de días
    const daysSelector = parseInt(document.getElementById('date-range').value);
    // Simular un crecimiento lógico usando multiplicadores basados en los días
    // Usamos las variables globales baseDailyRevenue y baseDailyCustomers generadas por fetchNewData()
    const projectedRevenue = daysSelector * baseDailyRevenue;
    const projectedCustomers = daysSelector * baseDailyCustomers;

    // KPI Cards Updates (Ahora en Enteros garantizados)
    const revMin = Math.floor(projectedRevenue * 0.9);
    const revMax = Math.floor(projectedRevenue * 1.1);
    const custMin = Math.floor(projectedCustomers * 0.9);
    const custMax = Math.floor(projectedCustomers * 1.1);

    document.getElementById('kpi-revenue').textContent = getRandomData(1, revMin, revMax)[0].toLocaleString('en-US', {maximumFractionDigits: 0});
    document.getElementById('kpi-customers').textContent = getRandomData(1, custMin, custMax)[0].toLocaleString('en-US', {maximumFractionDigits: 0});
    
    // Tasa de conversión controlada y constante con base en el servidor
    const currentConversion = baseConversionRate + (Math.random() * 0.2 - 0.1); 
    document.getElementById('kpi-conversion').textContent = currentConversion.toFixed(1);

    // Update Line Chart (Ingresos mensuales escalados proporcionalmente)
    // Dividimos la proyección entre 12 meses aprox para simular la línea
    const monthlyAvg = projectedRevenue / (daysSelector <= 30 ? 1 : (daysSelector / 30));
    revenueChart.data.datasets[0].data = getRandomData(12, monthlyAvg * 0.6, monthlyAvg * 1.4);
    revenueChart.update();

    // Update Doughnut Chart (Needs to sum ~100)
    const newCatData = getRandomData(4, 10, 50);
    categoryChart.data.datasets[0].data = newCatData;
    categoryChart.update();

    // Update Bar Chart (Adquisición semanal)
    acquisitionChart.data.datasets[0].data = getRandomData(7, (baseDailyCustomers*7)*0.1, (baseDailyCustomers*7)*0.4);
    acquisitionChart.update();
    
    // Refrescar tabla en base al filtro seleccionado simulado
    generateTableData(daysSelector);
}

// Función para poblar dinámicamente la tabla
function generateTableData(daysAgo = 30) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = ''; // Limpiar filas viejas
    
    // Generar entre 5 y 8 transacciones
    const numRows = Math.floor(Math.random() * 4) + 5;
    
    for (let i = 0; i < numRows; i++) {
        const id = 'TRX-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        // Simular fecha reciente según el selector
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
        const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
        
        const client = clients[Math.floor(Math.random() * clients.length)];
        const service = services[Math.floor(Math.random() * services.length)];
        
        // Ponderar estado: más completed, poco failed
        const randStatus = Math.random();
        let status = 'completed';
        if (randStatus > 0.8) status = 'pending';
        if (randStatus > 0.95) status = 'failed';
        
        const amount = (Math.random() * 5000 + 500).toFixed(2);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-family: monospace; color: var(--text-muted)">${id}</td>
            <td>${dateStr}</td>
            <td style="font-weight: 500;">${client}</td>
            <td>${service}</td>
            <td><span class="status-badge status-${status}">${status}</span></td>
            <td class="tx-amount">$${parseFloat(amount).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    }
}

// Simulador de Exportar a CSV
function exportToCSV() {
    const btn = document.getElementById('export-btn');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
        </svg>
        Generando...
    `;
    btn.style.opacity = '0.7';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        alert('📊 Reporte CSV generado exitosamente (Simulación).\\nEn un proyecto real, se descargaría un archivo con los datos del rango de fechas activo.');
    }, 1500);
}
