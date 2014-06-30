(function() {
    App.DeviceController = Ember.ObjectController.extend({
        model: App.Device.create(),
        socket: { },
        serverEndpointAddress: 'ws://'.concat(document.location.host,'/mobileWebSocket'),
        startOn: false,

        init: function() {
            var self = this;

            self.get('model').set('deviceInfo', JSON.stringify(DeviceService.getDeviceDetails()));
            self.get('model').set('colour', Colour.stringToColour(self.model.deviceInfo));
            self.get('model').set('id', self.model.deviceInfo.replace(/[^a-zA-Z0-9]+/g,''));

            self.set('socket', new WebSocket(self.serverEndpointAddress));

            self.socket.onclose = function(event) {
                console.log('Socket closed');
                self.set("socket",new WebSocket(self.serverEndpointAddress));
            }

            self.socket.onopen = function(event) {
                console.log('Socket opened');
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
                    if (self.get('startOn')) {
                        var orientationData = Orientation.calculateEulerOrientationForDevice(event);

                        var data = {
                            deviceInfo: self.get('model').deviceInfo,
                            id: self.get('model').id,
                            colour: self.get('model').colour,
                            orientationData: orientationData
                        };

                        self.set('model', data)
                        self.socket.send(JSON.stringify(data));
                    }
                }, false);
            }
        },

        toDisplayColour: function() {
            return '#' + self.model.colour.toString(16);
        }
    });
})();