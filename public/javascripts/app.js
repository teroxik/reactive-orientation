App = Ember.Application.create();

App.ApplicationStore = DS.Store.extend();

App.SubView = Ember.View.extend({
  templateName: "sub/sub"
});

App.Router.map(function() {
  this.resource('device', {  path: '/device' });
  this.resource('test', {path: '/test'})
});

setObjectQuaternion = function () {

var zee = new THREE.Vector3( 0, 0, 1 );

var euler = new THREE.Euler();

var q0 = new THREE.Quaternion();

var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

return function ( quaternion, alpha, beta, gamma ) {

euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

quaternion.setFromEuler( euler ); // orient the device

quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

quaternion.multiply( q0.setFromAxisAngle( zee, - (window.orientation || 0) ) ); // adjust for screen orientation

}

}();

App.IndexController = Ember.ArrayController.extend({
  appName: 'My First Example',
  cube: '',
  renderer: '',
  timerId: '',
  content: Ember.A(),
  socket: new WebSocket("ws://192.168.0.15:9000/dashboardWebSocket"),
  init: function() {
    this.removeUnusedDevicesTimer();
    var self = this;
    self.socket.onmessage = function(evt) {
      var json = JSON.parse(evt.data);

      json.data.alpha = THREE.Math.degToRad( json.data.alpha );
      json.data.beta = THREE.Math.degToRad( json.data.beta );
      json.data.gamma = THREE.Math.degToRad( json.data.gamma );

     /* json.data.beta = (json.data.beta) * Math.PI / 180;
      json.data.gamma = (json.data.gamma) * Math.PI / 180;*/

      var device = undefined;

      self.get("content").forEach(function(item){
        if(item.get("device") === json.device) {
          device = item;
          item.set("updated", Date.now());
          item.data.set("alpha", json.data.alpha);
          item.data.set("beta", json.data.beta);
          item.data.set("gamma", json.data.gamma);

          setObjectQuaternion( item.cube.quaternion, json.data.alpha, json.data.beta, json.data.gamma );
        }
      });

      if(device == undefined) {
        var newDevice = Ember.Object.create(
                          {
                            device: json.device,
                            deviceId: json.device.replace(/\s+/g, ''),
                            updated: Date.now(),
                            cube: self.createCube(),
                            camera: self.createCamera(),
                            renderer: undefined,
                            data: Ember.Object.create(
                            {
                              alpha: json.data.alpha,
                              beta: json.data.beta,
                              gamma: json.data.gamma
                            })
                          });

        self.get("content").pushObject(newDevice);
      }

      if(device != undefined && device.renderer == undefined) {
        var canvas = document.getElementById('canvas' + device.deviceId);
        if(canvas != undefined) {
          var renderer = self.createCanvas(device.cube, device.camera);

          device.set('cube', device.cube);
          device.set('renderer', renderer);
          canvas.appendChild(renderer.domElement);
        }
      }
    };
  },
  removeUnusedDevicesTimer: function () {
    var self = this;
    Ember.run.later(this, function() {
      self.get("content").forEach(function(item){
        if((new Date().getTime() - 2000) > item.get("updated")) {
          self.get("content").removeObject(item);
        }
      });
      this.removeUnusedDevicesTimer();
    }, 1000);
  },
  createCamera: function() {
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.rotation.reorder( "YXZ" );

    return camera;
  },
  createCube: function() {
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
  },
  createCanvas: function(cube, camera) {
    	var self = this;
    	var scene = new THREE.Scene();
    	var renderer = new THREE.WebGLRenderer({alpha: true});
    	renderer.setSize(600, 300);

    	scene.add(cube);
    	var render = function () {
    		requestAnimationFrame(render);
    		renderer.render(scene, camera);
        };
        render();

        return renderer;
  }
});

App.DeviceController = Ember.ObjectController.extend({
  appName: 'My First Example',
  socket: new WebSocket("ws://192.168.0.15:9000/mobileWebSocket"),
  startOn: false,
  orientation: { },
  init: function() {
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
        if (self.startOn) {
          var orientationData = calculateOrientation();
          var orientation =  {device: "Nexus 7", data: orientationData }
          self.set("orientation", orientation);
          self.socket.send(JSON.stringify(orientation));
        }
      }, false);
    }
  }
});

function calculateOrientation() {
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