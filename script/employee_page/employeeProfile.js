
let profileData; // Variable to hold the profile data
let getCustomerDatasFromDb;

document.addEventListener("DOMContentLoaded", function () {
    const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
    loadingIndicator.style.display = 'flex'; // Show loading before fetch

    document.getElementById("Clogo").src = localStorage.getItem("Clogo");

    // Check if profile data is already loaded
    if (profileData) {
        // Use the already loaded data
        populateProfileData(profileData);
    } else {
        // Load data from API
        loadProfileDataFromAPI();
    }
});

// Function to load profile data from the API
async function loadProfileDataFromAPI() {
    const eid = localStorage.getItem("eid");
    const url = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee/get/${eid}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        profileData = await response.json(); 
        checkbox(profileData.specialization);
        IsActive(profileData.available);
        EmpStatus(profileData.employee_status);
        // Process and populate the response data
        populateProfileData(profileData);
    } catch (error) {
        // document.getElementById('overlay').style.display = 'none';

    }

}

// Function to populate profile data into the form fields
function populateProfileData(data) {

    console.log(data)

    // Company datas 
    document.getElementById('first_name').value = data.first_name || '';
    document.getElementById('last_name').value = data.last_name || '';

    document.getElementById("logoPreview").src = data.photo || '';

    document.getElementById('email').value = data.email || '';
    document.getElementById('phone_number').value = data.phone_number || '';


    document.getElementById('areas_covered').value = data.areas_covered || '';
    document.getElementById('assigned_locations').value = data.assigned_locations || '';

    document.getElementById('qualification').value = data.qualification || '';
    document.getElementById('experience').value = data.experience || '';

    document.getElementById('street').value = data.street || '';
    document.getElementById('specialization').value = data.specialization || '';
    document.getElementById('driving_license').value = data.driving_license || '';

    document.getElementById('city').value = data.city || '';
    document.getElementById('zip').value = data.zip || '';


    document.getElementById('status').value = data.employee_status || '';
    document.getElementById('skills').value = data.skills || '';



    document.getElementById('availability').value = data.available === 1 ? 'Yes' : 'No';

    const loadingIndicator = document.getElementById('l'); 
    loadingIndicator.style.display = 'none';


}

// Ensure the DOM is fully loaded before executing the script
function checkbox(specialization) {
    if (specialization == "AC") {
        document.getElementById("acCheckbox").checked = true;
    }
    if (specialization == "Refrigerator") {
        document.getElementById("nonAcCheckbox").checked = true;
    }
    else if(specialization == null)
    {

    }
    else
    {
        document.getElementById("acCheckbox").checked = true;
        document.getElementById("nonAcCheckbox").checked = true;
    }


}

function IsActive(isActive) {
    document.getElementById(isActive === 1 ? "Yes" : "No").checked = true;
}

function EmpStatus(empStatus) {
    console.log(empStatus)
    document.getElementById(empStatus === "Active" ? "isAvailable" : "IsNotAvailable").checked = true;
}


// Function to save form data to localStorage on submission
function saveFormDataToLocalStorage() {
    const fields = [
        'first_name', 'last_name', 'phone_number', 'street', 'addressLine', "driving_license", 'email', 'Specialization', 'zip', 'experience', 'availability', 'qualification', 'skills', 'employee_status', 'assigned_locations', 'areas_covered'
    ];

    fields.forEach(field => {
        localStorage.setItem(field, document.getElementById(field).value);
    });
}

function getFieldValue(id) {
    const value = document.getElementById(id).value;
    return value === "" ? null : value;
}

// Handle form submission
function handleSubmit(event) {
    const loadingIndicator = document.getElementById('l'); // Adjust as per your actual loading element ID
    loadingIndicator.style.display = 'flex'; // Show loading before fetch
    const cid = localStorage.getItem("cid");
    const eid = localStorage.getItem("eid");

    const updateApiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee/update/${eid}`;


    const profileData = {
        company_id: cid,
        first_name: getFieldValue('first_name'),
        last_name: getFieldValue('last_name'),
        street: getFieldValue('street'),
        zip: getFieldValue('zip'),
        specialization: getFieldValue('specialization'),
        city: getFieldValue('city'),
        email: getFieldValue('email'),
        phone_number: getFieldValue('phone_number'),
        areas_covered: getFieldValue('areas_covered'),
        assigned_locations: getFieldValue('assigned_locations'),
        employee_status: getFieldValue('status'),
        available: getFieldValue('availability') == "Yes" ? 1 : 0,
        skills: getFieldValue('skills'),
        driving_license: getFieldValue('driving_license'),
        qualification: getFieldValue('qualification'),
        experience: getFieldValue('experience')
    };

    fetch(updateApiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
    })
        .then(response => {
            document.getElementById('l').style.display = 'none';
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .catch(error => document.getElementById('l').style.display = 'none');
}

// When I click Logo go to home page 

function homePage() {
    const modalElement = document.getElementById('homePageModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}

checkbox();

async function handleFileSelect(event) {
    const file = event.target.files[0]; // Get the selected file
    if (!file) {
        // alert("No file selected.");
        return;
    }

    // Convert file to Base64 format
    const reader = new FileReader();
    reader.onload = async function (e) {
        const base64Data = e.target.result.split(",")[1]; // Extract Base64 portion
        const fileName = file.name;

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
                updateLink(data.file_url); // Update UI with the uploaded file URL
            } else {
                // alert("Upload failed: " + data.detail);
            }
        } catch (error) {
            console.error("Error:", error);
            // alert("An error occurred during the upload. Please try again.");
        }
    };

    reader.readAsDataURL(file); // Read file as Base64
}

async function updateLink(url) {
    const cid = localStorage.getItem("cid");
    const eid = localStorage.getItem("eid");
    const apiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee/update/${eid}`;
    const payload = {
        company_id: cid,
        photo: url
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
            // alert("link data updated")
        } else {
            // alert('Error updating link.');
        }
    } catch (error) {
        console.error('Error updating link:', error);
        // alert('Error updating link. Check console for details.');
    }
}