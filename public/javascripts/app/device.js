App.Device = DS.Model.extend({
  deviceId: DS.attr('string'),
  colour: DS.attr('string'),
  updated: DS.attr('date'),
  cube: DS.attr(),
  renderer: DS.attr(),
  orientationData: DS.belongsTo('orientationdata')
});

App.Orientationdata = DS.Model.extend({
  alpha: DS.attr('number'),
  beta: DS.attr('number'),
  gamma: DS.attr('number')
});

App.Device.FIXTURES = [];
App.Orientationdata.FIXTURES = [];