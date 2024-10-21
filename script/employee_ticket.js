$(document).ready(function () {
    const apiUrl = "https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee/getall";
    let rowDetails = [];
    let index = 1;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(ticket => {
                rowDetails.push(ticket);
                addTicket(ticket);
                addCard(ticket, index); // Pass index for unique IDs
                index++;
            });
        })
        .catch(error => console.error('Error fetching tickets:', error));

    // Show more/less functionality
    $(document).on('click', '.show-more-toggle', function() {
        const index = $(this).data('index');
        $(`#showMoreButton-${index}`).hide();
        $(`#showMoreContent-${index}`).slideDown();
    });

    $(document).on('click', '.show-less-toggle', function() {
        const index = $(this).data('index');
        $(`#showMoreContent-${index}`).slideUp(function() {
            $(`#showMoreButton-${index}`).show();
        });
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
            ticket.first_name,
            ticket.phone_number,
            `<div class="issue-type ${ticket.specialization.toLowerCase()}"><span class="circle"></span>${ticket.specialization}</div>`,
            ticket.email,
            ticket.assigned_locations,
            ticket.employee_no_of_completed_work,
            ticket.no_of_pending_works,
        ]).draw(false).node(); // Get the row node after adding
    }

    // Function to create and append the card for mobile view
    function addCard(employee, index) {
        const cardHtml = `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-6">
                        <p><strong>Emp ID </strong>  00${index}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Phone Number </strong>  ${employee.phone_number}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p><strong>Emp Name </strong>  ${employee.first_name}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>Specialization </strong>  ${employee.specialization}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 text-center">
                        <p><strong>City:</strong> ${employee.assigned_locations}</p>
                    </div>
                </div>
                <p class="text-center mb-2 show-more-toggle" data-index="${index}" id="showMoreButton-${index}">Show more ⮟</p>
                <div class="show-more" id="showMoreContent-${index}" style="display:none">
                    <div class="row">
                        <div class="col-6">
                            <p><strong>Completed </strong>  ${employee.employee_no_of_completed_work}</p>
                        </div>
                        <div class="col-6">
                            <p><strong>Pending </strong>  ${employee.no_of_pending_works}</p>
                        </div>
                    </div>
                    <p class="text-center pt-3 mb-2 show-less-toggle" data-index="${index}">Show less ⮝</p>          
                </div>
            </div>
        </div>
        `;

        // Append the card to the card container for mobile view
        $('#card-container').append(cardHtml);
    }
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
    }
});