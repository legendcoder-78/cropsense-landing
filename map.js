let map;
let geoJsonLayer;
let currentRiskStatus = 'healthy'; // global map state

// GeoJSON for Indian States (Using external open-source gist)
const INDIA_GEOJSON_URL = 'https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States';

function initMap() {
    // Define coordinates roughly bounding India
    const indiaBounds = [
        [6.5, 68.0], // South-West
        [35.5, 97.4]  // North-East
    ];

    // Center map on India with boundary constraints
    map = L.map('map', {
        minZoom: 4,
        maxZoom: 10,
        maxBounds: indiaBounds,
        maxBoundsViscosity: 1.0, // Prevent panning outside India
        zoomSnap: 0.5,           // Allow fractional zooming
        wheelPxPerZoomLevel: 100 // Smoother mouse wheel zooming
    }).setView([22.5937, 78.9629], 5);

    // Add CartoDB Dark Matter tile layer for a beautifully dark premium look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    loadIndiaData();
}

function getStyleForState(feature) {
    const defaultStyle = {
        fillColor: 'transparent',
        weight: 1,
        opacity: 1,
        color: '#475569',
        fillOpacity: 0.1
    };

    // Which crop is selected?
    const activeCrop = window.CROP_DATA[window.currentCrop];
    if (!activeCrop) return defaultStyle;

    const stateName = feature.properties.NAME_1; // Adjust based on geojson props

    // Check if state is a primary region
    const isPrimaryRegion = activeCrop.regions.some(r => r.toLowerCase() === (stateName || '').toLowerCase());

    if (!isPrimaryRegion) {
        return {
            fillColor: '#1e293b',
            weight: 1,
            color: '#334155',
            fillOpacity: 0.4
        };
    }

    // Apply color based on risk status
    let fillColor = '#10b981'; // healthy
    if (window.currentRiskStatus === 'risk') fillColor = '#f59e0b';
    if (window.currentRiskStatus === 'fail') fillColor = '#ef4444';

    return {
        fillColor: fillColor,
        weight: 2,
        opacity: 1,
        color: fillColor,  // highlight border
        fillOpacity: 0.6
    };
}

async function loadIndiaData() {
    try {
        const response = await fetch(INDIA_GEOJSON_URL);
        const data = await response.json();

        geoJsonLayer = L.geoJSON(data, {
            style: getStyleForState,
            onEachFeature: (feature, layer) => {
                layer.on('mouseover', function () {
                    this.setStyle({ fillOpacity: 0.8 });
                });
                layer.on('mouseout', function () {
                    geoJsonLayer.resetStyle(this);
                });
                if (feature.properties.NAME_1) {
                    layer.bindTooltip(feature.properties.NAME_1);
                }
            }
        }).addTo(map);

    } catch (err) {
        console.error("Failed to load map data. Adding simulated markers instead.", err);
        // Fallback if GeoJson fails to load
        const fallbackCities = [
            { name: "Punjab", coords: [31.1471, 75.3412] },
            { name: "Uttar Pradesh", coords: [26.8467, 80.9462] },
            { name: "Maharashtra", coords: [19.7515, 75.7139] },
            { name: "West Bengal", coords: [22.9868, 87.8550] },
            { name: "Gujarat", coords: [22.2587, 71.1924] }
        ];

        fallbackCities.forEach(city => {
            L.circleMarker(city.coords, {
                radius: 15,
                fillColor: '#3b82f6',
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map).bindTooltip(city.name);
        });
    }
}

function updateMapState(riskStatus, cropKey) {
    window.currentRiskStatus = riskStatus;
    window.currentCrop = cropKey;
    if (geoJsonLayer) {
        geoJsonLayer.setStyle(getStyleForState);
    }
}

// Expose functions globally
window.initMap = initMap;
window.updateMapState = updateMapState;
