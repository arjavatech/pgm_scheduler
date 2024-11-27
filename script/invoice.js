
$(document).ready(function () {
    let cid = localStorage.getItem("cid");
    console.log(cid)
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/tickets/invoice/${cid}`;
    let rowDetails = [];
    const CName = localStorage.getItem("CName")


    document.getElementById("CName").innerHTML = CName;
    const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
    loadingIndicator.style.display = 'flex'; // Show loading before fetch
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            loadingIndicator.style.display = 'none';
            if (!(data.detail)) {
                console.log("yes")
                data.forEach(ticket => {
                    rowDetails.push(ticket);
                    addTicket(ticket);
                    addCard(ticket); // Add the card for mobile view
                });

            }
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
            `<div class="issue-type ${ticket.ticket_type}"><span class="circle"></span>${ticket.ticket_type}</div>`,
            ticket.name,
            ticket.phone_number,
            ticket.complain_raised_date,
            ticket.city,
            `<span class="assigned-employee">${ticket.first_name} ${ticket.last_name}</span>` // Assigned employee
        ]).draw(false).node(); // Get the row node after adding

        $(rowNode).find('td:first').addClass('details-control');
    }

    // Function for toggle arrow 
    $(document).on('click', 'td.details-control', function () {
        $(this).toggleClass('active');
    });

    // Format the row details
    function format(rowData) {


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
                            <br>
                               <button 
    type="button" 
    class="btn-yes btn-reassign" 
    data-bs-toggle="modal" 
    data-bs-target="#InvoiceModal"
    onclick="createInvoiceModal('${rowData.id}','${rowData.ticket_id}','${rowData.employee_id}')"> <!-- Pass the ticketID dynamically -->
    Generate Invoice
</button>

                            
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
        const workStartedTime = new Date(employee.work_started_time).toISOString().split('T')[0];
        const workEndedTime = new Date(employee.work_ended_time).toISOString().split('T')[0];
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
                <p class="text-center mb-2 showMoreButton">show more &#9660;</p>
                <div class="show-more" style="display:none">
                    <p><strong>Customer Address:</strong> ${employee.street}, ${employee.city}, ${employee.zip}</p>
                    <p><strong>Description:</strong> ${employee.description}</p>
                    <div class="input-container mt-3" style="text-align:left !important">
                                <label for="start-time">Work started time:</label>
                                <input type="datetime-local" class="input-bottom-border"
                                    id="start-time-${employee.ticket_id}" 
                                    value="${employee.work_started_time}">
                            </div>
                            <div class="input-container mt-3" style="text-align:left !important">
                                <label for="end-time">Work ended time :</label>
                                <input type="datetime-local" class="input-bottom-border"
                                    id="start-time-${employee.ticket_id}" 
                                    value="${employee.work_started_time}">
                            </div>
                    <div class="image-gallery d-flex justify-content-center mt-3">
                          <div class="image-container d-flex flex-row justify-content-center">

                         ${employee.photo_1 ? ` <img src="${employee.photo_1}" alt="Image 1" class="p-2" width="100px">` : ``}   
                           ${employee.photo_2 ? ` <img src="${employee.photo_2}" alt="Image 1" class="p-2" width="100px">` : ``} 
                           ${employee.photo_3 ? ` <img src="${employee.photo_3}" alt="Image 1" class="p-2" width="100px">` : ``} 
                        </div>
                    </div>
                    <button type="button" id="invoice" class="btn-yes btn-reassign mt-3" style="width:100%" data-bs-toggle="modal" data-bs-target="#InvoiceModal">
                        Generate Invoice
                    </button>
                    <p class="text-center pt-3 mb-2 showLessButton">show less &#9650;</p>       
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

});



function createInvoiceModal(tockenID, ticketID, eid) {
    // Check if the modal already exists
    let existingModal = document.getElementById("InvoiceModal");
    if (existingModal) {
        existingModal.remove(); // Remove existing modal if any
    }

    // Create modal container
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "InvoiceModal";
    modal.tabIndex = "-1";
    modal.setAttribute("aria-labelledby", "InvoiceModalLabel");
    modal.setAttribute("aria-hidden", "true");

    // Add modal dialog
    modal.innerHTML = `
<div class="modal-dialog modal-dialog-centered">
<div class="modal-content custom-modal-content">
    <div class="modal-body custom-modal-body">
        <h5 class="modal-title pt-2 pt-3" id="InvoiceModalLabel" style="font-weight: 600;">
            Generate Invoice
        </h5>
        <textarea placeholder="Description" class="input-bottom-border mb-4 mt-4"
            style="background-color: transparent;" rows="1"></textarea>
<input 
                    id="amountInput" 
                    placeholder="Amount" 
                    type="number" 
                    class="input-bottom-border mb-4" 
                    style="background-color: transparent;" />


        <div class="d-flex justify-content-center mt-2 mb-4">
            <button type="submit" class="btn-green btn btn-reassign" style="width: 90% !important;background: #004102 !important;
    color: white !important;
    padding: 6px !important;
    border-radius: 10px !important;
    font-size: medium !important;" 
                onclick="handlePayment('${tockenID}','${ticketID}','${eid}')">Pay</button>
        </div>
    </div>
</div>
</div>
`;

    // Append modal to the body
    document.body.appendChild(modal);

    // Show the modal
    const modalElement = new bootstrap.Modal(document.getElementById("InvoiceModal"));
    modalElement.show();
}

document.getElementById("amountInput").addEventListener("input", function (e) {
    // Allow only digits by replacing non-numeric characters
    this.value = this.value.replace(/[^0-9]/g, '');


    // Allow: Backspace, Delete, Tab, Escape, Enter, and Arrow keys
    if (
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "Tab" ||
        e.key === "Escape" ||
        e.key === "Enter" ||
        (e.key >= "0" && e.key <= "9") || // Allow numbers
        (e.key === "ArrowLeft" || e.key === "ArrowRight") // Allow navigation
    ) {
        return; // Let it happen
    }

    // Block any other key presses (non-numeric)
    e.preventDefault();
});


// Example of handling payment button click
async function handlePayment(tockenID, ticket_id, eid) {

    console.log(tockenID)
    const cid = localStorage.getItem("cid");



    const description = document.querySelector("#InvoiceModal textarea").value;
    const amount = getAmountAsInteger(); // Convert amount to integer


    if (!description || !amount) {
        alert("Please fill in all fields.");
        return;
    }


    const payment = parseInt(amount); // Ensure the amount is treated as a number
    const paymentDescription = description;

    const datas = {
        payment: `$${payment}`,
        payment_description: paymentDescription,
        status: 4,
        
    }
    console.log(datas)

    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/ticket/update/${ticket_id}`; // Replace with your API endpoint


    try {
        // Make the API call
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datas),
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        // Parse and log the response data
        const data = await response.json();
        console.log('Payment updated successfully:', data);

        // Provide user feedback (optional)
        alert('Payment updated successfully!');

        // Hide the modal
        const modalElement = bootstrap.Modal.getInstance(document.getElementById("InvoiceModal"));
        modalElement.hide();

        return data;
    } catch (error) {
        console.error('Failed to update payment:', error);
        alert(`Failed to update payment: ${error.message}`);
    }
}


async function updateLink(url, id, ticketId, ticketToken) {
    const cid = localStorage.getItem("cid");
    const eid = localStorage.getItem("eid");
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/ticket_status/update/${ticketToken}`;
    const payload = id == 1 ? {
        company_id: cid,
        employee_id: eid,
        ticket_id: parseInt(ticketId),
        photo_1: url
    } : id == 2 ? {
        company_id: cid,
        employee_id: eid,
        ticket_id: parseInt(ticketId),
        photo_2: url
    } : {
        company_id: cid,
        employee_id: eid,
        ticket_id: parseInt(ticketId),
        photo_3: url
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("link data updated")
        } else {
            alert('Error updating link.');
        }
    } catch (error) {
        console.error('Error updating link:', error);
        alert('Error updating link. Check console for details.');
    }
}



// Function to convert the Amount to an integer
function getAmountAsInteger() {
    const inputElement = document.getElementById("amountInput");
    const value = inputElement.value.trim(); // Get value and remove extra spaces

    // Convert to integer, or return null if not valid
    const amount = parseInt(value, 10);

    if (isNaN(amount)) {
        alert("Please enter a valid number.");
        return null; // Return null for invalid input
    }

    return amount;
}



// Example usage
// createInvoiceModal("12345");
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
    var input = document.querySelectorAll(".input-bottom-border")
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
        input.forEach(function (row) {
            row.disabled = true;
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
        input.forEach(function (row) {
            row.disabled = false;
        });
    }
});