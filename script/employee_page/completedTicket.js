// Sample data for the table rows
const tableRows = [
    {
        ticketID: '001',
        issueType: 'AC',
        assignedEmployee: 'Rohith',
        phone: '01234 56789',
        date: '12/12/2024',
        location: 'Ashok Nagar'
    },
    {
        ticketID: '002',
        issueType: 'Fridge',
        assignedEmployee: 'Karthik',
        phone: '09876 54321',
        date: '13/12/2024',
        location: 'Besant Nagar'
    },
    {
        ticketID: '003',
        issueType: 'Fridge',
        assignedEmployee: 'Sharma',
        phone: '09876 54321',
        date: '13/12/2024',
        location: 'Besant Nagar'
    }
];

// Sample data for row details
const rowDetails = [
    {
        ticketID: '001',
        address: 'KING SQUARE OLD NO.1 NEW NO.2, PLOT B 31, 6th Ave, Ashok Nagar, Chennai, Tamil Nadu 600083',
        description: 'The air conditioner is running but not cooling the room effectively...',
        employees: [
            { name: 'Ganesh', pending: 3 },
            { name: 'Rohith', pending: 6 },
            { name: 'Meera', pending: 2 }
        ]
    },
    {
        ticketID: '002',
        address: 'No. 45, Second St, Besant Nagar, Chennai, Tamil Nadu 600090',
        description: 'The fridge is making a strange noise...',
        employees: [
            { name: 'Ganesh', pending: 4 },
            { name: 'Rohith', pending: 5 },
            { name: 'Meera', pending: 1 }
        ]
    },
    {
        ticketID: '003',
        address: 'No. 45, Second St, Besant Nagar, Chennai, Tamil Nadu 600090',
        description: 'The fridge is making a strange noise...',
        employees: [
            { name: 'Ganesh', pending: 4 },
            { name: 'Rohith', pending: 5 },
            { name: 'Meera', pending: 1 }
        ]
    }
];

// Function to format row details
function format(rowData) {
    const employeeOptions = rowData.employees.map(employee => `
        <option value="${employee.name}" ${employee.pending > 5 ? 'disabled' : ''}>
            ${employee.name}
        </option>
    `).join('');

    return `
        <div class="collapse-content details-row" data-ticket-id="${rowData.ticketID}">
            <td colspan="8">
                <div class="row">
                    <div class="col-md-1"></div>
                    <div class="col-md-4">
                        <strong class="d-flex justify-content-left">Customer Address</strong>
                        <p class="pt-2" style="font-size: 13px;text-align: left;">${rowData.address}</p>
                    </div>
                    <div class="col-md-1"></div>
                    <div class="col-md-6">                        
                        <strong class="d-flex justify-content-left">Description:</strong>
                        <p style="font-size: 13px;text-align: left;" class="pt-2">${rowData.description}</p>                                
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-1"></div>
                    <div class="col-md-4">
                        <strong class="d-flex justify-content-left">Employee Start time:</strong>
                        <div class="input-wrapper mt-3">
                            <input type="text" placeholder="Start Time" class="date-input">
                            <span class="icon-calendar"><span style="color: #52525b;">&#128197;</span>
                        </div>  
                        
                        <div class="input-wrapper">
                            <input type="text" placeholder="End Time" class="date-input">
                            <span class="icon-calendar"><span style="color: #52525b;">&#128197;</span>
                        </div>
                    </div>
                    <div class="col-md-1"></div>
                    <div class="col-md-6">
                        <div class="image-set d-flex">
                            <img src="../images/profile img.png" alt="Image 1" id="image" width="100px">
                            <img src="../images/profile img.png" id="image" width="100px">
                            <div class="add-photo">
                                <label for="file-input" class="icon-attachment">Add Photo &#128279;</label>
                                <input type="file" id="file-input" accept="image/*">
                            </div>   
                        </div>
                    </div>
                </div>
            </td>
        </div>
    `;
}

// Function to generate and inject the table body
function generateTableBody() {
    const tbody = document.querySelector('#ticketTable tbody');
    tbody.innerHTML = ''; // Clear existing tbody content

    const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
    loadingIndicator.style.display = 'flex'; // Show loading before fetch
    tableRows.forEach(rowData => {
        const tr = document.createElement('tr');
        tr.classList.add('main-row');
        tr.dataset.ticketId = rowData.ticketID; // Set the data attribute for ticket ID

        tr.innerHTML = `
            <td class="details-control"></td>
            <td>${rowData.ticketID}</td>
            <td>
                <div class="issue-type ${rowData.issueType.toLowerCase()}">
                    <span class="circle"></span> ${rowData.issueType}
                </div>
            </td>
            <td class="assigned-employee">${rowData.assignedEmployee}</td>
            <td>${rowData.phone}</td>
            <td>${rowData.date}</td>
            <td>${rowData.location}</td>
        `;

        tbody.appendChild(tr);
    });
    loadingIndicator.style.display = 'none';
}

// Call the function to generate the table body
generateTableBody();

// Initialize DataTable
const table = $('#ticketTable').DataTable({
    paging: true,
    lengthChange: true,
    searching: true,
    ordering: true,
    info: true,
    autoWidth: false,
    responsive: true
});

// Expand row details on click
$('#ticketTable tbody').on('click', 'td.details-control', function () {
    const tr = $(this).closest('tr');
    const row = table.row(tr);
    const ticketID = tr.find('td:nth-child(2)').text(); // Get the ticket ID
    const details = rowDetails.find(detail => detail.ticketID === ticketID);

    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass('shown');
    } else {
        row.child(format(details)).show();
        tr.addClass('shown');
    }
});

// Update the assigned employee when selected in the row details
$('#ticketTable tbody').on('change', '.employee-select', function () {
    const selectedEmployee = $(this).val();
    const detailsRow = $(this).closest('tr.details-row');
    const ticketID = detailsRow.data('ticket-id');

    // Find the corresponding main row based on the ticket ID
    const mainRow = $(`#ticketTable tbody tr`).filter(function () {
        return $(this).find('td:nth-child(2)').text() === ticketID;
    });

    // Update the assigned employee in the main table row
    mainRow.find('.assigned-employee').text(selectedEmployee);
    table.row(mainRow).invalidate().draw();
});

// Function to add a card for an employee
function addCard(employee) {
    const cardHtml = `
        <div class="card mb-3" id="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-6">
                        <p><strong>Emp ID</strong>: ${employee.ticketID}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Issue Type</strong>: ${employee.issueType}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Emp Name</strong>: ${employee.assignedEmployee}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Phone</strong>: ${employee.phone}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Date</strong>: ${employee.date}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Location</strong>: ${employee.location}</p>
                    </div>
                </div>

                <p class="text-center mb-2 showMoreButton">show more ⮟</p>
                <div class="show-more" style="display:none">
                <div class="row">
                    <div class="col-12">
                        <p><strong>Address</strong>: ${employee.address}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <p><strong>Description</strong>: ${employee.description}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <button class="form-control mt-2 employee-select comform" style="width:100%" id="completed">Completed</button>
                    </div>
                    <div class="col-6">
                        <button class="form-control mt-2 employee-select cancel" style="width:100%" id="cancel">Cancel</button>
                    </div>
                </div>
                
                <p class="text-center pt-3 mb-2 showLessButton">show less ⮝</p>
                </div>  
            </div>
        </div>
    `;
    $('#card-container').append(cardHtml);

    // Show more functionality with event delegation
    $(document).on('click', '.showMoreButton', function () {
        const cardBody = $(this).closest('.card-body');
        cardBody.find('.show-more').slideDown(); // Slide down the content
        $(this).hide(); // Hide "show more" button
    });

    $(document).on('click', '.showLessButton', function () {
        const cardBody = $(this).closest('.card-body');
        cardBody.find('.show-more').slideUp(); // Slide up the content
        cardBody.find('.showMoreButton').show(); // Show "show more" button
    });
}

// Function to add cards for all employees based on rowDetails
function addCardsForAllEmployees() {
    rowDetails.forEach(detail => {
        const employeeData = {
            ticketID: detail.ticketID,
            issueType: tableRows.find(row => row.ticketID === detail.ticketID).issueType,
            assignedEmployee: detail.employees[0].name, // Assuming you want to use the first employee by default
            phone: tableRows.find(row => row.ticketID === detail.ticketID).phone,
            date: tableRows.find(row => row.ticketID === detail.ticketID).date,
            location: tableRows.find(row => row.ticketID === detail.ticketID).location,
            address: detail.address,
            description: detail.description
        };

        addCard(employeeData);
    });
}

// Call the function to add cards for all employees
addCardsForAllEmployees();