var map;
var marker = [];
var infoWindow = [];

function renderMap(){
  map = new google.maps.Map(document.getElementById("map"), { zoom: 12, center: new google.maps.LatLng(35.959143, 136.218218) });
  (async () => {
    while(true){
      await setMarker();
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

  function setMarker(){
    let jqXHRList = [];
    for(var i=1,maxBusNum = 11;i<=maxBusNum;i++){
      jqXHRList.push($.ajax({
        type: 'GET',
        url: 'http://tutujibus.com/busLookup.php',
        data: { busid: i },
        dataType: 'jsonp',
      }));
    }
    $.when.apply($, jqXHRList)
      .done(function(){
        for(var i=0; i< arguments.length; i++){
          data = arguments[i][0];
          textStatus = arguments[i][1];
          if(data['isRunning']){
            posLatLng = new google.maps.LatLng(data['latitude'], data['longitude']);
            if(!marker[i]){
              marker[i] = new google.maps.Marker({
                position: posLatLng,
                map: map
                //icon: 'http://tutujibus.com/image/bus/'+data['busid']+'/'+data['busid']+'_1.png'
              });
              infoWindow[i] = new google.maps.InfoWindow({
                content: '<div class="map">' +'binid:'+data['binid' ]+' '+data['destination']+ '</div>'
              });
              markerEvent(i);
            }else{
              marker[i].setPosition(posLatLng);
              infoWindow[i].setContent('<div class="map">' +'binid:'+data['binid' ]+' '+data['destination']+ '</div>');
            }
          }

          console.dir("----success["+i+"]----");
          console.dir("latitude: "+data['latitude'] + ", longitude: "+data['longitude'] + ", textStatus: "+textStatus);
        }
      })
    .fail(function(){//jqXHR, textStatus, errorThrown){
        console.dir("----fail----");
        console.dir("textStatus: "+arguments[1]+", jqXHR: "+arguments[2]);
     });

  }

  function markerEvent(i){
    marker[i].addListener('click', function(){
      infoWindow[i].open(map, marker[i]);
    });
  }

