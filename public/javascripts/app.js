App = Ember.Application.create();

App.SubView = Ember.View.extend({
  templateName: "sub/sub"
});

App.Router.map(function() {
  this.resource('device', {  path: '/device' });
  this.resource('test', {path: '/test'})
});

App.IndexController = Ember.Controller.extend({
  appName: 'My First Example',
  orientationData: { device: "rand", data: {alpha: 5, beta: 2, gamma: 3 } },
  socket: new WebSocket("ws://192.168.0.15:9000/dashboardWebSocket"),
  init: function() {
      var self = this;
      self.set('orientationData', { device: "rand", data: {alpha: 999, beta: 2, gamma: 3 } });

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

App.DeviceController = Ember.Controller.extend({
  appName: 'My First Example'
});



