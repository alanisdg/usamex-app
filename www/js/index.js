/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
 SlidingMarker.initializeGlobally();

    var marker, map;
    var myLatlng = new google.maps.LatLng(25.674873, -100.318432);
    var mapOptions = {
    zoom: 12,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
 m = []
                mwl = []
function getLoggin(token,callback){
    console.log('enviando post login')
    $.ajax({ 
        url:'http://usamexgps.com/api/user',
        type:'GET',
        headers: { "Authorization": "Bearer "+token+"" },
        success: function(r){
            $.mobile.changePage('#home',{reverse:false,transition:'slide'});
                callback(r);
            },
        error: function(data){ 
            $(':mobile-pagecontainer').pagecontainer('change', '#login', {
                    transition: 'flip',
                    changeHash: false,
                    reverse: true,
                    showLoadMsg: true
                });
            }
        })
}


if(localStorage.token != ''){ getLoggin(localStorage.token, function(num) { printData(num) }); }

$(function() {
    $('#loginBtn').click(function(e){
        console.log('enviando post login por formulario')
        alert('enviando')
        e.preventDefault();
        email = $('#mail').val()
        pass = $('#password').val()
        con = "application/x-www-form-urlencoded; charset=utf-8"
        $.ajax({ 
            url:'http://usamexgps.com/api/authenticate',
            type:'POST',
            data: { email: email,password:pass },
            success: function(r){ console.log(r)
                localStorage.setItem('token',r['token'])
                getLoggin(r['token'], function(num) {
                    printData(num)
                });
                
            },
            error: function(data){
                console.log('error login')
                $('#bad').removeClass('none')
               $(':mobile-pagecontainer').pagecontainer('change', '#index', {
                    transition: 'flip',
                    changeHash: false,
                    reverse: true,
                    showLoadMsg: true
                });
            }
        })
        return false;
    });
}); 

    function printData(data){ 
        console.log(data)
        $.each(data['devices'],function(dev, device){
            if(device.type_id == 1){
                    sendTo = 'devicesList'
                }else if(device.type_id == 2){
                    sendTo = 'boxesList'
                }
            if(device.lastpacket != null){ 
                var myLatlng= new google.maps.LatLng(device.lastpacket.lat,device.lastpacket.lng );
                var marker = new google.maps.Marker({
                                position: myLatlng,
                                zIndex:9999999,
                                icon:{
                                    url:'img/truck3.png',
                                    labelOrigin: new google.maps.Point(15, 45)
                                },

                                rotation:50,
                                id:device.id,
                                name: device.name,
                                map:map
                            });

                var label = new MarkerWithLabel({
                            position: myLatlng,

                            icon: " ",
                            labelContent: "<div>"+device.name+"</div>",
                            labelAnchor: new google.maps.Point(22, 0),
                            labelClass: "labels", // the CSS class for the label
                            labelStyle: {opacity: 0.75},
                            id: device.id,
                            map:map
                        });
                m.push(marker)
                mwl.push(label)
                console.log(label)
                time = moment(device.lastpacket.updateTime);
                CurrentDate = moment()
                a = CurrentDate.diff(time, 'seconds'); 
                eltime = getCurrentTime(a);

                if(a > 3600){
                    class_timer = 'red'
                }else{
                    class_timer = ''
                }
                console.log(device.engine)
                if(device.engine == 1){
                    engine = '<span class="engine10  icon-engine leicon green"></span>'
                }else if(device.engine == 0){
                    engine = '<span class="engine10  icon-engine shutdown" ></span>'
                }

                head = device.lastpacket.heading + ' --'
                console.log(head)
                if(device.stop == 0){
                    movement = '<span class="icon-arrow-circle-up move fa-rotate-'+ head +' leicon green" data-toggle="tooltip" data-placement="top" title="Unidad en movimiento"></span> '
                }else{
                    movement = '<span class="icon-arrow-circle-up move fa-rotate-'+ head +' leicon shutdown" data-toggle="tooltip" data-placement="top" title="Unidad detenida"></span> '
                }
                     
                                    


                console.log(engine)
                $('#'+sendTo).append('<li><a lat="'+device.lastpacket.lat+'"  lng="'+device.lastpacket.lng+'" name="'+device.name+'"  device_id="'+device.id+'"  class="seeDevice"   > '+device.name+' <span class="'+class_timer+' time'+device.id+'">'+a+'</span> '+engine+movement+'</a></li>')
                
                $(".time"+device.id).timer({ seconds: a, });
                }else{
                    $('#'+sendTo).append('<li><a    id="seeDevice"  >'+device.name+'</a></li>')
                }
        })
        
function go(data){
    $('.lat_'+data.device_id).html(data.lat)
    //console.log(data.device_id) 
    $.each(m,function(id, dev){
      //  console.log(dev.id)
      if(dev.id == data.device_id){
        myLatlng = new google.maps.LatLng(data.lat, data.lng); 
       
        dev.setPosition(myLatlng);
      }
    })

        $.each(mwl,function(id, dev){
      //  console.log(dev.id)
      if(dev.id == data.device_id){
        myLatlng = new google.maps.LatLng(data.lat, data.lng); 
     
        dev.setPosition(myLatlng);
      }
    })


}
        var socket = io.connect('http://usamexgps.com:3000');
     
             socket.on('message1', function (data) {
                 device_id =   data.device_id
                 go(data)
                 
                    $(".time"+device_id).timer('remove');
                                $(".time"+device_id).timer(); 
                });
              
        $('#devicesList').listview('refresh');
        $('#boxesList').listview('refresh');
        $('#tabs').tabs('refresh');
        
        function getCurrentTime(a){
            b =  a + ' segundos';
            return b;
        }
        $('.seeDevice').click(function(e){    
           
            localStorage.name = $(this).attr('name');
            localStorage.lat = $(this).attr('lat');
            localStorage.lng = $(this).attr('lng');
            localStorage.device_id = $(this).attr('device_id');
             
             $.mobile.changePage('#showDevice',{reverse:false,transition:'slide' });
             google.maps.event.trigger(map, 'resize'); 
            map.panTo(new google.maps.LatLng($(this).attr('lat'), $(this).attr('lng')));
 console.log('map.panTo(new google.maps.LatLng('+ $(this).attr("lat") +','+ $(this).attr("lng") +'));')
            
           

           

            })
    }
$(document).on("pageshow", "#showDevice", function() { 
     

    
   
 });

$(document).on("pagebeforeshow", "#showDevice", function() { 
    $('#name').html(localStorage.name)
    $('#lat').html(localStorage.lat)
    $('#lat').addClass('lat_'+localStorage.device_id)
    console.log(localStorage.name)

    
   
 });
    } // termina receivent event
};
