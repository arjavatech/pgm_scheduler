const dataSets = {
    '12months': {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [0, 100, 150, 250, 200, 180, 140, 170, 150, 130, 120, 110, 180]
    },
    '6months': {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        data: [170, 150, 130, 120, 110, 180]
    },
    '30days': {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        data: [20, 25, 30, 40, 35, 45, 50]
    },
    '7days': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [5, 15, 20, 10, 25, 30, 35]
    },
    'today': {
        labels: ['Hour 1', 'Hour 2', 'Hour 3', 'Hour 4', 'Hour 5'],
        data: [1, 5, 2, 4, 3]
    }
};
console.log(dataSets)

let cid = localStorage.getItem("cid");
console.log(cid);

let CName = localStorage.getItem("CName");
console.log(CName)
document.getElementById("CName").textContent = CName;
// Function to update chart data
function updateChart(range, button) {
    // Update active button style
    document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));

    // Add 'active' class to the clicked button
    button.classList.add('active');

    // Update chart data
    chart.data.labels = dataSets[range].labels;
    chart.data.datasets[0].data = dataSets[range].data;
    chart.update();
}

// Initialize chart with 12 months data
let ctx = document.getElementById('myChart').getContext('2d');
let chart = new Chart(ctx, {
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



async function fetchEmployeeCounts() {
    try {       
        document.getElementById('l').style.display = 'flex'; 
        setTimeout(() => {
            document.getElementById('l').style.display = 'none'; 
        }, 1000);
        
        const response = await fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee_count/${cid}`);
        const data = await response.json();
       console.log(data);
        // Assuming API returns data with totalEmployees and availableEmployees
        const totalEmployees = data.total_employee;
        const availableEmployees = data.available_employee;
       console.log(totalEmployees)

        // Update the HTML with fetched data
        document.querySelector('.box2 h3').textContent = totalEmployees === 0 ? 0 : totalEmployees;
        document.querySelector('.box3 h3').textContent = availableEmployees === 0 ? 0 : availableEmployees ;
    } catch (error) {
        console.error("Error fetching employee data:", error);
    }
}

// Call the function to load employee counts when the page loads



async function fetchCounts() {
    try {
       
        const response = await fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/ticket_counts/${cid}`);
        const data = await response.json();
       console.log(data);
        // Assuming API returns data with totalEmployees and availableEmployees
        const ticketCounts = data.total_tickets;
       
       console.log(ticketCounts)

        // Update the HTML with fetched data
        document.querySelector('.UnassignedCount h3').textContent =  data.pending_tickets;
        document.querySelector('.CompletedCount h3').textContent =  data.completed_tickets;
        document.querySelector('.InprocessCount h3').textContent = data. inprogress_tickets;
        document.querySelector('.ticketcount h3').textContent =  ticketCounts;
       
       
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