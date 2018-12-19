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

  for(let id=1;id<=ROSEN_NUM;id++){
    document.getElementById('rosenid:'+id).onclick=(function(){
      showRosen(id);
    });
  }

}

function initMarker(){
  for(let i=0;i<=ROSEN_NUM;i++){
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

function showRosen(rosenid){
  console.dir(rosenid);
  $.each(busMarker,function(i,bms){
    if(bms.length > 0){
      $.each(bms,function(j,bm){
        if(bm) bm.setVisible(i==rosenid);
      });
    }
  });

  $.each(busStopMarker,function(i,bsms){
    $.each(bsms,function(j,bsm){
      bsm.setVisible(i==rosenid);
    });
  });
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
      if(data['isRunning']){
        posLatLng = new google.maps.LatLng(data['latitude'], data['longitude']);
        if(!busMarker[data['rosenid']][data['binid']]){
          busMarker[data['rosenid']][data['binid']] = new google.maps.Marker({
            position: posLatLng,
            map: map,
            /*icon: {
              url: '/assets/bus_icon.png',
              scaledSize: new google.maps.Size(48,48),
              }*/
          });
          busInfoWindow[data['rosenid']][data['binid']]= new google.maps.InfoWindow({
            content: '<div class="map">' +'binid:'+data['binid' ]+' '+data['destination']+ '</div>'
          });
          MarkerEvent(busMarker[data['rosenid']][data['binid']],busInfoWindow[data['rosenid']][data['binid']]);
        }else{
          busMarker[data['rosenid']][data['binid']].setPosition(posLatLng);
          busInfoWindow[data['rosenid']][data['binid']].setContent('<div class="map">'+'binid:'+data['binid' ]+' '+data['destination']+ '</div>');
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

