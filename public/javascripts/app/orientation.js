var Orientation = (function() {
    var orientationServices = function() {
        this.createCanvas = function(cube) {
            var self = this;
            var scene = new THREE.Scene();
            var renderer = new THREE.WebGLRenderer({alpha: true});
            renderer.setSize(600, 300);
            renderer.shadowMapEnabled = true;

            cube.receiveShadow = true;
            scene.add(cube);

            // add subtle blue ambient lighting
            var ambientLight = new THREE.AmbientLight(0x000044);
            scene.add(ambientLight);

            // directional lighting
            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);

            var render = function () {
                requestAnimationFrame(render);
                renderer.render(scene, createCamera());
            };
            render();

            return renderer;
        };

        this.createCube = function(colour) {
            var materials = [];

            var geometry = new THREE.BoxGeometry(2,3,1);

            var cube = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: colour}));

            cube.rotation.reorder('YXZ');
            return cube;
        };

        this.setObjectQuaternion = function () {
            var zee = new THREE.Vector3(0, 0, 1);
            var euler = new THREE.Euler();
            var q0 = new THREE.Quaternion();
            var q1 = new THREE.Quaternion(- Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ));

            return function (quaternion, alpha, beta, gamma) {
                euler.set(beta, alpha, -gamma, 'YXZ');
                quaternion.setFromEuler(euler);
                quaternion.multiply(q1);
                quaternion.multiply(q0.setFromAxisAngle(zee, -(window.orientation || 0)));
            }
        }();

        this.calculateEulerOrientationForDevice = function(event) {
             var alpha,beta,gamma;

            if(event.webkitCompassHeading) {
                alpha = event.webkitCompassHeading;
                compass.style.WebkitTransform = 'rotate(-' + alpha + 'deg)';
            }
            else {
                alpha = event.alpha;
                beta = event.beta;
                gamma = event.gamma;
                webkitAlpha = alpha;
                if(!window.chrome) {
                    webkitAlpha = alpha-270;
                }
            }

            return {
                 alpha: alpha,
                 beta: beta,
                 gamma: gamma
            };
        };

        function createCamera() {
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            camera.rotation.reorder( "YXZ" );

            return camera;
        }
    };

    return new orientationServices();
})();