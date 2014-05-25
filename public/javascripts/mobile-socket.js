
  var wsUri = "ws://192.168.0.10:9000/mobileData";
  var output,orientationContainer;
  var startOn = false;

  function init()
  {
    output = document.getElementById("output");
    orientationContainer = document.getElementById("dataContainerOrientation");
    dataGeolocation = document.getElementById("dataGeolocation");
    testWebSocket();
    extractData();
  }

  function extractData()
  {
      if(window.DeviceOrientationEvent) {
          window.addEventListener('deviceorientation', function(event) {
              if(startOn) {
                  var alpha,beta,gamma;
                  //Check for iOS property
                  if(event.webkitCompassHeading) {
                      alpha = event.webkitCompassHeading;
                      //Rotation is reversed for iOS
                      compass.style.WebkitTransform = 'rotate(-' + alpha + 'deg)';
                  }
                  //non iOS
                  else {
                      alpha = event.alpha;
                      beta = event.beta;
                      gamma = event.gamma;
                      webkitAlpha = alpha;
                      if(!window.chrome) {
                          //Assume Android stock (this is crude, but good enough for our example) and apply offset
                          webkitAlpha = alpha-270;
                      }
                  }
                  if(alpha!=null || beta!=null || gamma!=null) {
                      dataContainerOrientation.innerHTML = 'alpha: ' + alpha + '<br/>beta: ' + beta + '<br />gamma: ' + gamma;
                  }
                  doSend(JSON.stringify({
                                            device: "Nexus 7",
                                            data: {
                                                alpha: alpha,
                                                beta: beta,
                                                gamma: gamma
                                            }
                                         }
                                     ));
              }

              }, false);
        }
  }

  function testWebSocket()
  {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
  }

  function onOpen(evt)
  {
    writeToScreen("CONNECTED");
  }

  function onClose(evt)
  {
    writeToScreen("DISCONNECTED");
  }

  function onMessage(evt)
  {
    // writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
  }

  function closeSocket() {
    websocket.close();
  }

  function onError(evt)
  {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
  }

  function doSend(message)
  {
   // writeToScreen("SENT: " + message);
    websocket.send(message);
  }

  function writeToScreen(message)
  {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
  }

  function startSending() {
   startOn = true;
  }

  function stopSending() {
   startOn = false;
  }

  function success(position) {
    dataGeolocation.innerHTML = 'latitue: ' + position.coords.latitude + '<br/>longitued: ' + position.coords.longitude;
  }

  function error(msg) {
    var s = document.querySelector('#status');
    s.innerHTML = typeof msg == 'string' ? msg : "failed";
    s.className = 'fail';

    // console.log(arguments);
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    error('not supported');
  }




  window.addEventListener("load", init, false);