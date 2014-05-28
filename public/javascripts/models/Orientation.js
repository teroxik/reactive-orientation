var attr = DS.attr;

App.Data = DS.Model.extend({
  alpha: attr(),
  beta: attr(),
  gamma: attr()
});

App.Orientation = DS.Model.extend({
  device: attr(),
  data: DS.belongsTo('data')
});