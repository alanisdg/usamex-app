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
        document.addEventListener("resume", this.onResume, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onResume: function() {
        //cuando inicia de nuevo
        //alert('resume')
        
    },
    onDeviceReady: function() {
      
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        $('#logout').click(function(){
         
            localStorage.removeItem('token');
            $.mobile.changePage('#login',{reverse:false,transition:'slide'});
            $.ajax({ 
                url:'http://localhost/api/logout',
                //url:'http://usamexgps.com/api/logout',
                type:'POST',
                data: { token: localStorage.token },
                success: function(r){
                alert(r) 
                    console.log(r)
                    
                     
                    
                },
                error: function(data){
                    console.log(data)
                }
            })
        })
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
    console.log(token)
    $('.loading').removeClass('none');
    $.ajax({ 
        url:'http://usamexgps.com/api/user',
        type:'GET',
        headers: { "Authorization": "Bearer "+token+"" },
        success: function(r){
            $.mobile.changePage('#home',{reverse:false,transition:'slide'});
                $('.loading').addClass('none') 
                callback(r);
            },
        error: function(data){ 
            console.log('no login')
            $('.loading').addClass('none') 
            $('#mail').val(localStorage.mail)
            $('#password').val(localStorage.password)
            $(':mobile-pagecontainer').pagecontainer('change', '#login', {
                    transition: 'flip',
                    changeHash: false,
                    reverse: true,
                    showLoadMsg: true
                });
            }
        })
}


if(localStorage.token != ''){ 
    console.log('aun');
    console.log(localStorage);
    //localStorage.removeItem('token')
    getLoggin(localStorage.token, function(num) {
    printData(num) 
}); }

$(function() {
    $('#loginBtn').click(function(e){
        console.log('enviando post login por formulario')
        $('.loading').removeClass('none');
        e.preventDefault();
        email = $('#mail').val()
        pass = $('#password').val()
        con = "application/x-www-form-urlencoded; charset=utf-8"
        $.ajax({ 
            url:'http://usamexgps.com/api/authenticate',
            type:'POST',
            data: { email: email,password:pass },
            success: function(r){ 
                //console.log(r)
                
                localStorage.setItem('token',r['token'])
                localStorage.setItem('mail',email)
                localStorage.setItem('password',pass)
                getLoggin(r['token'], function(num) {
                    printData(num)
                });
                
            },
            error: function(data){
                console.log('error login')
                $('#bad').removeClass('none')
                $('.loading').addClass('none');
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
        //console.log(data)
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
/*
                var label = new MarkerWithLabel({
                            position: myLatlng,

                            icon: " ",
                            labelContent: "<div>"+device.name+"</div>",
                            labelAnchor: new google.maps.Point(22, 0),
                            labelClass: "labels", // the CSS class for the label
                            labelStyle: {opacity: 0.75},
                            id: device.id,
                            map:map
                        }); */

                var myOptionsLabel = {
                                 content: device.name
                                ,boxStyle: {
                                    background: "white",
                                    borderRadius:"3px",
                                   border: "1px solid grey",
                                  textAlign: "center",
                                  opacity:0.75
                                  ,fontSize: "8pt"
                                  ,width: "100px"
                                 }
                                ,disableAutoPan: true
                                ,pixelOffset: new google.maps.Size(-25, 0)
                                ,position: myLatlng
                                ,closeBoxURL: ""
                                ,isHidden: false
                                ,pane: "mapPane"
                                ,enableEventPropagation: true
                            };

                            var ibLabel = new InfoBox(myOptionsLabel);
                            ibLabel.open(map, marker);


                m.push(marker)
               // mwl.push(label) 
                time = moment(device.lastpacket.updateTime);
                CurrentDate = moment()
                a = CurrentDate.diff(time, 'seconds'); 
                eltime = getCurrentTime(a);
                status_time = ''
                if(a > 3600 && a <= 86400){
                    class_timer = 'red';
                    // a = 'retrasado';
                    var b = moment();
                    minutos = a / 60;
                    b.subtract({minutes: minutos });
                    console.log(b.fromNow())
                }else if(a > 86400){
                    class_timer = 'red';
                    minutos = a / 60;
                    horas  = minutos / 60;
                    dias = horas / 24;
                    console.log('dias ' + dias + ' ' + device.name)
                    ro = Math.floor(dias)
                    console.log(' a' + ro)
                    var b = moment();
                    b.subtract({days: ro });
                    a = b.fromNow()
                    status_time = 'days'
                    
                }else if(a < 3600){
                    class_timer = ''
                }
                //console.log(device.engine)
                if(device.engine == 1){
                    engine = '<span class="engine'+device.id+'  icon-engine leicon green"></span>'
                }else if(device.engine == 0){
                    engine = '<span class="engine'+device.id+'  icon-engine shutdown" ></span>'
                }

                head = device.lastpacket.heading + ' --'
                //console.log(head)
                if(device.stop == 0){
                    movement = '<span class="icon-arrow-circle-up move'+device.id+' fa-rotate-'+ head +' leicon green" data-toggle="tooltip" data-placement="top" title="Unidad en movimiento"></span> '
                }else{
                    movement = '<span class="icon-arrow-circle-up move'+device.id+' fa-rotate-'+ head +' leicon shutdown" data-toggle="tooltip" data-placement="top" title="Unidad detenida"></span> '
                }
                unplugged = ''
                if(device.unplugged == 0)  {
                    unplugged = '<span data-toggle="tooltip" data-placement="top" title="Equipo desconectado"  class="glyphicon unplugged'+device.id+' icon-plug red  none " aria-hidden="true"></span>' 
                } 

                if(device.unplugged == 1)  {
                    unplugged = '<span data-toggle="tooltip" data-placement="top" title="Equipo desconectado"  class="glyphicon unplugged'+device.id+' icon-plug red   " aria-hidden="true"></span>' 
                } 
                                    
              //  '<li><div class="left"><a lat="'+device.lastpacket.lat+'"  lng="'+device.lastpacket.lng+'" name="'+device.name+'"  device_id="'+device.id+'"  class="seeDevice"   >'+device.name+'</div><div class="right">'+engine+movement+' <span class="'+class_timer+' time'+device.id+'">'+a+'</span>  </div></a> </li>'

                //console.log(engine)
                $('#'+sendTo).append('<li><a class="dev'+device.id+' seeDevice seeDeviceStyle '+device.id+'" unplugged="'+device.unplugged+'" head="'+device.lastpacket.heading+'" stop="'+device.stop+'" engine="'+device.engine+'" lat="'+device.lastpacket.lat+'" speed="'+device.lastpacket.speed+'"  lng="'+device.lastpacket.lng+'" time="'+device.lastpacket.updateTime+'" name="'+device.name+'"  device_id="'+device.id+'"  > <span class="device_name"> '+device.name+' </span> '+engine+ ' ' + movement+' '+unplugged+' <span class="'+class_timer+' eltime time'+device.id+'">'+a+'</span> </a></li>')
                if(status_time == 'days'){

                }else{
                    $(".time"+device.id).timer({ seconds: a, });
                }
                
                }else{
                    $('#'+sendTo).append('<li><a    class="seeDeviceStyle"  >'+device.name+' Equipo nuevo </a></li>')
                }
        }) 

var markerCluster = new MarkerClusterer(map, m, {
              averageCenter: true,
              gridSize:30
            });
function go(data){
    $('.lat_'+data.device_id).html(data.lat)
    $('.speed_'+data.device_id).html(data.Speed + ' k/h')
    //console.log("$('.speed_'"+data.device_id+".html("+data.Speed+")")
    $(".time_"+data.device_id).timer('remove');
    $(".time_"+data.device_id).removeClass('red');
                    $(".time_"+data.device_id).timer(); 


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

        $('.move'+data.device_id).removeClass('fa-rotate-'+data.previous_heading)
        $('.move'+data.device_id).addClass('fa-rotate-'+data.Heading)
        
        if(data.stop==1){
            $('.move'+data.device_id).removeClass('green')
            $('.move'+data.device_id).addClass('shutdown') 
        }     
        if(data.stop==0){
            $('.move'+data.device_id).removeClass('shutdown')
            $('.move'+data.device_id).addClass('green') 
        }   
        if(data.EventCode == 20){
            console.log('CAMBIOOO')
            $('.engine'+data.device_id).removeClass('green')
            $('.engine'+data.device_id).addClass('shutdown')
        }

        if(data.EventCode == 21){
            console.log('CAMBIOOO')
            $('.engine'+data.device_id).removeClass('shutdown')
            $('.engine'+data.device_id).addClass('green')
        }

        if(data.EventCode == 68){
                                //DESCONEXION
                                console.log('.unplugged'+data.device_id)
                               $('.unplugged'+data.device_id).removeClass('none')
                            }


                            if(data.EventCode == 61){
                                //DESCONEXION
                               $('.panic'+data.device_id).show()
                            }

                            if(data.EventCode == 60){
                                //DESCONEXION
                               $('.panic'+data.device_id).show()
                            }

                            if(data.EventCode == 69){
                                //CONEXION
                                $('.unplugged'+data.device_id).addClass('none')
                               
                            }
} 

var socket = io.connect('http://usamexgps.com:3000');
     
socket.on('message1', function (data) {
    device_id =   data.device_id
    go(data)
    if(device_id == '261'){
        console.log('$(".time'+device_id+'").timer("remove")')
        console.log('$(".time'+device_id+'").timer()')
    }
    $(".time"+device_id).timer('remove');
    $(".time"+device_id).timer(); 
    $(".time"+device_id).removeClass('red'); 
    $(".dev"+device_id).attr('lat',data.lat)
    $(".dev"+device_id).attr('lng',data.lng)
    $(".dev"+device_id).attr('time',data.updateTime)
    $(".dev"+device_id).attr('speed',data.Speed)
    $(".dev"+device_id).attr('stop',data.stop)
    $(".dev"+device_id).attr('head',data.Heading)
    if(data.EventCode == 21){
        $(".dev"+device_id).attr('engine',1)
    }
    if(data.EventCode == 20){
        $(".dev"+device_id).attr('engine',0)
    }
                    
                });
      
        $('#devicesList').listview('refresh');
        $('#boxesList').listview('refresh');
        $('#tabs').tabs('refresh');
        
        function getCurrentTime(a){
            b =  a + ' segundos';
            return b;
        }
        $('.seeDevice').click(function(e){    
           //console.log(' dee')
           $('#time').removeClass('time_'+localStorage.device_id)
           $('#speed').removeClass('speed_'+localStorage.device_id + ' k/h')
           $('#lat').removeClass('lat_'+localStorage.device_id)
            localStorage.name = $(this).attr('name');
            localStorage.lat = $(this).attr('lat');
            localStorage.lng = $(this).attr('lng');
            localStorage.speed = $(this).attr('speed');
            localStorage.device_id = $(this).attr('device_id');
            localStorage.time = $(this).attr('time');
            localStorage.engine = $(this).attr('engine');
            localStorage.stop = $(this).attr('stop');
            localStorage.head = $(this).attr('head');
            localStorage.unplugged = $(this).attr('unplugged');
            

             
             $.mobile.changePage('#showDevice',{reverse:false,transition:'slide' });
             google.maps.event.trigger(map, 'resize'); 
            map.panTo(new google.maps.LatLng($(this).attr('lat'), $(this).attr('lng')));
 //console.log('map.panTo(new google.maps.LatLng('+ $(this).attr("lat") +','+ $(this).attr("lng") +'));')
            
           

           

            })
    }
$(document).on("pageshow", "#showDevice", function() { 
     

    
   
 });

$(document).on("pagebeforeshow", "#showDevice", function() { 
    $('#name').html(localStorage.name)

    $('#speed').html(localStorage.speed+ ' k/h')
    $('#speed').addClass('speed_' + localStorage.device_id)
    $('#lat').html(localStorage.lat)
    $('#lat').addClass('lat_'+localStorage.device_id)

    if(localStorage.unplugged == 1){
        $('#unplugged').show()
    }

    if(localStorage.unplugged == 0)  {
                     $('#unplugged').html('<span data-toggle="tooltip" data-placement="top" title="Equipo desconectado"  class="glyphicon unplugged'+localStorage.device_id+' icon-plug red  none size25" aria-hidden="true"></span>')
                } 

                if(localStorage.unplugged == 1)  {
                    $('#unplugged').html('<span data-toggle="tooltip" data-placement="top" title="Equipo desconectado"  class="glyphicon unplugged'+localStorage.device_id+' icon-plug red  size25 " aria-hidden="true"></span>' )
                } 


    if(localStorage.stop == 0){
                    $('#stop').html('<span style="font-size:25px" class="icon-arrow-circle-up move'+localStorage.device_id+' fa-rotate-'+ localStorage.head +' leicon green" data-toggle="tooltip" data-placement="top" title="Unidad en movimiento"></span> ')
                }else{
                    $('#stop').html('<span style="font-size:25px" class="icon-arrow-circle-up move'+localStorage.device_id+' fa-rotate-'+ localStorage.head +' leicon shutdown" data-toggle="tooltip" data-placement="top" title="Unidad detenida"></span> ')
                }
                    


    if(localStorage.engine == 0){
       $('#engine').html('<span style="font-size:25px" class="engine'+localStorage.device_id+'  icon-engine leicon shutdown"></span>')
    }else if(localStorage.engine== 1){
       $('#engine').html('<span style="font-size:25px"  class="engine'+localStorage.device_id+'  icon-engine leicon green"></span>')
    }

    
    $('#time').addClass('time_'+localStorage.device_id)
    $('#time').addClass('subtitle')

    time = moment(localStorage.time);
    CurrentDate = moment()
    a = CurrentDate.diff(time, 'seconds'); 
    //console.log(a)
    $("#time").timer('remove');
        $('#time').timer({ seconds: a, })


    
   
 });
    } // termina receivent event 
};
