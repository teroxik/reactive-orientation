App = Ember.Application.create();

App.ApplicationStore = DS.Store.extend();

App.SubView = Ember.View.extend({
  templateName: "sub/sub"
});

App.Router.map(function() {
  this.resource('device', {  path: '/device' });
  this.resource('test', {path: '/test'})
});

App.IndexController = Ember.ArrayController.extend({
  appName: 'My First Example',
  cube: '',
  renderer: '',
  timerId: '',
  content: Ember.A(),
  socket: new WebSocket("ws://192.168.0.15:9000/dashboardWebSocket"),
  init: function() {
    this.removeUnusedDevicesTimer();
    var self = this;
    self.socket.onmessage = function(evt) {
      var json = JSON.parse(evt.data);

      json.data.alpha = THREE.Math.degToRad( json.data.alpha );
      json.data.beta = THREE.Math.degToRad( json.data.beta );
      json.data.gamma = THREE.Math.degToRad( json.data.gamma );

      var device = undefined;

      self.get("content").forEach(function(item){
        if(item.get("device") === json.device) {
          device = item;
          item.set("updated", Date.now());
          item.data.set("alpha", json.data.alpha);
          item.data.set("beta", json.data.beta);
          item.data.set("gamma", json.data.gamma);

          Orientation.setObjectQuaternion(item.cube.quaternion, json.data.alpha, json.data.beta, json.data.gamma);
        }
      });

      if(device == undefined) {
        var newDevice = Ember.Object.create(
                          {
                            device: json.device,
                            deviceId: json.device.replace(/\s+/g, ''),
                            updated: Date.now(),
                            cube: Orientation.createCube(),
                            renderer: undefined,
                            data: Ember.Object.create(
                            {
                              alpha: json.data.alpha,
                              beta: json.data.beta,
                              gamma: json.data.gamma
                            })
                          });

        self.get("content").pushObject(newDevice);
      }

      if(device != undefined && device.renderer == undefined) {
        var canvas = document.getElementById('canvas' + device.deviceId);
        if(canvas != undefined) {
          var renderer = Orientation.createCanvas(device.cube);

          device.set('cube', device.cube);
          device.set('renderer', renderer);
          canvas.appendChild(renderer.domElement);
        }
      }
    };
  },
  removeUnusedDevicesTimer: function () {
    var self = this;
    Ember.run.later(this, function() {
      self.get("content").forEach(function(item){
        if((new Date().getTime() - 2000) > item.get("updated")) {
          self.get("content").removeObject(item);
        }
      });
      this.removeUnusedDevicesTimer();
    }, 1000);
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
          var orientationData = Orientation.calculateEulerOrientationForDevice(event);
          var orientation =  {device: "Nexus 7", data: orientationData }
          self.set("orientation", orientation);
          self.socket.send(JSON.stringify(orientation));
        }
      }, false);
    }
  }
});