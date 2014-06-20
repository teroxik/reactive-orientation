App = Ember.Application.create();

App.Router.map(function() {
  this.resource('device', {  path: '/device' });
});

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.PostSerializer = DS.JSONSerializer.extend({
  primaryKey: 'deviceId'
});
