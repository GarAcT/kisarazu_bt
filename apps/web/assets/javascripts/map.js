var map;

const ROSEN_NUM = 17;
const BUTTON_NUM = 11;
var busMarker = [];
var busStopMarker = [];
var busInfoWindow = [];
var busStopInfoWindow = [];
var busIdx = [];

function BusIdx(rosenid,binid){
  this.rosenid = rosenid;
  this.binid = binid;
}

function renderMap(){
  map = new google.maps.Map(document.getElementById("map"), { zoom: 13, center: new google.maps.LatLng(35.959143, 136.218218) });
  initMarker();
  initButton();
  setBusStopMarker();
  (async () => {
    while(true){
      await setBusMarker();
      await sleepMS(5000);
    }
  })().catch((error) => {console.log(error)});

}

function initMarker(){
  for(let i=0;i<=ROSEN_NUM;i++){
    busMarker[i]=[];
    busInfoWindow[i]=[];
  }
}

function initButton(){
  document.getElementById('rosenid:All').onclick=(function(){
    $.each(busIdx,function(i,bi){
      busMarker[bi.rosenid][bi.binid].setVisible(true);
    });

    $.each(busStopMarker,function(i,bsms){
      $.each(bsms,function(j,bsm){
        bsm.setVisible(false);
        busStopInfoWindow[i][j].close();
      });
    });
  });

  for(let id=1;id<=BUTTON_NUM;id++){
    document.getElementById('rosenid:'+id).onclick=(function(){
      invisibleAllMarker();
      showRosen(id);
    });
  }

  document.getElementById('searchBusStopButton').onclick=(function(){
    invisibleAllMarker();
    $.each(searchRosen(searchBusStopTextbox.value),function(i,id){
      showRosen(id);
    });
  });

  document.getElementById('searchPositionButton').onclick=(function(){
    invisibleAllMarker();
    pos = searchPositionTextbox.value.split(",");
    showRosen(searchPosition(new google.maps.LatLng(pos[0],pos[1])));
  });
}

function sleepMS(s){
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, s)
  })
}

function invisibleAllMarker(){
  $.each(busIdx,function(i,bi){
    busMarker[bi.rosenid][bi.binid].setVisible(false);
    busInfoWindow[bi.rosenid][bi.binid].close();
  });

  $.each(busStopMarker,function(i,bsms){
    $.each(bsms,function(j,bsm){
      bsm.setVisible(false);
      busStopInfoWindow[i][j].close();
    });
  });
}

function showRosen(rosenid){
  $.each(busMarker[rosenid],function(i,bm){
    if(bm) bm.setVisible(true);
  });

  $.each(busStopMarker[rosenid],function(j,bsm){
    bsm.setVisible(true);
  });
}

function searchRosen(busStopName){
  var rosenid = [];
  $.each(busStopInfoWindow,function(i,bsis){
    $.each(bsis,function(j,bsi){
      if(~bsi.getContent().indexOf(busStopName)){
        bsi.open(map,busStopMarker[i][j]);
        rosenid.push(i);
      }
    });
  });
  if(rosenid.length==0) alert('Not Found');
  return rosenid;
}

function searchPosition(latlng){
  var rosenid = 1;
  var minidx = 1;
  var min = google.maps.geometry.spherical.computeDistanceBetween(busStopMarker[1][1].getPosition(),latlng);

  $.each(busStopMarker,function(i,bsms){
    $.each(bsms,function(j,bsm){
      var distance = google.maps.geometry.spherical.computeDistanceBetween(bsm.getPosition(),latlng);
      if(min > distance){
        rosenid = i;
        minidx = j;
        min = distance;
      }
    });
  });

  busStopInfoWindow[rosenid][minidx].open(map,busStopMarker[rosenid][minidx]);
  return rosenid;
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
            content: '<div class="map">' +'第'+data['binid' ]+'便 '+data['destination']+ '行き</div>'
          });
          MarkerEvent(busMarker[data['rosenid']][data['binid']],busInfoWindow[data['rosenid']][data['binid']]);
          busIdx.push(new BusIdx(data['rosenid'],data['binid']));
        }else{
          busMarker[data['rosenid']][data['binid']].setPosition(posLatLng);
          busInfoWindow[data['rosenid']][data['binid']].setContent('<div class="map">'+'第'+data['binid' ]+'便 '+data['destination']+'行き</div>');
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

