var Device = (function() {
    var deviceServices = function() {

        this.update = function(item, orientationData) {
            item.set("updated", Date.now());
            item.data.set("alpha", orientationData.data.alpha);
            item.data.set("beta", orientationData.data.beta);
            item.data.set("gamma", orientationData.data.gamma);

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
                    device: orientationData.device,
                    deviceId: orientationData.device.replace(/\s+/g, ''),
                    updated: Date.now(),
                    cube: Orientation.createCube(),
                    renderer: undefined,
                    data: Ember.Object.create({
                        alpha: orientationData.data.alpha,
                        beta: orientationData.data.beta,
                        gamma: orientationData.data.gamma
                    })
                }
            );
        };
    };

    return new deviceServices();
})();