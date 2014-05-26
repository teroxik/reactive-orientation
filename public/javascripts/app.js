App = Ember.Application.create();

App.ApplicationStore = DS.Store.extend();

App.SubView = Ember.View.extend({
  templateName: "sub/sub"
});

App.Router.map(function() {
  this.resource('device', {  path: '/device' });
  this.resource('test', {path: '/test'})
});

App.IndexRoute = Ember.Route.extend({
 model: function() {
   return this.store.all('orientation');
 }
});

App.IndexController = Ember.ArrayController.extend({
  appName: 'My First Example',
  orientationData: { },
  socket: new WebSocket("ws://192.168.0.15:9000/dashboardWebSocket"),
  init: function() {
    var self = this;
    self.socket.onmessage = function(evt) {
      //self.store.push('orientation', evt)

      //var a = self.store.all('orientation');
      self.set('orientationData', JSON.parse(evt.data));
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

    if(event.webkitCompassHeading) {
        alpha = event.webkitCompassHeading;
        compass.style.WebkitTransform = 'rotate(-' + alpha + 'deg)';
    }
    else {
      alpha = event.alpha;
      beta = event.beta;
      gamma = event.gamma;
      webkitAlpha = alpha;
      if(!window.chrome) {
        webkitAlpha = alpha-270;
      }
    }

    return {
             alpha: alpha,
             beta: beta,
             gamma: gamma
           };
}


