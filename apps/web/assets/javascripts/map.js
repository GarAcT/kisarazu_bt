var map;

const ROSEN_NUM = 11;
var busMarker = [];
var busStopMarker = [];
var busInfoWindow = [];
var busStopInfoWindow = [];

function renderMap(){
  map = new google.maps.Map(document.getElementById("map"), { zoom: 12, center: new google.maps.LatLng(35.959143, 136.218218) });
  initMarker();
  setBusStopMarker();
  (async () => {
    while(true){
      await setBusMarker();
      await sleepMS(5000);
    }
  })().catch((error) => {console.log(error)});
}

function initMarker(){
  for(let i=1;i<=ROSEN_NUM;i++){
    busMarker[i]=[];
    busInfoWindow[i]=[];
  }
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
  for(let i=0;i<ROSEN_NUM;i++){
    requests[i] = {url: 'http://tutujibus.com/busLookup.php', params: { busid: i+1 } };
  }

  getJSONP(requests, function(results){
    $.each(results,function(i,data){
      if(true){//data['isRunning']){
        posLatLng = new google.maps.LatLng(data['latitude'], data['longitude']);
        bm = busMarker[data['rosenid']][data['binid']];
        bi = busInfoWindow[data['rosenid']][data['binid']];
        if(!bm){
          bm = new google.maps.Marker({
            position: posLatLng,
            map: map,
            /*icon: {
              url: '/assets/bus_icon.png',
              scaledSize: new google.maps.Size(48,48),
            }*/
          });
          bi = new google.maps.InfoWindow({
            content: '<div class="map">' +'binid:'+data['binid' ]+' '+data['destination']+ '</div>'
          });
          MarkerEvent(bm,bi);
        }else{
          bm.setPosition(posLatLng);
          bi.setContent('<div class="map">' +'binid:'+data['binid' ]+' '+data['destination']+ '</div>');
        }
      }
    });
  });
}

function setBusStopMarker(){
  var requests = [];
  for(let i=0;i<ROSEN_NUM;i++){
    requests[i] = {url: 'http://tutujibus.com/busstopLookup.php', params: { rosenid: i+1 } };
  }

  getJSONP(requests, function(results){
    $.each(results,function(i,data){
      var rosenid = i+1;
      busStopMarker[rosenid] = [];
      busStopInfoWindow[rosenid] = [];
      $.each(data['busstop'],function(j,busstop){
        posLatLng = new google.maps.LatLng(busstop['latitude'], busstop['longitude']);
        busStopMarker[rosenid].push(new google.maps.Marker({
          position: posLatLng,
          map: map,
          icon: {
            url: '/assets/busstop_icon.png',
            scaledSize: new google.maps.Size(32,32),
          },
          visible:false,
        }));
        busStopInfoWindow[rosenid][j] = new google.maps.InfoWindow({
          content: '<div class="map">'+busstop['name']+ '</div>'
        });
        MarkerEvent(busStopMarker[rosenid][j], busStopInfoWindow[rosenid][j]);
      });
    });
  });
}

function MarkerEvent(marker,infoWindow){
  marker.addListener('click', function(){
    infoWindow.open(map, marker);
  });
}

