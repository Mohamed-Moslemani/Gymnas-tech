document.addEventListener('DOMContentLoaded', () => {
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

      signupForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          const firstName = document.getElementById('fname').value;
          const lastName = document.getElementById('lname').value;
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;

          if (!validateEmail(email)) {
              alert('Please enter a valid email address.');
              return;
          }

          console.log('Submitting registration form:', { firstName, lastName, email, password });

          try {
              const response = await fetch('http://localhost:3000/register', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ firstName, lastName, email, password }),
              });

              if (response.ok) {
                  console.log('Registration successful');
                  window.location.href = 'signin.html';
              } else {
                  const data = await response.json();
                  alert('Registration failed: ' + data.message);
                  console.log('Error response:', data);
              }
          } catch (error) {
              console.error('Error during registration:', error);
          }
      });
  } else {
      console.log('Signup form not found');
  }

  const signinForm = document.getElementById('signin-form');
  if (signinForm) {
      console.log('Signin form found');

      signinForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          const email = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          console.log('Submitting login form:', { email, password });

          try {
              const response = await fetch('http://localhost:3000/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email, password }),
              });

              const data = await response.json();
              if (response.ok) {
                  console.log('Login successful');
                  localStorage.setItem('token', data.token);
                  window.location.href = 'home.html';  // Redirect to home.html
              } else {
                  alert('Login failed: ' + data.message);
                  console.log('Error response:', data);
              }
          } catch (error) {
              console.error('Error during login:', error);
          }
      });
  } else {
      console.log('Signin form not found');
  }
});

// Email validation function
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}
