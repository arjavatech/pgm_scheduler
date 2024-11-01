$(document).ready(function () {
    const cid = localStorage.getItem("cid");
    const eid = localStorage.getItem("eid");

    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employees/inprogress_tickets/${cid}/${eid}`;
    let rowDetails = [];
    const employees = [];
    
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
            `<span id="ticketId"  ticket-tocken=${ticket.id}>${ticket.ticket_id}</span>`,
            `<div class="issue-type ${ticket.ticket_type.toLowerCase()}"><span class="circle"></span>${ticket.ticket_type}</div>`,
            ticket.name,
            ticket.phone_number,
            ticket.complain_raised_date,
            ticket.city,
            `<span class="assigned-employee" data-old-emp="${ticket.employee_id}">${ticket.name}</span>`
        ]).draw(false).node();
        $(rowNode).find('td:first').addClass('details-control');
    }


    function format(rowData) {
        console.log(rowData);
        const workStartedTime = new Date(rowData.work_started_time).toISOString().split('T')[0];
        return `
            <tr class="collapse-content details-row">
                <td colspan="8">
                    <div class="row">
                    <div class="col-md-1"></div>
                        <div class="col-md-4"style="text-align:left">
                            <strong>Customer Address</strong>
                            <p>${rowData.street}, ${rowData.city}, ${rowData.zip}, ${rowData.state}</p>
                           
                           <div class="input-container">
                          
                                <label for="start-time">Work started time :</label>

                                <input type="datetime-local" id="start-time-${rowData.ticket_id}" value="${rowData.work_started_time}">
            
                             </div>

                            <div class="input-container">
                            <label for="end-time">Work ended time :</label>
                                <input type="datetime-local" id="end-time-${rowData.ticket_id}" placeholder="End Time " value="${rowData.work_ended_time}">
                                
                            </div>
                           
                            </div>
                        <div class="col-md-1"></div>
                        <div class="col-md-6"style="text-align:left">
                            <strong>Description:</strong>
                            <p>${rowData.description}</p>
                            <div class="image-gallery d-flex">
                              
                                <div id="image-preview-container">
                                
                                   <img src="../images/profile img.png" alt="Image 1" width="100px">
                                </div>
                                <div class="uploads">
                               <label for="upload-${rowData.ticket_id}" class="upload-label">
                                <span> Add photo</span>
                                <i class="fa fa-paperclip" aria-hidden="true" style="color:black; text-align:right"></i> 
                               </label>
                               <input type="file" id="upload-${rowData.ticket_id}" accept="image/*" style="display: none;"  multiple accept="image/*" >
                               </div> 
                             </div>
                             
                        </div>
                         <div  class="buttonContainer" id="btn">
                             <button id="completed" class="completed-button" data-ticket-id="${rowData.ticket_id}">completed</button>
                             <button class="save" ticket-tocken =${rowData.id} start-time=${workStartedTime}  id=${rowData.ticket_id}>save</button>
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
        $(document).on('click', '.completed-button', async function () {
            const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
            loadingIndicator.style.display = 'flex'; // Show loading before fetch

            const ticketID = $(this).data('ticket-id');
            const workStartedTime = $(this).closest('tr').find('#start-time').val();
            const workEndedTime = $(this).closest('tr').find('#end-time').val();
            // const photos = ""; // You can handle the image upload and include it here if needed
    
            const requestBody = {
                company_id: localStorage.getItem("cid"), // Replace with actual company ID
                employee_id: localStorage.getItem("eid"), // Replace with actual employee ID
                ticket_id: ticketID,
                work_started_time: workStartedTime || null, // Optional
                work_ended_time: workEndedTime || null, // Optional
                // photos: photos || null // Optional
            };

            console.log(requestBody);
    
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
    

        document.addEventListener('change', function (event) {
            // Check if the file input changed
            if (event.target.id.startsWith('upload-')) {
                const photoInput = event.target;
                const previewContainer = document.getElementById('image-preview-container');
                
                // Clear any existing previews
              
        
                // Loop through the selected files
                for (const file of photoInput.files) {
                    const reader = new FileReader();
        
                    // Create a preview when the file is read
                    reader.onload = function (e) {
                        const img = document.createElement('img');
                        img.src = e.target.result; // Use the file's data URL
                        img.style.width = '50px'; // Set a width for the preview
                        img.style.margin = '2px'; // Add some margin
                        previewContainer.appendChild(img); // Add the image to the preview container
                    };
        
                    // Read the file as a data URL
                    reader.readAsDataURL(file);
                }
            }
        });
        
// Save button 

// Use event delegation to handle clicks on elements with the 'save' class
document.addEventListener('click', async function (event) {
    // Check if the clicked element has the class 'save'
    if (event.target.classList.contains('save')) {
        const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
        loadingIndicator.style.display = 'flex'; // Show loading before fetch

        const closestSendElement = event.target.closest('.save');

        if (closestSendElement) {
           
            const ticketId = closestSendElement.getAttribute('ticket-tocken');
            const Id = closestSendElement.getAttribute('id');
           
            const workStartedTime = document.getElementById(`start-time-${Id}`).value;
            const workEndedTime = document.getElementById(`end-time-${Id}`).value;
            const photos = ""; // Assuming you will add photo logic later

            const photoInput = document.getElementById(`upload-${Id}`);
            const formData = new FormData();
    
            // Check for photos
            if (photoInput) {
                for (const file of photoInput.files) {
                    formData.append('photos', file); // Adjust 'photos' to the expected field name in your backend
                }
            } else {
                console.warn(`No file input found for ID: upload-${Id}`);
            }
          
           // Output the ticket ID for debugging

            try {
                // Make the API call to save the ticket status
                const response = await fetch(`https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/ticket_status/save/${ticketId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        work_started_time : workStartedTime == "" ? null : workStartedTime,
                        work_ended_time : workEndedTime == "" ? null : workEndedTime
                    })
                });

                // Check for HTTP response errors
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                
                // Parse the JSON response
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
                console.error("Failed to save ticket status:", error.message);
            }
        } else {
            console.error("No closest element with ID 'btn' found.");
        }
    }
});

// card part
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
                <p class="text-center mb-2 showMoreButton">show more ⮟</p>     
                <div class="show-more" style="display:none">
                    <p><strong>Employee Name:</strong>
                        <select class="form-select mt-2 employee-select">
                            <option value="ganesh">Mani</option>
                            <option value="saab">Arunkumar</option>
                            <option value="mercedes">Sakthi</option>
                            <option value="audi">Logeshwari</option>
                        </select>
                    </p>
                    <p><strong>Customer Address:</strong> ${employee.street}, ${employee.city}, ${employee.zip}</p>
                    <p><strong>Description:</strong> ${employee.description}</p>
                    <p class="text-center"><strong>Employee:</strong> ${employee.name}</p>
                    <div class="image-gallery d-flex justify-content-center">
                        <img src="images/profile img.png" alt="Image 1" width="100px">
                        <div class="image-container d-inline justify-content-center">
                            <img src="images/profile img.png" alt="Image 1" width="100px">
                            <div class="overlay"  data-bs-toggle="modal"
                                            data-bs-target="#imageModel">+3</div>
                        </div>
                    </div>
                    <p class="text-center pt-3 mb-2 showLessButton">show less ⮝</p>             
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

            select.style.backgroundColor = "transparent";
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
            select.disabled = false;
        }
    });
});


function disable(ticket_id) {
    document.getElementById(`reassign-${ticket_id}`).style.display = "none";
    document.querySelector(`.employee-select-${ticket_id}`).disabled = false;
    document.getElementById(`conform-${ticket_id}`).style.display = "block";
}
