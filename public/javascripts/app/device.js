App.Dashboarddevice = DS.Model.extend({
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

App.Device = Ember.Object.extend({
    id: '',
    deviceInfo: '',
    colour: '',
    data: { },
    displayColour: function() {
        return '#' + this.colour.toString(16);
    }.property('colour')
});

App.Device.FIXTURES = [];
App.Orientationdata.FIXTURES = [];