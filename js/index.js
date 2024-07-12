document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.querySelector('.dark-form-container');
    const logo = document.querySelector('.logo');

    // Add a simple fade-in effect to the form container on load
    formContainer.style.opacity = 0;
    formContainer.style.transform = 'scale(0.9)';
    setTimeout(() => {
        formContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        formContainer.style.opacity = 1;
        formContainer.style.transform = 'scale(1)';
    }, 100);

    logo.addEventListener('mouseover', () => {
        logo.style.transform = 'rotate(360deg)';
        logo.style.transition = 'transform 0.5s ease';
    });

    logo.addEventListener('mouseout', () => {
        logo.style.transform = 'rotate(0deg)';
    });
});
