document.addEventListener('DOMContentLoaded', viewcompanydetails);

function viewcompanydetails() {
    const tableBody = document.getElementById("tBody");
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/company/getall`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            employeesData = data;
            tableBody.innerHTML = ''; // Clear any previous rows

            // Populate the table
            employeesData.forEach(element => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td class="pin-column">${element.company_name}</td>
                    <td class="name-column">${element.phone_number}</td>
                    <td class="phone-column">${element.first_name}</td>
                    <td class="isAdmin">${element.email}</td>
                    <td>
                        <div>
                            <span class="icon" title="Edit" style="cursor: pointer;">
                                <i class="fa fa-pencil" aria-hidden="true" style="color: #006103;"></i>
                            </span>
                            <span class="icon delete-icon" title="Delete" style="cursor: pointer; margin-left: 10px;" data-id="${element.company_id}">
                                <i class="fa fa-trash" aria-hidden="true" style="color: #006103;"></i>

                            </span>
                        </div>
                    </td>
                    <td>
                          <span class="icon " style="cursor: pointer; margin-left: 10px;" data-id="${element.company_id}">
                                <i class="fa-solid fa-paper-plane"></i>

                            </span>
                    </td>
                `;
                tableBody.appendChild(newRow);
            });

            // Initialize DataTable after populating data
            $(document).ready(function () {
                $('#ticketTable').DataTable({
                    "paging": true,
                    "lengthChange": true,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "responsive": true,
                });
            });

            // Event listener for deleting a company
            tableBody.addEventListener('click', function (event) {
                if (event.target.closest('.delete-icon')) {
                    const deleteIcon = event.target.closest('.delete-icon');
                    const companyId = deleteIcon.getAttribute('data-id');
                    const rowToDelete = deleteIcon.closest('tr');

                    if (confirm('Are you sure you want to delete this company?')) {
                        // Send PUT request to delete the company
                        fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/company/delete/${companyId}`, {
                            method: 'PUT',
                           
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Error: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(() => {
                            rowToDelete.remove();
                        })
                        .catch(error => {
                            console.error('Delete error:', error);
                            alert('Failed to delete the company.');
                        });
                    }
                }
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

document.getElementById('sidebarToggle').addEventListener('click', function () {
    var sidebar = document.getElementById('left');
    sidebar.classList.toggle('active');
});
