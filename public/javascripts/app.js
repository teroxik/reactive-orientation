App = Ember.Application.create();

App.SubView = Ember.View.extend({
  templateName: "sub/sub"
});

App.Router.map(function() {
  this.resource('device', {  path: '/device' });
  this.resource('test', {path: '/test'})
});

App.IndexController = Ember.ArrayController.extend({
  appName: 'My First Example',
  orientationData: { },
  socket: new WebSocket("ws://192.168.0.15:9000/dashboardWebSocket"),
  init: function() {
      var self = this;

      self.socket.onmessage = function(evt) {
        self.set('orientationData', JSON.parse(evt.data));
      };
      self.socket.onopen = function(evt) {
         self.set('orientationData', { device: "rand", data: {alpha: 1000, beta: 2, gamma: 3 } });
      };
      self.socket.onclose = function(evt) {
         self.set('orientationData', { device: "rand", data: {alpha: 0, beta: 2, gamma: 3 } });
      };
      self.socket.onerror = function(evt) {
         self.set('orientationData', { device: "rand", data: {alpha: -1000, beta: 2, gamma: 3 } });
      };
  }
});

App.DeviceController = Ember.ObjectController.extend({
  appName: 'My First Example',
  socket: new WebSocket("ws://192.168.0.15:9000/mobileWebSocket"),
  startOn: false,
  orientation: { },
  init: function() {
    this.registerListeners();
  },
  actions: {
    start: function() {
        this.set('startOn', true);
    },
    stop: function() {
        this.set('startOn', false);
    }
  },
  registerListeners: function() {
    var self = this;
    if(window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', function(event) {
        if (self.startOn) {
          var orientationData = calculateOrientation();
          var orientation =  {device: "Nexus 7", data: orientationData }
          self.set("orientation", orientation);
          self.socket.send(JSON.stringify(orientation));
        }
      }, false);
    }
  }
});

function calculateOrientation() {
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

    return {
             alpha: alpha,
             beta: beta,
             gamma: gamma
           };
}


