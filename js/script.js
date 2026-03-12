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

document.addEventListener('DOMContentLoaded', () => {
    initCharts();

    // Evento para botón de "Refrescar Datos" que simula un llamado a servidor
    document.getElementById('refresh-data-btn').addEventListener('click', () => {
        updateAnalytics();
    });
});

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
    // Generar nuevos datos aleatorios (simulando API)
    
    // KPI Cards Updates
    document.getElementById('kpi-revenue').textContent = getRandomData(1, 90000, 150000)[0].toLocaleString();
    document.getElementById('kpi-customers').textContent = getRandomData(1, 1000, 3000)[0].toLocaleString();
    document.getElementById('kpi-conversion').textContent = (Math.random() * (6.5 - 2.5) + 2.5).toFixed(1);

    // Update Line Chart
    revenueChart.data.datasets[0].data = getRandomData(12, 10000, 50000);
    revenueChart.update();

    // Update Doughnut Chart (Needs to sum ~100)
    const newCatData = getRandomData(4, 10, 50);
    categoryChart.data.datasets[0].data = newCatData;
    categoryChart.update();

    // Update Bar Chart
    acquisitionChart.data.datasets[0].data = getRandomData(7, 80, 350);
    acquisitionChart.update();
    
    alert('✅ Datos actualizados (simulación)');
}
