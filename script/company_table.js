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
            // Store the fetched data
            employeesData = data;
            let index = 0;

            // Clear the existing table body content
            tableBody.innerHTML = '';

            // Populate the table body with fetched data
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
                            <span class="icon" title="Delete" style="cursor: pointer; margin-left: 10px; ">
                                <i class="fa fa-trash" aria-hidden="true" style="color: #006103;"></i>
                            </span>
                        </div>
                    </td>
                    <td>
    <button class="btn btn-send" ${element.invite_status == "Accepted" ? "disabled" : ""}>
    ${element.invite_status == "Accepted" ? "Send" : "Resend"}
    </button>
</td>
                `;
                tableBody.appendChild(newRow);
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
}




document.getElementById('sidebarToggle').addEventListener('click', function () {
    var sidebar = document.getElementById('left');
    sidebar.classList.toggle('active');
});