var Device = (function() {
    var deviceServices = function() {

        this.update = function(item, orientationData) {
            item.set('updated', Date.now());
            item.data.set('alpha', orientationData.data.alpha);
            item.data.set('beta', orientationData.data.beta);
            item.data.set('gamma', orientationData.data.gamma);

            Orientation.setObjectQuaternion(
                item.cube.quaternion,
                orientationData.data.alpha,
                orientationData.data.beta,
                orientationData.data.gamma);

            return item;
        };

        this.create = function(orientationData) {
            return Ember.Object.create(
                {
                    deviceInfo: orientationData.deviceInfo,
                    deviceId: orientationData.deviceId,
                    colour: orientationData.colour,
                    updated: Date.now(),
                    cube: Orientation.createCube(orientationData.colour),
                    renderer: undefined,
                    data: Ember.Object.create({
                        alpha: orientationData.data.alpha,
                        beta: orientationData.data.beta,
                        gamma: orientationData.data.gamma
                    })
                }
            );
        };

        this.getDeviceDetails = function() {
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

            return deviceName;
        }
    };

    return new deviceServices();
})();