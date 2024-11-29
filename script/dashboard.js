
let dataSets = {};
let chart = null; // Declare chart as a global variable
let cid = localStorage.getItem("cid");

let CName = localStorage.getItem("CName");
document.getElementById("CName").textContent = CName;
document.getElementById("Clogo").src = localStorage.getItem("Clogo");

async function fetchEmployeeCounts() {
    try {       
        document.getElementById('l').style.display = 'flex'; 
        
        
        const response = await fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee_count/${cid}`);
        const data = await response.json();
        
        const totalEmployees = data.total_employee;
        const availableEmployees = data.available_employee;

        // Update the HTML with fetched data
        document.querySelector('.box2 h3').textContent = totalEmployees === 0 ? 0 : totalEmployees;
        document.querySelector('.box3 h3').textContent = availableEmployees === 0 ? 0 : availableEmployees;

        const api2 = await fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/ticket_history/${cid}`);
        dataSets = await api2.json();
     
        // Initialize chart with 12 months data
        let ctx = document.getElementById('myChart').getContext('2d');
        chart = new Chart(ctx, { // Assign to the global `chart` variable
            type: 'line',  // Set as 'line' to simulate an area chart
            data: {
                labels: dataSets['12months'].labels,
                datasets: [{
                    label: 'Ticket History',
                    data: dataSets['12months'].data,
                    borderColor: '#131313',  // Line color
                    backgroundColor: 'rgba(98, 0, 234, 0.1)',  // Fill color for the area
                    pointBackgroundColor: '#131313',
                    pointBorderColor: '#131313',
                    pointHoverRadius: 3,
                    tension: 0.1,
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#999',
                            stepSize: 100
                        },
                        grid: {
                            color: '#e0e0e0'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#999'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        document.getElementById('l').style.display = 'none';
    } catch (error) {
        console.error("Error fetching employee data:", error);
    }
}

// Function to update chart data
function updateChart(range, button) {
    if (!chart || !dataSets[range]) {
        console.error("Chart or dataset not found.");
        return;
    }

    // Update active button style
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));

    // Add 'active' class to the clicked button
    button.classList.add('active');

    // Update chart data
    chart.data.labels = dataSets[range].labels;
    chart.data.datasets[0].data = dataSets[range].data;
    chart.update();
}

async function fetchCounts() {
    try {
        const response = await fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/ticket_counts/${cid}`);
        const data = await response.json();
        console.log(data);

        // Update the HTML with fetched data
        document.querySelector('.UnassignedCount h3').textContent = data.pending_tickets;
        document.querySelector('.CompletedCount h3').textContent = data.completed_tickets;
        document.querySelector('.InprocessCount h3').textContent = data.inprogress_tickets;
        document.querySelector('.ticketcount h3').textContent = data.total_tickets;

    } catch (error) {
        console.error("Error fetching employee data:", error);
    }
}

window.addEventListener('DOMContentLoaded', function() {
    fetchEmployeeCounts();
    fetchCounts();
});

document.getElementById('sidebarToggle').addEventListener('click', function () {
    var sidebar = document.getElementById('left');    
    sidebar.classList.toggle('active');
});  