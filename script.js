// NIDA-Pad Rettungsdienst Tablet JavaScript

// Global Variables
let currentTab = 'patient';
let ekgAnimation = null;
let vitalsInterval = null;
let medicationData = [];
let protocolData = [];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('nida-pad-user');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    initializeApp();
});

function initializeApp() {
    setupUserInfo();
    setupTabNavigation();
    setupTimeDisplay();
    setupPatientForm();
    setupVitalsMonitoring();
    setupEKGMonitoring();
    setupMedicationForm();
    setupProtocolForm();
    setupUrgencySelector();
    setupFooterButtons();
    startVitalsSimulation();
}

function setupUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('nida-pad-user'));
    if (currentUser) {
        // Update header with user info
        const patientInfo = document.querySelector('.patient-info');
        if (patientInfo) {
            const positionLabels = {
                'RH': 'RH', 'RH-A': 'RH i.A.', 'RS': 'RS', 'RS-A': 'RS i.A.',
                'NFS': 'NFS', 'NFS-A': 'NFS i.A.', 'NA': 'NA', 'LNA': 'LNA',
                'OrgL': 'OrgL', 'Fahrer': 'Fahrer', 'Praktikant': 'Praktikant'
            };
            const posLabel = positionLabels[currentUser.position] || currentUser.position;
            patientInfo.innerHTML = `
                <span class="patient-name">${currentUser.name} | ${posLabel}</span>
                <span class="patient-id">${currentUser.vehicle}</span>
            `;
        }
        
        // Add logout button to header
        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'logout-btn';
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Abmelden';
            logoutBtn.addEventListener('click', logout);
            headerRight.appendChild(logoutBtn);
        }
    }
}

function logout() {
    if (confirm('Möchten Sie sich wirklich abmelden?')) {
        localStorage.removeItem('nida-pad-user');
        window.location.href = 'index.html';
    }
}

// Tab Navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            currentTab = targetTab;
            
            // Initialize tab-specific features
            if (targetTab === 'ekg') {
                initializeEKGCanvas();
            } else if (targetTab === 'vitals') {
                initializeVitalsChart();
            }
        });
    });
}

// Time Display
function setupTimeDisplay() {
    updateTime();
    setInterval(updateTime, 1000);
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('de-DE', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Patient Form
function setupPatientForm() {
    const dobInput = document.getElementById('patient-dob');
    const ageInput = document.getElementById('patient-age');
    
    if (dobInput && ageInput) {
        dobInput.addEventListener('change', function() {
            const dob = new Date(this.value);
            const today = new Date();
            const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
            ageInput.value = age;
        });
        
        // Calculate initial age
        const event = new Event('change');
        dobInput.dispatchEvent(event);
    }
    
    // Update patient name in header
    const nameInput = document.getElementById('patient-name');
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            const patientNameElement = document.querySelector('.patient-name');
            if (patientNameElement) {
                const name = this.value || 'Unbekannt';
                patientNameElement.textContent = name;
            }
        });
    }
}

// Urgency Selector
function setupUrgencySelector() {
    const urgencyButtons = document.querySelectorAll('.urgency-btn');
    
    urgencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            urgencyButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Vitals Monitoring
function setupVitalsMonitoring() {
    // Add manual vitals input functionality
    const vitalCards = document.querySelectorAll('.vital-card');
    vitalCards.forEach(card => {
        card.addEventListener('dblclick', function() {
            const valueElement = this.querySelector('.vital-value span:first-child');
            if (valueElement) {
                const currentValue = valueElement.textContent;
                const newValue = prompt('Neuer Wert eingeben:', currentValue);
                if (newValue !== null && !isNaN(newValue)) {
                    valueElement.textContent = newValue;
                    updateVitalTrend(this, currentValue, newValue);
                }
            }
        });
    });
}

function startVitalsSimulation() {
    vitalsInterval = setInterval(() => {
        if (currentTab === 'vitals') {
            simulateVitalChanges();
        }
    }, 3000);
}

function simulateVitalChanges() {
    // Simulate small variations in vitals
    const heartRate = document.getElementById('heart-rate');
    const spo2 = document.getElementById('spo2');
    const respiratoryRate = document.getElementById('respiratory-rate');
    
    if (heartRate) {
        const currentHR = parseInt(heartRate.textContent);
        const newHR = currentHR + Math.floor(Math.random() * 5) - 2; // ±2 bpm
        heartRate.textContent = Math.max(60, Math.min(100, newHR));
    }
    
    if (spo2) {
        const currentSpO2 = parseInt(spo2.textContent);
        const newSpO2 = currentSpO2 + Math.floor(Math.random() * 3) - 1; // ±1%
        spo2.textContent = Math.max(94, Math.min(100, newSpO2));
    }
    
    if (respiratoryRate) {
        const currentRR = parseInt(respiratoryRate.textContent);
        const newRR = currentRR + Math.floor(Math.random() * 3) - 1; // ±1
        respiratoryRate.textContent = Math.max(12, Math.min(20, newRR));
    }
}

function updateVitalTrend(card, oldValue, newValue) {
    const trendElement = card.querySelector('.vital-trend');
    if (trendElement) {
        const icon = trendElement.querySelector('i');
        const text = trendElement.querySelector('span:last-child');
        
        if (newValue > oldValue) {
            icon.className = 'fas fa-arrow-up';
            text.textContent = 'Steigend';
        } else if (newValue < oldValue) {
            icon.className = 'fas fa-arrow-down';
            text.textContent = 'Fallend';
        } else {
            icon.className = 'fas fa-arrow-right';
            text.textContent = 'Stabil';
        }
    }
}

// EKG Monitoring
function setupEKGMonitoring() {
    const startBtn = document.getElementById('ekg-start');
    const pauseBtn = document.getElementById('ekg-pause');
    const resetBtn = document.getElementById('ekg-reset');
    
    if (startBtn) {
        startBtn.addEventListener('click', startEKGAnimation);
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', pauseEKGAnimation);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetEKGAnimation);
    }
}

function initializeEKGCanvas() {
    const canvas = document.getElementById('ekg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        
        // Draw grid
        drawEKGGrid(ctx, canvas.width, canvas.height);
    }
}

function drawEKGGrid(ctx, width, height) {
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function startEKGAnimation() {
    const canvas = document.getElementById('ekg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let x = 0;
    let y = canvas.height / 2;
    
    if (ekgAnimation) {
        cancelAnimationFrame(ekgAnimation);
    }
    
    function animate() {
        // Clear only the area we're drawing on
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x, 0, 5, canvas.height);
        
        // Draw EKG wave pattern
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Simple EKG pattern
        const amplitude = 30;
        const frequency = 0.1;
        
        y = canvas.height / 2 + Math.sin(x * frequency) * amplitude;
        
        if (x % 100 < 10) {
            // P wave
            y = canvas.height / 2 + Math.sin((x % 100) * 0.3) * 10;
        } else if (x % 100 < 20) {
            // QRS complex
            y = canvas.height / 2 - Math.sin((x % 100 - 10) * 0.5) * amplitude;
        } else if (x % 100 < 30) {
            // T wave
            y = canvas.height / 2 + Math.sin((x % 100 - 20) * 0.2) * 15;
        }
        
        ctx.moveTo(x, y);
        ctx.lineTo(x + 1, y);
        ctx.stroke();
        
        x += 2;
        if (x > canvas.width) {
            x = 0;
        }
        
        ekgAnimation = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Update heart rate display
    updateEKGHeartRate();
}

function pauseEKGAnimation() {
    if (ekgAnimation) {
        cancelAnimationFrame(ekgAnimation);
        ekgAnimation = null;
    }
}

function resetEKGAnimation() {
    pauseEKGAnimation();
    initializeEKGCanvas();
}

function updateEKGHeartRate() {
    const hrElement = document.getElementById('ekg-hr');
    if (hrElement) {
        const hr = 70 + Math.floor(Math.random() * 20); // 70-90 bpm
        hrElement.textContent = hr + ' bpm';
    }
}

// Medication Form
function setupMedicationForm() {
    const addBtn = document.getElementById('add-medication');
    if (addBtn) {
        addBtn.addEventListener('click', addMedication);
    }
    
    // Set current time
    const timeInput = document.getElementById('medication-time');
    if (timeInput) {
        const now = new Date();
        timeInput.value = now.toTimeString().slice(0, 5);
    }
}

function addMedication() {
    const medicationSelect = document.getElementById('medication-select');
    const doseInput = document.getElementById('medication-dose');
    const timeInput = document.getElementById('medication-time');
    const effectSelect = document.getElementById('medication-effect');
    
    if (!medicationSelect.value || !doseInput.value) {
        alert('Bitte Medikament und Dosis auswählen/eingeben!');
        return;
    }
    
    const medication = {
        time: timeInput.value,
        name: medicationSelect.options[medicationSelect.selectedIndex].text,
        dose: doseInput.value,
        effect: effectSelect.value
    };
    
    medicationData.push(medication);
    addMedicationToTable(medication);
    
    // Clear form
    medicationSelect.value = '';
    doseInput.value = '';
    
    // Add to protocol
    addProtocolEvent('medication', `${medication.name} - ${medication.dose} verabreicht`);
}

function addMedicationToTable(medication) {
    const tbody = document.getElementById('medication-tbody');
    if (!tbody) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${medication.time}</td>
        <td>${medication.name}</td>
        <td>${medication.dose}</td>
        <td><span class="effect-${medication.effect}">${getEffectText(medication.effect)}</span></td>
        <td><button class="btn-remove" onclick="removeMedication(this)"><i class="fas fa-trash"></i></button></td>
    `;
    
    tbody.appendChild(row);
}

function getEffectText(effect) {
    const effects = {
        'positive': 'Positiv',
        'neutral': 'Neutral',
        'negative': 'Negativ'
    };
    return effects[effect] || 'Unbekannt';
}

function removeMedication(button) {
    const row = button.closest('tr');
    if (row) {
        row.remove();
    }
}

// Protocol Form
function setupProtocolForm() {
    const addBtn = document.getElementById('add-event');
    if (addBtn) {
        addBtn.addEventListener('click', addProtocolEvent);
    }
    
    // Set current time
    const timeInput = document.getElementById('event-time');
    if (timeInput) {
        const now = new Date();
        timeInput.value = now.toTimeString().slice(0, 5);
    }
}

function addProtocolEvent(type, description) {
    const timeInput = document.getElementById('event-time');
    const typeSelect = document.getElementById('event-type');
    const descriptionInput = document.getElementById('event-description');
    
    // If called from medication, use provided parameters
    if (type && description) {
        const event = {
            time: new Date().toTimeString().slice(0, 5),
            type: type,
            description: description
        };
        
        protocolData.push(event);
        addEventToTimeline(event);
        return;
    }
    
    // Otherwise get from form
    if (!timeInput.value || !descriptionInput.value) {
        alert('Bitte Zeit und Beschreibung eingeben!');
        return;
    }
    
    const event = {
        time: timeInput.value,
        type: typeSelect.value,
        description: descriptionInput.value
    };
    
    protocolData.push(event);
    addEventToTimeline(event);
    
    // Clear description
    descriptionInput.value = '';
}

function addEventToTimeline(event) {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    
    const item = document.createElement('div');
    item.className = 'timeline-item fade-in';
    item.innerHTML = `
        <div class="timeline-time">${event.time}</div>
        <div class="timeline-content">
            <span class="timeline-type ${event.type}">${getTypeText(event.type)}</span>
            <p>${event.description}</p>
        </div>
    `;
    
    timeline.insertBefore(item, timeline.firstChild);
}

function getTypeText(type) {
    const types = {
        'assessment': 'Einschätzung',
        'medication': 'Medikation',
        'procedure': 'Maßnahme',
        'vital-change': 'Vitalwertänderung',
        'communication': 'Kommunikation',
        'other': 'Sonstiges'
    };
    return types[type] || type;
}

// Footer Buttons
function setupFooterButtons() {
    const saveBtn = document.querySelector('.footer-btn');
    const printBtn = document.querySelectorAll('.footer-btn')[1];
    const emergencyBtn = document.querySelector('.footer-btn.emergency');
    const hospitalBtn = document.querySelectorAll('.footer-btn')[3];
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveData);
    }
    
    if (printBtn) {
        printBtn.addEventListener('click', printData);
    }
    
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', triggerEmergency);
    }
    
    if (hospitalBtn) {
        hospitalBtn.addEventListener('click', contactHospital);
    }
}

function saveData() {
    const data = {
        patient: {
            name: document.getElementById('patient-name')?.value || '',
            dob: document.getElementById('patient-dob')?.value || '',
            gender: document.getElementById('patient-gender')?.value || '',
            age: document.getElementById('patient-age')?.value || '',
            chiefComplaint: document.getElementById('chief-complaint')?.value || ''
        },
        vitals: {
            heartRate: document.getElementById('heart-rate')?.textContent || '',
            spo2: document.getElementById('spo2')?.textContent || '',
            bloodPressure: document.getElementById('blood-pressure')?.textContent || '',
            temperature: document.getElementById('temperature')?.textContent || '',
            respiratoryRate: document.getElementById('respiratory-rate')?.textContent || '',
            gcs: document.getElementById('gcs')?.textContent || ''
        },
        medications: medicationData,
        protocol: protocolData,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('nida-pad-data', JSON.stringify(data));
    
    // Show success message
    showNotification('Daten erfolgreich gespeichert!', 'success');
}

function printData() {
    generatePDF();
}

function triggerEmergency() {
    if (confirm('Notfall-Alarm auslösen?')) {
        showNotification('Notfall-Alarm wurde ausgelöst!', 'emergency');
        // In a real application, this would trigger emergency protocols
    }
}

function contactHospital() {
    showNotification('Klinik-Kontakt wird hergestellt...', 'info');
    // In a real application, this would initiate hospital communication
}

// PDF Generation Function
function generatePDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Get user data
        const currentUser = JSON.parse(localStorage.getItem('nida-pad-user'));
        const positionLabels = {
            'RH': 'Rettungshelfer', 'RH-A': 'Rettungshelfer i.A.', 'RS': 'Rettungssanitäter',
            'RS-A': 'Rettungssanitäter i.A.', 'NFS': 'Notfallsanitäter', 'NFS-A': 'Notfallsanitäter i.A.',
            'NA': 'Notarzt', 'LNA': 'Leitender Notarzt', 'OrgL': 'OrgL Rettungsdienst',
            'Fahrer': 'Fahrer', 'Praktikant': 'Praktikant'
        };
        const shiftLabels = {
            'frueh': 'Frühschicht', 'spaet': 'Spätschicht', 'nacht': 'Nachtschicht',
            '24h': '24h-Schicht', '48h': '48h-Schicht'
        };
        
        // Get patient data
        const patientData = {
            name: document.getElementById('patient-name')?.value || '',
            dob: document.getElementById('patient-dob')?.value || '',
            gender: document.getElementById('patient-gender')?.value || '',
            age: document.getElementById('patient-age')?.value || '',
            chiefComplaint: document.getElementById('chief-complaint')?.value || ''
        };
        
        // Get vitals data
        const vitalsData = {
            heartRate: document.getElementById('heart-rate')?.value || '',
            spo2: document.getElementById('spo2')?.value || '',
            bloodPressure: document.getElementById('blood-pressure')?.value || '',
            temperature: document.getElementById('temperature')?.value || '',
            respiratoryRate: document.getElementById('respiratory-rate')?.value || '',
            gcs: document.getElementById('gcs')?.value || ''
        };
        
        // Set font
        doc.setFontSize(12);
        
        // Header
        doc.setFontSize(16);
        doc.text('RETTUNGSDIENST-EINSATZPROTOKOLL', 105, 20, { align: 'center' });
        
        doc.setFontSize(11);
        doc.text('Nach Isobar-Schema (DIVI)', 105, 28, { align: 'center' });
        
        // Line under header
        doc.setLineWidth(0.5);
        doc.line(20, 32, 190, 32);
        
        // User Information
        doc.setFontSize(10);
        doc.text('PERSONAL / FAHRZEUG', 20, 42);
        doc.setFontSize(11);
        const posLabel = positionLabels[currentUser?.position] || currentUser?.position || '';
        const shiftLabel = shiftLabels[currentUser?.shift] || currentUser?.shift || '';
        doc.text(`Name: ${currentUser?.name || ''}`, 20, 50);
        doc.text(`Qualifikation: ${posLabel}`, 20, 57);
        doc.text(`Fahrzeug: ${currentUser?.vehicle || ''}`, 20, 64);
        doc.text(`Wache: ${currentUser?.station || ''}`, 110, 50);
        doc.text(`Schicht: ${shiftLabel}`, 110, 57);
        
        // Timestamp
        const now = new Date();
        doc.text(`Datum: ${now.toLocaleDateString('de-DE')}`, 110, 64);
        
        // Line
        doc.line(20, 70, 190, 70);
        
        // Patient Information
        doc.setFontSize(10);
        doc.text('PATIENTENSTAMMDATEN', 20, 78);
        doc.setFontSize(11);
        doc.text(`Name: ${patientData.name}`, 20, 86);
        doc.text(`Geburtsdatum: ${patientData.dob}`, 20, 93);
        doc.text(`Alter: ${patientData.age} Jahre`, 110, 86);
        doc.text(`Geschlecht: ${patientData.gender === 'male' ? 'Männlich' : patientData.gender === 'female' ? 'Weiblich' : 'Divers'}`, 110, 93);
        
        // Chief Complaint
        doc.text('Hauptbeschwerden:', 20, 103);
        doc.setFontSize(10);
        const complaintLines = doc.splitTextToSize(patientData.chiefComplaint || '—', 170);
        doc.text(complaintLines, 20, 110);
        
        // Line
        const afterComplaint = 110 + complaintLines.length * 5 + 3;
        doc.line(20, afterComplaint, 190, afterComplaint);
        
        // Vitals
        doc.setFontSize(10);
        doc.text('VITALWERTE', 20, afterComplaint + 8);
        doc.setFontSize(11);
        doc.text(`Herzfrequenz: ${vitalsData.heartRate || '—'} bpm`, 20, afterComplaint + 16);
        doc.text(`Blutdruck: ${vitalsData.bloodPressure || '—'} mmHg`, 20, afterComplaint + 23);
        doc.text(`Sauerstoffsättigung: ${vitalsData.spo2 || '—'}%`, 110, afterComplaint + 16);
        doc.text(`Atemfrequenz: ${vitalsData.respiratoryRate || '—'}/min`, 110, afterComplaint + 23);
        doc.text(`Temperatur: ${vitalsData.temperature || '—'}°C`, 20, afterComplaint + 30);
        doc.text(`GCS: ${vitalsData.gcs || '—'}/15`, 110, afterComplaint + 30);
        
        // Medications
        let yPosition = afterComplaint + 40;
        if (medicationData.length > 0) {
            doc.line(20, yPosition, 190, yPosition);
            yPosition += 8;
            doc.setFontSize(10);
            doc.text('MEDIKATION', 20, yPosition);
            yPosition += 8;
            doc.setFontSize(11);
            
            medicationData.forEach(med => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 30;
                }
                doc.text(`${med.time} — ${med.name}: ${med.dose} (${getEffectText(med.effect)})`, 20, yPosition);
                yPosition += 8;
            });
        }
        
        // Protocol
        if (protocolData.length > 0) {
            if (yPosition > 240) { doc.addPage(); yPosition = 30; }
            doc.line(20, yPosition, 190, yPosition);
            yPosition += 8;
            doc.setFontSize(10);
            doc.text('EREIGNISPROTOKOLL', 20, yPosition);
            yPosition += 8;
            doc.setFontSize(11);
            
            protocolData.forEach(event => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 30;
                }
                doc.text(`${event.time} — ${getTypeText(event.type)}: ${event.description}`, 20, yPosition);
                yPosition += 10;
            });
        }
        
        // Footer / Signature
        const sigY = Math.max(yPosition + 15, 260);
        if (sigY > 270) { doc.addPage(); }
        const finalY = sigY > 270 ? 30 : sigY;
        doc.setLineWidth(0.3);
        doc.line(20, finalY + 10, 90, finalY + 10);
        doc.setFontSize(9);
        doc.text('Unterschrift', 20, finalY + 15);
        doc.text(`Datum: ${now.toLocaleDateString('de-DE')}`, 120, finalY + 15);
        
        // Save PDF
        const filename = `NIDA-Pad_${patientData.name.replace(/\s+/g, '_') || 'Protokoll'}_${now.toLocaleDateString('de-DE').replace(/\./g, '-')}.pdf`;
        doc.save(filename);
        
        showNotification('PDF erfolgreich erstellt!', 'success');
        
    } catch (error) {
        console.error('PDF generation error:', error);
        showNotification('Fehler bei der PDF-Erstellung!', 'error');
        window.print();
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 16px;
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

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveData();
    }
    
    // Ctrl/Cmd + P to print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printData();
    }
    
    // Number keys to switch tabs
    if (e.key >= '1' && e.key <= '5') {
        const tabs = ['patient', 'vitals', 'ekg', 'medication', 'protocol'];
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
            const tabButton = document.querySelector(`[data-tab="${tabs[tabIndex]}"]`);
            if (tabButton) {
                tabButton.click();
            }
        }
    }
});

// Auto-save functionality
setInterval(() => {
    saveData();
}, 300000); // Auto-save every 5 minutes

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (ekgAnimation) {
        cancelAnimationFrame(ekgAnimation);
    }
    if (vitalsInterval) {
        clearInterval(vitalsInterval);
    }
});

// Add CSS animation for notifications
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
