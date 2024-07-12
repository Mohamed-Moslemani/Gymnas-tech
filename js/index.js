document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.querySelector('.dark-form-container');

    formContainer.style.opacity = 0;
    formContainer.style.transform = 'scale(0.9)';
    setTimeout(() => {
        formContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        formContainer.style.opacity = 1;
        formContainer.style.transform = 'scale(1)';
    }, 100);
});
