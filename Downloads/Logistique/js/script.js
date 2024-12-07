const users = [
    { username: 'caissier24', password: 'hello', redirectUrl: './caissier/jesyon.html' },
    { username: 'DrErla24', password: 'Erla', redirectUrl: 'dashboard.html' },
    { username: 'meow', password: 'meow', redirectUrl: 'jesyon.html' }
];

const form = document.getElementById('loginForm');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = sanitizeInput(document.getElementById('username').value);
    const password = sanitizeInput(document.getElementById('password').value);

    validateCredentials(username, password);
});

function sanitizeInput(input) {
    return input ? input.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim() : '';
}

function validateCredentials(username, password) {
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        showMessage('Connexion réussie!', 'success');
        setTimeout(() => {
            window.location.href = user.redirectUrl;
        }, 1000);
    } else {
        showMessage('Nom d\'utilisateur ou mot de passe incorrect.', 'error');
        form.reset();
    }
}

function showMessage(messageText, messageType) {
    const message = document.getElementById('message');
    message.textContent = messageText;
    message.className = messageType;
    message.style.display = 'block';
    setTimeout(() => {
        message.style.display = 'none';
    }, 2000);
}

document.getElementById('togglePassword').addEventListener('click', (event) => {
    event.preventDefault();
    const passwordField = document.getElementById('password');
    const icon = document.getElementById('togglePassword');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordField.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
});

const usernameField = document.getElementById('username');
const passwordField = document.getElementById('password');

usernameField.addEventListener('input', handleInput);
passwordField.addEventListener('input', handleInput);

function handleInput() {
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = !(usernameField.value.trim() && passwordField.value.trim());
}

usernameField.addEventListener('focus', () => {
    usernameField.style.borderColor = '#4CAF50';
});
usernameField.addEventListener('blur', () => {
    usernameField.style.borderColor = '';
});

passwordField.addEventListener('focus', () => {
    passwordField.style.borderColor = '#4CAF50';
});
passwordField.addEventListener('blur', () => {
    passwordField.style.borderColor = '';
});
