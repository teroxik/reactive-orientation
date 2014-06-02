App = Ember.Application.create();

App.Router.map(function() {
  this.resource('device', {  path: '/device' });
});
