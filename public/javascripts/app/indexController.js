(function() {
    App.IndexController = Ember.ArrayController.extend({
        appName: 'My First Example',
        content: Ember.A(),
        socket: new WebSocket("ws://192.168.0.10:9000/dashboardWebSocket"),

        init: function() {
            var self = this;
            self.removeUnusedDevicesTimer();
            self.socket.onmessage = function(event) {
                console.log("Received onMmessage");
                self.handleWebSocketReceivedMessage(event);
            };
        },

        removeUnusedDevicesTimer: function () {
            function deviceDataUpdatedInSeconds(device, seconds) {
                return (new Date().getTime() - seconds * 1000) < device.get("updated");
            }

            var self = this;
            Ember.run.later(this, function() {
                self.get("content").forEach(function(device) {
                    if(!deviceDataUpdatedInSeconds(device, 2)) {
                        self.get("content").removeObject(device);
                    }
                });

                this.removeUnusedDevicesTimer();
            }, 1000);
        },

        handleWebSocketReceivedMessage: function(event) {
            console.log("Received message");
            var self = this;
            var json = JSON.parse(event.data);

            json.data.alpha = THREE.Math.degToRad( json.data.alpha );
            json.data.beta = THREE.Math.degToRad( json.data.beta );
            json.data.gamma = THREE.Math.degToRad( json.data.gamma );

            var device = undefined;

            self.get("content").forEach(function(item) {
                if(item.get("device") === json.device) {
                    device = Device.update(item, json);
                }
            });

            if(device == undefined) {
                var newDevice = Device.create(json);
                self.get("content").pushObject(newDevice);
            }

            if(device != undefined && device.renderer == undefined) {
                var canvas = document.getElementById('canvas' + device.deviceId);

                if(canvas != undefined) {
                    var renderer = Orientation.createCanvas(device.cube);

                    device.set('cube', device.cube);
                    device.set('renderer', renderer);
                    canvas.appendChild(renderer.domElement);
                }
            }
        }
    });
})();