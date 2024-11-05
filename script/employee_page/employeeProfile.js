
let profileData; // Variable to hold the profile data
let getCustomerDatasFromDb;




document.addEventListener("DOMContentLoaded", function () {
    // document.getElementById('overlay').style.display = 'flex';

    // Check if profile data is already loaded
    if (profileData) {
        // Use the already loaded data
        populateProfileData(profileData);
        // document.getElementById('overlay').style.display = 'none';
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
        profileData = await response.json(); // Store data in the global variable

        console.log(profileData)

        // Process and populate the response data
        populateProfileData(profileData);

        // document.getElementById('overlay').style.display = 'none';
    } catch (error) {
        // document.getElementById('overlay').style.display = 'none';
    
    }

}

// Function to populate profile data into the form fields
function populateProfileData(data) {
    // const comLoDataUrl = data.CLogo; // Assume this is the logo URL
    // const image = document.getElementById("logo-img");

    // if (comLoDataUrl.startsWith('data:image/')) {
    //     image.src = comLoDataUrl; // Set the image source to the data URL
    //     localStorage.setItem("imageFile", comLoDataUrl); // Save logo to localStorage
    // } else {
      
    // }

    // Set other form fields with data
    // Company datas 
    document.getElementById('first_name').value = data.first_name || '';
    document.getElementById('last_name').value = data.last_name || '';

    document.getElementById('email').value = data.email || '';
    document.getElementById('phone_number').value = data.phone_number || '';
    
    document.getElementById('street').value = data.street || '';
    document.getElementById('city').value = data.city || '';
    document.getElementById('Specialization').value = data.specialization || '';
    document.getElementById('zip').value = data.zip || '';
}


// Function to save form data to localStorage on submission
function saveFormDataToLocalStorage() {
    const fields = [
        'first_name', 'last_name', 'phone_number', 'street', 'addressLine', 'email', 'Specialization', 'zip'
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
    console.log("Button clicked");
    const cid = localStorage.getItem("cid");
    const eid = localStorage.getItem("eid");

    const updateApiUrl = `https://m4j8v747jb.execute-api.us-west-2.amazonaws.com/dev/employee/update/${eid}`;
    console.log(updateApiUrl);

    const profileData = {
        company_id: cid,
        first_name: getFieldValue('first_name'),
        last_name: getFieldValue('last_name'),
        street: getFieldValue('street'),
        zip: getFieldValue('zip'),
        specialization: getFieldValue('Specialization'),
        city: getFieldValue('city'),
        email: getFieldValue('email'),
        phone_number: getFieldValue('phone_number')
    };

    console.log(profileData)

    fetch(updateApiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(profileData)
    })
    .then(response => {
        document.getElementById('l').style.display = 'none';
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Fetch error:', error));
}

// When I click Logo go to home page 

function homePage() {
    const modalElement = document.getElementById('homePageModal');
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}
