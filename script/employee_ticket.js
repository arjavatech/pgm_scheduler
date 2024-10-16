$(document).ready(function () {
    const apiUrl = "https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee/getall";
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
            ticket.first_name,
            ticket.phone_number,
            `<div class="issue-type ${ticket.specialization.toLowerCase()}"><span class="circle"></span>${ticket.specialization}</div>`,
            ticket.email,
            ticket.assigned_locations,
            ticket.employee_no_of_completed_work,
            ticket.no_of_pending_works,
          
        ]).draw(false).node(); // Get the row node after adding

        // $(rowNode).find('td:first').addClass('details-control');
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
                                ${rowData.street}, ${rowData.city}, ${rowData.zip}, ${rowData.state}, ${rowData.state}
                            </p>
                            <label class="mt-3 d-flex justify-content-left">Employee Name</label>
                            <select class="form-select mt-2 employee-select">
                                <option value="ganesh">Mani</option>
                                <option value="saab">Arunkumar</option>
                                <option value="mercedes">Sakthi</option>
                                <option value="audi">Logeshwari</option>
                            </select>
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
                  <p class="text-center mb-2" id="showMoreButton" onclick="showmore('none','block')">show more ⮟</p>
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
                     <p class="text-center pt-3 mb-2" id="showLessButton" onclick="showmore('block','none')">show less ⮝</p>          
                </div>
            </div>
        </div>
        `;

        // Append the card to the card container for mobile view
        $('#card-container').append(cardHtml);
    }


});
function showmore(response1, response2) {
    document.getElementById("showMoreButton").style.display = response1;
    document.querySelector(".show-more").style.display = response2;
}
document.getElementById('sidebarToggle').addEventListener('click', function () {
    var sidebar = document.getElementById('left');
    var body = document.body;  // Get the body element
    var mainContents = document.querySelectorAll(".card"); // Use correct selector for multiple elements
    var content = document.querySelector(".container-sty"); // Assuming this is the main content wrapper

    sidebar.classList.toggle('active');  // Toggle the sidebar

    if (sidebar.classList.contains('active')) {
        // When the sidebar is active (open), disable body scroll and add background overlay
        body.classList.add('no-scroll');
        body.classList.add('body-overlay');  // Add background overlay

        content.style.backgroundColor = "transparent";  // Apply transparent background
        mainContents.forEach(function(mainContent) {
            mainContent.style.backgroundColor = "transparent";  // Apply to each card
        });
    } else {
        // When the sidebar is closed, re-enable body scroll and remove background overlay
        body.classList.remove('no-scroll');
        body.classList.remove('body-overlay');  // Remove background overlay
        
        content.style.backgroundColor = "";  // Reset background color
        mainContents.forEach(function(mainContent) {
            mainContent.style.backgroundColor = "";  // Reset each card's background color
        });
    }
});