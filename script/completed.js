$(document).ready(function () {
    const apiUrl = "https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/tickets/completed/ShddWeFGFGkk9b67STTJY4";
    let rowDetails = [];
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(ticket => {
                rowDetails.push(ticket);
                addTicket(ticket);
                
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
 var t_id;
    // Function to add a ticket to the DataTable
    function addTicket(ticket) {
        t_id=ticket.ticket_id;
        const rowNode = table.row.add([
          ` <span></span>`, // Control for expanding the row
            ticket.ticket_id,
            `<div class="issue-type ${ticket.ticket_type.toLowerCase()}"><span class="circle"></span>${ticket.ticket_type}</div>`,
            ticket.name,
            ticket.phone_number,
            ticket.complain_raised_date,
            ticket.city,
            `<span class="assigned-employee">${ticket.name}</span>` // Placeholder for assigned employee with a class for easy selection
        ]).draw(false).node(); // Get the row node after adding
    
        $(rowNode).find('td:first').addClass('details-control');
    }

    // Format the row details
    function format(rowData) {
        return `
            <tr class="collapse-content details-row" data-ticket-id="${t_id}">
                <td colspan="8">
                            <div class="row">
                                <div class="col-md-1"></div>
                                <div class="col-md-4">
                                    <strong class="d-flex justify-content-left">Customer Address</strong>
                                    <p class="pt-2" style="font-size: 13px; text-align: left;">
                                        ${rowData.street}, ${rowData.city}, ${rowData.zip}
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
            console.log();
            row.child(format(details)).show();
            tr.addClass('shown');
        }
    });
});
