var DeviceService = (function() {
    var deviceServices = function() {

        this.update = function(item, device) {
            item.set('updated', Date.now());
            item.get('orientationData').set('alpha', device.orientationData.alpha);
            item.get('orientationData').set('beta', device.orientationData.beta);
            item.get('orientationData').set('gamma', device.orientationData.gamma);

            Orientation.setObjectQuaternion(
                item.get('cube').quaternion,
                device.orientationData.alpha,
                device.orientationData.beta,
                device.orientationData.gamma);

            return item;
        };

        this.create = function(store, json) {
            var orientationData = store.createRecord('orientationdata', json.orientationData);
            orientationData.save();

            json.orientationData = orientationData;
            json.updated = Date.now();
            json.cube = Orientation.createCube(json.colour);
            json.renderer = Orientation.createCanvas(json.cube);

            var device = store.createRecord('dashboarddevice', json);
            device.save();
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