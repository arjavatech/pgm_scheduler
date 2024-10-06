$(document).ready(function () {
    const apiUrl = "https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/tickets/unassigned/ShddWeFGFGkk9b67STTJY4";
    let rowDetails = [];
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(ticket => {
                rowDetails.push(ticket);
                addTicket(ticket);
                addCard(ticket); // Add the card for mobile view
            });
        })
        .catch(error => console.error('Error fetching tickets:', error));

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
            ticket.city,
          
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
                            <label class="mt-3 d-flex justify-content-left">Employee Name</label>
                            <small>Pending work: <span class="pending-work">
                                ${rowData.employees && rowData.employees.length > 0 ? rowData.employees[0].pending : 'N/A'}
                            </span></small>
                        </div>
                        <div class="col-md-1"></div>
                        <div class="col-md-6">
                            <strong>Description:</strong>
                            <p class="description">${rowData.description}</p>
                            <div class="image-gallery d-flex justify-content-center">
                        <img src="images/profile img.png" alt="Image 1" width="100px">
                        <div class="image-container d-inline justify-content-center">
                            <img src="images/profile img.png" alt="Image 1" width="100px">
                            <div class="overlay">+3</div>
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
                <p class="text-center mb-2" onclick="showmore(this)">show more ⮟</p>
                <div class="show-more" style="display:none">
                    <p><strong>Customer Address:</strong> ${employee.street}, ${employee.city}, ${employee.zip}</p>
                    <p><strong>Description:</strong> ${employee.description}</p>
                    <p class="text-center"><strong>Employee:</strong> ${employee.name}</p>
                    <div class="image-gallery d-flex justify-content-center">
                        <img src="images/profile img.png" alt="Image 1" width="100px">
                        <div class="image-container d-inline justify-content-center">
                            <img src="images/profile img.png" alt="Image 1" width="100px">
                            <div class="overlay">+3</div>
                        </div>
                    </div>
                    <p class="text-center pt-3 mb-2" onclick="showless(this)">show less </p>       
                </div>
            </div>
        </div>
        `;

        // Append the card to the card container for mobile view
        $('#card-container').append(cardHtml);
    }

    // Function to show more details in card
    window.showmore = function(button) {
        const showMoreDiv = $(button).next('.show-more');
        showMoreDiv.slideDown(); // Show the additional details
        $(button).hide(); // Hide the "show more" button
    }

    // Function to show less details in card
    window.showless = function(button) {
        const showMoreDiv = $(button).parent('.show-more');
        showMoreDiv.slideUp(); // Hide the additional details
        $(button).show(); // Show the "show more" button again
    }
});
