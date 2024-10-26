const cid = localStorage.getItem("cid");
$(document).ready(function () {
    console.log(cid)
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
                                    <div class="overlay"  data-bs-toggle="modal"
                                            data-bs-target="#imageModel">+3</div>
                                </div>
                            </div> 
                            
                            <div class="mt-3 mb-3">
                            <button type="button" class="btn-yes" onclick="handleAssign('${cid}', ${rowData.ticket_id})">Assigned</button>
                            <button type="button" class="btn-no" onclick="handleReject(${rowData.ticket_id})">Reject</button>
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
                <div class="row">
                    <div class="col-6">
                        <p><strong>Name:</strong> ${employee.name}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Ticket ID:</strong> ${employee.ticket_id}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Issue Type:</strong> ${employee.ticket_type}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Date:</strong> ${employee.complain_raised_date}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Phone:</strong> ${employee.phone_number}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>City:</strong> ${employee.city}</p>
                    </div>
                </div>
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
                            <div class="overlay"  data-bs-toggle="modal"
                                            data-bs-target="#imageModel">+3</div>
                        </div>
                    </div>
                     <div class="mt-3 mb-3  d-flex justify-content-center" style="gap:20px">
                            <button type="button" class="btn-yes">Assigned</button>
                                <button type="button" class="btn-no">Reject</button>
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


async function handleReject(ticketid) {
    // Show loading indicator
    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex';

    // Get today's date in "YYYY-MM-DD" format
    const today = new Date().toISOString().split('T')[0];
    console.log(rowDetails);
    // Find the ticket details from the global rowDetails array
    const details = rowDetails.find(detail => detail.ticket_id === (ticketid));

    if (!details) {
        console.error('Ticket details not found for ticketID:', ticketid);
        loadingIndicator.style.display = 'none';
        return;
    }

    // Define the body content to send, including row details
    const requestBody = {
        "rejected_reason": "xyz",
        "rejected_date": today,
        ...details
    };

    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/admin_reject_ticket/${ticketid}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();
        console.log("Ticket rejected successfully:", data);

        loadingIndicator.style.display = 'none';



    } catch (error) {
        console.error("Failed to reject ticket:", error.message);
        loadingIndicator.style.display = 'none';
    }
}





document.getElementById('sidebarToggle').addEventListener('click', function () {
    var sidebar = document.getElementById('left');
    var body = document.body;
    var mainContents = document.querySelectorAll(".card");
    var content = document.querySelector(".container-sty");
    var tableOddRows = document.querySelectorAll("tr");
    var tableEvenRows = document.querySelectorAll("tr.even");
    var issueType = document.querySelectorAll(".issue-type");
    var tHead = document.querySelector("thead");
    var tHeadCells = document.querySelectorAll("thead th");

    sidebar.classList.toggle('active');

    if (sidebar.classList.contains('active')) {
        // Sidebar is open, apply transparency
        body.classList.add('no-scroll');
        body.classList.add('body-overlay');

        content.style.backgroundColor = "transparent";
        mainContents.forEach(function (mainContent) {
            mainContent.style.backgroundColor = "transparent";
        });
        tableOddRows.forEach(function (row) {
            row.style.cssText = "background-color: transparent !important;"; // Adds !important
        });

        if (tHead) {
            tHead.style.cssText = "background-color: transparent !important;";
        }

        // Apply transparency to each table head cell
        tHeadCells.forEach(function (cell) {
            cell.style.cssText = "background-color: transparent !important;";
        });

        issueType.forEach(function (row) {
            row.style.cssText = "background-color: transparent !important;"; // Adds !important
        });
    } else {
        // Sidebar is closed, reset colors
        body.classList.remove('no-scroll');
        body.classList.remove('body-overlay');

        content.style.backgroundColor = "";
        mainContents.forEach(function (mainContent) {
            mainContent.style.backgroundColor = "";
        });

        tableOddRows.forEach(function (row) {
            row.style.backgroundColor = ""; // Reset odd row background
        });

        tableEvenRows.forEach(function (row) {
            row.style.backgroundColor = ""; // Reset even row background
        });

        if (tHead) {
            tHead.style.backgroundColor = ""; // Reset thead background
        }

        // Reset the background of each table head cell
        tHeadCells.forEach(function (cell) {
            cell.style.backgroundColor = ""; // Reset th background
        });
    }
});
