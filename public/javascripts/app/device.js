App.Device = DS.Model.extend({
  deviceId: attr('string'),
  colour: attr('string'),
  updated: attr('date'),
  cube: attr(),
  renderer: attr(),
  data: DS.belongsTo('orientationdata')
});

App.OrientationData = DS.Model.extend({
  alpha: attr('number'),
  beta: attr('number'),
  gamma: attr('number')
});