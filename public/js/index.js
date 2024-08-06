document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('signup.html')) {
        const formContainer = document.querySelector('.card');
        formContainer.style.opacity = 0;
        formContainer.style.transform = 'scale(0.9)';
        setTimeout(() => {
            formContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            formContainer.style.opacity = 1;
            formContainer.style.transform = 'scale(1)';
        }, 100);

        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            console.log('Signup form found');
            signupForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const form = event.target;
                const email = document.getElementById('email').value;
                const emailValid = validateEmail(email);

                if (!emailValid) {
                    document.getElementById('email').classList.add('is-invalid');
                    document.getElementById('email-error').textContent = "Please provide a valid email address.";
                    event.stopPropagation();
                } else {
                    document.getElementById('email').classList.remove('is-invalid');
                    document.getElementById('email-error').textContent = "";
                    if (form.checkValidity() === false) {
                        event.stopPropagation();
                    } else {
                        // Submit the form
                        submitForm();
                    }
                    form.classList.add('was-validated');
                }
            });
        } else {
            console.error('Signup form not found');
        }
    }

    if (window.location.pathname.includes('signin.html')) {
        const signinForm = document.getElementById('signin-form');
        if (signinForm) {
            signinForm.addEventListener('submit', function(event) {
                event.preventDefault();
                // Simulating successful sign-in
                window.location.href = 'home.html';
            });
        } else {
            console.error('Signin form not found');
        }
    }
});

function validateEmail(email) {
    return validator.isEmail(email);
}

function submitForm() {
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        window.location.href = 'signin.html';
    })
    .catch(error => {
        handleRegistrationError(error.message);
    });
}

function handleRegistrationError(errorMessage) {
    const emailInput = document.getElementById('email');
    if (errorMessage.includes('E11000 duplicate key error collection')) {
        emailInput.classList.add('is-invalid');
        document.getElementById('email-error').textContent = "This email is already registered. Please use a different email.";
    } else {
        alert(`Registration failed: ${errorMessage}`);
    }
}
    