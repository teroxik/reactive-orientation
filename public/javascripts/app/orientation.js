var Orientation = (function() {
    var orientationServices = function() {
        this.createCanvas = function(cube) {
            var self = this;
            var scene = new THREE.Scene();
            var renderer = new THREE.WebGLRenderer({alpha: true});
            renderer.setSize(600, 300);

            scene.add(cube);
            var render = function () {
                requestAnimationFrame(render);
                renderer.render(scene, createCamera());
             };
             render();

             return renderer;
        };

        this.createCube = function() {
             var materials = [];

             var geometry = new THREE.BoxGeometry(2,3,1);
             var material1 = new THREE.MeshBasicMaterial({color: 0xff0000});
             var material2 = new THREE.MeshBasicMaterial({color: 0x00ff00});
             var material3 = new THREE.MeshBasicMaterial({color: 0x3333ff});
             var material4 = new THREE.MeshBasicMaterial({color: 0xffff00});
             var material5 = new THREE.MeshBasicMaterial({color: 0xff33cc});
             var material6 = new THREE.MeshBasicMaterial({color: 0x996633});

             materials.push(material1);
             materials.push(material2);
             materials.push(material3);
             materials.push(material4);
             materials.push(material5);
             materials.push(material6);

             var cube = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
             cube.rotation.reorder( "YXZ" );
             return cube;
        };

        this.setObjectQuaternion = function () {
             var zee = new THREE.Vector3( 0, 0, 1 );
             var euler = new THREE.Euler();
             var q0 = new THREE.Quaternion();
             var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) );

             return function ( quaternion, alpha, beta, gamma ) {
                 euler.set( beta, alpha, - gamma, 'YXZ' );
                 quaternion.setFromEuler( euler );
                 quaternion.multiply( q1 );
                 quaternion.multiply( q0.setFromAxisAngle( zee, - (window.orientation || 0) ) );
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
        }

       function createCamera() {
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            camera.rotation.reorder( "YXZ" );

            return camera;
       };
    };

    return new orientationServices();
})();