var attr = DS.attr;

App.Orientation = DS.Model.extend({
  alpha: attr(),
  beta: attr(),
  gamma: attr(),
  name: attr()
});