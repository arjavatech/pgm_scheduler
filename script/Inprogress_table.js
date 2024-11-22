var emp_details_map;

$(document).ready(function () {
    const cid = localStorage.getItem("cid");
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/tickets/inprogress/${cid}`;
    const CName = localStorage.getItem("CName")
        console.log(cid)
        console.log(CName)

        document.getElementById("CName").innerHTML = CName;
    let rowDetails = [];
    // let employeeOptions = ""; // Declare employeeOptions globally

    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex'; // Show loading before fetch

    // Fetch employee data for the select options
    const employeeUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee_based_pending_works_count/${cid}`;
    fetch(employeeUrl)
        .then(response => response.json())
        .then(data => {
            // Populate global employeeOptions for use in both addCard and format
            emp_details_map = data;

        })
        .catch(error => console.error('Error fetching employees:', error));


    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            rowDetails.push(...data);
            data.forEach(ticket => {
                addTicket(ticket);
                addCard(ticket);
            });
            loadingIndicator.style.display = 'none'; // Hide loading after processing
        })
        .catch(error => {
            console.error('Error fetching tickets:', error);
            loadingIndicator.style.display = 'none'; // Hide loading on error
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
            `<span></span>`, // Control for expanding the row
            `<span id="ticketId">${ticket.ticket_id}</span>`,
            `<div class="issue-type ${ticket.ticket_type}"><span class="circle"></span>${ticket.ticket_type}</div>`,
            ticket.name,
            ticket.phone_number,
            ticket.complain_raised_date,
            ticket.city,
            `<span class="assigned-employee" data-old-emp="${ticket.employee_id}">${ticket.first_name} ${ticket.last_name}</span>`
        ]).draw(false).node();
        $(rowNode).find('td:first').addClass('details-control');
    }

    

    function format(rowData) {
        return `
            <tr class="collapse-content details-row">
                <td colspan="8">
                    <div class="row">
                    <div class="col-md-1"></div>
                        <div class="col-md-4">
                            <strong>Customer Address</strong>
                            <p>${rowData.street}, ${rowData.city}, ${rowData.zip}, ${rowData.state}</p>
                            <label>Employee Name</label>
                            <select class="form-select mt-2 employee-select employee-select-${rowData.ticket_id}" id="employee-select-${rowData.ticket_id}" disabled>
                            <option  disabled selected>${rowData.first_name} ${rowData.last_name}</option>
                            ${employee_det_options_get(rowData.ticket_type)}
                            </select>
                             <small id="pending-count-${rowData.ticket_id}">Pending work: </small>
                        </div>
                        <div class="col-md-1"></div>
                        <div class="col-md-6">
                            <strong>Description:</strong>
                            <p>${rowData.description}</p>
                            <div class="image-gallery d-flex justify-content-center">
                                <img src="images/profile img.png" alt="Image 1" width="100px">
                                <div class="image-container d-inline justify-content-center">
                                    <img src="images/profile img.png" alt="Image 1" width="100px">
                                    <div class="overlay" data-bs-toggle="modal"
                                         data-bs-target="#imageModel">+3</div>
                                </div>
                            <button class="btn-yes btn-reassign" id="reassign-${rowData.ticket_id}" onclick="disable(${rowData.ticket_id})">Reassign</button>
                            <button class="btn-yes btn-confirm" id="confirm-${rowData.ticket_id}" style="display:none" onclick="handleConfirm('${rowData.employee_id}', ${rowData.ticket_id})">Confirm</button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`;
    }


    function employee_det_options_get(ticketType)
    {
        var employeeOptions = emp_details_map[ticketType].map(employee =>
                
            `<option pending="${employee.no_of_pending_works}" value="${employee.employee_id}" ${employee.no_of_pending_works > 3 ? 'disabled' : ''}>${employee.employee_name}</option>`
        ).join("");

        return employeeOptions;
    }
    
    
    // Toggle arrow
    $(document).on('click', 'td.details-control', function () {
        $(this).toggleClass('active');
    });


    $(document).on('change', '.employee-select', function () {
        const selectedOption = $(this).find(':selected');
        const pendingWork = selectedOption.attr('pending');
        const ticketId = $(this).attr('id').split('-')[2];
        console.log(ticketId) // Extract ticket ID from select element ID
        $(`#pending-count-${ticketId}`).text(`Pending work: ${pendingWork || 'N/A'}`);
    });

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

    // Helper function to get pending work count for an employee
function getPendingWorkCount(employeeId) {
    const employee = data.find(emp => emp.employee_id === employeeId);
    return employee ? employee.pending : 'N/A';
}


    // card part
    // Function to create and append the card for mobile view
    function addCard(employee) {
        const cardHtml = `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-6">
                        <p><strong>Name </strong>  ${employee.name}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Ticket ID </strong>  ${employee.ticket_id}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Issue type </strong>  ${employee.ticket_type}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Date </strong>  ${employee.complain_raised_date}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Phone </strong> ${employee.phone_number}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>City:</strong> ${employee.city}</p>
                    </div>
                </div>
                <p class="text-center mb-2 showMoreButton">show more ⮟</p>     
                <div class="show-more" style="display:none">
                    <p><strong>Employee Name:</strong>
                        <select class="form-select mt-2 employee-select employee-select-${employee.ticket_id}" id="employee_select-${employee.ticket_id}" disabled>
                        ${employee_det_options_get(employee.ticket_type)}
                    </select>
                    </p>
                    <p><strong>Customer Address:</strong> ${employee.street}, ${employee.city}, ${employee.zip}</p>
                    <p><strong>Description:</strong> ${employee.description}</p>
                    <p class="text-center"><strong>Employee:</strong> ${employee.first_name}</p>
                    <div class="image-gallery d-flex justify-content-center">
                        <img src="images/profile img.png" alt="Image 1" width="100px">
                        <div class="image-container d-inline justify-content-center">
                            <img src="images/profile img.png" alt="Image 1" width="100px">
                            <div class="overlay"  data-bs-toggle="modal"
                                            data-bs-target="#imageModel">+3</div>
                        </div>
                    </div>
                    <button class="btn-yes mt-4" id="reassign-${employee.ticket_id}" onclick="disable2(${employee.ticket_id})" style="width:100%">Reassign</button>
                    <button class="btn-yes btn-reassign mt-4" id="confirm-${employee.ticket_id}" style="display:none;width:100%" onclick="handleConfirm('${employee.employee_id}', ${employee.ticket_id})">Confirm</button>
                    <p class="text-center pt-3 mb-2 showLessButton">show less ⮝</p>             
                </div>
            </div>
        </div>
        `;

        // Append the card to the card container for mobile view
        $('#card-container').append(cardHtml);
    }

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
        var select = document.querySelector(".employee-select")
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

            select.style.backgroundColor = "transparent";
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
            select.disabled = false;
        }
    });
});


function disable(ticket_id) {
    document.getElementById(`reassign-${ticket_id}`).style.display = "none";
    document.querySelector(`.employee-select-${ticket_id}`).disabled = false;
    document.getElementById(`confirm-${ticket_id}`).style.display = "block";
}

function disable2(ticket_id) {
    document.getElementById(`reassign-${ticket_id}`).style.display = "none";
    document.querySelector(`.employee-select-${ticket_id}`).disabled = false;
    document.getElementById(`confirm-${ticket_id}`).style.display = "block";
}

async function handleConfirm(old_eid, ticketId) {
    const cid = localStorage.getItem("cid");
    const selectElement = document.getElementById(`employee_select-${ticketId}`);
    const selectedValue = selectElement.value;
    const requestBody = {
        company_id: cid,
        ticket_id: ticketId,
        new_employee_id: selectedValue,
        old_employee_id: old_eid
    };

    if(selectedValue != old_eid)
    {
        const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex';
    const assignAPI = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/reassign_ticket`;
    
    try {
        const response = await fetch(assignAPI, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            loadingIndicator.style.display = 'none';
            const errorMessage = await response.text();
            throw new Error(`Error: ${response.status} - ${errorMessage}`);
          
        }
        
        const data = await response.json();

        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            window.location.href = 'In-Progress.html';
        }, 1000);

    } catch (error) {
        console.error("Failed to assign employee:", error.message);
        loadingIndicator.style.display = 'none';
    }
    }

}