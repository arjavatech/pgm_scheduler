document.addEventListener('DOMContentLoaded', viewcompanydetails);

function viewcompanydetails() {
    const tableBody = document.querySelector("#employeeTableBody");

    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/tickets/unassigned/ShddWeFGFGkk9b67STTJY4`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Store the fetchxed data
            let employeesData = data;
            console.log(employeesData)

            // Clear the existing table body content
            tableBody.innerHTML = '';

            let index = 0;
            // Populate the table body with fetched data
            employeesData.forEach((employee) => {
                const tableRow = `
                <tr data-bs-toggle="collapse" data-bs-target="#${index}" class="clickable main-row">
                <td class="details-control"></td>
                <td>${employee.ticket_id}</td>
                <td>
                    <div class="issue-type ${employee.ticket_type}"><span class="circle"></span>${employee.ticket_type}</div>
                </td>
                <td>${employee.name}</td>
                <td>${employee.phone_number}</td>
                <td>${employee.complain_raised_date}</td>
                <td>${employee.city}</td>
            </tr>
                <tr id="${index}" class="collapse collapse-content details-row">
                <td colspan="8">
                    <div class="row">
                        <div class="col-md-1"></div>
                        <div class="col-md-4">
                            <strong class="d-flex justify-content-left">Customer Address</strong>
                            <p class="pt-2" style="font-size: 13px; text-align: left;">${employee.street},${employee.city},${employee.zip},${employee.zip}</p>
                            <label class="mt-3 d-flex justify-content-left">Employee Name</label>
                            <small>Pending work: <span class="pending-work">employee.employees[0].pending}</span></small>
                        </div>
                        <div class="col-md-1"></div>
                        <div class="col-md-6">
                            <strong>Description:</strong>
                            <div class="row">
                                <p class="description">${employee.description}</p>
                                <div class="col-6">
                                    <div class="image-gallery">
                                        <img src="images/profile img.png" alt="Image 1" width="100px">
                                        <div class="image-container">
                                            <img src="images/profile img.png" alt="Image 1">
                                            <div class="overlay">+3</div>
                                        </div>
                                        <div class="thumbnail-container" id="additional-images" style="display: none;">
                                            <img src="images/profile img.png" alt="Additional Image 1">
                                            <img src="images/profile img.png" alt="Additional Image 2">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="button-container">
                                        <button class="btn btn-assign" disabled>Assign</button>
                                        <button class="btn btn-reject mt-3">Reject</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>`;
                tableBody.innerHTML += tableRow;
                index++;
            });


            // Initialize DataTable after populating data
            $(document).ready(function () {
                $('#ticketTable').DataTable({
                    // Optional configurations
                    "paging": true,
                    "lengthChange": true,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "responsive": true,

                });
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
        // Add your modify logic here
    });

    // Event listener for Remove button
    $('#ticketTable tbody').on('click', '.remove', function () {
        const row = $(this).closest('tr').prev();
        if (confirm(`Are you sure you want to remove employee: ${row.find('td:eq(2)').text()}?`)) {
            table.row(row).remove().draw();
        }
    });
}





