const ctx = document.getElementById('requestHistoryChart').getContext('2d');
let currentYear = 2024; // Initial year

document.getElementById("Clogo").src = localStorage.getItem("Clogo");

const dataByYear = {
    2024: [10, 20, 15, 25, 8, 10, 5, 35, 20, 28, 35, 25],
    2023: [15, 18, 12, 20, 10, 8, 7, 30, 25, 22, 30, 28],
};

// Define month labels
const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const sixMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']; // First six months

// Function to determine labels and data based on screen size
function getChartData() {
    const isMobile = window.innerWidth < 768; // Mobile screen width threshold
    const labels = isMobile ? sixMonths : allMonths;
    const data = isMobile ? dataByYear[currentYear].slice(0, 6) : dataByYear[currentYear]; // First 6 months for mobile

    return { labels, data };
}

// Create the chart with dynamic data for screen size
function createChart() {
    const { labels, data } = getChartData();

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Requests',
                data: data,
                backgroundColor: '#004102',
                borderWidth: 1,
                barThickness: window.innerWidth < 768 ? 10 : 12, // Adjusted bar thickness for mobile
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, max: 40 }
            }
        }
    });
}

// Initialize chart
let requestHistoryChart = createChart();

// Function to update the chart when year is changed
function updateChart(year) {
    const { labels, data } = getChartData();
    requestHistoryChart.data.labels = labels;
    requestHistoryChart.data.datasets[0].data = data;
    requestHistoryChart.update();
}

// Event Listeners for Year Buttons
document.getElementById('increaseYear').addEventListener('click', () => {
    currentYear++;
    document.getElementById('currentYearButton').textContent = currentYear;
    updateChart(currentYear);
});

document.getElementById('decreaseYear').addEventListener('click', () => {
    currentYear--;
    document.getElementById('currentYearButton').textContent = currentYear;
    updateChart(currentYear);
});

// Update chart on window resize to handle screen changes
window.addEventListener('resize', () => {
    requestHistoryChart.destroy(); // Destroy the previous chart instance
    requestHistoryChart = createChart(); // Recreate chart with new data for screen size
});


// Check if screen width is less than or equal to 320px
if (window.innerWidth <= 320) {
    // Targeting .request-history-container p
    document.querySelectorAll('.request-history-container p').forEach(element => {
        element.style.paddingTop = '0';
        element.style.fontSize = '10px';
        element.style.margin = '0';
    });

    // Targeting .year-nav
    document.querySelectorAll('.year-nav').forEach(element => {
        // element.style.display = 'inline-flex';  // Uncomment if display style is needed
        element.style.alignItems = 'center';
        // element.style.marginRight = '3px';
    });
}

