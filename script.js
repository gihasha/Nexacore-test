// ===== GLOBAL STATE =====
let isLoggedIn = false;
let currentUser = null;

let profileData = {
    nickname: 'Tech Explorer',
    username: 'guest_user',
    email: 'guest@nexacore.com',
    phone: null,
    phoneVerified: false,
    profileImage: null,
    twoFactorEnabled: false,
    loginAlerts: false,
    smsNotifications: false,
    emailNotifications: true,
    language: 'en',
    currency: 'LKR'
};

let paymentHistory = [
    { date: '2025-02-10', amount: 'රු 5,000', method: 'Visa •• 4242', status: 'Completed', receipt: '#INV-001' },
    { date: '2025-02-05', amount: 'රු 2,500', method: 'Mastercard •• 8888', status: 'Completed', receipt: '#INV-002' },
    { date: '2025-01-28', amount: 'රු 1,200', method: 'Bank Transfer', status: 'Completed', receipt: '#INV-003' }
];

// ===== PAGE NAVIGATION =====
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(`${page}-page`).classList.add('active');
    
    // Update URL without reload
    history.pushState({}, '', `/?page=${page}`);
    
    // Close sidebar if open
    const offcanvas = document.getElementById('nexaSidebar');
    if (offcanvas.classList.contains('show')) {
        bootstrap.Offcanvas.getInstance(offcanvas)?.hide();
    }
}

// ===== CHECK AUTH ON LOAD =====
function checkAuth() {
    const savedUser = localStorage.getItem('nexacore_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            isLoggedIn = true;
            profileData = { ...profileData, ...currentUser };
        } catch (e) {
            console.error('Failed to parse user data');
        }
    }
    
    const savedImage = localStorage.getItem('nexacore_profile_image');
    if (savedImage) {
        profileData.profileImage = savedImage;
        document.getElementById('sidebarProfileImg').src = savedImage;
    }
    
    updateSidebarProfile();
}

// ===== LOGIN =====
function handleLogin() {
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }
    
    // Demo login - in real app this would call an API
    isLoggedIn = true;
    currentUser = {
        email: email,
        nickname: email.split('@')[0],
        username: email.split('@')[0],
        twoFactorEnabled: false,
        loginAlerts: false,
        language: 'en',
        currency: 'LKR'
    };
    
    profileData = { ...profileData, ...currentUser };
    
    localStorage.setItem('nexacore_user', JSON.stringify(currentUser));
    
    updateSidebarProfile();
    navigateTo('dashboard');
    alert('✅ Logged in successfully! (Demo)');
}

// ===== SIGNUP =====
function handleSignup() {
    const email = document.getElementById('signupEmail')?.value;
    const password = document.getElementById('signupPassword')?.value;
    const confirm = document.getElementById('signupConfirmPassword')?.value;
    
    if (!email || !password) {
        alert('Please fill all fields');
        return;
    }
    
    if (password !== confirm) {
        alert('Passwords do not match');
        return;
    }
    
    isLoggedIn = true;
    currentUser = {
        email: email,
        nickname: email.split('@')[0],
        username: email.split('@')[0],
        twoFactorEnabled: false,
        loginAlerts: false
    };
    
    profileData = { ...profileData, ...currentUser };
    localStorage.setItem('nexacore_user', JSON.stringify(currentUser));
    
    updateSidebarProfile();
    navigateTo('dashboard');
    alert('✅ Account created! (Demo)');
}

// ===== LOGOUT =====
function handleLogout() {
    isLoggedIn = false;
    currentUser = null;
    
    profileData = {
        nickname: 'Tech Explorer',
        username: 'guest_user',
        email: 'guest@nexacore.com',
        phone: null,
        phoneVerified: false,
        profileImage: localStorage.getItem('nexacore_profile_image'),
        twoFactorEnabled: false,
        loginAlerts: false,
        smsNotifications: false,
        emailNotifications: true,
        language: profileData.language || 'en',
        currency: profileData.currency || 'LKR'
    };
    
    localStorage.removeItem('nexacore_user');
    
    updateSidebarProfile();
    navigateTo('dashboard');
    
    const offcanvas = document.getElementById('nexaSidebar');
    if (offcanvas.classList.contains('show')) {
        bootstrap.Offcanvas.getInstance(offcanvas)?.hide();
    }
}

// ===== PROFILE UPLOAD =====
function handleProfileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImg = document.getElementById('profilePreviewImg');
            const previewIcon = document.getElementById('profilePreviewIcon');
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            previewIcon.style.display = 'none';
            document.getElementById('sidebarProfileImg').src = e.target.result;
            profileData.profileImage = e.target.result;
            localStorage.setItem('nexacore_profile_image', e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// ===== SAVE PROFILE =====
function saveProfile() {
    const nickname = document.getElementById('nicknameInput')?.value || profileData.nickname;
    const username = document.getElementById('usernameInput')?.value || profileData.username;
    const fullName = document.getElementById('fullNameInput')?.value || '';
    const bio = document.getElementById('bioInput')?.value || '';
    const whatsapp = document.getElementById('whatsappInput')?.value || '';
    const telegram = document.getElementById('telegramInput')?.value || '';
    
    profileData.nickname = nickname;
    profileData.username = username;
    
    if (currentUser) {
        currentUser.nickname = nickname;
        currentUser.username = username;
        localStorage.setItem('nexacore_user', JSON.stringify(currentUser));
    }
    
    updateSidebarProfile();
    alert('✅ Profile updated! (Demo)');
    navigateTo('dashboard');
}

// ===== UPDATE SIDEBAR =====
function updateSidebarProfile() {
    document.getElementById('sidebarNickname').textContent = profileData.nickname;
    document.getElementById('sidebarUsername').textContent = '@' + profileData.username;
    document.getElementById('sidebarEmail').textContent = profileData.email;
    
    const savedImage = localStorage.getItem('nexacore_profile_image');
    if (savedImage) {
        document.getElementById('sidebarProfileImg').src = savedImage;
    }
    
    // Update settings page
    const emailDisplay = document.getElementById('currentEmailDisplay');
    if (emailDisplay) emailDisplay.textContent = profileData.email;
    
    const modalEmail = document.getElementById('modalCurrentEmail');
    if (modalEmail) modalEmail.textContent = profileData.email;
    
    const phoneDisplay = document.getElementById('currentPhoneDisplay');
    if (phoneDisplay) {
        if (profileData.phoneVerified) {
            phoneDisplay.textContent = profileData.phone + ' (Verified)';
            phoneDisplay.style.color = 'var(--nexa-success)';
        } else {
            phoneDisplay.textContent = 'Not verified';
            phoneDisplay.style.color = 'var(--nexa-text-dim)';
        }
    }
    
    // Update toggle buttons
    const twoFactorBtn = document.getElementById('2faButton');
    if (twoFactorBtn) {
        twoFactorBtn.textContent = profileData.twoFactorEnabled ? 'Disable' : 'Enable';
    }
    
    const loginAlertsBtn = document.getElementById('loginAlertsButton');
    if (loginAlertsBtn) {
        loginAlertsBtn.textContent = profileData.loginAlerts ? 'Disable' : 'Enable';
    }
    
    const smsBtn = document.getElementById('smsButton');
    if (smsBtn) {
        smsBtn.textContent = profileData.smsNotifications ? 'Disable' : 'Enable';
    }
    
    const emailNotifBtn = document.getElementById('emailNotifButton');
    if (emailNotifBtn) {
        emailNotifBtn.textContent = profileData.emailNotifications ? 'Disable' : 'Enable';
    }
    
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) languageSelect.value = profileData.language;
    
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) currencySelect.value = profileData.currency;
}

// ===== SETTINGS TOGGLES =====
function toggle2FA() {
    profileData.twoFactorEnabled = !profileData.twoFactorEnabled;
    updateSidebarProfile();
    alert(profileData.twoFactorEnabled ? '✅ 2FA Enabled' : '2FA Disabled');
}

function toggleLoginAlerts() {
    profileData.loginAlerts = !profileData.loginAlerts;
    updateSidebarProfile();
    alert(profileData.loginAlerts ? '✅ Login Alerts Enabled' : 'Login Alerts Disabled');
}

function toggleSMS() {
    if (!profileData.phoneVerified) {
        alert('⚠️ Please add and verify a phone number first');
        openVerifyPhoneModal();
        return;
    }
    
    profileData.smsNotifications = !profileData.smsNotifications;
    updateSidebarProfile();
    alert(profileData.smsNotifications ? '✅ SMS Notifications Enabled' : 'SMS Notifications Disabled');
}

function toggleEmailNotifications() {
    profileData.emailNotifications = !profileData.emailNotifications;
    updateSidebarProfile();
    alert(profileData.emailNotifications ? '✅ Email Notifications Enabled' : 'Email Notifications Disabled');
}

// ===== LANGUAGE =====
function changeLanguage(lang) {
    profileData.language = lang;
    localStorage.setItem('nexacore_language', lang);
    
    if (window.google && google.translate) {
        const select = document.querySelector('select.goog-te-combo');
        if (select) {
            select.value = lang;
            select.dispatchEvent(new Event('change'));
        }
    }
    alert(`🌐 Language changed to ${lang}`);
}

function updateCurrency(currency) {
    profileData.currency = currency;
    localStorage.setItem('nexacore_currency', currency);
    alert(`💰 Currency set to ${currency}`);
}

// ===== EMAIL VERIFICATION (DEMO) =====
function sendEmailVerification() {
    const newEmail = document.getElementById('newEmailInput')?.value;
    if (!newEmail) {
        alert('Please enter new email');
        return;
    }
    
    document.getElementById('emailStep1').style.display = 'none';
    document.getElementById('emailStep2').style.display = 'block';
    document.getElementById('verificationEmailDisplay').textContent = profileData.email;
    sessionStorage.setItem('pending_email', newEmail);
    
    alert(`📧 Demo: Verification code 123456 sent to ${profileData.email}`);
}

function verifyEmailCode() {
    const code = 
        document.getElementById('code1')?.value +
        document.getElementById('code2')?.value +
        document.getElementById('code3')?.value +
        document.getElementById('code4')?.value +
        document.getElementById('code5')?.value +
        document.getElementById('code6')?.value;
    
    if (code.length !== 6) {
        alert('Please enter 6-digit code');
        return;
    }
    
    // Demo verification - any code works
    const newEmail = sessionStorage.getItem('pending_email');
    profileData.email = newEmail;
    
    if (currentUser) {
        currentUser.email = newEmail;
        localStorage.setItem('nexacore_user', JSON.stringify(currentUser));
    }
    
    document.getElementById('currentEmailDisplay').textContent = newEmail;
    document.getElementById('modalCurrentEmail').textContent = newEmail;
    document.getElementById('sidebarEmail').textContent = newEmail;
    
    alert('✅ Email updated!');
    bootstrap.Modal.getInstance(document.getElementById('changeEmailModal')).hide();
    
    setTimeout(() => {
        document.getElementById('emailStep1').style.display = 'block';
        document.getElementById('emailStep2').style.display = 'none';
        sessionStorage.removeItem('pending_email');
    }, 300);
}

function resendEmailCode() {
    alert('📧 Demo: New code 123456 sent');
}

// ===== PHONE VERIFICATION (DEMO) =====
function sendPhoneVerification() {
    const phone = document.getElementById('phoneNumberInput')?.value;
    if (!phone) {
        alert('Please enter phone');
        return;
    }
    
    if (!phone.match(/^\+94[0-9]{9}$/)) {
        alert('Use format: +94XXXXXXXXX');
        return;
    }
    
    document.getElementById('phoneStep1').style.display = 'none';
    document.getElementById('phoneStep2').style.display = 'block';
    document.getElementById('phoneNumberDisplay').textContent = phone;
    sessionStorage.setItem('pending_phone', phone);
    
    alert(`📱 Demo: SMS with code 123456 sent to ${phone}`);
}

function verifyPhoneCode() {
    const code = 
        document.getElementById('phoneCode1')?.value +
        document.getElementById('phoneCode2')?.value +
        document.getElementById('phoneCode3')?.value +
        document.getElementById('phoneCode4')?.value +
        document.getElementById('phoneCode5')?.value +
        document.getElementById('phoneCode6')?.value;
    
    if (code.length !== 6) {
        alert('Please enter 6-digit code');
        return;
    }
    
    const phone = sessionStorage.getItem('pending_phone');
    profileData.phone = phone;
    profileData.phoneVerified = true;
    
    document.getElementById('currentPhoneDisplay').textContent = phone + ' (Verified)';
    document.getElementById('currentPhoneDisplay').style.color = 'var(--nexa-success)';
    
    alert('✅ Phone verified!');
    bootstrap.Modal.getInstance(document.getElementById('verifyPhoneModal')).hide();
    
    setTimeout(() => {
        document.getElementById('phoneStep1').style.display = 'block';
        document.getElementById('phoneStep2').style.display = 'none';
        sessionStorage.removeItem('pending_phone');
    }, 300);
}

// ===== SECURITY QUESTIONS =====
function addSecurityQuestion() {
    const container = document.getElementById('securityQuestionsContainer');
    const div = document.createElement('div');
    div.className = 'security-question-item mb-3';
    div.innerHTML = `
        <select class="form-select mb-2">
            <option>What is your favorite book?</option>
            <option>What was your first car?</option>
            <option>What is your dream job?</option>
        </select>
        <input type="text" class="form-control" placeholder="Your answer">
    `;
    container.appendChild(div);
}

function saveSecurityQuestions() {
    alert('✅ Security questions saved!');
    navigateTo('settings');
}

// ===== PAYMENT =====
function openAddCardModal() {
    new bootstrap.Modal(document.getElementById('addCardModal')).show();
}

function addPaymentMethod() {
    const cardNumber = document.getElementById('cardNumber')?.value;
    const expiry = document.getElementById('expiryDate')?.value;
    const cvv = document.getElementById('cvv')?.value;
    const holder = document.getElementById('cardHolder')?.value;
    
    if (!cardNumber || !expiry || !cvv || !holder) {
        alert('Please fill all fields');
        return;
    }
    
    alert('✅ Card added!');
    bootstrap.Modal.getInstance(document.getElementById('addCardModal')).hide();
}

function viewPaymentHistory() {
    const tbody = document.getElementById('paymentHistoryBody');
    tbody.innerHTML = '';
    
    paymentHistory.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.date}</td>
                <td>${p.amount}</td>
                <td>${p.method}</td>
                <td><span style="color: var(--nexa-success);">${p.status}</span></td>
                <td><button class="btn-settings" onclick="downloadReceipt('${p.receipt}')">Download</button></td>
            </tr>
        `;
    });
    
    new bootstrap.Modal(document.getElementById('paymentHistoryModal')).show();
}

function downloadReceipt(id) {
    alert(`✅ Receipt ${id} downloaded (Demo)`);
}

// ===== MODALS =====
function openChangeEmailModal() {
    new bootstrap.Modal(document.getElementById('changeEmailModal')).show();
}

function openVerifyPhoneModal() {
    new bootstrap.Modal(document.getElementById('verifyPhoneModal')).show();
}

function openChangePasswordModal() {
    alert('📧 Demo: Password reset link sent to your email');
}

function openForgotPasswordModal() {
    new bootstrap.Modal(document.getElementById('forgotPasswordModal')).show();
}

function sendPasswordReset() {
    const email = document.getElementById('resetEmail')?.value;
    if (!email) {
        alert('Please enter email');
        return;
    }
    alert(`
