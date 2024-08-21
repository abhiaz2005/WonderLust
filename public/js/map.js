let latlng ;
if(coordinates.length === 0){
     latlng = [28.704, 77.102] ;
}else{
     latlng = [coordinates[1],coordinates[0]] ;
}

var map = L.map('map').setView(latlng, 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

console.log(title);

L.marker(latlng).addTo(map)
    .bindPopup(`<h4>${title}</h4> <br> <p>${description}</p>`)
    .openPopup();



let marker = L.marker(latlng).addTo(map);

let circle = L.circle(latlng, {
    color: '',          
    fillColor: '#f03',  
    fillOpacity: 0.5,   
    radius: 500         
}).addTo(map);