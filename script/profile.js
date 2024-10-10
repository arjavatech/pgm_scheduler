document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('overlay').style.display = 'flex';
    loadImage();
    loadLocalStorageData();
    initializeFormSubmission();
});

const cid = localStorage.getItem('companyID');
const customerId1 = localStorage.getItem('customId');
const phone = localStorage.getItem("phone")

console.log(phone)
async function loadImage() {
    const url = `https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/company/get/${cid}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log(responseData);

        const comLoDataUrl = responseData.CLogo; // This is a data URL
        const image = document.getElementById("logo-img");
        console.log(comLoDataUrl)

        if (comLoDataUrl.startsWith('data:image/')) {
            image.src = comLoDataUrl; // Set the image source to the data URL
            image.onload = function () {
                console.log('Logo image loaded successfully');
            };
            image.onerror = function () {
                console.error('Error loading logo image');
            };
        } else {
            console.error('Invalid data URL:', comLoDataUrl);
        }

        document.getElementById('overlay').style.display = 'none';

    } catch (error) {
        document.getElementById('overlay').style.display = 'none';
        console.error('Error in loadImage function:', error.message);
    }
}

function loadLocalStorageData() {
    const fields = [
        'companyName', 'companyAddress', 'username', 'password',
        'firstName', 'lastName', 'address', 'phone', 'email'
    ];

    fields.forEach(field => {
        if (field === "phone") {
            const value = localStorage.getItem(field);
            if (value) {
                const element = document.getElementById(field);
                if (element) {
                    element.value = formatPhoneNumber2(value);
                } else {
                    console.error(`Element with id ${field} not found`);
                }
            }
        }
        else {
            const value = localStorage.getItem(field);
            if (value) {
                const element = document.getElementById(field);
                if (element) {
                    element.value = value;
                } else {
                    console.error(`Element with id ${field} not found`);
                }
            }
        }
    });
}

function initializeFormSubmission() {
    document.getElementById('settingsForm').addEventListener('submit', function (event) {
        event.preventDefault();

        let isValid = validateForm();
        if (isValid) {
            saveFormDataToLocalStorage();
            updateApiData();
            // displaySuccessMessage();
        }
    });
}

function validateForm() {
    let isValid = true;

    isValid &= validateField('email', 'Invalid email format', /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    isValid &= validPhoneno();
    isValid &= validateField('firstName', 'Only use letters and spaces', /^[a-zA-Z\s]+$/);
    isValid &= validateField('lastName', 'Only use letters and spaces', /^[a-zA-Z\s]+$/);
    isValid &= validatePassword();

    return !!isValid; // Convert to boolean
}

function validateField(id, errorMessage, pattern) {
    const value = document.getElementById(id).value;
    if (value.trim() === '' || !pattern.test(value)) {
        showError(document.getElementById(id), value.trim() === '' ? 'This field is required' : errorMessage);
        return false;
    }
    clearError(document.getElementById(id));
    return true;
}

function validatePassword() {
    const password = document.getElementById('password').value;
    if (password.trim() === '' || password.length < 8) {
        showError(document.getElementById('password'), password.trim() === '' ? 'Password is required' : 'Password must be at least 8 characters');
        return false;
    }
    clearError(document.getElementById('password'));
    return true;
}

function showError(input, message) {
    clearError(input);
    const error = document.createElement('span');
    error.className = 'error';
    error.innerText = message;
    input.parentElement.appendChild(error);
}

function clearError(input) {
    const error = input.parentElement.querySelector('.error');
    if (error) {
        error.remove();
    }
}

function validPhoneno() {
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('showMsg3');
    const phoneNumber = phoneInput.value;
    const phoneRegex = /^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/;

    if (phoneNumber === "") {
        phoneError.textContent = 'Enter phone number.';
        return false;
    } else if (!phoneRegex.test(phoneNumber)) {
        phoneError.textContent = 'Invalid phone number.';
        return false;
    } else {
        phoneError.textContent = '';
        return true;
    }
}

function formatPhoneNumber() {
    const inputField = document.getElementById('phone');
    let value = inputField.value;
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');
    // Format the phone number
    if (value.length > 3 && value.length <= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length > 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    inputField.value = value;
}

function formatPhoneNumber2(phoneNumber) {
    // Remove any non-digit characters from the input
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Check if the cleaned number has the expected length (10 digits for this format)
    if (cleaned.length !== 10) {
        // throw new Error('Invalid phone number length');
        return phoneNumber;
    }

    // Format the cleaned number
    const areaCode = cleaned.substring(0, 3);
    const centralOfficeCode = cleaned.substring(3, 6);
    const lineNumber = cleaned.substring(6);

    return `(${areaCode}) ${centralOfficeCode}-${lineNumber}`;
}

function handleFileSelect(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('companyLogo').value = input.files[0].name;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function loadFile(event) {
    const logoImg = document.getElementById('logo-img');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            logoImg.src = e.target.result; // Set the image source to the file's data URL
            localStorage.setItem("imageFile", e.target.result); // Store the data URL in localStorage
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
}

function dataURLToBlob(dataURL) {
    const parts = dataURL.split(',');
    const mimeType = parts[0].match(/:(.*?);/)[1];
    const byteString = atob(parts[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: mimeType });
}

function saveFormDataToLocalStorage() {
    const fields = [
        'companyName', 'companyAddress', 'username', 'password',
        'firstName', 'lastName', 'address', 'phone', 'email'
    ];

    fields.forEach(field => {
        localStorage.setItem(field, document.getElementById(field).value);
    });
}

const customerAPIUrlBase = `https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/customer`;
const companyAPIUrlBase = `https://397vncv6uh.execute-api.us-west-2.amazonaws.com/test/company`;

function updateApiData() {
    if (!cid || !customerId1) {
        console.error("UUID or CustomerID is missing in localStorage");
        return;
    }

    const customerApiUrl = `${customerAPIUrlBase}/update/${customerId1}`;
    const companyApiUrl = `${companyAPIUrlBase}/update/${cid}`;

    const customerData = {
        CustomerID: customerId1,
        CID: cid,
        FName: document.getElementById('firstName').value,
        LName: document.getElementById('lastName').value,
        Address: document.getElementById('address').value,
        PhoneNumber: document.getElementById('phone').value,
        Email: document.getElementById('email').value,
        IsActive: true
    };

    const companyData = {
        CID: cid,
        UserName: document.getElementById('username').value,
        CName: document.getElementById('companyName').value,
        CAddress: document.getElementById('companyAddress').value,
        CLogo: localStorage.getItem("imageFile"),
        Password: document.getElementById("password").value,
        ReportType: "Weekly"
    };

    Promise.all([
        fetch(customerApiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        }),
        fetch(companyApiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(companyData)
        })
    ])
        .then(responses => Promise.all(responses.map(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        })))
        .then(data => {
            console.log('Update successful:', data);
        })
        .catch(error => {
            console.error('Error updating data:', error);
        });
}

// function displaySuccessMessage() {
//     const messageContainer = document.getElementById('messageContainer');
//     messageContainer.textContent = 'Update successful!';
//     messageContainer.style.color = 'green';
// }
