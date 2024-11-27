$(document).ready(function () {
    const cid = localStorage.getItem("cid");
    const eid = localStorage.getItem("eid");
    const CName = localStorage.getItem("CName")
    document.getElementById("CName").innerHTML = CName;
    document.getElementById("e_name").innerHTML = localStorage.getItem("e_name");

    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employees/completed_tickets/${cid}/${eid}`;
    let rowDetails = [];
    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex'; // Show loading before fetch

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
            `<span class="assigned-employee" data-old-emp="${ticket.employee_id}">${ticket.name}</span>`
        ]).draw(false).node();
        $(rowNode).find('td:first').addClass('details-control');
    }


    function format(rowData) {
        const workStartedTime = new Date(rowData.work_started_time).toISOString().split('T')[0];
        const workEndedTime = new Date(rowData.work_ended_time).toISOString().split('T')[0];
        console.log(workStartedTime)
        console.log(rowData)
        return `
            <tr class="collapse-content details-row">
                <td colspan="8">
                    <div class="row">
                        <div class="col-md-1"></div>
                        <div class="col-md-4" >
                            <strong class="d-flex justify-content-left">Customer Address</strong>
                            <p class="pt-2" style="font-size: 13px; text-align: left;">
                                ${rowData.street}, ${rowData.city}, ${rowData.zip}, ${rowData.state}
                            </p>
                            
                            <div class="input-container mt-3" style="text-align:left !important">
                                <label for="start-time">Work started time:</label>
                                <input type="datetime-local" class="input-bottom-border mt-2" style="background:transparent"
                                    id="start-time-${rowData.ticket_id}" 
                                    value="${rowData.work_started_time}">
                            </div>


                            <div class="input-container mt-3" style="text-align:left !important">
                                <label for="end-time">Work ended time :</label>
                                <input type="datetime-local" class="input-bottom-border mt-2" style="background:transparent"
                                    id="start-time-${rowData.ticket_id}" 
                                    value="${rowData.work_ended_time}">                                
                            </div>                             
                        </div>
                        <div class="col-md-1"></div>
                        <div class="col-md-6">
                            <strong>Description:</strong>
                            <p class="description">${rowData.description}</p>
                          <div class="image-gallery row g-2 justify-content-center">
                            <!-- Upload 1 -->
                            
                                     ${rowData.photo_1 ? `
                                            <div class="col-4 col-sm-3 col-md-2">
                                            <div class="uploads position-relative border" style="width: 100%; height: 100px;">
                                            <img id="image-preview1-${rowData.ticket_id}-${rowData.id}" src="${rowData.photo_1}"  alt="Uploaded Image" class="w-100 h-100" 
                                                style="object-fit: cover;" />
                                            </div>
                                            </div>
                                        ` : `
            
                                    `}
                                <!-- Upload 2 -->
        
                                    ${rowData.photo_2 ? `
                                    <div class="col-4 col-sm-3 col-md-2">
                                    <div class="uploads position-relative border" style="width: 100%; height: 100px;">
                                    <img id="image-preview2-${rowData.ticket_id}-${rowData.id}" src="${rowData.photo_2}" alt="Uploaded Image" class="w-100 h-100" 
                                    style="object-fit: cover;" />
                                    </div>
                                    </div>
                                ` : `  `}
                        
                                    <!-- Upload 3 -->
                        
                                    ${rowData.photo_3 ? `
                                    <div class="col-4 col-sm-3 col-md-2">
                                    <div class="uploads position-relative border" style="width: 100%; height: 100px;">
                                    <img id="image-preview3-${rowData.ticket_id}-${rowData.id}"src="${rowData.photo_3}" 
                                    alt="Uploaded Image" class="w-100 h-100" style="object-fit: cover;"/>
                                    </div>
                                    </div>
                                ` : ` `} 
                            
                             
                        </div>

                    </div>
                </td>
            </tr>`;
    }
    

    // Toggle arrow
    $(document).on('click', 'td.details-control', function () {
        $(this).toggleClass('active');
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

    // Handle the reassign button click
    $('#ticketTable tbody').on('click', '.btn-reassign', async function () {
        const detailsRow = $(this).closest('.details-row');
        const ticketID = detailsRow.closest('tr').prev().find('#ticketId').text();
        const newEmployeeID = detailsRow.find('.employee-select').val();
        const oldEmployeeID = detailsRow.closest('tr').prev().find('.assigned-employee').data('old-emp');

        const requestBody = {
            ticket_id: ticketID,
            assigned_employee: newEmployeeID,
            old_employee: oldEmployeeID
        };

        try {
            const response = await fetch(`https://your-api-url.com/update_assigned_employee/${ticketID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            detailsRow.find('.assigned-employee').text(newEmployeeID);
        } catch (error) {
            console.error("Failed to reassign employee:", error.message);
        }
    });

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
                        <select class="form-select mt-2 employee-select">
                            <option value="ganesh">Mani</option>
                            <option value="saab">Arunkumar</option>
                            <option value="mercedes">Sakthi</option>
                            <option value="audi">Logeshwari</option>
                        </select>
                    </p>
                    <p><strong>Customer Address:</strong> ${employee.street}, ${employee.city}, ${employee.zip}</p>
                    <p><strong>Description:</strong> ${employee.description}</p>
                    <p class="text-center"><strong>Employee:</strong> ${employee.name}</p>
                    <div class="image-gallery d-flex flex-row justify-content-center">
                        <div class="image-container d-flex flex-row justify-content-center">

                         ${employee.photo_1 ? ` <img src="${employee.photo_1}" alt="Image 1" class="p-2" width="100px">`: ``}   
                           ${employee.photo_2 ? ` <img src="${employee.photo_2}" alt="Image 1" class="p-2" width="100px">`: ``} 
                           ${employee.photo_3 ? ` <img src="${employee.photo_3}" alt="Image 1" class="p-2" width="100px">`: ``} 
                        </div>
                    </div>
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
        sidebar.classList.toggle('collapsed');
        content.classList.toggle("container-sty-collapsed")

        tableOddRows.forEach(row => {
            row.classList.toggle("table-row-collapsed")
        })
        tableEvenRows.forEach(row => {
            row.classList.toggle("table-row-collapsed")
        })
        issueType.forEach(row => {
            row.classList.toggle("table-row-collapsed")
        })
        mainContents.forEach(content => {
            content.classList.toggle("card-collapsed")
        })

        tHead.classList.toggle("table-head")
        tHeadCells.forEach(cell => {
            cell.classList.toggle("table-head")
        })
    })
});


function disable(ticket_id) {
    document.getElementById(`reassign-${ticket_id}`).style.display = "none";
    document.querySelector(`.employee-select-${ticket_id}`).disabled = false;
    document.getElementById(`conform-${ticket_id}`).style.display = "block";
}
