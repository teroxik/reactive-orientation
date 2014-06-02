App.DeviceController = Ember.ObjectController.extend({
    model: {device: '', colour: '', data: {}},
    socket: { },
    serverEndpointAddress: "ws://".concat(document.location.host,"/mobileWebSocket"),
    startOn: false,
    orientation: { },

    init: function() {
        var self = this;
        self.model.device = JSON.stringify(Device.getDeviceDetails());
        self.model.colour = Colour.stringToColour(self.model.device); //TODO: get/set

        self.set("socket",new WebSocket(self.serverEndpointAddress));

        self.socket.onclose = function(event) {
            console.log("Socket closed");
            self.set("socket",new WebSocket(self.serverEndpointAddress));
        }
        self.socket.onopen = function(event) {
            console.log("Socket opened");
        }

        this.registerListeners();
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

                    var data = {device: self.model.device, colour: self.model.colour, data: orientationData};
                    self.set('model', data)
                    self.socket.send(JSON.stringify(data));
                }
            }, false);
        }
    }
});