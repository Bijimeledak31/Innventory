// Theme toggle functionality with chart updates
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    
    // Update icon
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }

    // Update chart themes
    updateChartsTheme(isDark);
}

// Track if charts are initialized
let chartsInitialized = false;

// Navigation functionality
function navigateToSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update navigation active state
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Initialize charts only if they haven't been initialized yet
    if (sectionId === 'dashboard' && !chartsInitialized) {
        initializeCharts();
        chartsInitialized = true;
    }
}

// Chart theme colors
const lightTheme = {
    background: 'white',
    text: '#4B5563',
    grid: '#E5E7EB'
};

const darkTheme = {
    background: '#1F2937',
    text: '#F3F4F6',
    grid: '#374151'
};

// Create and initialize charts
function initializeCharts() {
    // Stock Movement Line Chart
    const stockCtx = document.getElementById('stockMovementChart')?.getContext('2d');
    if (stockCtx) {
        window.stockChart = new Chart(stockCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Barang Masuk',
                    data: [65, 59, 80, 81, 56, 85],
                    borderColor: '#2563EB',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true
                }, {
                    label: 'Barang Keluar',
                    data: [28, 48, 40, 19, 86, 27],
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true
                }]
            },
            options: getChartOptions('Pergerakan Stok Bulanan')
        });
    }

    // Product Category Doughnut Chart
    const categoryCtx = document.getElementById('productCategoryChart')?.getContext('2d');
    if (categoryCtx) {
        window.categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Elektronik', 'Fashion', 'Makanan', 'Furnitur'],
                datasets: [{
                    data: [300, 200, 150, 100],
                    backgroundColor: ['#2563EB', '#10B981', '#F59E0B', '#6366F1']
                }]
            },
            options: {
                ...getChartOptions('Distribusi Kategori Produk'),
                scales: {} // Remove scales for doughnut chart
            }
        });
    }

    // Warehouse Stock Bar Chart
    const warehouseCtx = document.getElementById('warehouseStockChart')?.getContext('2d');
    if (warehouseCtx) {
        window.warehouseChart = new Chart(warehouseCtx, {
            type: 'bar',
            data: {
                labels: ['Gudang A', 'Gudang B', 'Gudang C'],
                datasets: [{
                    label: 'Total Stok',
                    data: [450, 320, 280],
                    backgroundColor: '#2563EB'
                }, {
                    label: 'Stok Rendah',
                    data: [20, 15, 25],
                    backgroundColor: '#EF4444'
                }]
            },
            options: getChartOptions('Status Stok per Gudang')
        });
    }
}

// Get common chart options
function getChartOptions(title) {
    const isDark = document.body.classList.contains('dark-theme');
    const theme = isDark ? darkTheme : lightTheme;
    
    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 750
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: theme.text,
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: false,
                text: title,
                color: theme.text,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: theme.grid
                },
                ticks: {
                    color: theme.text
                }
            },
            y: {
                grid: {
                    color: theme.grid
                },
                ticks: {
                    color: theme.text
                }
            }
        }
    };
}

// Update charts theme
function updateChartsTheme(isDark) {
    const theme = isDark ? darkTheme : lightTheme;
    const charts = [window.stockChart, window.categoryChart, window.warehouseChart];
    
    charts.forEach(chart => {
        if (!chart) return;
        
        // Update options
        if (chart.options.scales) {
            chart.options.scales.x.grid.color = theme.grid;
            chart.options.scales.x.ticks.color = theme.text;
            chart.options.scales.y.grid.color = theme.grid;
            chart.options.scales.y.ticks.color = theme.text;
        }
        
        // Update legend
        chart.options.plugins.legend.labels.color = theme.text;
        chart.update('none'); // Update without animation
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add navigation event listeners
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            navigateToSection(sectionId);
        });
    });

    // Initialize with dashboard
    navigateToSection('dashboard');

    // Handle form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const successMessage = document.createElement('div');
            successMessage.className = 'badge badge-success animate-fade-in';
            successMessage.style.marginTop = '1rem';
            successMessage.textContent = 'Data berhasil disimpan!';
            form.appendChild(successMessage);
            
            setTimeout(() => {
                successMessage.remove();
                form.reset();
            }, 3000);
        });
    });
});
