var map;
var busMarker = [];
var busStopMarker = [];
var busInfoWindow = [];
var busStopInfoWindow = [];

function renderMap(){
  map = new google.maps.Map(document.getElementById("map"), { zoom: 12, center: new google.maps.LatLng(35.959143, 136.218218) });
  setBusStopMarker();
  (async () => {
    while(true){
      await setBusMarker();
      await sleepMS(5000);
    }
  })().catch((error) => {console.log(error)});
}

function sleepMS(s){
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, s)
  })
}

function getJSONP(requests, clallback){
  let jqXHRList = [];

  $.each(requests,function(i,request){
    jqXHRList.push($.ajax({
      type: 'GET',
      url: request.url,
      data: request.params,
      dataType: 'jsonp',
    }));
  });
  $.when.apply($, jqXHRList)
    .done(function(){
      let results = [];
      $.each(arguments,function(i,argument){
        data = argument[0];
        textStatus = argument[1];
        results.push(data);
      });
      clallback(results);
    })
  .fail(function(){
    console.dir("----fail----");
    console.dir("textStatus: "+arguments[1]+", jqXHR: "+arguments[2]);
  });
}

function setBusMarker(){
  var requests = [];
  for(let i=0,maxBusNum = 11;i<maxBusNum;i++){
    requests[i] = {url: 'http://tutujibus.com/busLookup.php', params: { busid: i+1 } };
  }

  getJSONP(requests, function(results){
    $.each(results,function(i,data){
      if(data['isRunning']){
        posLatLng = new google.maps.LatLng(data['latitude'], data['longitude']);
        if(!busMarker[i]){
          busMarker[i] = new google.maps.Marker({
            position: posLatLng,
            map: map
              //icon: 'http://tutujibus.com/image/bus/'+data['busid']+'/'+data['busid']+'_1.png'
          });
          busInfoWindow[i] = new google.maps.InfoWindow({
            content: '<div class="map">' +'binid:'+data['binid' ]+' '+data['destination']+ '</div>'
          });
          MarkerEvent(busMarker[i],busInfoWindow[i]);
        }else{
          busMarker[i].setPosition(posLatLng);
          busInfoWindow[i].setContent('<div class="map">' +'binid:'+data['binid' ]+' '+data['destination']+ '</div>');
        }
      }
    });
  });
}

function setBusStopMarker(){
  var requests = [];
  for(let i=0,maxRosenNum = 11;i<maxRosenNum;i++){
    requests[i] = {url: 'http://tutujibus.com/busstopLookup.php', params: { rosenid: i+1 } };
  }


  getJSONP(requests, function(results){
    $.each(results,function(i,data){
      $.each(data['busstop'],function(i,busstop){
        posLatLng = new google.maps.LatLng(busstop['latitude'], busstop['longitude']);
        busStopMarker[i] = new google.maps.Marker({
          position: posLatLng,
          map: map,
          icon: 'http://tutujibus.com/image/busstop32.png'
        });
        busStopInfoWindow[i] = new google.maps.InfoWindow({
          content: '<div class="map">'+busstop['name']+ '</div>'
        });
        MarkerEvent(busStopMarker[i], busStopInfoWindow[i]);
      });
    });
  });
}

function MarkerEvent(marker,infoWindow){
  marker.addListener('click', function(){
    infoWindow.open(map, marker);
  });
}

