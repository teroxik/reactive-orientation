App = Ember.Application.create();

App.SubView = Ember.View.extend({
  templateName: "sub/sub"
});



App.Router.map(function() {
  this.resource('device', {  path: '/device' });
  this.resource('dashboard', {path: '/'});
});
