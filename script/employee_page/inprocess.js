$(document).ready(function () {
    const cid = localStorage.getItem("cid");
    const eid = localStorage.getItem("eid");
    document.getElementById("e_name").innerHTML = localStorage.getItem("e_name");

    document.getElementById("Clogo").src = localStorage.getItem("Clogo");

    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employees/inprogress_tickets/${cid}/${eid}`;
    let rowDetails = [];
    const CName = localStorage.getItem("CName")
    
    document.getElementById("CName").innerHTML = CName;
    
    const loadingIndicator = document.getElementById('l');
    loadingIndicator.style.display = 'flex'; // Show loading before fetch

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            rowDetails.push(...data);
            data.forEach(ticket => {
                addTicket(ticket);
                addCard(ticket);
            });
            loadingIndicator.style.display = 'none'; // Hide loading after processing
        })
        .catch(error => {
            console.error('Error fetching tickets:', error);
            loadingIndicator.style.display = 'none'; // Hide loading on error
        });

    // Initialize DataTable
  // Initialize DataTable
  const table = $('#ticketTable').DataTable({
    language: {
        paginate: {
            previous: '<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M8 0 L0 6 L8 12 Z" fill="#000"/></svg>',
            next: '<svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><path d="M4 0 L12 6 L4 12 Z" fill="#000"/></svg>'
        }
        },
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
            `<span id="ticketId"  ticket-tocken=${ticket.id}>${ticket.ticket_id}</span>`,
            `<div class="issue-type ${ticket.ticket_type}"><span class="circle"></span>${ticket.ticket_type}</div>`,
            ticket.name,
            ticket.phone_number,
            ticket.complain_raised_date,
            ticket.city,
            `<span class="assigned-employee" data-old-emp="${ticket.employee_id}">${ticket.name}</span>`
        ]).draw(false).node();
        $(rowNode).find('td:first').addClass('details-control');
    }


    function format(rowData) {
        const workStartedTime = new Date(rowData.work_started_time).toISOString().split('T')[0];
        return `
            <tr class="collapse-content details-row">
                <td colspan="8">
                    <div class="row">
                    
                        <div class="col-md-4 box1">
                            <strong>Customer Address</strong>
                            <p>${rowData.street}, ${rowData.city}, ${rowData.zip}, ${rowData.state}</p>
                           
                         <div class="input-container mt-3" style="text-align:left !important; padding:0 !important">
                                <label for="start-time">Work started time:</label>
                                <input type="datetime-local" class="input-bottom-border mt-2" style="background:transparent"
                                    id="start-time-${rowData.ticket_id}" 
                                    value="${rowData.work_started_time}">
                            </div>

                             <div class="input-container mt-3" style="text-align:left !important;  padding:0 !important">
                                <label for="end-time">Work ended time :</label>
                                <input type="datetime-local" class="input-bottom-border mt-2" style="background:transparent"
                                    id="end-time-${rowData.ticket_id}" 
                                    value="${rowData.work_ended_time}">                                
                            </div>  
                           
                            </div>
                       <div class="col-md-2"></div>
                        <div class="col-md-6 box2">
                            <strong>Description:</strong>
                            <p>${rowData.description}</p>
                       <div class="image-gallery row g-2 ">
    <!-- Upload 1 -->
   <div class="col-5 col-sm-4 col-md-4">
        <div class="uploads position-relative border" style="width: 100%; height: 100px;">
            <input 
                type="file" 
                id="upload1-${rowData.ticket_id}-${rowData.id}"  
                accept="image/*" 
                onchange="handleFileSelect1(event)"
                class="position-absolute top-0 start-0 w-100 h-100 opacity-0" 
            />
            ${rowData.photo_1 ? `
            <img 
                id="image-preview1-${rowData.ticket_id}-${rowData.id}" 
                src="${rowData.photo_1}" 
                alt="Uploaded Image" 
                class="w-100 h-100" 
                style="object-fit: cover;" 
            />
            ` : `
            <label 
                for="upload1-${rowData.ticket_id}-${rowData.id}"  
                class="d-flex align-items-center justify-content-center w-100 h-100 fw-bold text-success" 
                style="cursor: pointer; font-size: 24px;">
                +
            </label>
            `}
        </div>
    </div>

    <!-- Upload 2 -->
   <div class="col-5 col-sm-4 col-md-4">
        <div class="uploads position-relative border" style="width: 100%; height: 100px;">
            <input 
                type="file" 
                id="upload2-${rowData.ticket_id}-${rowData.id}"  
                accept="image/*" 
                onchange="handleFileSelect2(event)"
                class="position-absolute top-0 start-0 w-100 h-100 opacity-0" 
            />
            ${rowData.photo_2 ? `
            <img 
                id="image-preview2-${rowData.ticket_id}-${rowData.id}" 
                src="${rowData.photo_2}" 
                alt="Uploaded Image" 
                class="w-100 h-100" 
                style="object-fit: cover;" 
            />
            ` : `
            <label 
                for="upload2-${rowData.ticket_id}-${rowData.id}"  
                class="d-flex align-items-center justify-content-center w-100 h-100 fw-bold text-success" 
                style="cursor: pointer; font-size: 24px;">
                +
            </label>
            `}
        </div>
    </div>

    <!-- Upload 3 -->
    <div class="col-5 col-sm-4 col-md-4">
        <div class="uploads position-relative border" style="width: 100%; height: 100px;">
            <input 
                type="file" 
                id="upload3-${rowData.ticket_id}-${rowData.id}" 
                accept="image/*" 
                onchange="handleFileSelect3(event)"
                class="position-absolute top-0 start-0 w-100 h-100 opacity-0" 
            />
            ${rowData.photo_3 ? `
            <img 
                id="image-preview3-${rowData.ticket_id}-${rowData.id}" 
                src="${rowData.photo_3}" 
                alt="Uploaded Image" 
                class="w-100 h-100" 
                style="object-fit: cover;" 
            />
            ` : `
            <label 
                for="upload3-${rowData.ticket_id}-${rowData.id}"  
                class="d-flex align-items-center justify-content-center w-100 h-100 fw-bold text-success" 
                style="cursor: pointer; font-size: 24px;">
                +
            </label>
            `}
        </div>
    </div>
</div>

                             </div>
                             
                        </div>

                         <div  class="buttonContainer" id="btn">
                             <button id="completed" class="completed-button" data-ticket-id="${rowData.ticket_id}">Completed</button>
                             <button class="save" ticket-tocken=${rowData.id} id=${rowData.ticket_id} data-ticket-id="${rowData.ticket_id}">Save</button>
                        </div>
                    </div>
                </td>
            </tr>`;
    }
    

    // Toggle arrow
    $(document).on('click', 'td.details-control', function () {
        $(this).toggleClass('active');
    });

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

    // Handle the reassign button click
    $('#ticketTable tbody').on('click', '.btn-reassign', async function () {
        const detailsRow = $(this).closest('.details-row');
        const ticketID = detailsRow.closest('tr').prev().find('#ticketId').text();
        const newEmployeeID = detailsRow.find('.employee-select').val();
        const oldEmployeeID = detailsRow.closest('tr').prev().find('.assigned-employee').data('old-emp');

        const requestBody = {
            ticket_id: ticketID,
            assigned_employee: newEmployeeID,
            old_employee: oldEmployeeID
        };

        try {
            const response = await fetch(`https://your-api-url.com/update_assigned_employee/${ticketID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            console.log("Employee assigned successfully:", data);
            detailsRow.find('.assigned-employee').text(newEmployeeID);
        } catch (error) {
            console.error("Failed to reassign employee:", error.message);
        }
    });


    // Completed button 

        // Event listener for the completed button
        $(document).on('click', '.save', async function () {
            const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
            loadingIndicator.style.display = 'flex'; // Show loading before fetch

            const ticket_token = this.getAttribute('ticket-tocken');
            const ticket_id = this.getAttribute("data-ticket-id");

            const workStartedTime = document.getElementById(`start-time-${ticket_id}`).value;
            const workEndedTime = document.getElementById(`end-time-${ticket_id}`).value;
            const requestBody = {
                work_started_time: workStartedTime || null, 
                work_ended_time: workEndedTime || null, 
            };

            console.log(requestBody)
    
            try {
                const response = await fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/ticket_status/save/${ticket_token}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });
    
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                const data = await response.json();
                if(data.message)
                {
                    setTimeout(() => {
                        loadingIndicator.style.display = 'none';
                        window.location.href = 'inProcessTicket.html';
                    }, 1000);
                }
                else
                {
                    loadingIndicator.style.display = 'none';
                }
            } catch (error) {
                loadingIndicator.style.display = 'none';
                console.error("Failed to mark ticket as completed:", error.message);
            }
        });

        // Event listener for the completed button
        $(document).on('click', '.completed-button', async function () {
            const loadingIndicator = document.getElementById('l'); 
            loadingIndicator.style.display = 'flex'; 

            const ticketID = $(this).data('ticket-id');
            const ticket_id = this.getAttribute("data-ticket-id");

            const workStartedTime = document.getElementById(`start-time-${ticket_id}`).value;
            const workEndedTime = document.getElementById(`end-time-${ticket_id}`).value;
    
            const requestBody = {
                company_id: localStorage.getItem("cid"), 
                employee_id: localStorage.getItem("eid"), 
                ticket_id: ticketID,
                work_started_time: workStartedTime || null, 
                work_ended_time: workEndedTime || null, 
            };
    
            try {
                const response = await fetch('https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee_complted_ticket', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });
    
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                const data = await response.json();
                if(data.message)
                {
                    setTimeout(() => {
                        loadingIndicator.style.display = 'none';
                        window.location.href = 'inProcessTicket.html';
                    }, 1000);
                }
                else
                {
                    loadingIndicator.style.display = 'none';
                }
            } catch (error) {
                loadingIndicator.style.display = 'none';
                console.error("Failed to mark ticket as completed:", error.message);
            }
        });
    

        document.addEventListener("DOMContentLoaded", function () {
            const fileInput = document.getElementById(`upload-${rowData.ticket_id}`);
            const maxFiles = 3;
        
            fileInput.addEventListener("change", function (event) {
                const files = event.target.files;
        
                // If more than 3 files are selected, keep only the first 3
                if (files.length > maxFiles) {
                    // alert(`You can only select up to ${maxFiles} files.`);
                    
                    // Convert FileList to Array and keep only the first 3 files
                    const fileArray = Array.from(files).slice(0, maxFiles);
                    
                    // Create a DataTransfer object to modify FileList
                    const dataTransfer = new DataTransfer();
                    fileArray.forEach(file => dataTransfer.items.add(file));
                    
                    // Assign modified FileList back to the input
                    fileInput.files = dataTransfer.files;
                }
            });
        });


// card part
    // Function to create and append the card for mobile view
    function addCard(employee) {
        const workStartedTime = new Date(employee.work_started_time).toISOString().split('T')[0];
        const cardHtml = `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-6">
                        <p><strong>Name:</strong>  ${employee.name}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Ticket ID:</strong>  ${employee.ticket_id}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Issue type:</strong>  ${employee.ticket_type}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Date:</strong>  ${employee.complain_raised_date}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Phone:</strong> ${employee.phone_number}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>City:</strong> ${employee.city}</p>
                    </div>
                </div>
                <p class="text-center mb-2 showMoreButton">Show more ⮟</p>     
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
                                    id="end-time-${employee.ticket_id}" 
                                    value="${employee.work_ended_time}">
                            </div>
                   <div class="image-gallery d-flex flex-row justify-content-center">
                        <div class="image-container d-flex flex-row justify-content-center">

                         ${employee.photo_1 ? ` <img src="${employee.photo_1}" alt="Image 1" class="p-2" width="100px">`: ``}   
                           ${employee.photo_2 ? ` <img src="${employee.photo_2}" alt="Image 1" class="p-2" width="100px">`: ``} 
                           ${employee.photo_3 ? ` <img src="${employee.photo_3}" alt="Image 1" class="p-2" width="100px">`: ``} 
                        </div>
                    </div>
                    <div class="row">

                      <div class="col-6">
                            <button class="form-control mt-2 employee-select comform completed-button" style="width:100%" data-ticket-id="${employee.ticket_id}">Completed</button>
                        </div>
                       <div class="col-6">
                            <button class="form-control mt-2 employee-select cancel save" style="width:100%" ticket-tocken=${employee.id}  id=${employee.ticket_id} data-ticket-id="${employee.ticket_id}">Save</button>
                        </div>
                        </div>
                    <p class="text-center pt-3 mb-2 showLessButton">Show less ⮝</p>             
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
        sidebar.classList.toggle('collapsed');
        content.classList.toggle("container-sty-collapsed")

        tableOddRows.forEach(row => {
            row.classList.toggle("table-row-collapsed")
        })
        tableEvenRows.forEach(row => {
            row.classList.toggle("table-row-collapsed")
        })
        issueType.forEach(row => {
            row.classList.toggle("table-row-collapsed")
        })
        mainContents.forEach(content => {
            content.classList.toggle("card-collapsed")
        })

        tHead.classList.toggle("table-head")
        tHeadCells.forEach(cell => {
            cell.classList.toggle("table-head")
        })
    })
});


function disable(ticket_id) {
    document.getElementById(`reassign-${ticket_id}`).style.display = "none";
    document.querySelector(`.employee-select-${ticket_id}`).disabled = false;
    document.getElementById(`conform-${ticket_id}`).style.display = "block";
}


async function handleFileSelect1(event) {
    const file = event.target.files[0]; 
    
    if (!file) {
        // alert("No file selected.");
        return;
    }

    const loadingIndicator = document.getElementById('l'); 
    loadingIndicator.style.display = 'flex'; 

    // Convert file to Base64 format
    const reader = new FileReader();
    reader.onload = async function (e) {

        const ticketId = event.target.id.split("-")[1];
        const ticketToken = event.target.id.split("-")[2];
        const base64Data = e.target.result.split(",")[1]; // Extract Base64 portion
        const fileName = file.name;

        let imagePreview = document.getElementById(`image-preview1-${ticketId}-${ticketToken}`);
        if (!imagePreview) {
            // Dynamically create an <img> element if it doesn't exist
            imagePreview = document.createElement('img');
            imagePreview.id = `image-preview1-${ticketId}-${ticketToken}`;
            imagePreview.className = 'w-100 h-100';
            imagePreview.style.objectFit = 'cover';

            // Replace the label with the newly created <img> element
            const label = document.querySelector(`label[for="upload1-${ticketId}-${ticketToken}"]`);
            if (label) {
                label.parentNode.replaceChild(imagePreview, label);
            }
        }

        // Update the image preview's `src` attribute
        imagePreview.src = e.target.result;

        try {
            // Send Base64 data to the server
            const response = await fetch("https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/company_logo_upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_name: fileName,
                    file_data: base64Data,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                updateLink(data.file_url, 1, ticketId, ticketToken); // Update UI with the uploaded file URL
            } else {
                loadingIndicator.style.display = 'none'; 
            }
        } catch (error) {
            console.error("Error:", error);
            loadingIndicator.style.display = 'none'; 
        }
    };

    reader.readAsDataURL(file); // Read file as Base64
}

async function handleFileSelect2(event) {
    const ticketId = event.target.id.split("-")[1];
    const ticketToken = event.target.id.split("-")[2];
    const file = event.target.files[0]; // Get the selected file
    
    if (!file) {
        // alert("No file selected.");
        return;
    }

    const loadingIndicator = document.getElementById('l'); 
    loadingIndicator.style.display = 'flex'; 

    // Convert file to Base64 format
    const reader = new FileReader();
    reader.onload = async function (e) {
        const base64Data = e.target.result.split(",")[1]; // Extract Base64 portion
        const fileName = file.name;
        let imagePreview = document.getElementById(`image-preview2-${ticketId}-${ticketToken}`);
        if (!imagePreview) {
            // Dynamically create an <img> element if it doesn't exist
            imagePreview = document.createElement('img');
            imagePreview.id = `image-preview2-${ticketId}-${ticketToken}`;
            imagePreview.className = 'w-100 h-100';
            imagePreview.style.objectFit = 'cover';

            // Replace the label with the newly created <img> element
            const label = document.querySelector(`label[for="upload2-${ticketId}-${ticketToken}"]`);
            if (label) {
                label.parentNode.replaceChild(imagePreview, label);
            }
        }

        // Update the image preview's `src` attribute
        imagePreview.src = e.target.result;

        try {
            // Send Base64 data to the server
            const response = await fetch("https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/company_logo_upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_name: fileName,
                    file_data: base64Data,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // alert("Upload succeeded: " + data.file_url);
                updateLink(data.file_url, 2, ticketId, ticketToken); // Update UI with the uploaded file URL
            } else {
                loadingIndicator.style.display = 'none'; 
            }
        } catch (error) {
            console.error("Error:", error);
            loadingIndicator.style.display = 'none'; 
        }
    };

    reader.readAsDataURL(file); // Read file as Base64
}

async function handleFileSelect3(event) {
    const ticketId = event.target.id.split("-")[1];
    const ticketToken = event.target.id.split("-")[2];
    
    const file = event.target.files[0]; // Get the selected file
    
    if (!file) {
        // alert("No file selected.");
        return;
    }
    const loadingIndicator = document.getElementById('l'); 
    loadingIndicator.style.display = 'flex'; 

    // Convert file to Base64 format
    const reader = new FileReader();
    reader.onload = async function (e) {
        const base64Data = e.target.result.split(",")[1]; // Extract Base64 portion
        const fileName = file.name;
        let imagePreview = document.getElementById(`image-preview3-${ticketId}-${ticketToken}`);
        if (!imagePreview) {
            // Dynamically create an <img> element if it doesn't exist
            imagePreview = document.createElement('img');
            imagePreview.id = `image-preview3-${ticketId}-${ticketToken}`;
            imagePreview.className = 'w-100 h-100';
            imagePreview.style.objectFit = 'cover';

            // Replace the label with the newly created <img> element
            const label = document.querySelector(`label[for="upload3-${ticketId}-${ticketToken}"]`);
            if (label) {
                label.parentNode.replaceChild(imagePreview, label);
            }
        }

        // Update the image preview's `src` attribute
        imagePreview.src = e.target.result;

        

        try {
            // Send Base64 data to the server
            const response = await fetch("https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/company_logo_upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_name: fileName,
                    file_data: base64Data,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // alert("Upload succeeded: " + data.file_url);
                updateLink(data.file_url, 3, ticketId, ticketToken); // Update UI with the uploaded file URL
            } else {
                loadingIndicator.style.display = 'none'; 
            }
        } catch (error) {
            console.error("Error:", error);
            loadingIndicator.style.display = 'none'; 
        }
    };

    reader.readAsDataURL(file); // Read file as Base64
}

async function updateLink(url, id, ticketId, ticketToken) {
    const cid = localStorage.getItem("cid");
    const eid = localStorage.getItem("eid");
    const loadingIndicator = document.getElementById('l'); 
    loadingIndicator.style.display = 'flex'; 
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/ticket_status/update/${ticketToken}`;
    const payload = id == 1 ? {
        company_id: cid,
        employee_id: eid,
        ticket_id: parseInt(ticketId),
        photo_1: url
    } : id ==2 ?  {
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
            loadingIndicator.style.display = 'none'; 
        } else {
            loadingIndicator.style.display = 'none'; 
        }
    } catch (error) {
        console.error('Error updating link:', error);
        loadingIndicator.style.display = 'none'; 
    }
}