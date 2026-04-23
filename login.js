// NIDA-Pad Login System

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('nida-pad-user');
    if (currentUser) {
        window.location.href = 'app.html';
        return;
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(loginForm);
        const userData = {
            name: formData.get('userName'),
            position: formData.get('position'),
            vehicle: formData.get('vehicle'),
            station: formData.get('station') || '',
            shift: formData.get('shift'),
            loginTime: new Date().toISOString()
        };
        
        // Validate required fields
        if (!userData.name || !userData.position || !userData.vehicle || !userData.shift) {
            showNotification('Bitte alle Pflichtfelder ausfüllen!', 'error');
            return;
        }
        
        // Save user data
        localStorage.setItem('nida-pad-user', JSON.stringify(userData));
        
        showNotification('Anmeldung erfolgreich!', 'success');
        
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 800);
    });
    
    // Auto-fill last used data
    const lastUser = localStorage.getItem('nida-pad-last-user');
    if (lastUser) {
        const data = JSON.parse(lastUser);
        document.getElementById('user-name').value = data.name || '';
        document.getElementById('position').value = data.position || '';
        document.getElementById('vehicle').value = data.vehicle || '';
        document.getElementById('station').value = data.station || '';
        document.getElementById('shift').value = data.shift || '';
    }
    
    // Save form data on change
    const inputs = loginForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            const formData = new FormData(loginForm);
            const tempData = {
                name: formData.get('userName'),
                position: formData.get('position'),
                vehicle: formData.get('vehicle'),
                station: formData.get('station'),
                shift: formData.get('shift')
            };
            localStorage.setItem('nida-pad-last-user', JSON.stringify(tempData));
        });
    });
});

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 18px;
        border-radius: 4px;
        color: white;
        font-weight: 600;
        font-size: 13px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    const colors = {
        'success': '#27ae60',
        'error': '#c0392b',
        'info': '#3498db',
        'warning': '#f39c12'
    };
    
    notification.style.background = colors[type] || colors.info;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
