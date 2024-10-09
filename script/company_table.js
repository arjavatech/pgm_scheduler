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
                            <span class="icon delete-icon" title="Delete" style="cursor: pointer; margin-left: 10px;" data-id="${element.company_id}" email-id="${element.email}">
                                <i class="fa fa-trash" aria-hidden="true" style="color: #006103;"></i>
                            </span>
                        </div>
                    </td>
                    <td>
                       <i class="fa fa-envelope paper-plane" style="color: blue;" ${element.invite_status == "Accepted" ? "disabled" : ""}></i>
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
                    const email = deleteIcon.getAttribute('email-id');

                    // Show confirmation modal instead of using confirm
                    showConfirmModal(() => {
                        // If confirmed, proceed with delete
                        fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/company/delete/${companyId}/${email}`, {
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
                            showAlert('Failed to delete the company.');
                        });
                    });
                }
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
            showAlert('Failed to load company details.');
        });
}

// Function to show the confirmation modal
function showConfirmModal(onConfirm) {
    const confirmModal = document.getElementById('confirmModal');
    const confirmYesBtn = document.getElementById('confirmYesBtn');
    const confirmNoBtn = document.getElementById('confirmNoBtn');
    const confirmCBtn = document.getElementById('confirmCBtn');
    if (!confirmModal || !confirmYesBtn || !confirmNoBtn) {
        console.error('Confirm modal elements are not found in the DOM.');
        return;
    }
    
    confirmModal.style.display = 'block';

    confirmYesBtn.onclick = () => {
        onConfirm();
        confirmModal.style.display = 'none';
    };

    confirmNoBtn.onclick = () => {
        confirmModal.style.display = 'none';
    };
    confirmCBtn.onclick = () => {
        confirmModal.style.display = 'none';
    };
}

// Function to show the alert modal
function showAlert(message) {
    const alertModal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');
    const alertOkBtn = document.getElementById('alertOkBtn');
    
    alertMessage.innerText = message;
    alertModal.style.display = 'block';

    alertOkBtn.onclick = () => {
        alertModal.style.display = 'none';
    };
}

document.getElementById('sidebarToggle').addEventListener('click', function () {
    var sidebar = document.getElementById('left');
    sidebar.classList.toggle('active');
});
