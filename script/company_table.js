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
            let index = 0;

          
            tableBody.innerHTML = '';

            
            employeesData.forEach(element => {
                console.log(element);
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
                            <span class="icon" title="Delete" id="delete"style="cursor: pointer; margin-left: 10px; " data-id="${element.company_id}">
                            
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
           
tableBody.addEventListener('click', function (event) {
    if (event.target.closest('.icon[title="Delete"]')) {
        const deleteIcon=document.getElementById('delete');
        const companyId = document.getElementById('delete').getAttribute('data-id');
        
        if (confirm('Are you sure you want to delete this company?')) {
            
            fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/company/delete/${companyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ deleted: true }) 
            })
            .then(response => {
                if (!response.ok) {
                    console.log('yes');
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
             
                const rowToDelete = deleteIcon.closest('tr');
                rowToDelete.remove();
                console.log('Company deleted successfully');
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









// document.addEventListener('DOMContentLoaded', viewcompanydetails);

// function viewcompanydetails() {
//     const tableBody = document.getElementById("tBody");
//     const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/company/getall`;

//     fetch(apiUrl)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Error: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             employeesData = data;
//             let index = 0;
//             tableBody.innerHTML = '';

//             employeesData.forEach(element => {
//                 console.log(element);
//                 const newRow = document.createElement('tr');
//                 newRow.innerHTML = `
//                     <td class="pin-column">${element.company_name}</td>
//                     <td class="name-column">${element.phone_number}</td>
//                     <td class="phone-column">${element.first_name}</td>
//                     <td class="isAdmin">${element.email}</td>
//                     <td>
//                         <div>
//                             <span class="icon" title="Edit" style="cursor: pointer;">
//                                 <i class="fa fa-pencil" aria-hidden="true" style="color: #006103;"></i>
//                             </span>
//                             <span class="icon" title="Delete" style="cursor: pointer; margin-left: 10px;" data-id="${element.company_id}">
//                                 <i class="fa fa-trash" aria-hidden="true" style="color: #006103;"></i>
//                             </span>
//                         </div>
//                     </td>
//                     <td>
//                         <button class="btn btn-send" ${element.invite_status === "Accepted" ? "disabled" : ""}>
//                             ${element.invite_status === "Accepted" ? "Send" : "Resend"}
//                         </button>
//                     </td>
//                 `;
//                 tableBody.appendChild(newRow);
//                 index++;
//             });

//             // Initialize DataTable after populating data
//             $(document).ready(function () {
//                 $('#ticketTable').DataTable({
//                     "paging": true,
//                     "lengthChange": true,
//                     "searching": true,
//                     "ordering": true,
//                     "info": true,
//                     "autoWidth": false,
//                     "responsive": true,
//                 });
//             });

//             tableBody.addEventListener('click', function (event) {
//                 if (event.target.closest('.icon[title="Delete"]')) {
//                     const deleteIcon = event.target.closest('.icon[title="Delete"]');
//                     const companyId = deleteIcon.getAttribute('data-id');

//                     if (confirm('Are you sure you want to delete this company?')) {
//                         fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/company/delete/${companyId}`, {
//                             method: 'PUT',
//                             headers: {
//                                 'Content-Type': 'application/json'
//                             },
//                             body: JSON.stringify({ deleted: true }) 
//                         })
//                         .then(response => {
//                             if (!response.ok) {
//                                 throw new Error(`Error: ${response.status}`);
//                             }
//                             return response.json();
//                         })
//                         .then(() => {
//                             const rowToDelete = deleteIcon.closest('tr');
//                             rowToDelete.remove();
//                             console.log('Company deleted successfully');
//                         })
//                         .catch(error => {
//                             console.error('Delete error:', error);
//                             alert('Failed to delete the company.');
//                         });
//                     }
//                 }
//             });

//         })
//         .catch(error => {
//             console.error('Fetch error:', error);
//         });
// }

// document.getElementById('sidebarToggle').addEventListener('click', function () {
//     var sidebar = document.getElementById('left');
//     sidebar.classList.toggle('active');
// });
