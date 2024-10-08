$(document).ready(function () {
    function format(rowData) {
        // Render the row details with the employee dropdown and description
        const employeeOptions = rowData.employees.map(employee => `
            <option value="${employee.name}" ${employee.pending > 5 ? 'disabled' : ''}>
                ${employee.name}
            </option>
        `).join('');

        return `
            <div class="collapse-content details-row" data-ticket-id="${rowData.ticketID}">
                <td colspan="8">
                    <div class="row">
                        <div class="col-md-1"></div>
                        <div class="col-md-4">
                            <strong class="d-flex justify-content-left">Customer Address</strong>
                            <p class="pt-2" style="font-size: 13px;text-align: left;">${rowData.address}</p>
                            <label class="mt-3 d-flex justify-content-left">Employee Name</label>
                            <select class="form-select mt-2 employee-select" disabled>
                                ${employeeOptions}
                            </select>
                            <small class="text-muted mt-2">Pending work: <span class="pending-work">${rowData.employees[0].pending}</span></small>
                        </div>
                        <div class="col-md-1"></div>
                        <div class="col-md-6">
                            <strong class="d-flex justify-content-left">Description:</strong>
                            <p style="font-size: 16px;text-align: left;" class="pt-2">${rowData.description}</p>
                            <div class="row">
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
                                    <button class="btn btn-assign" ${rowData.employees.every(e => e.pending > 5) ? 'disabled' : ''}>
                                        ReAssign
                                    </button>
                                </div>
                        </div>
                    </div>
                </td>
            </div>`;
    }



    // Sample data for dynamic row details
    const rowDetails = [
        {
            ticketID: '001',
            address: 'KING SQUARE OLD NO.1 NEW NO.2, PLOT B 31, 6th Ave, Ashok Nagar, Chennai, Tamil Nadu 600083',
            description: 'The air conditioner is running but not cooling the room effectively, blowing warm air despite long cooling cycles. This could be due to low refrigerant levels, a dirty air filter, a malfunctioning compressor, or a faulty thermostat. To address this issue, check and replace the air filter, and have a professional inspect.',
            employees: [
                { name: 'Ganesh', pending: 3 },
                { name: 'Rohith', pending: 6 },
                { name: 'Meera', pending: 2 }
            ]
        },
        {
            ticketID: '002',
            address: 'No. 45, Second St, Besant Nagar, Chennai, Tamil Nadu 600090',
            description: 'The air conditioner is running but not cooling the room effectively, blowing warm air despite long cooling cycles. This could be due to low refrigerant levels, a dirty air filter, a malfunctioning compressor, or a faulty thermostat. To address this issue, check and replace the air filter, and have a professional inspect.',

            employees: [
                { name: 'Ganesh', pending: 4 },
                { name: 'Rohith', pending: 5 },
                { name: 'Meera', pending: 1 }
            ]
        },
        {
            ticketID: '003',
            address: 'No. 45, Second St, Besant Nagar, Chennai, Tamil Nadu 600090',
            description: 'The air conditioner is running but not cooling the room effectively, blowing warm air despite long cooling cycles. This could be due to low refrigerant levels, a dirty air filter, a malfunctioning compressor, or a faulty thermostat. To address this issue, check and replace the air filter, and have a professional inspect.',

            employees: [
                { name: 'Ganesh', pending: 4 },
                { name: 'Rohith', pending: 5 },
                { name: 'Meera', pending: 1 }
            ]
        },
        // Add more details for additional tickets
        {
            ticketID: '004',
            address: '123 Main St, Anna Nagar, Chennai, Tamil Nadu 600040',
            description: 'The air conditioner is running but not cooling the room effectively, blowing warm air despite long cooling cycles. This could be due to low refrigerant levels, a dirty air filter, a malfunctioning compressor, or a faulty thermostat. To address this issue, check and replace the air filter, and have a professional inspect.',

            employees: [
                { name: 'Ravi', pending: 2 },
                { name: 'Suresh', pending: 8 },
                { name: 'Mohan', pending: 1 }
            ]
        },
        {
            ticketID: '005',
            address: '45, 2nd Cross, Koramangala, Bangalore, Karnataka 560034', 
            description: 'The air conditioner is running but not cooling the room effectively, blowing warm air despite long cooling cycles. This could be due to low refrigerant levels, a dirty air filter, a malfunctioning compressor, or a faulty thermostat. To address this issue, check and replace the air filter, and have a professional inspect.',

            employees: [
                { name: 'Anita', pending: 1 },
                { name: 'Vijay', pending: 3 },
                { name: 'Suman', pending: 4 }
            ]
        },
        {
            ticketID: '006',
            address: '67, JP Nagar, Bangalore, Karnataka 560078',
            description: 'The air conditioner is running but not cooling the room effectively, blowing warm air despite long cooling cycles. This could be due to low refrigerant levels, a dirty air filter, a malfunctioning compressor, or a faulty thermostat. To address this issue, check and replace the air filter, and have a professional inspect.',

            employees: [
                { name: 'Amit', pending: 2 },
                { name: 'Anjali', pending: 6 },
                { name: 'Sneha', pending: 3 }
            ]
        },
        {
            ticketID: '007',
            address: '90, Whitefield, Bangalore, Karnataka 560066',
            description: 'The air conditioner is running but not cooling the room effectively, blowing warm air despite long cooling cycles. This could be due to low refrigerant levels, a dirty air filter, a malfunctioning compressor, or a faulty thermostat. To address this issue, check and replace the air filter, and have a professional inspect.',

            employees: [
                { name: 'Kiran', pending: 0 },
                { name: 'Manoj', pending: 5 },
                { name: 'Pooja', pending: 2 }
            ]
        },
        {
            ticketID: '008',
            address: '32, Ulsoor, Bangalore, Karnataka 560008',
            description: 'The air conditioner is running but not cooling the room effectively, blowing warm air despite long cooling cycles. This could be due to low refrigerant levels, a dirty air filter, a malfunctioning compressor, or a faulty thermostat. To address this issue, check and replace the air filter, and have a professional inspect.',

            employees: [
                { name: 'Rahul', pending: 1 },
                { name: 'Priya', pending: 4 },
                { name: 'Sunil', pending: 7 }
            ]
        },
        {
            ticketID: '009',
            address: '88, Thippasandra, Bangalore, Karnataka 560075',
            description: 'The air conditioner is running but not cooling the room effectively, blowing warm air despite long cooling cycles. This could be due to low refrigerant levels, a dirty air filter, a malfunctioning compressor, or a faulty thermostat. To address this issue, check and replace the air filter, and have a professional inspect.',

            employees: [
                { name: 'Ravi', pending: 3 },
                { name: 'Siddharth', pending: 5 },
                { name: 'Anita', pending: 1 }
            ]
        },
        {
            ticketID: '010',
            address: '56, Indiranagar, Bangalore, Karnataka 560038',
            description: 'The air conditioner is running but not cooling the room effectively, blowing warm air despite long cooling cycles. This could be due to low refrigerant levels, a dirty air filter, a malfunctioning compressor, or a faulty thermostat. To address this issue, check and replace the air filter, and have a professional inspect.',

            employees: [
                { name: 'Karthik', pending: 0 },
                { name: 'Shalini', pending: 3 },
                { name: 'Neha', pending: 2 }
            ]
        }
    ];

    // Set the initial assigned employee name in the main table rows
    $('#ticketTable tbody tr').each(function () {
        const ticketID = $(this).find('td:nth-child(2)').text();
        const details = rowDetails.find(detail => detail.ticketID === ticketID);

        // Set initial assigned employee in the table's main row
        if (details && details.employees.length > 0) {
            const initialEmployee = details.employees[0].name;
            $(this).find('.assigned-employee').text(initialEmployee);
        }
    });

    // Initialize DataTables
    const table = $('#ticketTable').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "responsive": true
    });

    // Expand row details on click
    $('#ticketTable tbody').on('click', 'td.details-control', function () {
        const tr = $(this).closest('tr');
        const row = table.row(tr);
        const ticketID = tr.find('td:nth-child(2)').text(); // Get the ticket ID
        const details = rowDetails.find(detail => detail.ticketID === ticketID);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        } else {
            row.child(format(details)).show();
            tr.addClass('shown');
        }
    });

    // Reassign button logic
    $('#ticketTable tbody').on('click', '.btn-assign', function () {
        $(this).closest('.details-row').find('.employee-select').prop('disabled', false);
    });

    // Update the assigned employee when an employee is selected
    $('#ticketTable tbody').on('change', '.employee-select', function () {
        const selectedEmployee = $(this).val();
        const detailsRow = $(this).closest('tr.details-row');
        const ticketID = detailsRow.data('ticket-id');

        // Find the corresponding main row based on the ticket ID
        const mainRow = $(`#ticketTable tbody tr:not(.details-row)`).filter(function () {
            return $(this).find('td:nth-child(2)').text() === ticketID;
        });

        // Update the assigned employee in the main table row
        mainRow.find('.assigned-employee').text(selectedEmployee);
        table.row(mainRow).invalidate().draw();
    });
});

document.getElementById('sidebarToggle').addEventListener('click', function () {
    var sidebar = document.getElementById('left');
    sidebar.classList.toggle('active');
});