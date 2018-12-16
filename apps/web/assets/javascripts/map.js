var map;

function renderMap(){
  map = new google.maps.Map(document.getElementById("map"), { zoom: 3, center: new google.maps.LatLng(0, 0) });
}
