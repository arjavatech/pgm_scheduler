$(document).ready(function () {
    const cid = localStorage.getItem("cid");
    const eid = localStorage.getItem("eid");
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employees/pending_tickets/${cid}/${eid}`;
    let rowDetails = [];

    const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
    loadingIndicator.style.display = 'flex'; // Show loading before fetch
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let index = 0;
            loadingIndicator.style.display = 'none';
            data.forEach(ticket => {
                rowDetails.push(ticket);
                addTicket(ticket);
                addCard(ticket, index); // Pass index for unique IDs
                index++;
            });
        })
        .catch(error => {
            console.error('Error fetching tickets:', error);
            loadingIndicator.style.display = 'none'; // Hide loading indicator in case of an error
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
            ticket.ticket_id,
            `<div class="issue-type ${ticket.ticket_type.toLowerCase()}"><span class="circle"></span>${ticket.ticket_type}</div>`,
            ticket.name,
            ticket.phone_number,
            ticket.complain_raised_date,
            ticket.city
        ]).draw(false).node(); // Get the row node after adding

        $(rowNode).find('td:first').addClass('details-control');
    }

    // Format the row details
    function format(rowData) {
        return `
            <tr class="collapse-content details-row">
                <td colspan="8">
                    <div class="row">
                        <div class="col-md-1"></div>
                        <div class="col-md-4">
                            <strong class="d-flex justify-content-left">Customer Address</strong>
                            <p class="pt-2" style="font-size: 13px; text-align: left;">
                                ${rowData.street}, ${rowData.city}, ${rowData.zip}, ${rowData.state}
                            </p>
                        </div>
                        <div class="col-md-1"></div>
                        <div class="col-md-6">
                            <strong>Description:</strong>
                            <p class="description">${rowData.description}</p>
                            <div class="image-gallery d-flex justify-content-center">
                                <img src="../../images/profile img.png" alt="Image 1" width="100px">
                                <div class="image-container d-inline justify-content-center">
                                    <img src="../../images/profile img.png" alt="Image 1" width="100px">
                                    <div class="overlay"  data-bs-toggle="modal"
                                            data-bs-target="#imageModel">+3</div>
                                </div>
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
                    <p><strong>Customer Address:</strong> ${employee.street}, ${employee.city}, ${employee.zip}</p>
                    <p><strong>Description:</strong> ${employee.description}</p>
                    <p class="text-center"><strong>Employee:</strong> ${employee.name}</p>
                    <div class="image-gallery d-flex justify-content-center">
                        <img src="images/profile img.png" alt="Image 1" width="100px">
                        <div class="image-container d-inline justify-content-center">
                            <img src="images/profile img.png" alt="Image 1" width="100px">
                            <div class="overlay"  data-bs-toggle="modal"
                                            data-bs-target="#imageModel">+3</div>
                        </div>
                    </div>
                    <p class="text-center pt-3 mb-2 showLessButton">show less ⮝</p>             
                </div>
                 <div class="d-flex justify-content-center align-items-center">
                    <input type="text" placeholder="Reason" class="input-bottom-reson mt-3" id="reason-${employee.ticketID}" style="display:none">
                </div>
                
                <div class="d-flex justify-content-center align-items-center mt-3">
                    <div class="row" id="acceptButton-${employee.ticket_id}">
                        <div class="col-md-6 d-flex justify-content-center">
                            <button class="form-control mt-2 employee-select comform" style="width:250px" id="completed">Accept</button>
                        </div>
                        <div class="col-md-6 d-flex justify-content-center">
                            <button class="form-control mt-2 employee-select cancel" style="width:250px" onclick="reason('${employee.ticket_id}')" id="cancel">Reject</button>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-center align-items-center mt-3" >
                    <div class="row" id="comformButton-${employee.ticket_id}" style="display:none">
                        <div class="col-md-6 d-flex justify-content-center">
                            <button class="form-control mt-2 employee-select comform" style="width:250px" id="completed">Confirm</button>
                        </div>
                        <div class="col-md-6 d-flex justify-content-center">
                            <button class="form-control mt-2 employee-select cancel" style="width:250px" onclick="cancel('${employee.ticket_id}')"  id="cancel">Cancel</button>
                        </div>
                    </div>
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
        cardBody.find('.showMoreButton').show(); // Show "show more" button again
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

    // Show the reason input field and toggle visibility
    function reason(ticketID) {
        document.getElementById(`reason-${ticketID}`).style.display = 'block';
        document.getElementById(`acceptButton-${ticketID}`).style.display = 'none';
        document.getElementById(`comformButton-${ticketID}`).style.display = 'flex';
    }
    
    function cancel(ticketID) {
        document.getElementById(`reason-${ticketID}`).style.display = 'none';
        document.getElementById(`acceptButton-${ticketID}`).style.display = 'flex';
        document.getElementById(`comformButton-${ticketID}`).style.display = 'none';
    }


// // Function to format row details
// function format(rowData) {
//     return `
//         <div class="collapse-content details-row" data-ticket-id="${rowData.ticket_id}">
//             <td colspan="8">
//                 <div class="row">
//                     <div class="col-md-1"></div>
//                     <div class="col-md-4">
//                         <strong class="d-flex justify-content-left">Customer Address</strong>
//                         <p class="pt-2" style="font-size: 13px;text-align: left;">${rowData.street}, ${rowData.city}, ${rowData.zip}, ${rowData.state}</p>
//                     </div>
//                     <div class="col-md-1"></div>
//                     <div class="col-md-6">
//                         <strong class="d-flex justify-content-left">Description:</strong>
//                         <p class="pt-2" style="font-size: 13px;text-align: left;">${rowData.description}</p>
//                     </div>
//                 </div>                
//                 <div class="d-flex justify-content-center align-items-center">
//                     <input type="text" placeholder="Reason" class="input-bottom-reson mt-3" id="reason-${rowData.ticketID}" style="display:none">
//                 </div>
                
//                 <div class="d-flex justify-content-center align-items-center mt-3">
//                     <div class="row" id="acceptButton-${rowData.ticket_id}">
//                         <div class="col-md-6 d-flex justify-content-center">
//                             <button class="form-control mt-2 employee-select comform" style="width:250px" id="completed">Accept</button>
//                         </div>
//                         <div class="col-md-6 d-flex justify-content-center">
//                             <button class="form-control mt-2 employee-select cancel" style="width:250px" onclick="reason('${rowData.ticket_id}')" id="cancel">Reject</button>
//                         </div>
//                     </div>
//                 </div>

//                 <div class="d-flex justify-content-center align-items-center mt-3" >
//                     <div class="row" id="comformButton-${rowData.ticket_id}" style="display:none">
//                         <div class="col-md-6 d-flex justify-content-center">
//                             <button class="form-control mt-2 employee-select comform" style="width:250px" id="completed">Confirm</button>
//                         </div>
//                         <div class="col-md-6 d-flex justify-content-center">
//                             <button class="form-control mt-2 employee-select cancel" style="width:250px" onclick="cancel('${rowData.ticket_id}')"  id="cancel">Cancel</button>
//                         </div>
//                     </div>
//                 </div>
//             </td>
//         </div>
//     `;
// }

