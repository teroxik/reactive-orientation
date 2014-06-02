App.DeviceController = Ember.ObjectController.extend({
    model: {device: '', data: {}},
    startOn: false,
    orientation: { },
    socket: {},

    init: function() {
        var self = this;
        self.model.device = JSON.stringify(Device.getDeviceDetails());
        this.registerListeners();
        this.set('socket', new WebSocket('ws://192.168.0.15:9000/mobileWebSocket'))
    },

    actions: {
        start: function() {
            this.set('startOn', true);
        },

        stop: function() {
            this.set('startOn', false);
        }
    },

    registerListeners: function() {
        var self = this;
        if(window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function(event) {
                if (self.get("startOn")) {
                    var orientationData = Orientation.calculateEulerOrientationForDevice(event);

                    var data = {device: self.model.device, data: orientationData};
                    self.set('model',data)
                    self.socket.send(JSON.stringify(data));
                }
            }, false);
        }
    }
});