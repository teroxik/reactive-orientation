App.DeviceController = Ember.ObjectController.extend({
    model: {device: '', data: {}},
    socket: { },
    serverEndpointAddress: "ws://".concat(document.location.host,"/mobileWebSocket"),
    startOn: false,
    orientation: { },
    socket: {},

    init: function() {
        var parser = new UAParser();
        var deviceName = {};


        if (parser.getDevice().model != undefined) {
            deviceName['model'] = parser.getDevice().model;
        }
        if (parser.getDevice().type != undefined) {
            deviceName['type']  = parser.getDevice().type;
        }
        if (parser.getDevice().vendor != undefined) {
            deviceName['vendor'] = parser.getDevice().vendor;
        }
        if (parser.getOS().name != undefined) {
            deviceName['osName'] = parser.getOS().name;
        }
        if (parser.getBrowser().name != undefined) {
            deviceName['browser'] = parser.getBrowser().name;
        }
        if (parser.getBrowser().name != undefined) {
            deviceName['browserMajor'] = parser.getBrowser().major;
        }
        if (parser.getBrowser().name != undefined) {
                deviceName['browserVersion'] = parser.getBrowser().version;
        }
        var self = this;

        self.model.device = JSON.stringify(deviceName);

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

                    var data = {device: self.model.device, data: orientationData};
                    self.set('model',data)
                    self.socket.send(JSON.stringify(data));
                }
            }, false);
        }
    }
});