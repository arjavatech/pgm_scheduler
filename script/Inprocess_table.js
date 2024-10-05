document.addEventListener('DOMContentLoaded', viewcompanydetails);

function viewcompanydetails() {
    const tableBody = document.querySelector("#employeeTableBody");

    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/tickets/inprogress/ShddWeFGFGkk9b67STTJY4`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let employeesData = data;
            console.log(employeesData);

            let index = 0;
            employeesData.forEach((employee) => {
                const tableRow = `
                        <tr data-bs-toggle="collapse" data-bs-target="#${index}" class="clickable main-row">
                            <td class="details-control"></td>
                            <td>${employee.ticket_id}</td>
                            <td>
                                <div class="issue-type ${employee.ticket_type}"><span class="circle"></span>${employee.ticket_type}
                                </div>
                            </td>
                            <td>${employee.name}</td>
                            <td>${employee.phone_number}</td>
                            <td>${employee.complain_raised_date}</td>
                            <td>${employee.city}</td>
                            <td>${employee.city}</td>
                        </tr>
                        <tr id="${index}" class="collapse collapse-content details-row">
                            <td colspan="8">
                                <div class="row">
                                    <div class="col-md-1"></div>
                                    <div class="col-md-4">
                                        <strong class="d-flex justify-content-left">Customer Address</strong>
                                        <p class="pt-2" style="font-size: 13px; text-align: left;">${employee.street}, ${employee.city}, ${employee.zip}</p>
                                        <label class="mt-3 d-flex justify-content-left">Employee Name</label>
                                        <small>Pending work: <span class="pending-work">${employee.employees ? employee.employees[0].pending : 'N/A'}</span></small>
                                    </div>
                                    <div class="col-md-1"></div>
                                    <div class="col-md-6">
                                        <strong>Description:</strong>
                                        <p class="description">${employee.description}</p>
                                    </div>
                                </div>
                            </td>
                        </tr>`;
                tableBody.innerHTML += tableRow;
                index++;
            });

            // Initialize DataTable after populating data
            $('#ticketTable').DataTable({
                paging: true,
                lengthChange: true,
                searching: true,
                ordering: true,
                info: true,
                autoWidth: false,
                responsive: true,
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });

    // Add event listener for opening and closing details in the table
    $('#ticketTable tbody').on('click', 'tr.clickable', function () {
        const target = $(this).data('bs-target');
        $(target).collapse('toggle');
    });

    // Event listener for Modify button
    $('#ticketTable tbody').on('click', '.modify', function () {
        const row = $(this).closest('tr').prev();
        alert(`Modify clicked for employee: ${row.find('td:eq(2)').text()}`);
    });

    // Event listener for Remove button
    $('#ticketTable tbody').on('click', '.remove', function () {
        const row = $(this).closest('tr').prev();
        if (confirm(`Are you sure you want to remove employee: ${row.find('td:eq(2)').text()}?`)) {
            const table = $('#ticketTable').DataTable();
            table.row(row).remove().draw();
        }
    });
}