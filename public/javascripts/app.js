App = Ember.Application.create();

App.SubView = Ember.View.extend({
  templateName: "sub/sub"
});



App.Router.map(function() {
  this.resource('device', {  path: '/device' });
  this.resource('test', {path: '/test'})
});

App.IndexController = Ember.Controller.extend({
  appName: 'My First Example'
});

App.DeviceController = Ember.Controller.extend({
  appName: 'My First Example'

});



