var map = L.map('map').setView([-34.57158, -58.43926], 14);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(map);
L.circle([-34.57158, -58.43926], 200, {
    color: '#0073ae',
    fillOpacity: 0.8
}).addTo(map);