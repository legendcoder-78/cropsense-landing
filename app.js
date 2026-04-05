// Global UI State
window.currentCrop = 'wheat';
window.currentRiskStatus = 'healthy';

// UI Elements
const els = {
    cropSelector: document.getElementById('crop-selector'),
    cropDisplay: document.getElementById('crop-name-display'),
    tempSlider: document.getElementById('temp-slider'),
    rainSlider: document.getElementById('rain-slider'),
    tempVal: document.getElementById('temp-val'),
    rainVal: document.getElementById('rain-val'),
    riskBadge: document.getElementById('risk-badge'),
    statusDot: document.querySelector('.status-dot'),
    riskText: document.getElementById('risk-text'),
    insightBox: document.getElementById('insight-box')
};

// Colors mapping
const statusColors = {
    'healthy': 'var(--status-healthy)',
    'risk': 'var(--status-risk)',
    'fail': 'var(--status-fail)'
};

function initApp() {
    // Initialize Map
    window.initMap();

    // Attach Event Listeners
    els.cropSelector.addEventListener('change', (e) => {
        window.currentCrop = e.target.value;
        const cropName = window.CROP_DATA[window.currentCrop].name;
        els.cropDisplay.textContent = cropName;
        runSimulation();
    });

    els.tempSlider.addEventListener('input', (e) => {
        els.tempVal.textContent = e.target.value;
        runSimulation();
    });

    els.rainSlider.addEventListener('input', (e) => {
        els.rainVal.textContent = e.target.value;
        runSimulation();
    });

    // Run initial sim
    runSimulation();
}

function runSimulation() {
    const temp = parseFloat(els.tempSlider.value);
    const rain = parseFloat(els.rainSlider.value);
    
    // Use the AI Logic from data.js
    const result = window.evaluateRisk(window.currentCrop, temp, rain);
    
    updateUI(result.status, result.message);
    window.updateMapState(result.status, window.currentCrop);
}

function updateUI(status, message) {
    // Animate change
    els.riskBadge.style.transform = 'scale(1.05)';
    setTimeout(() => { els.riskBadge.style.transform = 'scale(1)'; }, 200);

    // Update colors and text
    const color = statusColors[status];
    els.riskBadge.style.borderLeft = `4px solid ${color}`;
    els.statusDot.style.background = color;
    els.statusDot.style.boxShadow = `0 0 10px ${color}`;
    
    els.riskText.textContent = status.toUpperCase();
    els.insightBox.innerHTML = message;
}

// Start application
document.addEventListener('DOMContentLoaded', initApp);
