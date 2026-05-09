let btn = document.getElementById('scrollHintBtn');
let hint = document.getElementById('scrollHintText');

btn.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
    hint.classList.add('visible');
    setTimeout(() => {
        hint.classList.remove('visible');
    }, 3000);
});

let toggleBtn = document.getElementById('togglePatternsBtn');
let extra = document.getElementById('patternsExtraContent');

if (toggleBtn && extra) {
    toggleBtn.addEventListener('click', function() {
        extra.classList.toggle('show');
        this.classList.toggle('active');
        let txt = this.querySelector('.btn-text');
        if (extra.classList.contains('show')) {
            txt.textContent = 'Скрыть подробности';
        } else {
            txt.textContent = 'Показать подробности';
        }
    });
}

let links = document.querySelectorAll('.nav-link');

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        let id = link.getAttribute('data-section');
        let target = document.getElementById(id);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

let currentMode = 'login';

function openModal(mode) {
    currentMode = mode;
    const modal = document.getElementById('authModal');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    const switchText = document.getElementById('switchText');
    
    if (mode === 'login') {
        modalTitle.textContent = 'Вход';
        submitBtn.textContent = 'Войти';
        switchText.innerHTML = 'Нет аккаунта? <span onclick="switchMode()">Зарегистрироваться</span>';
    } else {
        modalTitle.textContent = 'Регистрация';
        submitBtn.textContent = 'Зарегистрироваться';
        switchText.innerHTML = 'Уже есть аккаунт? <span onclick="switchMode()">Войти</span>';
    }
    
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('usernameError').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchMode() {
    if (currentMode === 'login') {
        openModal('register');
    } else {
        openModal('login');
    }
}

document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    
    usernameError.style.display = 'none';
    passwordError.style.display = 'none';
    
    if (!username || !password) {
        if (!username) {
            usernameError.textContent = 'Введите имя пользователя';
            usernameError.style.display = 'block';
        }
        if (!password) {
            passwordError.textContent = 'Введите пароль';
            passwordError.style.display = 'block';
        }
        return;
    }
    
    if (currentMode === 'register') {
        let users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[username]) {
            usernameError.textContent = 'Пользователь с таким именем уже существует';
            usernameError.style.display = 'block';
            return;
        }
        
        if (password.length < 3) {
            passwordError.textContent = 'Пароль должен содержать минимум 3 символа';
            passwordError.style.display = 'block';
            return;
        }
        
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        
        localStorage.setItem('currentUser', username);
        updateUIBasedOnAuth();
        closeModal();
        
    } else if (currentMode === 'login') {
        let users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (!users[username]) {
            usernameError.textContent = 'Пользователь не найден';
            usernameError.style.display = 'block';
            return;
        }
        
        if (users[username] !== password) {
            passwordError.textContent = 'Неверный пароль';
            passwordError.style.display = 'block';
            return;
        }
        
        localStorage.setItem('currentUser', username);
        updateUIBasedOnAuth();
        closeModal();
    }
});

function logout() {
    localStorage.removeItem('currentUser');
    updateUIBasedOnAuth();
}

function updateUIBasedOnAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    
    if (currentUser) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        userName.textContent = currentUser;
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
    }
}

document.getElementById('authModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

updateUIBasedOnAuth();