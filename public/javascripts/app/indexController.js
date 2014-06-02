(function() {
    App.IndexController = Ember.ArrayController.extend({
        appName: 'My First Example',
        content: Ember.A(),
        socket: {},

        init: function() {
            var self = this;
            self.removeUnusedDevicesTimer();
            self.set('socket', new WebSocket('ws://192.168.0.15:9000/dashboardWebSocket'))

            self.socket.onmessage = function(event) {
                self.handleWebSocketReceivedMessage(event);
            };
        },

        removeUnusedDevicesTimer: function () {
            function deviceDataUpdatedInSeconds(device, seconds) {
                return (new Date().getTime() - seconds * 1000) < device.get('updated');
            }

            var self = this;
            Ember.run.later(this, function() {
                self.get('content').forEach(function(device) {
                    if(!deviceDataUpdatedInSeconds(device, 2)) {
                        self.get('content').removeObject(device);
                    }
                });

                this.removeUnusedDevicesTimer();
            }, 1000);
        },

        handleWebSocketReceivedMessage: function(event) {
            var self = this;
            var json = Orientation.convertDegreesToRadians(JSON.parse(event.data));

            var device = undefined;

            self.get('content').forEach(function(item) {
                if(item.get('device') === json.device) {
                    device = Device.update(item, json);
                }
            });

            if(!alreadyExists(device)) {
                self.get('content').pushObject(Device.create(json));
            }

            if(alreadyExists(device) && !alreadyExists(device.renderer)) {
                var canvas = document.getElementById('canvas' + device.deviceId);

                if(canvasAlreadyRendered(canvas)) {
                    var renderer = Orientation.createCanvas(device.cube);
                    device.set('renderer', renderer);

                    try {
                        canvas.appendChild(renderer.domElement)
                    } catch (e) {
                        self.get('content').removeObject(device);
                    }
                }
            }

            function alreadyExists(obj) {
                return obj !== undefined;
            }

            function canvasAlreadyRendered(canvas) {
                return alreadyExists(canvas);
            }
        }
    });
})();
