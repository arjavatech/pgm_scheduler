const cid = localStorage.getItem("cid");
$(document).ready(function () {
    
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/tickets/unassigned/${cid}`;
    let rowDetails = [];
    let employeeOptions = ""; // Declare employeeOptions globally
    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex';

    // Fetch employee data for the select options
    const employeeUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee_based_pending_works_count/ShddWeFGFGkk9b67STTJY4`;
    fetch(employeeUrl)
        .then(response => response.json())
        .then(data => {
            // Populate global employeeOptions for use in both addCard and format
            employeeOptions = data.map(employee =>
                `<option value="${employee.employee_id}">${employee.employee_name}</option>`
            ).join("");
        })
        .catch(error => console.error('Error fetching employees:', error));

    // Fetch tickets
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loadingIndicator.style.display = 'none';
            data.forEach(ticket => {
                rowDetails.push(ticket);
                addTicket(ticket);
                addCard(ticket); // Use employeeOptions in addCard
            });
        })
        .catch(error => {
            console.error('Error fetching tickets:', error);
            loadingIndicator.style.display = 'none';
        });

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

    // Function to add a ticket to the DataTable
    function addTicket(ticket) {
        const rowNode = table.row.add([
            `<span></span>`,
            ticket.ticket_id,
            `<div class="issue-type ${ticket.ticket_type.toLowerCase()}"><span class="circle"></span>${ticket.ticket_type}</div>`,
            ticket.name,
            ticket.phone_number,
            ticket.complain_raised_date,
            ticket.city,
        ]).draw(false).node();

        $(rowNode).find('td:first').addClass('details-control');
    }

    // Function to format each row with expandable details
    function format(rowData) {
        console.log(rowData.ticket_id); // Log the ticket ID
    
        // Escape function to prevent XSS attacks
        function escapeHTML(html) {
            const text = document.createTextNode(html);
            const div = document.createElement('div');
            div.appendChild(text);
            return div.innerHTML;
        }
    
        return `
            <tr class="collapse-content details-row">
                <td colspan="8">
                    <div class="row">
                        <div class="col-md-1"></div>
                        <div class="col-md-4">
                            <strong>Customer Address</strong>
                            <p>${escapeHTML(rowData.street || 'No address available')}, ${escapeHTML(rowData.city || 'N/A')}, ${escapeHTML(rowData.zip || 'N/A')}, ${escapeHTML(rowData.state || 'N/A')}</p>
                            <label class="mt-3 d-flex justify-content-left"><strong>Employee Name</strong></label>
                            <select class="form-select employee-select mt-2" id="employee-select-${rowData.ticket_id}">
                                ${employeeOptions}
                            </select>
                            <small>Pending work: ${rowData.employees?.[0]?.pending || 'N/A'}</small>
                        </div>
                        <div class="col-md-6">
                            <strong>Description:</strong>
                            <p>${escapeHTML(rowData.description || 'No description available')}</p>
                            <div class="image-gallery d-flex justify-content-center">
                                <img src="images/profile img.png" alt="Image for ticket" width="100px">
                                <div class="image-container">
                                    <img src="images/profile img.png" alt="Additional image for ticket" width="100px">
                                    <div class="overlay">+3</div>
                                </div>
                            </div> 
                            
                            <div class="mt-3 mb-3">
                            <button type="button" class="btn-yes" onclick="handleAssign('${cid}', ${rowData.ticket_id})">Assigned</button>
                                <button type="button" class="btn-no">Reject</button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`;
    }
    
    // Expand row details on click
    $('#ticketTable tbody').on('click', 'td.details-control', function () {
        const tr = $(this).closest('tr');
        const row = table.row(tr);
        const ticket_id = tr.find('td:nth-child(2)').text();
        const details = rowDetails.find(detail => detail.ticket_id == ticket_id);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        } else {
            row.child(format(details)).show();
            tr.addClass('shown');
        }
    });




    // Function to create and append the card for mobile view
    function addCard(employee) {
        const cardHtml = `
        <div class="card mb-3">
            <div class="card-body">
                <p><strong>Name:</strong> ${employee.name}</p>
                <p><strong>Ticket ID:</strong> ${employee.ticket_id}</p>
                <p><strong>Issue Type:</strong> ${employee.ticket_type}</p>
                <p><strong>Date:</strong> ${employee.complain_raised_date}</p>
                <p><strong>Phone:</strong> ${employee.phone_number}</p>
                <p><strong>City:</strong> ${employee.city}</p>
                <p class="text-center mb-2 showMoreButton">Show more ⮟</p>
                <div class="show-more" style="display:none">
                    <p><strong>Address:</strong> ${employee.street}, ${employee.city}, ${employee.zip}</p>
                    <p><strong>Description:</strong> ${employee.description}</p>
                    <p><strong>Employee:</strong>
                        <select class="form-select employee-select">
                            ${employeeOptions}
                        </select>
                    </p>
                    <div class="image-gallery d-flex justify-content-center">
                        <img src="images/profile img.png" alt="Image 1" width="100px">
                        <div class="image-container">
                            <img src="images/profile img.png" alt="Image 1" width="100px">
                            <div class="overlay">+3</div>
                        </div>
                    </div>
                    <p class="text-center pt-3 mb-2 showLessButton">Show less ⮝</p>
                </div>
            </div>
        </div>`;

        $('#card-container').append(cardHtml);
    }

    // Show more functionality
    $(document).on('click', '.showMoreButton', function () {
        $(this).closest('.card-body').find('.show-more').slideDown();
        $(this).hide();
    });

    $(document).on('click', '.showLessButton', function () {
        $(this).closest('.card-body').find('.show-more').slideUp();
        $(this).closest('.card-body').find('.showMoreButton').show();
    });
});


async function assignedEmployee(cid, employee_id, ticket_id) {
    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex';
    console.log(employee_id)
    const assignAPI = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/approve_ticket/${cid}/${ticket_id}/${employee_id}`;
    
    try {
        const response = await fetch(assignAPI, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error: ${response.status} - ${errorMessage}`);
          
        }
        
        const data = await response.json();
        console.log("Employee assigned successfully:", data);
        loadingIndicator.style.display = 'none';
    } catch (error) {
        console.error("Failed to assign employee:", error.message);
        loadingIndicator.style.display = 'none';
    }
}



// Function to handle assignment
function handleAssign(cid, ticketId) {
    const selectElement = document.getElementById(`employee-select-${ticketId}`);
    const selectedValue = selectElement.value;

    // Ensure ticketId is a number, if not, convert it to a valid format
    const ticketIdInt = parseInt(ticketId, 10);
    if (isNaN(ticketIdInt)) {
        console.error(`Invalid ticket ID: ${ticketId}`);
        return; // Prevent the function from proceeding
    }

    assignedEmployee(cid, selectedValue, ticketIdInt);
}

