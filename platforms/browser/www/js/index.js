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
        alert('ok')
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
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

        $(function() {
            function printData(data){
                alert('logeado')
            }
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
    } // termina receivent event
};
